
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
    UserIcon, 
    X, 
    XCircle
} from "lucide-react"
import { ActionResponseType, ActionStateType, DropdownOptionsType, ModalButton } from ".."
import React, { JSX} from "react"
import { FailedActionDialog, OngoingActionDialog, SuccessActionDialog } from "@/components"


export const cursorDisplayOptions: DropdownOptionsType[] = [
    {
        label: "Show always",
        default: true
    },
    {
        label: "Hide cursor",
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
        label: "Default - MacBook Air Microphone",
        default: true
    },
    {
        icon: <MicIcon size={18}/>,
        label: "Logitech StreamCam Microphone"
    },
    {
        icon: <MicIcon size={18}/>,
        label: "Rhode NT-USB Microphone"
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

export const DIALOG_ICONS = {
    alert: <AlertTriangle size={18} stroke="#fef2f2"/>,
    checked: <CheckCircleIcon size={24} fill='#ff4393' stroke="#ffffff"/>,
    failed: <XCircle size={18} stroke="red"/>,
    loader: <LoaderCircle size={24} className="animate-spin"/>,
    close: <X size={18}/>,
    info: <InfoIcon size={18} stroke='blue'/>
}

export type ModalContentType = {
    body: React.ReactElement | null,
    buttons?: ModalButton[] | null
}

export const modalContent = (
    actionStatus: ActionStateType | null,
    actionResponse : ActionResponseType | null,
    failedContent: ModalContentType,
    ongoingContent: ModalContentType,
    successContent: ModalContentType,
    beforeContent?: ModalContentType
) => {
    
    if(beforeContent && actionStatus === 'before'  ) {
        return beforeContent;
    }

    if(actionStatus ==='ongoing' && ongoingContent) {
        return ongoingContent;
    }

    if(actionStatus ==='after' && actionResponse === 'successful' && successContent) {
        return successContent;
    }

    if(actionStatus ==='after' && actionResponse === 'failed' && failedContent) {
        return failedContent;
    }
    
    return null;
}

// const recordingStateContent = ({
//     recordingState,

// }) => {

// }

export const modalButton = (text: string, action: () => void, className?: string): ModalButton => {
    return {
        text,
        action,
        className: className || "btn-theme"
    }
}