import { 
    AlertTriangle,
    CameraIcon, 
    CameraOffIcon, 
    CheckCircleIcon, 
    InfoIcon, 
    Layout, 
    LayoutGrid, 
    LoaderCircle, 
    MicIcon, 
    MicOffIcon, 
    MonitorIcon, 
    Navigation, 
    NavigationOff, 
    SwitchCameraIcon, 
    Upload, 
    UserIcon, 
    X, 
    XCircle
} from "lucide-react"
import { DropdownOptionsType } from ".."
import { JSX } from "react"
import { NoNameModalActionType, VoidAction} from "@/lib/hooks/useModalContext"
import { getActionStateButtons, getModalButton } from "@/lib/modalContentUtil"
import { Img } from "@/components"

export const SOCIAL_ICONS = {
  googleIcon: (
  <Img
    src="/assets/icons/google.svg"
    alt="google_icon"
    size={22}
  />
) 
}

export const cursorDisplayOptions: DropdownOptionsType[] = [
    {
        label: "Show always",
        default: true
    },
    {
        label: "Hide away",
        inactive: true
    },
    {
        label: "Show in motion"
    },
]

export const cursorDisplayOptionsIcon = (condition: boolean): JSX.Element => {
    return condition ? <NavigationOff size={18}/> : <Navigation size={18}/> 
}  

export const micSettingsOptions:DropdownOptionsType[] = [
    {
        icon: <MicOffIcon size={18}/>,
        label: "No microphone",
        inactive: true
    },
    {
        icon: <MicIcon size={18}/>,
        label: "Default - MacBook Air Mic.",
        default: true
    },
    {
        icon: <MicIcon size={18}/>,
        label: "Logitech StreamCam Mic."
    },
    {
        icon: <MicIcon size={18}/>,
        label: "Rhode NT-USB Mic."
    },
]

export const micSettingsOptionsIcon = (condition: boolean): JSX.Element => {
    return condition ? <MicIcon size={18}/> : <MicOffIcon size={18}/> 
}  

export const cameraSettingsOptions: DropdownOptionsType[] = [
    {
        icon: <CameraOffIcon size={18}/>,
        label: "no Camera",
        inactive: true,
        default: true
    },
    {
        icon: <CameraIcon size={20}/>,
        label: "with Camera",
    },
    {
        icon: <CameraIcon size={20}/>,
        label: "Camera only",
    },
]

export const screenSettingsOptions: DropdownOptionsType[] = [
    {
        icon: <MonitorIcon size={18}/>,
        label: "Entire Screen",
        default: true
    },
    {
        icon: <LayoutGrid size={18}/>,
        label: "Window"},
    {
        icon: <Layout size={18}/>,
        label: "Browser Tab"
    },
    {
        icon: <UserIcon size={18}/>,
        label: "Camera only",
        inactive: true,
    },
]

export const cameraMode: DropdownOptionsType[] = [
    {label: 'front', icon: <CameraIcon size={20}/>, default: true},
    {label: 'back', icon: <SwitchCameraIcon size={20}/>}
]

export const LoaderIcon =({size, color}: {size?: number, color?: string}) => (<LoaderCircle size={size || 24} stroke={color || "#ff4393"} className="animate-spin"/>
)

export const MODAL_ICONS = {
    alert: <AlertTriangle size={18} stroke="#ff4393"/>,
    checked: <CheckCircleIcon size={30} fill='#ff4393' stroke="#ffffff"/>,
    failed: <XCircle size={18} stroke="red"/>,
    loader: LoaderIcon,
    close: <X size={18}/>,
    info: <InfoIcon size={18} stroke='#ff4393'/>
}

//Record modal contents
const goBackButton = (onGoBack: VoidAction, text?: string) => getModalButton(text || 'Go back', onGoBack, 'btn-white')

const uploadButton = (onGoToUpload: VoidAction, text?: string) => getModalButton(text || 'Upload', onGoToUpload, 'btn-theme', <Upload size={16}/>)

