'use client'
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
import {DropdownOptionsType} from ".."
import React, { JSX, useEffect} from "react"
import { DialogContentBody, FailedActionDialog, OngoingActionDialog, SuccessActionDialog, WarningActionDialog } from "@/components"
import { NoNameModalActionType } from "@/lib/hooks/useGlobalContext"
import { contentClassNameByState, getModalButton} from "@/lib/modalContentUtil"


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
    alert: <AlertTriangle size={18} stroke="#ff4393"/>,
    checked: <CheckCircleIcon size={30} fill='#ff4393' stroke="#ffffff"/>,
    failed: <XCircle size={18} stroke="red"/>,
    loader: <LoaderCircle size={24} stroke="#ff4393" className="animate-spin"/>,
    close: <X size={18}/>,
    info: <InfoIcon size={18} stroke='#ff4393'/>
}

type ActionBodyProps = {
    action: NoNameModalActionType;
    beforeRender?: React.ReactElement;
    failedNote?: string;
}

export const CheckBody = ({
    action,
    checkResponse,
    beforeRender
}: ActionBodyProps & {checkResponse: string}) => {
    if(action) {
        const state = action?.state
        const response = action?.response

        return state && (
            <>
                <DialogContentBody subNode= {beforeRender} className={contentClassNameByState(state === 'before')}/>
                <OngoingActionDialog text = 'Checking user devices...' className={contentClassNameByState(state === 'ongoing')}/>
                <FailedActionDialog header ='Check failed' text={checkResponse} className={contentClassNameByState(state === 'after' &&  response === 'failed')}/>
                <SuccessActionDialog text = 'Check passed' className={contentClassNameByState(state === 'after' && response === 'successful')}/>
            </>
        )
    } else return null
}

export const RecordGuideBody = ({
    action,
    beforeRender,
    successRender,
    failedNote
}: ActionBodyProps & {successRender: React.ReactElement}) => {
    if(action) {
        const state = action?.state
        const response = action?.response

        return state && (
            <>
                <DialogContentBody
                    icon={DIALOG_ICONS.info}
                    headerNode = 'Guide'
                    subNode = {beforeRender}
                    actionPopup = {false}
                    className={`${contentClassNameByState(state === 'before')} mt-1`}
                />
                <OngoingActionDialog text = 'Starting recording session...' className={contentClassNameByState(state === 'ongoing')}/>
                <FailedActionDialog text={failedNote} className={contentClassNameByState(state === 'after' &&  response === 'failed')}/> 
                <DialogContentBody
                    subNode = {successRender}
                    className={contentClassNameByState(state === 'after' && response === 'successful')}
                />
            </>
        )
    } else return null
}

export const RedirectBody = ({
    action,
}: ActionBodyProps) => {
    if(action) {
        const state = action?.state
        const response = action?.response

        return state && (
            <>
                <OngoingActionDialog text='Accessing recording blob...' className={contentClassNameByState(state === 'before')}/>
                <OngoingActionDialog text='Redirecting to Upload page...' className={contentClassNameByState(state === 'ongoing')}/>
                <FailedActionDialog text='You can try again or save video and self upload' className={contentClassNameByState(state === 'after' &&  response === 'failed')}/>
            </>
        )
    } else return null
}

export const LoadBody = ({
    action,
    successRender
}: ActionBodyProps & {successRender: React.ReactElement}) => {
    if(action) {
        const state = action?.state
        const response = action?.response

        return state && (
            <>
                <WarningActionDialog header="About to stop recording" text='Click End button' className={contentClassNameByState(state === 'before')} />
                <OngoingActionDialog text='Loading recorded video...' className={contentClassNameByState(state === 'ongoing')}/>
                <FailedActionDialog text='Sorry, recorded blob seem lost or not loading' className={contentClassNameByState(state === 'after' &&  response === 'failed')}/>
                <DialogContentBody subNode={successRender} className={contentClassNameByState(state === 'after' && response === 'successful')}/>
            </>
        )
    } else return null
}

export const SaveBody = ({
    action,
    failedNote
}: ActionBodyProps) => {
    if(action) {
        const state = action?.state
        const response = action?.response

        return state && (
            <>
                <OngoingActionDialog text='"Downloading recorded video...' className={contentClassNameByState(state === 'ongoing')}/>
                <FailedActionDialog text={failedNote} className={contentClassNameByState(state === 'after' &&  response === 'failed')}/>
                <SuccessActionDialog text={'Video downloaded'} className={contentClassNameByState(state === 'after' && response === 'successful')}/>
            </>
        )
    } else return null
}


export const exitContent = (resetModal: () => void, cancelExit: () => void, exit: boolean) => {
    return exit ? {
        body: <WarningActionDialog header="About to exit modal" text=''/>,
        buttons: [
            getModalButton('Cancel', cancelExit, 'btn-white'),
            getModalButton('Exit', resetModal)
        ]
    } : null
}

export const successfulRedirectContent = (resetModal: () => void, successfulRedirect: boolean) => {
    return successfulRedirect ? {
        body: <SuccessActionDialog header='Redirected Successfully' text=''/>,
        buttons: [
          getModalButton('Ok', resetModal)
        ]
    } : null
}