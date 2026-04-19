import { 
  FailedActionModalBody, 
  OngoingActionModalBody, 
  SuccessfulActionModalBody 
} from "@/components";
import { NoNameModalActionType } from "@/lib/hooks/useModalContext";
import { showOrHide } from "@/lib/modalContentUtil";

type AddThumbnailBodyProps = {
  action: NoNameModalActionType,
  failedText: string,
}

const AddThumbnailBody = ({
  action, 
  failedText
}: AddThumbnailBodyProps) => {
  const {state, response} = action;

  return (
    <>
      <OngoingActionModalBody 
        text='Adding thumbnail file...' 
        className={showOrHide(state === 'ongoing')}
      />
      <FailedActionModalBody 
        text={failedText || 'Failed to add thumbnail'} className={showOrHide(state === 'after' &&  response === 'failed')}
      />
      <SuccessfulActionModalBody 
        text='Thumbnail added for upload' 
        className={showOrHide(state === 'after' &&  response === 'successful')}
      />
    </>
  )
}


export default AddThumbnailBody;