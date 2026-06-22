import { 
  useCallback, 
  useEffect, 
  useRef, 
  useState 
} from "react";
import { 
  DeviceStatus, 
  DeviceType, 
  ImagesArrayType, 
  VideoSettingsType,
} from "@/index";
import { 
  checkDevice, 
  downloadVideo, 
} from "../../utils";
import {ActionNoParams, VoidAction, useModalContext } from "../useModalContext";

export type SyncCameraKeys = Pick<VideoSettingsType, "displaySurface" | "camera">;

const useModalActions = () => {

  const {
    resetModal,
    modalAction,
    successfulAction,
    failedAction,
    beforeAction,
    changeState,
  } = useModalContext()

  const videoRef= useRef<HTMLVideoElement>(null);

  const [videoPlaying, setVideoPlaying] = useState(false);
  
  const [failedCheck, setFailedCheck] = useState('');

  //modal-buttons and routing----------------------
  const onExitModal = useCallback((resetRecording: VoidAction) => {
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
      if(checkResult == 'no-permission' || checkResult == 'no-support') {
        helpFailedCheck(device, checkResult);
      }
      return checkResult;
    } else {
      return 'unused';
    };
  }

  //refactoring may not work well but needs refactoring
  const onCheckDevices = useCallback(async (videoSettings: VideoSettingsType) => {
    if(videoSettings.camera !== "no" || videoSettings.withMic) {
      
      changeState('ongoing', 'check')
  
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

  const onGoBack = useCallback(() => {
    beforeAction('check')
  },[])

  const onStartRecording = useCallback(async (startRecording: ActionNoParams<Promise<boolean>>)=> {
    try {
      await startRecording();
    }catch(error) {
      console.log(error)
      setFailedCheck("looks like you cancelled");
    }
  },[])

  //add a loader intro to another before start content
  const onRecordAgain = useCallback(async (resetRecording: VoidAction, 
  )=> {
    try {
      resetRecording();
      beforeAction('record');
    }catch(error) {
        const message = error instanceof Error ? error.message : error;
        setFailedCheck(message as string);
    }
  },[])

  const onStopRecording = useCallback((stopRecording: VoidAction) => {
    try {
      changeState('ongoing', 'load');
      stopRecording();
      successfulAction('load');
    } catch (error) {
      failedAction('load');
    }
  },[])
  
  const onStopWarning = useCallback((
    recordingStatus: RecordingState, 
    onPauseResume: VoidAction
  ) => {
      if(recordingStatus === 'recording') onPauseResume();
      beforeAction('load');
  },[])

  const onContinueRecording = useCallback(() => {
    successfulAction('record', 'before');
  },[])

  const onGoToUpload = useCallback(async (
    recordedBlob: Blob | null, 
    recordingDuration: number,
    screenShots: ImagesArrayType[]
  )=> {
    beforeAction('redirect');

    if(!recordedBlob) {
      failedAction('redirect');
      return;
    }
    const videoUrl = URL.createObjectURL(recordedBlob);
    
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
      if(modalAction?.redirect?.state === 'ongoing') {
        failedAction('redirect')
      }
      return;
    }, 10000);

  },[])

  const changeVideoPlaying = (state: boolean) => setVideoPlaying(state)

  return {
    videoRef,
    resetModal,
    onExitModal,
    onCheckDevices,
    onStartRecording,
    onStopRecording,
    onStopWarning,
    onContinueRecording,
    onGoBack,
    onRecordAgain,
    onGoToUpload,
    changeVideoPlaying,
    failedCheck,
  }
}

export default useModalActions