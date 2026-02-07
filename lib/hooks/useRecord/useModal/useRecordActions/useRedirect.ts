import { redirectBody, uploadButton } from "@/constants/lists"
import { NoNameModalActionType } from "../../../useGlobalContext"
import useRecordActions from "../../useRecordActions"
import { useCallback } from "react"
import { ModalContentType } from "@/index"
import { getActionStateButtons, getModalButton } from "@/lib/modalContentUtil"

const useRedirect = () => {

  const {
    handleSaveRecording, 
    handleGoToUpload,
  } = useRecordActions()

  const redirectContent = useCallback((action: NoNameModalActionType): ModalContentType => {
    return {
        body: redirectBody(action),
        buttons: getActionStateButtons(
            action,
            [
                getModalButton('Save Recording', handleSaveRecording),
                uploadButton(handleGoToUpload, 'Retry')
            ]
        )
    }
  }, [getActionStateButtons, handleSaveRecording, uploadButton, getModalButton])

  return {redirectContent}
}

export default useRedirect