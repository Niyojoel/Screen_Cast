import { 
  FailedActionModalBody, 
  OngoingActionModalBody 
} from "@/components";
import { NoNameModalActionType } from "@/lib/hooks/useModalContext"
import { showOrHide } from "@/lib/modalContentUtil"

const RedirectBody = ({
  action
}: {action: NoNameModalActionType},
) => {
  const {state, response} = action;

  return (
    <>
      <OngoingActionModalBody 
        text='Redirecting to profile...' 
        className={showOrHide(state === 'ongoing')}
      />
      <FailedActionModalBody 
        text='Failed to redirect to profile' 
        className={showOrHide(state === 'after' &&  response === 'failed')}
      />
    </>
  )
}

export default RedirectBody;