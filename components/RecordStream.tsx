'use client'

import { ICONS } from '@/constants'
import { useRouter } from 'next/navigation'
import React, { 
    memo,
    useCallback, 
    useEffect, 
    useMemo, 
    useState 
} from 'react'
import { authClient } from '@/lib/authClient'
import {ActionButton, DialogContentBody, DialogListItem, DropdownList, FailedActionDialog, OngoingActionDialog} from './'
import {dummySession} from "@/constants"
import {
    CheckCircleIcon,
    CirclePauseIcon,
    Download,
    HomeIcon,
    LoaderCircle,
    Upload,
    X,
} from 'lucide-react'
import { 
    cn,
    parseBrowserDialogOptions,
    parseOutputDisplaySetting,
    parseVideoSettings, 
} from '@/lib/utils'
import {
    Action,
    DropdownOptionsType, 
    ModalContentType, 
    RecordSettingsType,
    RecordingDialogContentBodyProps,
    VideoSettingsType,
} from '..'
import toast from 'react-hot-toast';
import { DIALOG_ICONS} from '@/constants/lists'
import useRecordingFeatures from '@/lib/hooks/useRecordingFeatures'
import { 
    ModalContentTypeAdapted, 
    getActionStateContent, 
    getContentByAction, 
    getModalButton, 
} from '@/lib/modalContentUtil'
import { NoNameModalActionType } from '@/lib/hooks/useGlobalContext'

