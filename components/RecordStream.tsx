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
import {DialogContentBody, DropdownList, FailedActionDialog, Modal} from './'
import {dummySession} from "@/constants"
import {
    CirclePauseIcon,
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
import { DIALOG_ICONS } from '@/constants/lists'
import useRecordingFeatures from '@/lib/hooks/useRecordingFeatures'

const RecordStream = () => {

  const {
    recordingState,
    videoRef,
    goToUpload,
    goingToUploadAction,
    recordedVideoUrl,
    selectedVideoSetting,
    showInstructions,
    settingsGuide,
    recordSettings,
    recordingButtons,
    videoSettings,
    actionResponse,
    handleOpenModal,
    handleCloseModal,
    showModalError,
    modal,
    modalError,
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
  
  useEffect(() => {
    console.log("from recording stream component: ", recordingState)
    recordingButtons
  },[recordingState])

  useEffect(() => {
    if(goToUpload === "redirecting") goingToUploadAction(()=> router.push('/upload'))
  },[goToUpload])

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
        {modal.state && (
            <Modal
                closeIcon={modal.closeIcon}
                closeModal={handleCloseModal}
                error={modalError}
                setError={showModalError}
                footerButtons={modal.buttons}
                contentBody={modal.content}
            />
        )}
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

const RecordingOnSubNode = memo(({
    selectedVideoSetting
}: Pick<RecordingDialogContentBodyProps, 'selectedVideoSetting'>) => (
    <div className="media-use">
        <span className='media-use-intro'>
            {selectedVideoSetting.displaySurface ? `You are recording on ${parseOutputDisplaySetting(selectedVideoSetting?.displaySurface)} mode with:` : 'You are using camera only with: '}
        </span>
        <div className='feature-box'>
            <DialogContentListFeature
                featureName = "System audio : "
                featureStatus = {selectedVideoSetting.systemAudio ? "in use" : "not in use"}
            />
            <DialogContentListFeature
                featureName = "Cursor : "
                featureStatus = {selectedVideoSetting.cursor === "never" ? "hidden" : selectedVideoSetting.cursor === "motion" ? "showing in motion" : "showing"}
            />
            <DialogContentListFeature
                featureName = "Camera : "
                featureStatus = {selectedVideoSetting.camera === "no" ? "not in use" : selectedVideoSetting.camera === "only" ? `in use (${selectedVideoSetting.cameraFacingMode} mode)` : "in use"}
            />
            <DialogContentListFeature
                featureName = "Mic : "
                featureStatus = {selectedVideoSetting.withMic ? 'on' : "off"}
            />
        </div>
    </div>
))


export default RecordStream