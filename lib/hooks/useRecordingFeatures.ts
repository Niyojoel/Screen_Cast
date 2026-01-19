import { 
  useCallback, 
  useEffect, 
  useMemo,
  useRef, 
  useState 
} from "react";
import { useScreenRecording } from "./useScreenRecording";
import { 
  DeviceStatus, 
  DeviceType, 
  ModalButton, 
  CameraOptions, 
  DisplaySurfaceOptions, 
  RecordSettingsType, 
  VideoSettingsType, 
} from "@/index";
import { 
  cameraMode, 
  cameraSettingsOptions, 
  cursorDisplayOptions, 
  cursorDisplayOptionsIcon, 
  micSettingsOptions, 
  micSettingsOptionsIcon, 
  screenSettingsOptions 
} from "@/constants/lists";
import { 
  checkDevice,  //add to util from master
  downloadVideo, 
  parseVideoSettings, 
  syncCameraOnly 
} from "../utils";
import { useGlobalContext } from "./useGlobalContext";

export type SyncCameraKeys = Pick<VideoSettingsType, "displaySurface" | "camera">;

const useRecordingFeatures = () => {

  const {
    recordedVideoUrl,
    isRecording,
    recordedBlob,
    recordingDuration,
    startRecording,
    stopRecording,
    resetRecording,
    selectedVideoSetting,
    handleTakeScreenShot,
    handlePauseResume,
    recordingStatus,
    isFlashing
  } = useScreenRecording()

  const {
    openModal, 
    closeModal, 
    actionResponse,
    actionStatus,
    showModalError,
    recordingState,
    changeRecordingState,
    changeModalContent,
    action,
    changeAction,
    successfulAction,
    actionTimeout,
    failedAction,
    beforeAction,
    ongoingAction,
    resetAction
  } = useGlobalContext()

  const videoRef= useRef<HTMLVideoElement>(null);
  
  //Settings
  const [videoSettings, setVideoSettings] = useState<VideoSettingsType>({
    cursor: "always",
    displaySurface: "monitor",
    camera: 'no',
    cameraFacingMode: 'user',
    withMic: true,
  });
  
  const [settingsGuide, setSettingsGuide] = useState('');


  //Settings ------------
  const helpVideoSettings = useCallback((
    key: keyof VideoSettingsType, 
    value: VideoSettingsType[keyof VideoSettingsType]
  ) => {
    setVideoSettings(prev => ({...prev, [key]: value}));
  },[])

  const syncCamera = useCallback(async(
    key: keyof SyncCameraKeys, 
    value: DisplaySurfaceOptions | CameraOptions
  ) => {
    const syncSetting = await syncCameraOnly(
      key, 
      value,
      {
        displaySurface: videoSettings.displaySurface,
        camera: videoSettings.camera
      }
    )
    console.log(syncSetting);
    if(syncSetting) helpVideoSettings(syncSetting[0], syncSetting[1]);

  },[videoSettings])
  
  const updateSettings = useCallback((key: keyof VideoSettingsType, option: string) => {
    const value: VideoSettingsType[keyof VideoSettingsType] = parseVideoSettings(key, option);

    helpVideoSettings(key, value);

    if(key === "displaySurface" || "camera") {
      syncCamera(
        key as keyof SyncCameraKeys, 
        value as DisplaySurfaceOptions | CameraOptions
      )
    }
  },[syncCamera]);


  const recordSettings = useMemo((): RecordSettingsType[] => [
    {
      title: "Screen Settings",
      options: screenSettingsOptions,
      updateSetting: (option) => updateSettings('displaySurface', option),
      settingValue: ['displaySurface', videoSettings.displaySurface],
      className:'col-span-3',
    },
    {
      idIcon: cursorDisplayOptionsIcon(videoSettings.cursor === "never"),
      options: cursorDisplayOptions,
      updateSetting: (option) => updateSettings('cursor', option),
      settingValue: ['cursor', videoSettings.cursor],
      className:'col-span-3',
    },
    {
      title: "Camera Settings",
      options: cameraSettingsOptions,
      updateSetting: (option) => updateSettings('camera', option),
      settingValue: ['camera', videoSettings.camera],
      className:'col-span-2',
    },
    {
      options: cameraMode,
      updateSetting: (option) => updateSettings('cameraFacingMode', option),
      settingValue: ['cameraFacingMode', videoSettings.cameraFacingMode],
      className:'col-span-1 place-self-end',
      disabled: videoSettings.camera === "no",
    },
    {
      idIcon: micSettingsOptionsIcon(videoSettings.withMic),
      options: micSettingsOptions,
      updateSetting: (option) => updateSettings('withMic', option),
      settingValue: ['withMic', videoSettings.withMic],
      className:'col-span-3',
    },
  ],[
    updateSettings,
    screenSettingsOptions, 
    cursorDisplayOptions, 
    cameraSettingsOptions, 
    cameraMode, 
    videoSettings, 
    micSettingsOptions
  ])

  //modal-buttons and routing----------------------
  const handleOpenModal = useCallback((content: React.ReactNode, buttons: ModalButton[], closeIcon: React.ReactNode) => {
    openModal(
      content,
      buttons,
      closeIcon
    );
    changeRecordingState('before')
    beforeAction('check');
  },[]);

  const handleCloseModal = useCallback(() => {
    closeModal();
    resetRecording();
  },[])

  const goingToUploadAction = useCallback((UIActions: () => void): void => {
    UIActions();
    successfulAction();
  },[])

  //recording buttons ------------
  const handleStartRecording = useCallback(async ()=> {
    try {
      ongoingAction('record')
      await startRecording(
        videoSettings, 
        successfulAction
      );
    }catch(error) {
      const message = error instanceof Error ? error.message : error;
      failedAction();
      showModalError(message as string);
    }
  },[videoSettings])

  const handleRecordAgain = useCallback(async ()=> {
    try {
      resetRecording();
      changeRecordingState('before');
      ongoingAction('record')
      handleStartRecording();
    }catch(error) {
        const message = error instanceof Error ? error.message : error;
        showModalError(message as string);
    }

    if(recordedVideoUrl && videoRef.current) {
        videoRef.current.src = recordedVideoUrl;
    }
  },[videoSettings])

  const handleStopRecording = useCallback(() => {
    try {
      changeRecordingState('after')
      ongoingAction('load');
      stopRecording();
      successfulAction();
    } catch (error) {
      failedAction();
    }
  },[])

  const handleGoToUpload = useCallback(()=> {
    beforeAction('redirect');

    if(!recordedBlob) {
      failedAction();
      return;
    }
    const url= URL.createObjectURL(recordedBlob);
    
    sessionStorage.setItem('recordedVideo', 
        JSON.stringify({
            url,
            name: "screen-recording.webm",
            type: recordedBlob.type,
            size: recordedBlob.size,
            duration: recordingDuration
        })
    )
    // setIsModalOpen(false);
    changeAction({state: 'ongoing'});
  },[recordedBlob, recordingDuration])

  const handleBackToSettings = useCallback(() => {
    resetRecording();
    beforeAction('check');
    changeRecordingState('before');
  },[])

  const handleSaveRecordedVideo = useCallback(() => {
    if(!recordedBlob) return;
    try {
      ongoingAction('save');
      const videoUrl = URL.createObjectURL(recordedBlob);
      downloadVideo(videoUrl);
      successfulAction();
    }catch(error){
      const message = error instanceof Error ? error.message : 'Failed to download video' 
      showModalError(message)
      failedAction();
    }finally {
      changeAction({type: 'load', state: 'after', response: 'successful'});
    }
  },[])
  //------------------------------

  //Device check function
  const deviceCheckCondition = async (
    condition: boolean, 
    device: DeviceType
  ): Promise<DeviceStatus> => {
    if(condition) {
      const checkResult = await checkDevice(device);
      return checkResult;
    } else {
      return 'unused';
    };
  }

  //refactoring may not work well but needs refactoring
  const devicesCheck = async () => {
    if(videoSettings.camera !== "no" || videoSettings.withMic) {
      
      changeAction({state: 'ongoing'})
  
      //might not work right
      const checkFailed = (response: DeviceStatus) => {
        if(response === "no-support" || response === "no-permission") {
          failedAction();
          return
        };
      }
  
      console.log('checking devices')
  
      const camCheckResponse = await deviceCheckCondition(videoSettings.camera !== 'no', 'camera')
      
      console.log(camCheckResponse)
  
      checkFailed(camCheckResponse)
      
      const micCheckResponse = await deviceCheckCondition(videoSettings.withMic, 'microphone')
  
      console.log(micCheckResponse)
  
      checkFailed(micCheckResponse)
  
      successfulAction();

      actionTimeout(beforeAction('record'))

    } else {
      beforeAction('record');
    };
  }

  const handleGoBack = () => resetAction()

  // const recordingButtons = useMemo((): ModalButton[] => {
  //   let recordingStateBtns: ModalButton[] = [];   
    
  //   if(recordingState === "before" && !showInstructions) {
  //     recordingStateBtns = [
  //       {
  //         className:'btn-theme',
  //         action: () => devicesCheck({
  //           camera: videoSettings?.camera, 
  //           withMic: videoSettings?.withMic
  //         }),
  //         text: "Continue",
  //       },
  //     ]
  //   } else if (recordingState === "before" && showInstructions) {
  //     recordingStateBtns = [
  //       {
  //         className:'btn-white',
  //         action: () => setShowInstructions(false),
  //         text: "Go Back"
  //       },
  //       {
  //         className:'btn-theme',
  //         action: handleStartRecording,
  //         text: "Start Recording"
  //       }
  //     ]
  //   } else if (recordingState === "ongoing") {
  //     recordingStateBtns = [
  //       {
  //         className:'btn-destructive',
  //         action: handleStopRecording,
  //         text: "Stop Recording"
  //       },
  //     ]
  //   } else if (recordingState === "after" && goToUpload === null) {
  //     recordingStateBtns = [
  //       {
  //         className:'btn-white',
  //         action: handleGoBack,
  //         text: "Go Back"
  //       },
  //       {
  //         className:'btn-white',
  //         action: handleRecordAgain,
  //         text: "Record Again"
  //       },
  //       {
  //         className:'btn-theme',
  //         action: handleGoToUpload,
  //         src: ICONS.upload,
  //         alt: "upload",
  //         text: "Upload"
  //       },
  //     ]
  //   } else if (recordingState === "after" && goToUpload === 'failed') {
  //     recordingStateBtns = [
  //       {
  //         className:'btn-theme',
  //         action: handleSaveRecordedVideo,
  //         text: "Save Video"
  //       },
  //       {
  //         className:'btn-theme',
  //         action: handleGoToUpload,
  //         src: ICONS.upload,
  //         alt: "try again",
  //         text: "Try again"
  //       },
  //     ] 
  //   } else null;
   
  //   return recordingStateBtns;
  // }, [
  //   handleStartRecording, 
  //   recordingState, 
  //   handleStopRecording, 
  //   handleGoBack, 
  //   handleRecordAgain, 
  //   handleGoToUpload, 
  //   handleOpenModal,
  //   showInstructions,
  //   ICONS,
  //   goToUpload
  // ])

  useEffect(()=>{
      if(!isRecording && !recordedVideoUrl) changeRecordingState('before')
      if(isRecording) {
        changeRecordingState('ongoing');
        resetAction();
      };
      if(recordedVideoUrl && !changeAction) changeRecordingState('after');
  },[isRecording, recordedVideoUrl])

  return {
    recordingState,
    videoRef,
    goingToUploadAction,
    handleOpenModal, 
    handleCloseModal,
    handleBackToSettings,
    devicesCheck,
    handleStartRecording,
    handleStopRecording,
    handleGoBack,
    handleRecordAgain,
    handleGoToUpload,
    handleSaveRecordedVideo,
    recordedVideoUrl,
    selectedVideoSetting,
    settingsGuide,
    videoSettings,
    recordSettings,
    actionResponse,
    actionStatus,
    showModalError,
    handleTakeScreenShot,
    handlePauseResume,
    recordingStatus,
    isFlashing
  }
}

export default useRecordingFeatures