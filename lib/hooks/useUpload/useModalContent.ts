
import { 
    useCallback, 
} from "react"
import useUploadActions from "./useModalActions"
import { 
    MappedAction, 
    VoidAction 
} from "../useModalContext"
import { 
    ImagesArrayType, 
    ParentContentType 
} from "@/index"
import {
    editContent, 
    thumbnailContent 
} from "@/components/modalContent/upload"

const useModalContent = () => {

    const {
        onStartGenerate: startGenerate, 
        onBackToGenerated,
        onGenerateAgain, 
        onAddThumbnail: addThumbnail,
        resetModal
    } = useUploadActions()

    const uploadContent = useCallback((
        modalAction: MappedAction,
        contentParent: ParentContentType | null,
        videoFile: File,
        onFileChange: (file: File) => void,
        captureTime: number,
        generatedThumbnail: ImagesArrayType | null,
        failedText: string,
        changeGeneratedThumbnail: (generated: ImagesArrayType) => void,
        onCaptureTimeChange: (time: number) => void,
        onGoToEdit: VoidAction,
        onImageClick: VoidAction,
        resetCaptureTime: VoidAction
    ) => {

        const onAddThumbnail = () => addThumbnail(
            onFileChange, 
            generatedThumbnail 
        )

        const onStartGenerate = () => startGenerate(
            videoFile, 
            captureTime, 
            changeGeneratedThumbnail
        )

        const exitModal = () => {
            resetModal();
            resetCaptureTime();
        }

        if(contentParent === 'thumbnail') {
            return thumbnailContent(
                modalAction,
                captureTime,
                generatedThumbnail?.url as string,  
                failedText,
                onStartGenerate,
                onGenerateAgain,
                onAddThumbnail,
                onCaptureTimeChange,
                exitModal,
                onImageClick,
            )
        } else if (modalAction.name === 'edit') {
            return editContent(
                modalAction?.edit,
                failedText,
                onGoToEdit
            )
        } else return null
    },[])

    return {uploadContent}
}

export default useModalContent;