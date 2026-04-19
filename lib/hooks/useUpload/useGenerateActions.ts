'use client'

import { ImagesArrayType } from "@/index"
import { useCallback, useState } from "react"
import { useModalContext } from "../useModalContext"


const useGenerateActions = () => {

  const {
    changeImageFS,
    changeImageFSActions,
    failedAction,
    logActionError,
    successfulAction,
  } = useModalContext();

  const [captureTime, setCaptureTime] = useState(1)
  const [generatedThumbnail, setGeneratedThumbnail] = useState<ImagesArrayType | null>(null)

  const onCaptureTimeChange = (time: number) => {setCaptureTime(time)};
  
  const resetCaptureTime = () => {setCaptureTime(1)};

  const changeGeneratedThumbnail = (generated: ImagesArrayType) => {
    setGeneratedThumbnail(generated)
  }
  
  const onImageClick = () => {
    changeImageFS(generatedThumbnail);
    changeImageFSActions({
      onClose: () => changeImageFS(null),
      onSave: onSaveThumbnail
    })
  }

  const onSaveThumbnail = (id: string) => {
    
  }

  return {
    captureTime,
    generatedThumbnail,
    changeGeneratedThumbnail,
    onCaptureTimeChange,
    resetCaptureTime,
    onImageClick,
  }
}

export default useGenerateActions