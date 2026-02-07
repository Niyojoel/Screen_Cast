import { useCallback } from "react";
import useRecordActions from "../../useRecordActions"
import { NoNameModalActionType } from "../../../useGlobalContext";
import { ModalContentType } from "@/index";
import { saveBody } from "@/constants/lists";
import { getActionStateButtons, getModalButton } from "@/lib/modalContentUtil";

const useSave = () => {

  const {handleSaveRecording, handleExitModal} = useRecordActions();

  const saveContent = useCallback((
    action: NoNameModalActionType,
    failedCheck: string
  ): ModalContentType => {
    return {
        body: saveBody(action, failedCheck),
        buttons: getActionStateButtons(
            action,
            [
                getModalButton('Retry save', () => handleSaveRecording)
            ],
            null,
            [getModalButton('Exit', handleExitModal)]
        )
    }
  }, [getActionStateButtons, handleExitModal, getModalButton, handleSaveRecording,])

  return {saveContent}
}

export default useSave