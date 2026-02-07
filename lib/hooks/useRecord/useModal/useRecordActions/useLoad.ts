import { ImagesArrayType, ModalContentType } from "@/index"
import { useCallback, useMemo } from "react"
import useRecordActions from "../../useRecordActions"
import { NoNameModalActionType } from "../../../useGlobalContext"
import { loadBody, uploadButton } from "@/constants/lists"
import { getActionStateButtons, getModalButton } from "@/lib/modalContentUtil"


export const useLoad = () => {
    const {
        handleRecordAgain,
        handleStopRecording,
        handleContinueRecording,
        handleGoToUpload
    } = useRecordActions()

    const recordAgain = useMemo(() => getModalButton('Record again', handleRecordAgain, 'btn-white'),[handleRecordAgain, getModalButton])

    const loadContent = useCallback((
        action: NoNameModalActionType,
        recordedVideoUrl: string,
        screenShots: ImagesArrayType[]
    ): ModalContentType => {
        return {
            body: loadBody(action, recordedVideoUrl, screenShots),
            buttons: getActionStateButtons(
                action,
                [
                    recordAgain,
                    getModalButton('Recover', handleStopRecording)
                ],
                [
                    getModalButton('Continue', handleContinueRecording),
                    getModalButton('End', handleStopRecording, 'btn-destructive'),
                ],
                [
                    recordAgain, 
                    uploadButton(handleGoToUpload)
                ],
            )
        }
    }, [recordAgain, getModalButton, getActionStateButtons, getModalButton, handleStopRecording, handleContinueRecording, uploadButton])

    return {loadContent};
}