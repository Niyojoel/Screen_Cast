import { 
    MappedAction, 
    VoidAction, 
    VoidActionParam 
} from "@/lib/hooks/useModalContext"
import AddThumbnailBody from "./AddThumbnailBody"
import { 
    addThumbnailButtons, 
    generateButtons
} from "@/constants/lists"
import GenerateBody from "./GenerateBody"

const thumbnailContent = (
  modalAction: MappedAction,
  captureTime: number,
  imageUrl: string,  
  failedText: string,
  onStartGenerate: VoidAction,
  onGenerateAgain: VoidAction,
  onAddThumbnail: VoidAction,
  onCaptureTimeChange: VoidActionParam<number>,
  resetModal: VoidAction,
  onImageClick: VoidAction,
) => {
  if(modalAction.name === 'generate') {
    return {
      body: (
        <GenerateBody
          action={modalAction?.generate} 
          captureTime={captureTime} 
          imageUrl={imageUrl} 
          failedText={failedText} 
          onCaptureTimeChange={onCaptureTimeChange}
          fullScreenView={onImageClick}
        />
      ),
      buttons: generateButtons (
        modalAction?.generate,
        onStartGenerate,
        onGenerateAgain,
        onAddThumbnail,
      )
    }
  } else if(modalAction.name === 'add') {
    return {
      body: (
        <AddThumbnailBody 
        action={modalAction?.add} 
        failedText={failedText} 
        />
      ),
      buttons: addThumbnailButtons(
        modalAction?.add,
        onAddThumbnail,
        resetModal,
      )
    }
  } else return null;
}

export default thumbnailContent;