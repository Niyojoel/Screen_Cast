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
import {ActionButton, DialogListItem, DropdownList, ImagesConsole} from './'
import {dummySession} from "@/constants"
import {
    CheckCircleIcon,
    CircleIcon,
    CirclePauseIcon,
    CirclePlayIcon,
    Download,
    HomeIcon,
    Image,
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
    DropdownOptionsType, 
    ImagesArrayType, 
    ModalContentType, 
    RecordSettingsType,
    RecordingDialogContentBodyProps,
    StreamSettingsType,
    VideoSettingsType,
} from '..'
import toast from 'react-hot-toast';
import { CheckBody, LoadBody, RecordGuideBody, RedirectBody, SaveBody, exitContent} from '@/constants/lists'
import useRecordingFeatures, { RecordingTimerType } from '@/lib/hooks/useRecordingFeatures'
import { 
    getActionStateButtons, 
    getActionStateContent,
    getModalButton, 
} from '@/lib/modalContentUtil'
import { NoNameModalActionType, useGlobalContext } from '@/lib/hooks/useGlobalContext'

const RecordStream = () => {

  const {
    videoRef,
    recordedVideoUrl,
    screenShots,
    streamSettings,
    failedCheck,
    recordSettings,
    videoSettings,
    recordingTimer,
    onScreenShotRemove,
    onScreenShotSave,
    onScreenShotSelect,
    onScreenShotClick,
    changeVideoPlaying,
    handleOpenModal,
    handleExitModal,
    handleStartRecording,
    handleStopRecording,
    handleStopWarning,
    handleContinueRecording,
    handleGoBack,
    handleTakeScreenShot,
    handleRecordAgain,
    handleGoToUpload,
    handleCheckDevices,
    handleSaveRecording,
    handlePauseResume,
    recordingStatus,
  } = useRecordingFeatures()

  const {
    modalOpen,
    modalAction,
    exit,
    resetModal,
    cancelExit,
    syncModalContent,
  } = useGlobalContext()

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

  const note = useCallback((
    settings: VideoSettingsType | StreamSettingsType,
    falseConditionRender: string | React.ReactElement,
    additionalFeature?: React.ReactElement | null,
    featureHeaderText?: string,
    className?: string,
  ) => {
     return (
        <div className='w-full flex flex-col gap-2.5 mb-3.5 bg-transparent'>
            <p className='text-[15.5px] text-gray-600'>
                 {
                 settings.displaySurface !== 'camera only'
                 ? falseConditionRender
                 : `You are using camera only.`
                 }
             </p>
            <div className="w-full flex flex-col gap-2 bg-transparent">
                {featureHeaderText && <span className=''>{featureHeaderText}{' :'}</span>}
                <ul className="w-full flex gap-2 items-center flex-wrap">
                    {additionalFeature && additionalFeature}
                    {settings.camera === 'with' && <DialogListItem text='Camera'/>}
                    {settings.withMic && <DialogListItem text='Microphone'/>} 
                    <DialogListItem
                        text={settings.cursor === 'always' ? 'Cursor display' : settings.cursor === 'motion' ? 'Cursor display on motion' : 'Cursor hidden'}
                    />
                </ul>
            </div>
        </div>
     )
  }, [])

  const guideNote = useCallback((
    videoSettings: VideoSettingsType
  ) => note(
    videoSettings,
    <>
        <span className='block'>
            <span>When the browser dialog picker appears, your screen setting option</span> {" "}
            <span className='font-medium'>{`(${parseBrowserDialogOptions(videoSettings.displaySurface)})`}</span> {" "}
            <span>would be preset on the tab.</span>
            {" "} Click in the box underneath to choose which screen to record. You can also enable system audio.
        </span>
        <span className='block'>
        </span>
    </>,
    null,
    'Active features'
),[])

  const ongoingRecordingNote = useCallback((
    streamSettings: StreamSettingsType
  ) => (
    note(
        streamSettings,
        `You are recording on ${parseOutputDisplaySetting(streamSettings.displaySurface)} mode with:`,
        streamSettings.systemAudio ? <DialogListItem text = "System audio"/> : null
    )
  ),[]) 

  const onGoingRecordingContent = useCallback((
    recordingStatus: RecordingState, 
    recordingTimer: RecordingTimerType,
    streamSettings: StreamSettingsType,
    screenShots: ImagesArrayType[]
  ) => (
    <article className='w-full flex flex-col my-2'>
        <div className='flex flex-col items-center gap-4'>
            <div className='flex items-center w-fit gap-5 rounded-full shadow-md px-5 py-2.5'>
                <CircleIcon 
                    size={30} 
                    stroke='white' 
                    fill={recordingStatus === "recording" ? '"#fb2c36"' : 'grey'} 
                    className= {recordingStatus === "recording" ? 'animate-pulse' : 'animate-none'}
                />
                <button onClick={handlePauseResume} className='w-fit h-fit border-none outline-none rounded-full hover:shadow-md'>
                    {recordingStatus === "recording" 
                    ? <CirclePauseIcon size={30} stroke='#ff4393' strokeWidth={1.2}/>
                    : <CirclePlayIcon size={30} stroke='#ff4393' strokeWidth={1.2}/>
                    }   
                </button>
                <button 
                onClick={handleTakeScreenShot} className='w-fit h-fit border-none outline-none rounded-full hover:shadow-md'>
                    <Image 
                        size={20} 
                        stroke='#ff4393'
                        strokeWidth={1.2}
                    />
                </button>
                <span>
                    {recordingTimer.hour && recordingTimer.hour !== '00'
                    ? `${recordingTimer.hour}:${recordingTimer.minutes}:${recordingTimer.seconds}` 
                    : `${recordingTimer.minutes}:${recordingTimer.seconds}`}
                </span>
            </div>
            <p className='text-center text-pink-100 text-[16.5px] font-medium'>
                {recordingStatus === "recording" ?
                'Recording in progress...' : 'Recording paused'}
            </p>
        </div>
        {screenShots && screenShots.length > 0 && <ImagesConsole
            imagesArr={screenShots}
            onClick ={onScreenShotClick}
            onRemove={onScreenShotRemove}
            onSave={onScreenShotSave}
            className = 'h-20 w-full'
            cardClass = 'w-[80px]'
        />}
        {/* {ongoingRecordingNote(streamSettings)} */}
    </article>
  ),[/*ongoingRecordingNote,*/ handlePauseResume, onScreenShotClick, onScreenShotRemove, onScreenShotSave])

  const goBackButton = useCallback((text?: string) => getModalButton(text || 'Go back', handleGoBack, 'btn-white'),[handleGoBack, getModalButton])

  const recordAgain = useMemo(() => getModalButton('Record again', handleRecordAgain, 'btn-white'),[handleRecordAgain, getModalButton])

  const uploadButton = useCallback((text?: string) => getModalButton(text || 'Upload', handleGoToUpload, 'btn-theme', <Upload size={16}/>),[getModalButton, handleGoToUpload])

  const recordButtons = useMemo(() => [
    goBackButton(), 
    getModalButton('Record', handleStartRecording)
  ],[goBackButton, getModalButton, handleStartRecording])
  
  const loadSuccessBody = useCallback((
    recordedVideoUrl: string,
    screenShots: ImagesArrayType[],
  ) => (
    <div className='video-wrapper'>
        <video 
            src={recordedVideoUrl} 
            ref={videoRef} 
            controls 
            onPlay={() => changeVideoPlaying(true)}
            onEnded={() => changeVideoPlaying(false)}
            onPause={() => changeVideoPlaying(false)}
        />
        {screenShots && screenShots.length > 0 && (
            <ImagesConsole
                imagesArr={screenShots}
                onClick ={onScreenShotClick}
                onRemove={onScreenShotRemove}
                onSave={onScreenShotSave}
                onSelect={onScreenShotSelect}
            />
        )}
    </div>
  ),[changeVideoPlaying, getActionStateContent, onScreenShotClick, onScreenShotRemove, onScreenShotSave, onScreenShotSelect]);

  const recordGuideContent = useCallback((
    action: NoNameModalActionType,
    videoSettings: VideoSettingsType,
    failedCheck: string,
    streamSettings: StreamSettingsType,
    recordingStatus: RecordingState, 
    recordingTimer: RecordingTimerType,
    screenShots: ImagesArrayType[]
  ): ModalContentType => {
    return {
        body: <RecordGuideBody
            action={action}
            beforeRender={guideNote(videoSettings)}
            successRender={onGoingRecordingContent(
                recordingStatus,
                recordingTimer,
                streamSettings,
                screenShots
            )}
            failedNote = {failedCheck}
        />,
        buttons: getActionStateButtons(
            action,
            recordButtons,
            recordButtons,
            [
                getModalButton('Stop recording', handleStopWarning)
            ],
        )
    }
  }, [getActionStateButtons, guideNote, recordButtons, handleStopWarning])

  const checkContent = useCallback((
    action: NoNameModalActionType, 
    settings: RecordSettingsType[],
    checkResponse: string,
  ): ModalContentType | null => {
    return {
        body: (
        <CheckBody 
            action={action} 
            beforeRender={<RecordingSettings recordSettings={settings}/>} 
            checkResponse={checkResponse}
        />
        ),
        buttons: getActionStateButtons(
            action,
            [
                goBackButton('Adjust setting'), 
                getModalButton('Retry Check', handleCheckDevices)
            ],
            [
                getModalButton("Continue", handleCheckDevices)
            ]
        )
    }
  }, [getActionStateButtons, goBackButton, getModalButton, handleCheckDevices])

  const redirectContent = useCallback((action: NoNameModalActionType): ModalContentType | null => {
    return {
        body: <RedirectBody action={action}/>,
        buttons: getActionStateButtons(
            action,
            [
                getModalButton('Save Recording', handleSaveRecording),
                uploadButton('Retry')
            ]
        )
    }
  }, [getActionStateButtons, handleSaveRecording, uploadButton, getModalButton])

  const loadContent = useCallback((
    action: NoNameModalActionType,
    recordedVideoUrl: string,
    screenShots: ImagesArrayType[]
): ModalContentType | null => {
    return {
        body: <LoadBody 
            action={action}
            successRender={loadSuccessBody(
                recordedVideoUrl,
                screenShots
            )}
        />,
        buttons: getActionStateButtons(
            action,
            [
                recordAgain,
                getModalButton('Recover', handleStopRecording)
            ],
            [
                getModalButton('Continue', handleContinueRecording),
                getModalButton('End', handleStopRecording, 'btn-destructive'),
            ],
            [
                recordAgain, 
                uploadButton()
            ],
        )
    }
  }, [getModalButton, handleTakeScreenShot, getActionStateButtons, getModalButton, handleStopRecording, handleContinueRecording, uploadButton, recordAgain])
  
  const saveContent = useCallback((
    action: NoNameModalActionType,
    failedCheck: string
  ): ModalContentType | null => {
    return {
        body: <SaveBody action={action} failedNote={failedCheck}/>,
        buttons: getActionStateButtons(
            action,
            [
                getModalButton('Retry save', () => handleSaveRecording)
            ],
            null,
            [getModalButton('Exit', handleExitModal)]
        )
    }
  }, [getActionStateButtons, handleExitModal, getModalButton, handleSaveRecording,])

   //generic content
  const exitModalContent = useCallback((action: boolean): ModalContentType | null => exitContent(resetModal, cancelExit, action)
  ,[resetModal, cancelExit, exitContent])

  useEffect(() => {
    let content: ModalContentType | null = null;

    if(exit) {
        content = exitModalContent(exit)
    }else if (modalAction.name === 'check') {
        content = checkContent(
            modalAction?.check,
            recordSettings,
            failedCheck,
        )
    } else if(modalAction.name === 'record') {
        content = recordGuideContent(
            modalAction?.record,
            videoSettings,
            failedCheck,
            streamSettings,
            recordingStatus,
            recordingTimer,
            screenShots,
        )
    } else if(modalAction.name === 'load') {
        content = loadContent(
            modalAction?.load,
            recordedVideoUrl,
            screenShots,
        )
    } else if(modalAction.name === 'redirect') {
        content = redirectContent(modalAction?.redirect)

        if(modalAction.redirect?.state === 'ongoing') router.push('/upload')

    } else if(modalAction.name === 'save_record') {
        content = saveContent(
            modalAction?.save_record,
            failedCheck
        )
    }

    if(content) syncModalContent('record', content);
    
  },[modalAction, exit, videoSettings, recordSettings, failedCheck, streamSettings, recordingStatus, recordingTimer, recordedVideoUrl, screenShots])

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
    className, /* ="col-span-5",*/ 
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