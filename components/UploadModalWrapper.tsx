"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ModalContentType } from "@/index";
import { useModalContext } from "@/lib/hooks/useModalContext";
import { 
  useUploadActions, 
  useModalContent, 
  useGenerateActions
} from "@/lib/hooks/useUpload";

const UploadModalWrapper = ({children}: {children: React.ReactNode}) => {
  
  const router = useRouter();
  
  const {
    modalOpen,
    modalContentParent,
    exit,
    modalAction,
    syncModalContent,
    redirectedContent,
    exitModalContent,
    actionError
  } = useModalContext()

  const {
    captureTime,
    generatedThumbnail,
    changeGeneratedThumbnail,
    onCaptureTimeChange,
    resetCaptureTime,
    onImageClick
  } = useGenerateActions()

  const {uploadContent} = useModalContent();

  const {
    video,
    thumbnail,
    uploaderId,
    onGoToEdit, 
  } = useUploadActions();

  //setting upload modal content
  useEffect(() => {
    let content: ModalContentType | null = null;

    const redirected: boolean = (modalAction?.redirect?.state === 'after' && modalAction?.redirect?.response === 'successful')

    console.log(modalAction)
    
    if(redirected) {
      content = redirectedContent()
    } else if(exit) {
      content = exitModalContent(resetCaptureTime)
    } else if(modalOpen.type === 'upload') {
      content = uploadContent(
        modalAction, 
        modalContentParent,
        video.file as File,
        thumbnail.onFileChange,
        captureTime,
        generatedThumbnail!,
        actionError,
        changeGeneratedThumbnail,
        onCaptureTimeChange,
        onGoToEdit,
        onImageClick,
        resetCaptureTime
      )
    } 

    if(content) syncModalContent('upload', content);

  }, [modalAction, exit, modalOpen, generatedThumbnail, actionError, captureTime])

  useEffect(()=> {
    if(uploaderId) router.push(`/profile/${uploaderId}`)
  },[uploaderId])

  return (
    <>{children}</>
  )
}

export default UploadModalWrapper