const RecordStream = () => {

  const {
    modalOpen,
    videoRef,
    goingToUploadAction,
    recordedVideoUrl,
    selectedVideoSetting,
    settingsGuide,
    recordSettings,
    videoSettings,
    modalAction,
    saveAfterLoadAction,
    setVideoPlaying,
    handleOpenModal,
    handleCloseModal,
    handleBackToSettings,
    handleStartRecording,
    handleStopRecording,
    handleGoBack,
    handleTakeScreenShot,
    handleRecordAgain,
    handleGoToUpload,
    handleCheckDevices,
    handleSaveAfterLoad,
    handleSaveOnFailedRedirect,
    handlePauseResume,
    recordingStatus,
    syncModalContent,
  } = useRecordingFeatures()

  const router = useRouter();

  const session = dummySession;

  const handleGoToRecording = useCallback(() => {
    if(!session?.user) {
        router.push('/sign-in')
        toast('You need to sign in to access recording features');
        return;
    }

    handleOpenModal({closeIcon: <HomeIcon size={22}/>}) 
  },[
    session,
  ])

  const note = (
    preNoteCondition: boolean,
    falseConditionRender: string | React.ReactElement,
    featureList?: React.ReactElement | null,
     featureHeaderText?: string,
     className?: string,
   ) => {
     return (
        <div className='w-full flex flex-col gap-2 mb-3 bg-transparent'>
            <p className='text-[15.5px] text-gray-600'>
                 {
                 preNoteCondition
                 ? falseConditionRender
                 : `You are using camera only.`
                 }
             </p>
            <div className="w-full flex flex-col gap-2 bg-transparent">
                {featureHeaderText && <span>{featureHeaderText}</span>}
                <ul className="w-full flex gap-2 items-center flex-wrap">
                    {featureList && featureList}   
                     <DialogListItem
                         text={videoSettings.cursor === 'always' ? 'Cursor display' : videoSettings.cursor === 'motion' ? 'Cursor display on motion' : 'Cursor hidden'}
                    />
                </ul>
            </div>
        </div>
     )
   }

  const guideNote = () => note(
    videoSettings.displaySurface !== 'camera only',
    <>
        <span className='block'>
            <span>When the browser dialog picker appears, your screen setting option</span> {" "}
            <span className='font-medium'>{`(${parseBrowserDialogOptions(videoSettings.displaySurface)})`}</span> {" "}
            <span>would be preset on the tab.</span>
        </span>
        <span className='block'>
            Click in the box underneath to choose which exact screen to record. You can also enable system audio.
        </span>
    </>,
    null,
    'Active features'
)

  const ongoingRecordingNote = () => (
    note(
        !!selectedVideoSetting.displaySurface,
        `You are recording on ${parseOutputDisplaySetting(selectedVideoSetting?.displaySurface)} mode with:`,
        <DialogListItem text = "System audio"/>
    )
  ) 

  const onGoingRecordingContent = () => (
    <article className='recording-features'>
    <div className='flex flex-col items-center'>
        <button onClick={handlePauseResume} className='w-fit h-fit border-none outline-none rounded-full hover:bg-pink-100'>
            <CirclePauseIcon size={30} className={recordingStatus !== 'pause' ? 'animate-pulse' : 'animate-none'} fill='#fb2c36' stroke='white'/>
        </button>
        <p className='text-center text-dark-100 text-base font-medium'>
            Recording in progress
        </p>
    </div>
        {ongoingRecordingNote()}
    </article>
  )

  const goBackButton = useCallback((text?: string) => getModalButton(text || 'Go back', handleGoBack, 'btn-white'),[handleGoBack, getModalButton])

  const recordAgain = useMemo(() => getModalButton('Record again', handleRecordAgain, 'btn-white'),[handleRecordAgain, getModalButton])

  const uploadButton = useCallback((text?: string) => getModalButton(text || 'Upload', handleGoToUpload, 'btn-theme', <Upload size={16}/>),[getModalButton, handleGoToUpload])

  const recordButtons = useMemo(() => [
    goBackButton(), 
    getModalButton('Record', handleStartRecording)
  ],[goBackButton, getModalButton, handleStartRecording])

  const settingsContent = useCallback((settings: RecordSettingsType[]): ModalContentTypeAdapted => {
    return {
        node: (
            <DialogContentBody subNode = {<RecordingSettings recordSettings={settings}/>}
            />
        ),
        buttons: [
            getModalButton("Continue", handleCheckDevices)
        ]
    }
  }, [getModalButton, handleCheckDevices, recordSettings])

  const loadAfterSuccessContent = useMemo((): ModalContentTypeAdapted | null => {
    return modalAction.name === 'load' && modalAction.load?.state === 'success' && saveAfterLoadAction.response !== 'failed' ?
        {
            node: (
                <div className='video-wrapper'>
                    <video 
                        src={recordedVideoUrl} 
                        ref={videoRef} 
                        controls 
                        onPlay={() => setVideoPlaying(true)}onEnded={() => setVideoPlaying(false)}
                        onPause={() => setVideoPlaying(false)}
                    />
                    <button className='float-btn' onClick={()=> handleSaveAfterLoad}>
                        {getActionStateContent(
                            saveAfterLoadAction.state,
                            saveAfterLoadAction.response,
                            {node: <X size={18} stroke="red"/>},
                            {node: <LoaderCircle size={16} className="animate-spin"/>},
                            {node: <CheckCircleIcon size={24} fill='#ff4393' stroke="#ffffff"/>},
                            {node: <Download size={16}/>},
                        ).body}
                    </button>
                </div>
            ),
            buttons: [getModalButton('Go Back', handleBackToSettings, 'btn-white'), recordAgain, uploadButton()]
        } : null
  },[uploadButton, recordAgain, goBackButton, getModalButton, handleBackToSettings, handleSaveAfterLoad, getActionStateContent, saveAfterLoadAction, recordedVideoUrl, modalAction]);
  
  const recordGuideContent = useCallback((
    action: NoNameModalActionType): ModalContentType => {
    return getActionStateContent(
      action.state,
      action.response,
        {
            node: "Recording session has been canceled",
            buttons: recordButtons
        },
        {
            node: 'Loading browser dialog...'
        },
        {
            node: 'Dialog opened'
        }, 
        {
            node: (
                <DialogContentBody
                    icon={DIALOG_ICONS.info}
                    headerNode = 'Guide'
                    subNode = {guideNote()}
                    actionPopup = {false}
                />
            ),
            buttons: recordButtons
        }
    ) 
  }, [getActionStateContent, guideNote, recordButtons, DIALOG_ICONS, guideNote])

  const checkContent = useCallback((
    action: NoNameModalActionType, 
    settings: RecordSettingsType[],
    checkResponse: string,
  ): ModalContentType | null => {
    return getActionStateContent(
        action.state,
        action.response,
        {
            node: <FailedActionDialog header ='Check failed' text={checkResponse}/>,
            buttons: [
                goBackButton('Adjust setting'), 
                getModalButton('Retry Check', handleCheckDevices)
            ]
        },
        {
            node: 'Checking user devices...'
        },
        {
            node: 'Check passed'
        },
        settingsContent(settings)
    )
  }, [getActionStateContent, goBackButton, getModalButton, handleCheckDevices, settingsContent])

  const redirectContent = useCallback((action: NoNameModalActionType): ModalContentType | null => {
    return getActionStateContent(
        action.state,
        action.response,
        {
            node: "You can try again or save video and self upload",
            buttons: [
                getModalButton('Save Recording', handleSaveOnFailedRedirect),
                uploadButton('Retry')
            ]
        },
        {
            node: "Redirecting to Upload page..."
        },
        null,
        {
            node: 'Accessing recording blob...'
        }
    )
  }, [getActionStateContent, handleSaveOnFailedRedirect, uploadButton, getModalButton])

  const loadContent = useCallback((action: NoNameModalActionType): ModalContentType | null => {
    return getActionStateContent(
        action.state,
        action.response,
        {
            node: "Sorry, recorded blob seem lost or not loading",
            buttons: [
                recordAgain,
                getModalButton('Recover', handleStopRecording)
            ]
        },
        {
            node: "Loading recorded video..."
        },
        loadAfterSuccessContent,
        {
            node: onGoingRecordingContent(),
            buttons: [
                getModalButton('Stop recording', handleStopRecording, 'btn-destructive'),
                getModalButton('Screenshot stream', handleTakeScreenShot) 
            ]
        },
    )
  }, [getModalButton, handleTakeScreenShot, getActionStateContent, getModalButton, getContentByAction, handleStopRecording, loadAfterSuccessContent, recordedVideoUrl, saveAfterLoadAction])
  
  const saveContent = useCallback((action: NoNameModalActionType): ModalContentType | null => {
    return getActionStateContent(
        action.state,
        action.response,
        {
            node: "Failed to save video",
            buttons: [
                getModalButton('Retry save', () => handleSaveOnFailedRedirect)
            ]
        },
        {
            node: "Downloading recorded video..."
        },
        {
            node: 'Video downloaded',
            buttons: [getModalButton('Exit', handleCloseModal)]
        },
    )
  }, [getActionStateContent, handleCloseModal, getModalButton, handleSaveOnFailedRedirect,])
  
  useEffect(() => {
    let content: ModalContentType | null = null;
    if(modalAction.name === 'check') {
        content = checkContent(
            modalAction?.check,
            recordSettings,
            settingsGuide,
        )
    } 
    if(modalAction.name === 'record') {
        content = recordGuideContent(modalAction?.record)
    } 
    if(modalAction.name === 'load') {
        content = loadContent(modalAction?.load)
    } 
    if(modalAction.name === 'redirect') {
        content = redirectContent(modalAction?.redirect)
    } 
    if(modalAction.name === 'save_record') {
        content = saveContent(modalAction?.save_record)
    }
    console.log(modalAction);

    if(modalAction.name) syncModalContent('record', content!)
  },[modalAction, videoSettings, recordSettings, settingsGuide])

  useEffect(() => {
    if(modalAction.name === 'redirect') {
        modalAction.redirect?.state === 'ongoing' && goingToUploadAction(()=> router.push('/upload'))
    }
  },[modalAction.name])

  return (
    <div className="record">
        <ActionButton
            className='primary-btn'
            action={handleGoToRecording}
            src={ICONS.record}
            alt="record"
            size={16}
        >
            <span className='text-white font-semibold'>
                Record a video
            </span>
        </ActionButton>
    </div>
  )
}


  //dialogContent settings - ul child Element
