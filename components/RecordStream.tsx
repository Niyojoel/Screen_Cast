'use client'

import { ICONS } from '@/constants'
import { useScreenRecording } from '@/lib/hooks/useScreenRecording'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import ActionButton from './ActionButton'
import { duration } from 'drizzle-orm/gel-core'
import { authClient } from '@/lib/authClient'
import toast from 'react-hot-toast'
import {Modal} from './'
import {dummySession} from "@/constants"

const RecordStream = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const videoRef= useRef<HTMLVideoElement>(null)

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

  const handleOpenModal = () => setIsOpen(true);

  const handleCloseModal = () => {
    setIsOpen(false);
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
    setIsOpen(false);
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
                <p>
                    Click record to start recording your screen
                </p>
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
            <span className='truncate'>
                Record a video
            </span>
        </ActionButton>
        {isOpen && (
            <Modal
                closeModal={handleCloseModal}
                dialogTitle="Screen Recording"
                dialogContent= {dialogContent()}
            />
        )}
    </div>
  )
}

export default RecordStream