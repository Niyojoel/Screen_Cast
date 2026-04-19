import { 
  NoNameModalActionType, 
  VoidAction
} from "@/lib/hooks/useModalContext"
import { showOrHide } from "@/lib/modalContentUtil"
import { 
  BeforeGenerateBody, 
  SuccessfulGenerateBody 
} from "../sub-components"
import { 
  FailedActionModalBody, 
  OngoingActionModalBody 
} from "@/components"

type GenerateBodyProps = {
  action: NoNameModalActionType;
  captureTime: number;
  imageUrl: string;  
  failedText: string;
  onCaptureTimeChange: (time: number) => void;
  fullScreenView: VoidAction;
}

const GenerateBody = ({
  action,
  captureTime,
  imageUrl,  
  failedText,
  onCaptureTimeChange,
  fullScreenView
}: GenerateBodyProps) => {
  const {state, response} = action;

  return (
    <>
      <BeforeGenerateBody
        captureTime={captureTime}
        className={showOrHide(state === 'before')}
        onCaptureTimeChange={(e) => onCaptureTimeChange(Number(e.target.value))}
      />
      <OngoingActionModalBody 
        text='Generating thumbnail...' 
        className={showOrHide(state === 'ongoing')}
      />
      <FailedActionModalBody 
        text={failedText || 'Failed to generate thumbnail'} 
        className={showOrHide(state === 'after' &&  response === 'failed')}
      />
      <SuccessfulGenerateBody
        imageUrl={imageUrl}
        fullScreenView={fullScreenView}
        className={showOrHide(state === 'after' &&  response === 'successful')}    
      />
    </>
  )
}

export default GenerateBody;