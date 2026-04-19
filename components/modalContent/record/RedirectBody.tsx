
import { NoNameModalActionType } from "@/lib/hooks/useModalContext";
import { showOrHide } from "@/lib/modalContentUtil"
import { 
  FailedActionModalBody, 
  OngoingActionModalBody 
} from "@/components";

const RedirectBody = ({action}: {action: NoNameModalActionType}) => {
  const {state, response} = action;

  return (
    <>
      <OngoingActionModalBody 
        text='Accessing recording blob...' 
        className={showOrHide(state === 'before')}
      />
      <OngoingActionModalBody 
        text='Redirecting to Upload page...' 
        className={showOrHide(state === 'ongoing')}
      />
      <FailedActionModalBody 
        text='You can try again or save video and self upload' 
        className={showOrHide(state === 'after' &&  response === 'failed')}
      />
    </>
  )
}

export default RedirectBody;