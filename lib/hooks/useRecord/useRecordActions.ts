import { 
  useCallback, 
  useEffect, 
  useRef, 
  useState 
} from "react";
import { useScreenRecording } from "./useScreenRecording";
import { 
  DeviceStatus, 
  DeviceType, 
  VideoSettingsType,
  OpenModalArgs,
} from "@/index";
import { 
  base64ToFile,
  checkDevice, 
  downloadVideo, 
} from "../../utils";
import {useGlobalContext } from "../useGlobalContext";
import useSettings from "./useSettings";

export type SyncCameraKeys = Pick<VideoSettingsType, "displaySurface" | "camera">;

export type RecordingTimerType = {
  seconds: string,
  minutes: string,
  hour: string
}


const useRecordActions = () => {

  const {
    recordedVideoUrl,
    isRecording,
    recordedBlob,
    recordingDuration,
    startRecording,
    stopRecording,
    resetRecording,
    handleTakeScreenShot,
    handlePauseResume,
    screenShots,
    recordingStatus,
    streamSettings,
    recordingTimer,
    onScreenShotClick, 
    onScreenShotRemove, 
    onScreenShotSave,
    onScreenShotSelect
  } = useScreenRecording()

  const {
    modalOpen,
    openModal, 
    resetModal,
    changeContentParent,
    modalAction,
    successfulAction,
    failedAction,
    beforeAction,
    ongoingAction,
    changeState,
  } = useGlobalContext()

  const videoRef= useRef<HTMLVideoElement>(null);

  const [videoPlaying, setVideoPlaying] = useState(false);
  
  const [failedCheck, setFailedCheck] = useState('');

  //modal-buttons and routing----------------------

  //not working well
  const handleOpenModal = useCallback((content: Omit<OpenModalArgs, 'type'>) => {
    console.log(modalOpen.type)
    console.log(modalAction.name)
    if(modalOpen.type === 'record' && modalAction.name) {
      console.log('display modal')
      openModal()
    } else {
      console.log('opening fresh modal')
      openModal({
        type: 'record', 
        closeIcon: content.closeIcon
      });
      changeContentParent('record');
      beforeAction('check');
    }
  },[openModal, changeContentParent, beforeAction, modalOpen, modalAction]);

  const handleExitModal = useCallback(() => {
    resetModal();
    resetRecording();
  },[])

  //recording buttons ------------
   //Device check function
  const helpFailedCheck = (device: DeviceType, checkResult: DeviceStatus ) => {
    const capitalizedDevice = device.replace(device.charAt(0), device.charAt(0).toUpperCase())
    if(checkResult === "no-permission"){
      setFailedCheck(`Please allow ${device} permission to proceed`);
    } else {
      setFailedCheck(`${capitalizedDevice} not supported on this device. Try adjusting settings`);
    }
  }

  const deviceCheckCondition = async (
    condition: boolean, 
    device: DeviceType
  ): Promise<DeviceStatus> => {
    if(condition) {
      const checkResult = await checkDevice(device);
      if(checkResult === 'no-permission' || 'no-support') {
        helpFailedCheck(device, checkResult);
      }
      return checkResult;
    } else {
      return 'unused';
    };
  }

  //refactoring may not work well but needs refactoring
  const handleCheckDevices = useCallback(async (videoSettings: VideoSettingsType) => {
    if(videoSettings.camera !== "no" || videoSettings.withMic) {
      
      changeState('ongoing', 'check')
  
      console.log(videoSettings);
      console.log('checking devices')
  
      const camCheckResponse = await deviceCheckCondition(videoSettings.camera !== 'no', 'camera')
      
      console.log(camCheckResponse)
  
      if(camCheckResponse === "no-support" || camCheckResponse === "no-permission") {
          failedAction('check');
          return
        };
      
      const micCheckResponse = await deviceCheckCondition(videoSettings.withMic, 'microphone')
  
      console.log(micCheckResponse)
  
      if(micCheckResponse === "no-support" || micCheckResponse === "no-permission") {
          failedAction('check');
          return
        };
  
      successfulAction('check');

      setFailedCheck('');
      setTimeout(()=> beforeAction('record'), 2000)
    } else {
      beforeAction('record');
    };
  }, [])

  const handleGoBack = useCallback(() => {
    beforeAction('check')
  },[])

  const handleStartRecording = useCallback(async (videoSettings: VideoSettingsType)=> {
    try {
      await startRecording(
        videoSettings, 
        () => changeState('ongoing', 'record'),
        () => failedAction('record')
      );
    }catch(error) {
      const message = error instanceof Error ? error.message : error;
      setFailedCheck(message as string);
    }
  },[])

  const handleRecordAgain = useCallback(async ()=> {
    try {
      resetRecording();
      beforeAction('record');
    }catch(error) {
        const message = error instanceof Error ? error.message : error;
        setFailedCheck(message as string);
    }

    if(recordedVideoUrl && videoRef.current) {
        videoRef.current.src = recordedVideoUrl;
    }
  },[])

  const handleStopRecording = useCallback(() => {
    try {
      changeState('ongoing', 'load');
      stopRecording();
      successfulAction('load');
      console.log(modalAction.load)
    } catch (error) {
      failedAction('load');
    }
  },[])
  
  const handleStopWarning = useCallback(() => {
      if(recordingStatus === 'recording') handlePauseResume();
      beforeAction('load');
  },[handlePauseResume, beforeAction])

  const handleContinueRecording = useCallback(() => {
    successfulAction('record', 'before');
  },[successfulAction])

  const handleGoToUpload = useCallback(async ()=> {
    beforeAction('redirect');

    if(!recordedBlob) {
      failedAction('redirect');
      return;
    }
    const videoUrl= URL.createObjectURL(recordedBlob);
    
    sessionStorage.setItem('recordedVideo', 
      JSON.stringify({
          videoUrl,
          name: "screen-recording.webm",
          type: recordedBlob.type,
          size: recordedBlob.size,
          duration: recordingDuration
      })
    )

    const selectedShot = screenShots.length > 0 ? screenShots?.find(shot => shot.selected) : undefined;

    if(selectedShot) {
      const {selected, ...shot} = selectedShot; 
      sessionStorage.setItem('selectedShot', JSON.stringify(shot))
    }

    changeState('ongoing', 'redirect');

    setTimeout(() => {
      if(modalAction?.redirect?.state === 'ongoing') failedAction('redirect')
      return;
    }, 10000);

  },[recordedBlob, recordingDuration, base64ToFile])

  const changeVideoPlaying = (state: boolean) => setVideoPlaying(state)

  const handleSaveRecording = useCallback(() => {
    if(!recordedBlob) return;
    try {
      ongoingAction('save_record');
      const videoUrl = URL.createObjectURL(recordedBlob);
      downloadVideo(videoUrl);
      successfulAction('save_record');
      setTimeout(()=> successfulAction('load', 'before'), 2000);
    }catch(error){
      const message = error instanceof Error ? error.message : 'Failed to download video' 
      setFailedCheck(message);
      failedAction('save_record');
    }
  },[ongoingAction, successfulAction, failedAction])

  const handleGoToRecordedVideo = () => successfulAction('load', 'before')
  //------------------------------
  
  
  useEffect(() => {
    if(isRecording) successfulAction('record');
  },[isRecording])

  useEffect(() => {
    console.log(streamSettings)
    console.log(recordingStatus)
    console.log(recordedVideoUrl)
    console.log(recordingTimer)
  },[ streamSettings, recordingStatus, recordedVideoUrl, recordingTimer])

  return {
    videoRef,
    resetModal,
    handleOpenModal, 
    handleExitModal,
    handleCheckDevices,
    handleStartRecording,
    handleStopRecording,
    handleStopWarning,
    handleContinueRecording,
    handleGoBack,
    handleRecordAgain,
    handleGoToUpload,
    handleSaveRecording,
    recordedVideoUrl,
    failedCheck,
    changeVideoPlaying,
    handleTakeScreenShot,
    handlePauseResume,
    recordingStatus,
    screenShots,
    streamSettings,
    recordingTimer,
  }
}

export default useRecordActions