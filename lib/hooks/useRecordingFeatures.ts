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
  CameraOptions, 
  DisplaySurfaceOptions, 
  RecordSettingsType, 
  VideoSettingsType,
  OpenModalArgs,
  Action,
  ActionStateType,
  ActionResponseType,
  BeforeModalActionType, 
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
import { ActionType, useGlobalContext } from "./useGlobalContext";

export type SyncCameraKeys = Pick<VideoSettingsType, "displaySurface" | "camera">;

type NoNameBeforeAction = Omit<BeforeModalActionType, 'name'>

type NonNullPropertyValue<T>= {
  [K in keyof NoNameBeforeAction]: K extends T ? NonNullable<NoNameBeforeAction[K]> : NoNameBeforeAction[K]
}

type SaveAfterLoadActionType = NonNullPropertyValue<'state'>

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
    modalOpen,
    openModal, 
    closeModal, 
    showModalError,
    changeContentParent,
    modalAction,
    modalContentParent,
    successfulAction,
    actionTimeout,
    failedAction,
    beforeAction,
    ongoingAction,
    changeState,
    syncModalContent,
    actionTrue,
  } = useGlobalContext()

  const videoRef= useRef<HTMLVideoElement>(null);

  const [videoPlaying, setVideoPlaying] = useState(false);
  
  //Settings
  const [videoSettings, setVideoSettings] = useState<VideoSettingsType>({
    cursor: "always",
    displaySurface: "monitor",
    camera: 'no',
    cameraFacingMode: 'user',
    withMic: true,
  });
  
  const [settingsGuide, setSettingsGuide] = useState('');

  const [saveAfterLoadAction, setSaveAfterLoadAction] = useState<SaveAfterLoadActionType>({state: 'before', response: null})

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
  const handleOpenModal = useCallback((content: Omit<OpenModalArgs, 'type'>) => {
    openModal({type: 'record', closeIcon: content.closeIcon});
    changeContentParent('record');
    beforeAction('check');
  },[]);

  const handleCloseModal = useCallback(() => {
    closeModal();
    resetRecording();
  },[])

  const goingToUploadAction = useCallback((UIActions: () => void): void => {
    UIActions();
    successfulAction('redirect');
  },[])

  //recording buttons ------------
   //Device check function
  const helpSettingsGuide = (device: DeviceType, checkResult: DeviceStatus ) => {
    const capitalizedDevice = device.replace(device.charAt(0), device.charAt(0).toUpperCase())
    if(checkResult === "no-permission"){
      setSettingsGuide(`Please allow ${device} permission to proceed`);
    } else {
      setSettingsGuide(`${capitalizedDevice} not supported on this device. Try adjusting settings`);
    }
  }

  const deviceCheckCondition = async (
    condition: boolean, 
    device: DeviceType
  ): Promise<DeviceStatus> => {
    if(condition) {
      const checkResult = await checkDevice(device);
      if(checkResult === 'no-permission' || 'no-support') {
        helpSettingsGuide(device, checkResult);
      }
      return checkResult;
    } else {
      return 'unused';
    };
  }

  //refactoring may not work well but needs refactoring
  const handleCheckDevices = useCallback(async () => {
    if(videoSettings.camera !== "no" || videoSettings.withMic) {
      
      changeState('check','ongoing')
  
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

      actionTimeout(() => beforeAction('record'), 2000)
    } else {
      beforeAction('record');
    };
  }, [videoSettings])

  const handleGoBack = useCallback(() => {
    beforeAction('check')
  },[])

  const handleStartRecording = useCallback(async ()=> {
    try {
      changeState('record', 'ongoing')
      await startRecording(
        videoSettings, 
        () => successfulAction('record')
      );
    }catch(error) {
      const message = error instanceof Error ? error.message : error;
      failedAction('record');
      showModalError(message as string);
    }
  },[videoSettings])

  const handleRecordAgain = useCallback(async ()=> {
    try {
      resetRecording();
      ongoingAction('record');
      await startRecording(
        videoSettings, 
        () => successfulAction('record')
      );
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
      changeState('load', 'ongoing');
      stopRecording();
      successfulAction('load');
      console.log(modalAction.load)
    } catch (error) {
      failedAction('load');
    }
  },[])

  const handleGoToUpload = useCallback(()=> {
    beforeAction('redirect');

    if(!recordedBlob) {
      failedAction('redirect');
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
    changeState('redirect', 'ongoing');
  },[recordedBlob, recordingDuration])

  const handleBackToSettings = useCallback(() => {
    resetRecording();
    beforeAction('check');
  },[])

  const changeSaveAfterLoad = useCallback((state: ActionStateType, response?: ActionResponseType) => {
    setSaveAfterLoadAction(prev => {
      return response ? {state, response} : {state, response: null};
    })
  },[])

  const saveRecording = useCallback((
    ongoingAction: () => void,
    afterSuccessAction: () => void,
    afterFailureAction: () => void,
  ) => {
    if(!recordedBlob) return;
    try {
      ongoingAction();
      const videoUrl = URL.createObjectURL(recordedBlob);
      downloadVideo(videoUrl);
      afterSuccessAction();
    }catch(error){
      const message = error instanceof Error ? error.message : 'Failed to download video' 
      showModalError(message)
      afterFailureAction();
    }
  },[])

  const handleSaveAfterLoad = useCallback((failedFallback?: (name: Action, type: ActionType) => void) => {
    saveRecording(
      () => {
        if(failedFallback) failedFallback('load', 'before');
        changeSaveAfterLoad('ongoing');
      },
      () => {
        changeSaveAfterLoad('after', 'successful');
        actionTimeout(() => changeSaveAfterLoad('before'), 2000)
      },
      () => {
        changeSaveAfterLoad('after', 'failed')
        failedAction('save_record', 'ongoing')
        if(videoPlaying)videoRef.current?.pause()
        // resetAction();
      },
    );
  },[saveRecording, changeSaveAfterLoad])

  const handleSaveOnFailedRedirect = useCallback(() => {
    if(saveAfterLoadAction.response === 'failed') {
      handleSaveAfterLoad(successfulAction);
      return;
    }
    saveRecording(
      () => ongoingAction('save_record'),
      () => {
        successfulAction('save_record')
        actionTimeout(() => successfulAction('load', 'before'), 2000);
      },
      () => failedAction('save_record')
    );
  },[saveRecording, ongoingAction, successfulAction, failedAction])

  const handleGoToRecordedVideo = () => successfulAction('load', 'before')
  //------------------------------

  useEffect(()=>{
      if(isRecording) {
        beforeAction('load');
      };
  },[isRecording])

  return {
    modalOpen,
    videoRef,
    modalAction,
    modalContentParent,
    actionTrue,
    goingToUploadAction,
    handleOpenModal, 
    handleCloseModal,
    handleBackToSettings,
    handleCheckDevices,
    handleStartRecording,
    handleStopRecording,
    handleGoBack,
    handleRecordAgain,
    handleGoToUpload,
    handleSaveAfterLoad,
    handleSaveOnFailedRedirect,
    syncModalContent,
    saveAfterLoadAction,
    recordedVideoUrl,
    selectedVideoSetting,
    settingsGuide,
    videoSettings,
    recordSettings,
    setVideoPlaying,
    showModalError,
    handleTakeScreenShot,
    handlePauseResume,
    recordingStatus,
    isFlashing
  }
}

export default useRecordingFeatures