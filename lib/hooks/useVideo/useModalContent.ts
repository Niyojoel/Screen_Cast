import { useCallback } from "react"
import { 
    MappedAction, 
    VoidAction, 
    useModalContext 
} from "../useModalContext"
import { 
    ModalContentType, 
    ParentContentType 
} from "@/index"
import {useModalActions} from "./"
import { 
    deleteContent, 
    downloadContent 
} from "@/components/modalContent/video"

const useModalContent = () => {
    const {
        onDelete: onDelete_, 
        afterDeleteRedirect: afterDeleteRedirect_,
    } = useModalActions()

    const { closeModal } = useModalContext()

    const videoContent = useCallback((
        modalAction: MappedAction,
        contentParent: ParentContentType | null,
        toast: any,
        videoUrl: string,
        videoId: string,
        thumbnailUrl: string,
        redirectToProfile: VoidAction,
        onDownload_: (videoUrl: string, toast: any) => void,
    ): ModalContentType | null => {

        const onDownload = () => onDownload_(videoUrl, toast)

        const onDelete = () => onDelete_(
            videoId, 
            thumbnailUrl, 
            redirectToProfile,
            toast
        )

        const afterDeleteRedirect = () => afterDeleteRedirect_(redirectToProfile)

        if(contentParent === 'delete') {
            return deleteContent(
                modalAction,
                onDelete,
                closeModal,
                afterDeleteRedirect
            )
        } else if (modalAction.name === 'download') {
            return downloadContent(
                modalAction?.download,
                onDownload
            )
        } else return null
    },[])

    return {videoContent}
}

export default useModalContent;