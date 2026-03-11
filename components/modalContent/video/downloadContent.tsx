
import { 
  FailedActionModalBody, 
  OngoingActionModalBody, 
  SuccessfulActionModalBody 
} from "@/components";
import { downloadButtons } from "@/constants/lists";
import { ModalContentType } from "@/index";
import { 
  NoNameModalActionType, 
  VoidAction 
} from "@/lib/hooks/useModalContext";
import { showOrHide } from "@/lib/modalContentUtil";

const DownloadBody = ({
  action
}: {action: NoNameModalActionType},
) => {
  const {state, response} = action;

  return (
    <>
      <OngoingActionModalBody 
        text='Downloading video..' 
        className={showOrHide(state === 'ongoing')}
      />
      <FailedActionModalBody 
        text='Failed to download video' 
        className={showOrHide(state === 'after' &&  response === 'failed')}
      />
      <SuccessfulActionModalBody 
        text='Video successfully downloaded' 
        className={showOrHide(state === 'after' &&  response === 'successful')}
      />
    </>
  )
}

const downloadContent = (
  action: NoNameModalActionType,
  onDownload: VoidAction
): ModalContentType => {
  return {
    body: <DownloadBody action={action}/>,
    buttons: downloadButtons(
      action,
      onDownload
    )
  }
};

export default downloadContent;