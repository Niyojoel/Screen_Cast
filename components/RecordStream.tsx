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
import ActionButton from './ActionButton'
import { authClient } from '@/lib/authClient'
import {DialogContentBody, DialogListItem, DropdownList, FailedActionDialog, ImagesConsole, Modal, OngoingActionDialog, SuccessActionDialog} from './'
import {dummySession} from "@/constants"
import {
    CirclePauseIcon,
    Dot,
    HomeIcon, 
} from 'lucide-react'
import { 
    cn,
    parseBrowserDialogOptions,
    parseOutputDisplaySetting,
    parseVideoSettings, 
} from '@/lib/utils'
import {
    DropdownOptionsType, 
    RecordSettingsType,
    RecordingDialogContentBodyProps,
} from '..'
import toast from 'react-hot-toast';
import { DialogContentListFeature } from './DialogContentBody'
import { DIALOG_ICONS, ModalContentType, modalButton, modalContent } from '@/constants/lists'
import useRecordingFeatures from '@/lib/hooks/useRecordingFeatures'

const RecordStream = () => {

  const {
    recordingState,
    videoRef,
    actionStatus,
    goingToUploadAction,
    recordedVideoUrl,
    selectedVideoSetting,
    settingsGuide,
    recordSettings,
    videoSettings,
    actionResponse,
    handleOpenModal,
    handleCloseModal,
    showModalError,
    handleBackToSettings,
    devicesCheck,
    handleStartRecording,
    handleStopRecording,
    handleGoBack,
    handleTakeScreenShot,
    handleRecordAgain,
    handleGoToUpload,
    handleSaveRecordedVideo,
    
  } = useRecordingFeatures()

  const router = useRouter();

  const session = dummySession;

  const handleGoToRecording = useCallback(() => {
    if(!session?.user) {
        router.push('/sign-in')
        toast('You need to sign in to access recording features');
        return;
    }

    handleOpenModal(
        <RecordingDialogContentBody
            recordingState={recordingState}
            recordedVideoUrl ={recordedVideoUrl}
            goToUpload ={goToUpload}
            videoRef ={videoRef}
            settingsGuide ={settingsGuide}
            showInstructions ={showInstructions}
            videoSettings ={videoSettings}
            selectedVideoSetting ={selectedVideoSetting}
            recordSettings = {recordSettings}
            actionResponse = {actionResponse}
        />, 
        recordingButtons,
        <HomeIcon size={22}/>
    ) 
  },[
    recordingState,
    recordedVideoUrl,
    goToUpload,
    settingsGuide,
    showInstructions,

    videoSettings,
    selectedVideoSetting,
    recordSettings,
    actionResponse,
  ])

  const guideNote = () => (
    note(
        videoSettings.displaySurface !== 'camera only',
        `When the browser dialog picker appears, your screen setting option ${parseBrowserDialogOptions(videoSettings.displaySurface)} would be preset on the tab. </n>
        Click in the box underneath to choose which exact screen to record. You can also enable system audio.`,
    )
  )

  const ongoingRecordingNote = () => (
    note(
        !!selectedVideoSetting.displaySurface,
        `You are recording on ${parseOutputDisplaySetting(selectedVideoSetting?.displaySurface)} mode with:`,
        <DialogListItem text = "System audio"/>
    )
  ) 

  const note = (
    preNoteCondition: boolean,
    falseConditionRender: string,
    featureList?: React.ReactElement,
    featureHeaderText?: string,
    className?: string,
  ) => {
    return (
        <div className='features'>
            <p className='pre-note'>
                {
                preNoteCondition 
                ? falseConditionRender 
                : `You are using camera only.`
                }
            </p>
            <div className="feature-box">
                <p className='w-full flex items-center gap-2'>
                    {<Dot fill='#ff4393'/>}
                    <span>{ featureHeaderText || 'Active feature'}</span>
                </p>
                <ul className="feature">
                    {featureList}   
                    <DialogListItem
                        text={videoSettings.cursor === 'always' ? 'Cursor display' : videoSettings.cursor === 'motion' ? 'Cursor display on motion' : 'Cursor hidden'}
                    />
                    <DialogListItem
                        text={videoSettings.camera === 'with' ? 'Camera' : null}
                    />
                    <DialogListItem
                        text={videoSettings.withMic ? 'Microphone' : null}
                    />
                </ul>
            </div>
        </div>  
    )
  } 

  const onGoingRecordingContent = () => (
    <article className='recording-features'>
        <CirclePauseIcon size={50} className='animate-pulse' fill='#fb2c36' stroke='white'/>
        <p>
            Recording in progress
        </p>
        {ongoingRecordingNote()}
    </article>
  )

  //
  const recordGuideContent = useMemo((): ModalContentType | null => {
    return modalContent (
        actionStatus.record,
        actionResponse.record,
        {
            body: <FailedActionDialog customMessage= "Recording session has been canceled"/>,
            buttons: [
                modalButton('Go back', handleGoBack, 'btn-white'), 
                modalButton('Try again', handleStartRecording)
            ]   
        },
        {
            body: <OngoingActionDialog message = 'Loading browser dialog...'/>
        },
        {
            body: <SuccessActionDialog message = 'Dialog opened option selection'/>
        }, 
        {
            body: (
                <DialogContentBody
                    icon={DIALOG_ICONS.info}
                    headerNode = 'Guide'
                    subNode = {guideNote()}
                    className={cn('content-body', actionStatus.record ? "show" : "no-show")}
                    actionPopup = {false}
                />
            ),
            buttons: [
                modalButton("Go back", handleGoBack, 'btn-white'),
                modalButton("Start recording", handleStartRecording),
            ]
        }
    )
  }, [actionStatus.record, actionResponse.record, handleGoBack, handleStartRecording])

  const settingsContent = useMemo((): ModalContentType => {
    return {
        body: (
            <DialogContentBody
                subNode = {<RecordingSettings recordSettings={recordSettings}/>}
                className={cn('settings-box', actionStatus.record ? "no-show" : "show")}
            />
        ),
        buttons: [
            modalButton("Continue", () => devicesCheck )
        ]
    }
  }, [actionStatus.record, actionResponse.check, settingsGuide, handleBackToSettings, devicesCheck, videoSettings])

  const checkContent = useMemo((): ModalContentType | null => {
    return modalContent (
        actionStatus.check,
        actionResponse.check,
        {
            body: <FailedActionDialog header ='Check failed' customMessage={settingsGuide}/>,
            buttons: [
                modalButton('Change Settings', handleGoBack), 
                modalButton('Retry Check', () => devicesCheck())
            ]
        },
        {
            body: <OngoingActionDialog message = {videoSettings.camera !== 'no' && videoSettings.withMic ? "Checking user devices..." : "Checking user device..."}/>
        },
        {
            body: <SuccessActionDialog message = 'Check passed'/>
        },
        settingsContent
    )
  }, [actionStatus.check, actionResponse.check, settingsGuide, handleBackToSettings, devicesCheck, videoSettings])

  const redirectContent = useMemo((): ModalContentType | null => {
    return modalContent (
        actionStatus.redirect,
        actionResponse.redirect,
        {
            body: <FailedActionDialog customMessage = "You can save video"/>,
            buttons: [
                modalButton('Change Settings', handleGoBack), 
                modalButton('Retry Redirect', () => devicesCheck())
            ]
        },
        {
            body: <OngoingActionDialog message = {videoSettings.camera !== 'no' && videoSettings.withMic ? "Checking user devices..." : "Checking user device..."}/>
        },
        {
            body: <SuccessActionDialog message = 'Check passed'/>
        },
        {
            body: <>
                <video src={recordedVideoUrl} ref={videoRef} controls/>
                <ImagesConsole
                    imagesArr={screenshots}
                />
            </>,

        }
    )
  }, [actionStatus.check, actionResponse.check, settingsGuide, handleBackToSettings, devicesCheck, videoSettings])


   const recordingContent = useMemo((): ModalContentType | null => {
    return modalContent(
      recordingState,
      actionResponse.delete,
      {
        body: <FailedActionDialog customMessage = "Sorry, recorded blob seem lost or not loading"/>,
        buttons: [
            modalButton('Start over', handleStartRecording, 'btn-white'),
            modalButton('Recover blob', handleStopRecording)
        ]
      },
      {
        body: onGoingRecordingContent(),
        buttons: [
            modalButton('Stop recording', handleStopRecording, 'btn-destructive'),
            modalButton('Screenshot stream', handleTakeScreenShot) 
        ]
      },
      !recordedVideoUrl ? {
        body: (
        <DialogContentBody
            icon = {DIALOG_ICONS.loader}
            subNode = "Loading recorded video.."
        />),
      } : !actionStatus.redirect 
        ? <video src={recordedVideoUrl} ref={videoRef} controls/>
        : 
        body: <SuccessActionDialog message = 'Video successfully deleted'/>
      },
      actionStatus.check && checkContent 
      ? {
        body: checkContent.body,
        buttons: checkContent.buttons
      } 
      : actionStatus.record && recordGuideContent
        ? {
            body: recordGuideContent.body,
            buttons: recordGuideContent.buttons
        } 
        : {
            body: null,
            buttons: null
        }
    )
  }, [actionStatus.check, actionStatus.record, actionResponse.delete, modalButton, handleDelete, closeModal, recordGuideContent, checkContent])
  
  useEffect(() => {
    console.log("from recording stream component: ", recordingState)
    recordingButtons
  },[recordingState])

  useEffect(() => {
    if(actionStatus.redirect === "ongoing") goingToUploadAction(()=> router.push('/upload'))
  },[actionStatus.redirect])

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

