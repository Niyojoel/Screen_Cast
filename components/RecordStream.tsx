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
        label: "Screen and Camera"
    },
    {
        icon: <TvIcon size={18}/>,
        label: "Full Screen"
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
        label: "Default - MacBook Air Microphone"
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
            ) : (
                <ul>
                    <li>
                        <label>Video settings</label>
                        <DropdownList
                            options={settingsOptions}
                            action={activateVideoSetting}
                        />
                    </li>
                    <li>
                        <label>Recording settings</label>
                        <DropdownList
                            options={micRecordingOptions}
                            action={activateMicSetting}
                        />
                    </li>
                    
                </ul>
            )}
        </section>
        <div className="record-box">
            {(!isRecording && !recordedVideoUrl) && (
                <ActionButton
                    className='record-start'
                    action={handleStartRecording}
                    src={ICONS.record}
                    alt="record"
                >
                    Record
                </ActionButton>
            )}
            {isRecording && (
                <ActionButton
                    className='record-stop'
                    action={handleStopRecording}
                    src={ICONS.record}
                    alt="record"
                >
                    Stop Recording
                </ActionButton>
            )}
            {recordedVideoUrl && (
                <>
                    <button
                        className='record-again'
                        onClick={handleRecordAgain}
                    >
                        Record Again
                    </button>

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
                closeIcon = {<HomeIcon/>}
            />
        )}
    </div>
  )
}

export default RecordStream