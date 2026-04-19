'use client'

import { 
  ICONS, 
  dummySession 
} from '@/constants'
import { useRouter } from 'next/navigation'
import React, {
  useCallback, 
  useEffect, 
} from 'react'
import { authClient } from '@/lib/authClient'
import { HomeIcon } from 'lucide-react'
import { ModalContentType } from '..'
import toast from 'react-hot-toast';
import { useModalContext } from '@/lib/hooks/useModalContext'
import useRecordContent from '@/lib/hooks/useRecord/useModalContent'
import { 
  useScreenshotActions, 
  useScreenRecording, 
  useSettings,
  useSaveRecordActions
} from '@/lib/hooks/useRecord'
import ActionButton from './ActionButton'

const RecordStream = () => {

  const { recordContent } = useRecordContent()

  const {
    modalOpen,
    modalContentParent,
    modalAction,
    exit,
    exitModalContent,
    syncModalContent,
    openModal,
  } = useModalContext()

  const {
    screenShots,
    resetScreenShots,
    changeScreenShots,
    onScreenShotClick,
  } = useScreenshotActions()

  const {
    recordedBlob,
    recordedVideoUrl,
    recordingDuration,
    recordingStatus,
    startRecording,
    stopRecording,
    resetRecording,
    streamSettings,
    recordingTimer,
    onPauseResume,
    onTakeScreenShot,
  } = useScreenRecording()

  const {
    videoSettings, 
    recordSettings
  } = useSettings()

  const { 
    saveRecord,
    onSaveRecording
  } = useSaveRecordActions()

  const router = useRouter();

  const session = dummySession;

  //using useCallback causes a loss of last modal action state on opening  
  const onGoToRecording = /*useCallback(*/() => {
    if(!session?.user) {
      router.push('/sign-in')
      toast('You need to sign in to access recording features');
      return;
    }

    openModal({
      action: 'check', 
      type: 'record', 
      parent: 'record',
      closeIcon: <HomeIcon size={22}/>
    })
  }/*,[session, router])*/

  //recording modal content
  useEffect(() => {
    let content: ModalContentType | null = null;

    if(exit) {
      content = exitModalContent(resetRecording);

    } else if (modalOpen.type === 'record') {
      content = recordContent(
        modalAction,
        modalContentParent,
        videoSettings,
        recordSettings,
        recordedBlob,
        recordedVideoUrl,
        recordingDuration,
        recordingStatus,
        streamSettings,
        recordingTimer,
        saveRecord,
        onSaveRecording,
        startRecording,
        stopRecording,
        resetRecording,
        onPauseResume,
        onTakeScreenShot,
        screenShots,
        resetScreenShots,
        changeScreenShots,
        onScreenShotClick,
      )

      if(modalAction?.redirect?.state === 'ongoing') {
        router.push('/upload')
      }
    }

    if(content) syncModalContent('record', content);
    
  },[
    modalAction, 
    modalContentParent,
    modalOpen,
    exit,
    saveRecord,
    recordedBlob,
    recordedVideoUrl,
    recordingDuration,
    recordingStatus,
    streamSettings,
    recordingTimer,
    screenShots,
    recordSettings,
    videoSettings,
  ])

  return (
    <div className="record">
      <ActionButton
        className='primary-btn'
        action={() => onGoToRecording()}
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

export default RecordStream