// const 

const RecordingDialogContentBody = memo(({
    recordingState,
    recordedVideoUrl,
    goToUpload,
    videoRef,
    settingsGuide,
    showInstructions,
    videoSettings,
    selectedVideoSetting,
    recordSettings,
    actionResponse
}: RecordingDialogContentBodyProps) => (
    <div className="recording-body">
        {recordingState === "ongoing"
        ? (
            <article className='recording-features'>
                <CirclePauseIcon size={50} className='animate-pulse' fill='#fb2c36' stroke='white'/>
                <p>
                    Recording in progress
                </p>
                <RecordingOnSubNode selectedVideoSetting={selectedVideoSetting}/>
            </article>
        ): recordingState === "after" 
        ? (
            recordedVideoUrl ?
            (!goToUpload 
                ? <video src={recordedVideoUrl} ref={videoRef} controls/> 
                : goToUpload === 'failed' 
                    ? !actionResponse 
                      ? <FailedActionDialog customMessage = "You can save video"/>
                      : actionResponse === "failed" 
                        ? <FailedActionDialog customMessage='Video failed to save'/>
                        : <DialogContentBody
                            icon = {DIALOG_ICONS.checked} 
                            subNode = "Video has been saved"
                        />
                    : <DialogContentBody
                        icon = {DIALOG_ICONS.loader}
                        subNode = "Redirecting to Upload page.."
                      />
            )
            : <DialogContentBody
                icon = {DIALOG_ICONS.loader}
                subNode = "Loading recorded video.."
            />
            
        ) : recordingState === "before" 
        ? (!showInstructions ? 
            <DialogContentBody
                headerNode = {
                    settingsGuide ? <div className="guide">
                        <i className='animate-pulse'>           
                            {settingsGuide.split(' ').includes("supported") 
                            ? DIALOG_ICONS.failed 
                            : settingsGuide.split(' ').includes("permission") 
                                ? DIALOG_ICONS.alert 
                                : null} 
                        </i>
                        <p className={settingsGuide ? 'opacity-100 h-7' : 'opacity-0 h-0'}>
                            {settingsGuide}
                        </p>
                    </div>
                    : ""
                }
                subNode = {<RecordingSettings recordSettings={recordSettings}/>}
                className={cn('settings-box', showInstructions ? "no-show" : "show")}
            /> :
            <DialogContentBody
                icon={DIALOG_ICONS.info}
                headerNode = 'Guide'
                subNode = {videoSettings.camera !== 'only' 
                ? `When the browser dialog picker appears, display surface option on the tab would be preset to ${parseBrowserDialogOptions(videoSettings.displaySurface)}. Click in the box underneath to choose which screen to record. You can also enable system audio.` 
                : `You are using only camera ${videoSettings.withMic ? 'with microphone' : 'without microphone'}`}
                className={cn('content-body', showInstructions ? "show" : "no-show")}
                actionPopup = {false}
            />
        ) : null}
    </div>
))

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