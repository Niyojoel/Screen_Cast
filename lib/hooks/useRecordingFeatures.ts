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
  GoToUploadState
} from "@/index";
import { ICONS } from "@/constants";
import { 
  cameraMode, 
  cameraSettingsOptions, 
  cursorDisplayOptions, 
  cursorDisplayOptionsIcon, 
  micSettingsOptions, 
  micSettingsOptionsIcon, 
  screenSettingsOptions 
} from "@/constants/lists";
import { checkHardwareSupport, checkPermission, downloadVideo, parseVideoSettings, syncCameraOnly } from "../utils";

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
  } = useScreenRecording()

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalError, setModalError] = useState("");

  const [showInstructions, setShowInstructions] = useState(false);
  
  const [recordingState, setRecordingState] = useState<ActionStatusType | null>(null)

  const [actionResponse, setActionResponse] = useState<'failed' | 'successful' | null>(null);

  const [downloading, setDownloading] = useState(false);
  
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
  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true)
    setRecordingState('before')
  },[]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    resetRecording();
    setRecordingState(null);
  },[])

  const goingToUploadAction = useCallback((UIActions: () => void): void => {
    UIActions();
    setGoToUpload("finished");
    const goToUploadTimer = setTimeout(()=> setGoToUpload(null), 500)
    clearTimeout(goToUploadTimer);
  },[])
  
  //recording buttons ------------
  const handleStartRecording = useCallback(async ()=> {
    try {
      await startRecording(videoSettings);
    }catch(error) {
      const message = error instanceof Error ? error.message : error;
      setModalError(message as string);
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
    setRecordingState('after')
    setShowInstructions(false);
    stopRecording();
  },[])

  const handleGoToUpload = useCallback(()=> {
    setGoToUpload('loading');

    if(!recordedBlob) {
      setGoToUpload('failed');
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
    setGoToUpload('redirecting');
  },[recordedBlob, recordingDuration])

  const handleGoBack = useCallback(() => {
    resetRecording()
    setRecordingState('before');
  },[])

  const handleSaveRecordedVideo = useCallback(() => {
    if(!recordedBlob) return;
    try {
      setDownloading(true);
      const videoUrl = URL.createObjectURL(recordedBlob);
      downloadVideo(videoUrl);
      setActionResponse('successful')
    }catch(error){
      const errorMssg = error instanceof Error ? error.message : 'Failed to download video' 
      setModalError(errorMssg)
      setActionResponse('failed');
    }finally {
      setDownloading(false);
    }
  },[])
  //------------------------------

  //Device check function
  //Not tried yet,look out for error
  const checkDevice = async (device: DeviceType): Promise<DeviceStatus> => {
    const supported = await checkHardwareSupport(device);

    console.log({[device]: supported})

    if(!supported) return 'no-support';
    
    const permissionStatus = await checkPermission(device);
    
    console.log(permissionStatus)
    
    if(permissionStatus !== "granted") return 'no-permission';

    console.log(`setting ${device} to pass`)

    return 'passed'
  }

  const helpSettingsGuide = (device: DeviceType, checkStatus: DeviceStatus ) => {
    const capitalizedDevice = device.replace(device.charAt(0), device.charAt(0).toUpperCase())
    if(checkStatus === "no-permission"){
      transitionNote(`Please allow ${capitalizedDevice} permission`);
    } else if (checkStatus === "no-support") {
      transitionNote(`${capitalizedDevice} not supported on this device`);
    } else return;
  }

  const deviceCheckCondition = async (
    condition: boolean, 
    device: DeviceType
  ): Promise<DeviceStatus> => {
    if(condition) {
      const checkResult = await checkDevice(device)
      helpSettingsGuide(device, checkResult)
      return checkResult;
      
    } else {
      helpSettingsGuide(device, "unused")
      return 'unused';
    };
  }

  const devicesCheck = async (videoSettings: Pick<VideoSettingsType, 'camera' | 'withMic'>) => {

    console.log('checking devices')

    const camCheckResponse = await deviceCheckCondition(videoSettings.camera !== 'no', 'camera')
    
    console.log(camCheckResponse)

    if(camCheckResponse === "no-support" || camCheckResponse === "no-permission") return;
    
    const micCheckResponse = await deviceCheckCondition(videoSettings.withMic, 'microphone')

    console.log(micCheckResponse)

    if(micCheckResponse === "no-support" || micCheckResponse === "no-permission") return;
    
    setShowInstructions(true);
  }

  const recordingButtons = useMemo((): ModalButton[] => {
    
    let recordingStateBtns: ModalButton[] = [];
    
    if(recordingState === "before" && !showInstructions) {
      recordingStateBtns = [
        {
          className:'btn-theme',
          action: () => devicesCheck({
            camera: videoSettings?.camera, 
            withMic: videoSettings?.withMic
          }),
          text: "Continue",
        },
      ]
    } else if (recordingState === "before" && showInstructions) {
      recordingStateBtns = [
        {
          className:'btn-white',
          action: () => setShowInstructions(false),
          text: "Go Back"
        },
        {
          className:'btn-theme',
          action: handleStartRecording,
          text: "Start Recording"
        }
      ]
    } else if (recordingState === "ongoing") {
      recordingStateBtns = [
        {
          className:'btn-destructive',
          action: handleStopRecording,
          text: "Stop Recording"
        },
      ]
    } else if (recordingState === "after" && goToUpload === null) {
      recordingStateBtns = [
        {
          className:'btn-white',
          action: handleGoBack,
          text: "Go Back"
        },
        {
          className:'btn-white',
          action: handleRecordAgain,
          text: "Record Again"
        },
        {
          className:'btn-theme',
          action: handleGoToUpload,
          src: ICONS.upload,
          alt: "upload",
          text: "Upload"
        },
      ]
    } else if (recordingState === "after" && goToUpload === 'failed') {
      recordingStateBtns = [
        {
          className:'btn-theme',
          action: handleSaveRecordedVideo,
          text: "Save Video"
        },
        {
          className:'btn-theme',
          action: handleGoToUpload,
          src: ICONS.upload,
          alt: "try again",
          text: "Try again"
        },
      ] 
    } else null;
   
  return recordingStateBtns;
  }, [
    handleStartRecording, 
    recordingState, 
    handleStopRecording, 
    handleGoBack, 
    handleRecordAgain, 
    handleGoToUpload, 
    showInstructions,
    ICONS,
    goToUpload
  ])

  useEffect(()=>{
      if(!isRecording && !recordedVideoUrl) setRecordingState('before')
      if(isRecording) setRecordingState('ongoing');
      if(recordedVideoUrl && !goToUpload) setRecordingState('after');
  },[isRecording, recordedVideoUrl])

  useEffect(() => console.log(recordingState), [recordingState])

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
    downloading,
    actionResponse
  }
}

export default useRecordingFeatures