export const checkButtons = (
  action: NoNameModalActionType,
  onGoBack: VoidAction,
  onCheckDevices: VoidAction,
) => {
  return getActionStateButtons (
    action,
    [
      goBackButton(onGoBack, 'Adjust setting'), 
      getModalButton('Retry Check', onCheckDevices)
    ],
    [
      getModalButton("Continue", onCheckDevices)
    ]
)}

export const loadButtons = (
  action: NoNameModalActionType,
  onRecordAgain: VoidAction,
  onStopRecording: VoidAction,
  onContinueRecording: VoidAction,
  onGoToUpload: VoidAction,
) => {
  const recordAgain = getModalButton('Record again', onRecordAgain, 'btn-white')

  return getActionStateButtons(
    action,
    [
      recordAgain,
      getModalButton('Recover', onStopRecording)
    ],
    [
      getModalButton('Continue', onContinueRecording),
      getModalButton('End', onStopRecording, 'btn-destructive'),
    ],
    [
      recordAgain, 
      uploadButton(onGoToUpload)
    ],
  )
}

export const recordRedirectButtons = (
  action: NoNameModalActionType,
  onSaveRecording: VoidAction,
  onGoToUpload: VoidAction,
) => {
  return getActionStateButtons (
    action,
    [
      getModalButton('Save Recording', onSaveRecording),
      uploadButton(onGoToUpload, 'Retry Upload')
    ]
  )
}

export const startRecordingButtons = (
  action: NoNameModalActionType,
  onGoBack: VoidAction,
  onStartRecording: VoidAction,
  onStopWarning: VoidAction
) => {
  const recordButtons = [
    goBackButton(onGoBack), 
    getModalButton('Record', onStartRecording)
  ]
  return getActionStateButtons(
    action,
    recordButtons,
    recordButtons,
    [getModalButton('Stop recording', onStopWarning)],
  )
}

export const saveButtons = (
  action: NoNameModalActionType,
  onExit: VoidAction,
  onSaveRecording: VoidAction,
) => {
  return getActionStateButtons(
    action,
    [getModalButton('Retry', onSaveRecording)],
    null,
    [getModalButton('Exit', onExit)],
  )
}


export const editButtons = (
  action: NoNameModalActionType,
  onGoToEdit: VoidAction
) => {
  return getActionStateButtons(
    action,
    [getModalButton('Retry', onGoToEdit)],
  )
}

export const addThumbnailButtons = (
  action: NoNameModalActionType,
  onAddThumbnail: VoidAction,
  resetModal: VoidAction,
) => {
return getActionStateButtons(
    action,
    [getModalButton('Retry', onAddThumbnail)],
    null,
    [getModalButton('Exit', resetModal)]
  )
}

export const generateButtons = (
  action: NoNameModalActionType,
  onStartGenerate: VoidAction,
  onGenerateAgain: VoidAction,
  onAddThumbnail: VoidAction,
) => {
  return getActionStateButtons(
    action,
    [getModalButton('Try again', onStartGenerate)],
    [getModalButton('Generate', onStartGenerate)],
    [
      getModalButton('Generate', onGenerateAgain, 'btn-white'),
      getModalButton('Upload', onAddThumbnail)
    ]
  )
}


export const deleteButtons = (
  action: NoNameModalActionType,
  onDelete: VoidAction,
  closeModal: VoidAction,
) => {
  return getActionStateButtons(
    action,
    [getModalButton('Retry', onDelete, 'btn-destructive')],
    [
      getModalButton('Cancel', closeModal, 'btn-white'),
      getModalButton('Continue', onDelete, 'btn-destructive'),
    ]
  )
}

export const videoRedirectButtons = (
  action: NoNameModalActionType,
  afterDeleteRedirect: VoidAction
) => {
  return getActionStateButtons(
    action,
    [getModalButton('Retry', afterDeleteRedirect)]
  )
}

export const downloadButtons = (
  action: NoNameModalActionType,
  onDownload: VoidAction
) => {
  return getActionStateButtons(
    action,
    [getModalButton('Retry', onDownload)]
  )
}