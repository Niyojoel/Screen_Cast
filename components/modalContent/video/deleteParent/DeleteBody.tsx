import { 
  FailedActionModalBody, 
  OngoingActionModalBody, 
  SuccessfulActionModalBody, 
  WarningActionModalBody 
} from "@/components"
import { NoNameModalActionType } from "@/lib/hooks/useModalContext"
import { showOrHide } from "@/lib/modalContentUtil"

const DeleteBody = ({
  action
}: {action: NoNameModalActionType},
) => {
  const {state, response} = action;

  return (
    <>
      <WarningActionModalBody
        header = 'This action cannot be undone'
        text = "Click continue to complete action"
        className={showOrHide(state === 'before')}
      />
      <OngoingActionModalBody 
        text='Deleting video..' 
        className={showOrHide(state === 'ongoing')}
      />
      <FailedActionModalBody 
        text='Failed to delete video' 
        className={showOrHide(state === 'after' &&  response === 'failed')}
      />
      <SuccessfulActionModalBody 
        text='Video successfully deleted' 
        className={showOrHide(state === 'after' &&  response === 'successful')}
      />
    </>
  )
}

export default DeleteBody;
  