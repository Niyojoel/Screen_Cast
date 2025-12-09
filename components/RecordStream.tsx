import { ICONS } from '@/constants'
import { useScreenRecording } from '@/lib/hooks/useScreenRecording'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import ActionButton from './ActionButton'
import { duration } from 'drizzle-orm/gel-core'

const RecordStream = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const videoRef= useRef<HTMLVideoElement>(null)

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
    setIsOpen(true);
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

  return (
    <div className="record">
        <ActionButton
            className='primary-btn'
            action={handleOpenModal}
            image={ICONS.record}
            alt="record"
            size={16}
        >
            <span>Record a video</span>
        </ActionButton>
        {isOpen && (
            <section className="dialog">
                <div className="overlay-record" onClick={handleCloseModal}/>
                <div className="dialog-content">
                    <figure>
                        <h3>Screen Recording</h3>
                        <ActionButton
                            action={handleCloseModal}
                            image={ICONS.close}
                            alt="close"
                            size={20}
                        />
                    </figure>
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
                                image={ICONS.record}
                                alt="record"
                            >
                                Record
                            </ActionButton>
                        )}
                        {isRecording && (
                            <ActionButton
                                className='record-stop'
                                action={handleStopRecording}
                                image={ICONS.record}
                                alt="record"
                            >
                                Stop Recording
                            </ActionButton>
                        )}
                        {recordedVideoUrl && (
                            <>
                                <ActionButton
                                    className='record-again'
                                    action={handleRecordAgain}
                                    alt="record"
                                >
                                    Record Again
                                </ActionButton>

                                <ActionButton
                                    className='record-upload'
                                    action={handleGoToUpload}
                                    image={ICONS.upload}
                                    alt="upload"
                                >
                                    Continue to Upload
                                </ActionButton>
                            </>
                        )}
                    </div>
                </div>
            </section>
        )}
    </div>
  )
}

export default RecordStream