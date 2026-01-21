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
  ActionStatusType, 
  CameraOptions, 
  DisplaySurfaceOptions, 
  RecordSettingsType, 
  VideoSettingsType, 
  ActionStatusType,
  ActionResponseType
} from "@/index";
import { ICONS } from "@/constants";
import { 
  ModalContentType,
  cameraMode, 
  cameraSettingsOptions, 
  cursorDisplayOptions, 
  cursorDisplayOptionsIcon, 
  micSettingsOptions, 
  micSettingsOptionsIcon, 
  modalContent, 
  screenSettingsOptions 
} from "@/constants/lists";
import { checkDevice, checkHardwareSupport, checkPermission, downloadVideo, parseVideoSettings, syncCameraOnly } from "../utils";

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
  } = useScreenRecording()

  const {
    openModal, 
    closeModal, 
    actionResponse,
    actionStatus,
    changeActionStatus,
    changeActionResponse,
    showModalError,
    recordingState,
    changeRecordingState,
    changeModalContent,
    recordingResponse,
    changeRecordingResponse
  } = useGlobalContext()

  const recordActionStatus = (status: ActionStatusType | null) => changeActionStatus('record', status)

  const recordActionResponse = (response: ActionResponseType | null) => changeActionResponse('record', response)

  const redirectActionStatus = (status: ActionStatusType | null) => changeActionStatus('redirect', status)

  const redirectActionResponse = (response: ActionResponseType | null) => changeActionResponse('redirect', response)

  const checkActionStatus = (status: ActionStatusType | null) => changeActionStatus('check', status)

  const checkActionResponse = (response: ActionResponseType | null) => changeActionResponse('check', response)

  const saveRecordingActionResponse = (response: ActionResponseType | null) => changeActionResponse('save_recording', response)

  const saveRecordingActionStatus = (status: ActionStatusType | null) => changeActionStatus('save_recording', status)

  const videoRef= useRef<HTMLVideoElement>(null);
  
  const [goToUpload, setGoToUpload] = useState<GoToUploadState | null> (null);

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
  const transitionNote = useCallback((incomingNote: string) => {
    setSettingsGuide('');
    const noteTimer = setTimeout(()=> setSettingsGuide(incomingNote), 500)
    return ()=> clearTimeout(noteTimer);
  },[])

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
    checkActionStatus('before');
  },[]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    resetRecording();
    setRecordingState(null);
  },[])

  const goingToUploadAction = useCallback((UIActions: () => void): void => {
    UIActions();
    redirectActionStatus('after')
    redirectActionResponse("successful");
  },[])
  
  //recording buttons ------------
  const handleStartRecording = useCallback(async ()=> {
    const onBrowserDialogPopUp = () => {
      recordActionStatus('after')
      recordActionResponse('successful')
    }
    try {
      if(recordingState !== "before") changeRecordingState('before');
      recordActionStatus('ongoing')
      
      await startRecording(
        videoSettings, 
        onBrowserDialogPopUp
      );
    }catch(error) {
      const message = error instanceof Error ? error.message : error;
      recordActionStatus('after');
      recordActionResponse('failed');
      showModalError(message as string);
    }
  },[videoSettings])

  const handleRecordAgain = useCallback(async ()=> {
    try {
        resetRecording();
        await startRecording(videoSettings);
    }catch(error) {
        const message = error instanceof Error ? error.message : error;
        setModalError(message as string);
    }

    if(recordedVideoUrl && videoRef.current) {
        videoRef.current.src = recordedVideoUrl;
    }
  },[videoSettings])

  const handleStopRecording = useCallback(() => {
    changeRecordingState('after')
    recordActionStatus(null);
    stopRecording();
  },[])

  const handleGoToUpload = useCallback(()=> {
    redirectActionStatus('before');

    if(!recordedBlob) {
      redirectActionStatus('after')
      redirectActionResponse('failed');
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
    redirectActionStatus('ongoing');
  },[recordedBlob, recordingDuration])

  const handleBackToSettings = useCallback(() => {
    resetRecording()
    changeRecordingState('before');
  },[])

  const handleSaveRecordedVideo = useCallback(() => {
    if(!recordedBlob) return;
    try {
      saveRecordingActionStatus('ongoing');
      const videoUrl = URL.createObjectURL(recordedBlob);
      downloadVideo(videoUrl);
      saveRecordingActionStatus('after');
      saveRecordingActionResponse('successful')
    }catch(error){
      const errorMssg = error instanceof Error ? error.message : 'Failed to download video' 
      showModalError(errorMssg)
      saveRecordingActionStatus('after');
      saveRecordingActionResponse('failed');
    }finally {
      saveRecordingActionStatus(null);
    }
  },[])
  //------------------------------

  //Device check function
  //Not tried yet,look out for error
  const helpSettingsGuide = (device: DeviceType, checkStatus: DeviceStatus ) => {
    const capitalizedDevice = device.replace(device.charAt(0), device.charAt(0).toUpperCase())
    if(checkStatus === "no-permission"){
      transitionNote(`Please allow ${capitalizedDevice} permission to proceed`);
    } else if (checkStatus === "no-support") {
      transitionNote(`${capitalizedDevice} not supported on this device. Try adjusting settings`);
    } else return;
  }

  const deviceCheckCondition = async (
    condition: boolean, 
    device: DeviceType
  ): Promise<DeviceStatus> => {
    if(condition) {
      const checkResult = await checkDevice(device);
      helpSettingsGuide(device, checkResult)
      return checkResult;
      
    } else {
      helpSettingsGuide(device, "unused")
      return 'unused';
    };
  }

  //refactoring may not work well
  const devicesCheck = async () => {
    checkActionStatus('ongoing')

    const trackOnCheck = ( response: ActionResponseType | null, status?: ActionStatusType | null) => {
      checkActionStatus(status || 'after')
      checkActionResponse(response)
    }

    const checkFailed = (response: DeviceStatus) => {
      if(response === "no-support" || response === "no-permission") {
        trackOnCheck('failed');
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

    trackOnCheck('successful');

    const startRecordTimer = setTimeout(() => {
      trackOnCheck(null, null);
      recordActionStatus('before');
    })

    clearTimeout(startRecordTimer);
  }

  const handleGoBack = () => {
    if(actionStatus.check) checkActionStatus(null)
    if(actionStatus.record) recordActionStatus(null)
  }

  //  const recordingContent = useMemo((): ModalContentType | null => {
  //   return modalContent(
  //     recordingState,
  //     recordingState,
  //     {
  //       body: <FailedActionDialog customMessage="Failed to delete video"/>,
  //       buttons: [modalButton('Retry', handleDelete, 'btn-destructive')]
  //     },
  //     {
  //       body: <OngoingActionDialog message = "Deleting video.."/>
  //     },
  //     {
  //       body: <SuccessActionDialog message = 'Video successfully deleted'/>
  //     },
  //     {
  //       body: 
  //         actionStatus.check 
  //         ? modalContent(
  //             actionStatus.check,
  //             actionResponse.check,
  //             {
  //               body: <FailedActionDialog 
  //               customMessage="Failed to delete video"/>,
  //               buttons: [modalButton('Retry', handleDelete, 'btn-destructive')]
  //             },

  //         ) : actionStatus.record
  //           ? modalContent(

  //           ):
  //         <WarningActionDialog
  //           header = 'This action cannot be undone'
  //           message = "Click continue to delete this video completely"
  //         />
  //       ),
  //       buttons: [
  //         modalButton('Cancel', closeModal, 'btn-white'),
  //         modalButton('Continue', handleDelete, 'btn-destructive'),
  //       ]
  //     },
  //   )
  // }, [actionStatus.delete, actionResponse.delete, modalButton, handleDelete, closeModal])

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
      if(isRecording) changeRecordingState('ongoing');
      if(recordedVideoUrl && !redirectActionStatus) changeRecordingState('after');
  },[isRecording, recordedVideoUrl])

  useEffect(()=> {
    if(settingsGuide && settingsGuide.toLowerCase().split(' ').includes('camera') && videoSettings.camera === 'no') {
      transitionNote('')
    }
  },[videoSettings, settingsGuide])

  return {
    modalError,
    recordingState,
    videoRef,
    recordingButtons,
    goToUpload,
    goingToUploadAction,
    setModalError,
    isModalOpen, 
    handleOpenModal, 
    handleCloseModal,
    recordedVideoUrl,
    selectedVideoSetting,
    showInstructions,
    settingsGuide,
    videoSettings,
    recordSettings,
    actionResponse,
    actionStatus,
    showModalError,
    handleTakeScreenShot
  }
}

export default useRecordingFeatures