const RecordingSettings = memo(({
    recordSettings
}: Pick<RecordingDialogContentBodyProps, 'recordSettings'>) => (
    <ul className='recording-settings'>
        <div className='settings-col-grid'>
            {recordSettings.map((setting, index)=> (
                <RecordSetting
                    key={index}
                    idIcon={setting.idIcon}
                    title = {setting?.title}
                    options= {setting.options}
                    updateSetting= {setting.updateSetting}
                    settingValue={setting.settingValue}
                    className={setting.className}
                    disabled= {setting?.disabled}
                />
            ))}
        </div>
    </ul>
))

const RecordSetting = memo(({
    title, 
    options, 
    updateSetting, 
    settingValue,
    className="col-span-3", 
    idIcon,
    disabled
}: RecordSettingsType) => {

    const activeOption: DropdownOptionsType = useMemo(()=> options.find(option => parseVideoSettings(settingValue[0], option.label) === settingValue[1]), [options, settingValue, parseVideoSettings])!; 

    const [selectedOption, setSelectedOption] = useState(activeOption);

    const updateSetting_ = useCallback((option: DropdownOptionsType) => {
        updateSetting(option.label)
    },[updateSetting])

    useEffect(()=> {
        setSelectedOption(activeOption);
    },[activeOption])

    const dropdown = () => (
        <DropdownList
            activeOption={selectedOption}
            options={options}
            onSelectAction={updateSetting_}
            disabled = {disabled && disabled}
        />
    ) 

    return (
        <li className={`setting ${className}`}>
            {title && <p>{title}</p>}
                {idIcon ? (
                    <DropdownWithIdIcon idIcon={idIcon}>
                        {dropdown()}
                    </DropdownWithIdIcon>
                ): (dropdown())}
        </li>
    )
});

const DropdownWithIdIcon = memo(({idIcon, children}: {idIcon: React.ReactNode, children: React.ReactNode})=> (
    <div className='setting-identifier'>
        <i>{idIcon}</i>
        <span>{children}</span>
    </div>
))

export default RecordStream