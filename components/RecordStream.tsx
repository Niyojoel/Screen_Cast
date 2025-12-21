'use client'

import { ICONS } from '@/constants'
import { useScreenRecording } from '@/lib/hooks/useScreenRecording'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useMemo, useRef, useState } from 'react'
import ActionButton, { Img } from './ActionButton'
import { duration } from 'drizzle-orm/gel-core'
import { authClient } from '@/lib/authClient'
import toast from 'react-hot-toast'
import {DropdownList, Modal, OptionsTrigger} from './'
import {dummySession} from "@/constants"
import { AppWindowMacIcon, HomeIcon, LucideNotebookTabs, MicIcon, MicOffIcon, TvIcon, UserIcon } from 'lucide-react'

const activateVideoSetting = (selectedSetting: string) => {
    console.log(selectedSetting);
}

const activateMicSetting = (selectedMic: string) => {
    console.log(selectedMic);
}

const settingsOptions = [
    {
        icon: <TvIcon size={18}/>,
        label: "Full Screen",
        default: true
    },
    {
        icon: <AppWindowMacIcon size={18}/>,
        label: "Window"
    },
    {
        icon: <LucideNotebookTabs size={18}/>,
        label: "CurrentTab"
    },
    {
        icon: <UserIcon size={18}/>,
        label: "Camera only"
    },
]
const micRecordingOptions = [
    {
        icon: <MicOffIcon size={18}/>,
        label: "No microphone"
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

const RecordStream = () => {
  const router = useRouter();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const videoRef= useRef<HTMLVideoElement>(null);

//   const {data: session} = authClient.useSession();

const session = dummySession;

  const {
    isRecording,
    recordedBlob,
    recordedVideoUrl,
    recordingDuration,
    startRecording,
    stopRecording,
    resetRecording
  } = useScreenRecording()

  const handleOpenModal = () => setIsOpenModal(true);

  const handleCloseModal = () => {
    setIsOpenModal(false);
    resetRecording();
  };

  const handleStartRecording = async ()=> await startRecording();

  const handleRecordAgain = async ()=> {
    resetRecording();
    await startRecording();

    if(recordedVideoUrl && videoRef.current) {
        videoRef.current.src = recordedVideoUrl;
    }

  } 

  const handleStopRecording = () => stopRecording();

  const handleGoToUpload =()=> {
    if(!recordedBlob) return;
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
    router.push('/upload');
    setIsOpenModal(false);
  }

  const handleGuestUser = () => {
    router.push('/sign-in')
    toast('You need to sign in to access recording features');
  }

  const recordingSettings = () => (
    <ul className='recording-settings'>
        <li>
            <p>Video settings</p>
            <DropdownList
                options={settingsOptions}
                action={activateVideoSetting}
                optionsStyle={{display: "flex", alignItems: "center", gap: "0.5rem", paddingTop: "0.7rem", paddingBottom: "0.7rem"}}
            />
        </li>
        <li>
            <p>Recording settings</p>
            <DropdownList
                options={micRecordingOptions}
                action={activateMicSetting}
                optionsStyle={{display: "flex", alignItems: "center", gap: "0.5rem"}}
            />
        </li>
    </ul>
  )

  const dialogContent = () => (
    <article className='recording-elements'>
        <section>
            {isRecording ? (
                <article>
                    <div/>
                    <span>
                        Recording in progress
                    </span>
                </article>
            ): recordedVideoUrl ? (
                <video src={recordedVideoUrl} ref={videoRef} controls/>
            ) : (recordingSettings())}
        </section>
        <div className="record-box">
            {(!isRecording && !recordedVideoUrl) && (
                <ActionButton
                    className='record-start'
                    action={handleStartRecording}
                >
                    Start Recording
                </ActionButton>
            )}
            {isRecording && (
                <ActionButton
                    className='record-stop'
                    action={handleStopRecording}
                >
                    Stop Recording
                </ActionButton>
            )}
            {recordedVideoUrl && (
                <>
                    <ActionButton
                        className='record-again'
                        action={handleRecordAgain}
                    >
                        Record Again
                    </ActionButton>

                    <ActionButton
                        className='record-upload'
                        action={handleGoToUpload}
                        src={ICONS.upload}
                        alt="upload"
                    >
                        Continue to Upload
                    </ActionButton>
                </>
            )}
        </div>
    </article>
  )

  return (
    <div className="record">
        <ActionButton
            className='primary-btn'
            action={session?.user ? handleOpenModal : handleGuestUser}
            src={ICONS.record}
            alt="record"
            size={16}
        >
            <span className='text-white font-semibold'>
                Record a video
            </span>
        </ActionButton>
        {isOpenModal && (
            <Modal
                closeModal={handleCloseModal}
                dialogContent= {dialogContent()}
                closeIcon = {<HomeIcon size={22}/>}
            />
        )}
    </div>
  )
}

export default RecordStream