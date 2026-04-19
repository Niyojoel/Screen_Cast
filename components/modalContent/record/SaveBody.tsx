
import { saveButtons } from "@/constants/lists"
import { NoNameModalActionType } from "@/lib/hooks/useModalContext";
import { ModalContentType } from "@/index"
import { showOrHide } from "@/lib/modalContentUtil"
import { 
  FailedActionModalBody,
  SuccessfulActionModalBody, 
  OngoingActionModalBody 
} from "@/components";

const SaveBody = ({action}: {action: NoNameModalActionType}) => {
  const {state, response} = action;

  return (
    <>
      <OngoingActionModalBody 
        text='Saving recorded video...' 
        className={showOrHide(state === 'ongoing')}
      />
      <FailedActionModalBody 
        text='Retry saving' 
        className={showOrHide(state === 'after' &&  response === 'failed')}
      />
      <SuccessfulActionModalBody 
        text='Recorded video saved' 
        className={showOrHide(state === 'after' &&  response === 'successful')}
      />
    </>
  )
}

const saveContent = (
  action: NoNameModalActionType,
  onSaveRecording: () => void, 
  onExit: () => void
): ModalContentType => {
  return {
    body: <SaveBody action={action}/>,
    buttons: saveButtons (
      action,
      onSaveRecording,
      onExit
    )
  }
}

export default SaveBody;