import { 
  FailedActionModalBody, 
  OngoingActionModalBody 
} from "@/components";
import { editButtons } from "@/constants/lists";
import { ModalContentType } from "@/index"
import { 
  NoNameModalActionType, 
  VoidAction 
} from "@/lib/hooks/useModalContext"
import { showOrHide } from "@/lib/modalContentUtil"

type EditBodyProps = {
  action: NoNameModalActionType,
  failedText: string,
}

const EditBody = ({
  action,
  failedText,
}: EditBodyProps) => {
  const {state, response} = action;

  return (
    <>
      <OngoingActionModalBody 
        text='Accessing editing features...' 
        className={showOrHide(state === 'ongoing')}
      />
      <FailedActionModalBody 
        text={failedText || "Failed to load editing features"} 
        className={showOrHide(state === 'after' &&  response === 'failed')}
      />
    </>
  )
}

const editContent = (
  action: NoNameModalActionType,
  failedText: string,
  onGoToEdit: VoidAction
): ModalContentType => {
  return {
    body: <EditBody 
      action={action} 
      failedText={failedText}
    />,
    buttons: editButtons(
      action,
      onGoToEdit
    )
  }
};

export default editContent;

