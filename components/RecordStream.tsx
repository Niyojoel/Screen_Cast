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
    CircleIcon,
    CirclePauseIcon,
    CirclePlayIcon,
    HomeIcon,
    Image,
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
import { RecordingTimerType } from '@/lib/hooks/useRecord/useRecordActions'
import { useGlobalContext } from '@/lib/hooks/useGlobalContext'
import { useScreenRecording } from '@/lib/hooks/useRecord/useScreenRecording'
import useSettings from '@/lib/hooks/useRecord/useSettings'
import useRecordActions from '@/lib/hooks/useRecord/useRecordActions'
import useRecordContent from '@/lib/hooks/useRecord/useModal/useRecordContent'

const RecordStream = () => {

  const {recordContent} = useRecordContent()
  const {
    failedCheck,
    recordedVideoUrl,
    recordingStatus,
    streamSettings,
    recordingTimer,
    screenShots,
    handleOpenModal,
  } = useRecordActions()

  const {videoSettings, recordSettings} = useSettings()

  const {
    modalOpen,
    modalAction,
    exit,
    exitModalContent,
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

  useEffect(() => {
    let content: ModalContentType | null = null;

    if(exit) {
        content = exitModalContent(exit);
    } else if (modalOpen.type === 'record') {
        content = recordContent(
            modalAction,
            failedCheck,
            screenShots,
            recordSettings,
            videoSettings,
            streamSettings,
            recordingStatus,
            recordingTimer,
            recordedVideoUrl,
        )

        if(modalAction?.redirect?.state === 'ongoing') {
            router.push('/upload')
        }
    }

    if(content) syncModalContent('record', content);
    
  },[
        modalAction, 
        exit, 
        videoSettings, 
        recordSettings, 
        failedCheck, 
        streamSettings, 
        recordingStatus, 
        recordingTimer, 
        recordedVideoUrl, 
        screenShots
    ])

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

type NoteProps = {
    settings: VideoSettingsType | StreamSettingsType,
    falseConditionRender: string | React.ReactElement,
    additionalFeature?: React.ReactElement | null,
    featureHeaderText?: string,
    className?: string,
}

type OngoingRecordingContentProps = {
    recordingStatus: RecordingState, 
    recordingTimer: RecordingTimerType,
    streamSettings: StreamSettingsType,
    screenShots: ImagesArrayType[]
}

const Note = memo(({
    settings,
    falseConditionRender,
    additionalFeature,
    featureHeaderText,
    className,
}: NoteProps) => {
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
})

export const GuideNote = memo(({videoSettings}: {videoSettings: VideoSettingsType}) => {

    const falseConditionRender = () => (
        <>
            <span className='block'>
                <span>When the browser dialog picker appears, your screen setting option</span> {" "}
                <span className='font-medium'>{`(${parseBrowserDialogOptions(videoSettings.displaySurface)})`}</span> {" "}
                <span>would be preset on the tab.</span>
                {" "} Click in the box underneath to choose which screen to record. You can also enable system audio.
            </span>
            <span className='block'>
            </span>
        </>
    )

    return (
        <Note
            settings={videoSettings}
            falseConditionRender={falseConditionRender()}
            additionalFeature={null}
            featureHeaderText='Active features'
        />
    )
})

export const SuccessfulStartRecordingBody = memo(({
    recordingStatus, 
    recordingTimer,
    streamSettings,
    screenShots,
}: OngoingRecordingContentProps) => {

    const {handlePauseResume} = useRecordActions();

    const {
        handleTakeScreenShot, 
        onScreenShotClick, 
        onScreenShotRemove, 
        onScreenShotSave
    } = useScreenRecording();


    useEffect(() => {
        console.log(recordingStatus);
    })

    const ongoingRecordingNote = useCallback((streamSettings: StreamSettingsType) => (
        <Note
            settings={streamSettings}
            falseConditionRender={`You are recording on ${parseOutputDisplaySetting(streamSettings.displaySurface)} mode with:`}
            additionalFeature={streamSettings.systemAudio ? <DialogListItem text = "System audio"/> : null}
        />
    ),[parseOutputDisplaySetting]) 

    return (
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
    )
})

export const SuccessfulLoadBody = memo(({recordedVideoUrl, screenShots}: {
    recordedVideoUrl: string,
    screenShots: ImagesArrayType[]
}) => {
    const {
        onScreenShotClick, 
        onScreenShotRemove, 
        onScreenShotSave, 
        onScreenShotSelect
    } = useScreenRecording();

    const {
        videoRef,
        changeVideoPlaying
    } = useRecordActions();

    return (
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
    )
})

  //dialogContent settings - ul child Element
export const RecordingSettings = memo(({
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