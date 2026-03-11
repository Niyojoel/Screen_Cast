import { 
  useCallback, 
} from "react"
import { useModalContext } from "../useModalContext"
import { 
  ImagesArrayType, 
  UploadAction 
} from "@/index"
import { 
  base64ToFile, 
  fileToBase64, 
  generateThumbnail 
} from "@/lib/utils"


const useModalActions = () => {

  const {
    resetModal, 
    logActionError,
    successfulAction,
    failedAction,
    beforeAction,
    ongoingAction,
    changeState,
  } = useModalContext()

  const onErrorHandle = (action: UploadAction, error: Error) => {
    const message = error instanceof Error ? error.message : `Failed to ${action} thumbnail`;
    logActionError(message);
    failedAction(action);
    console.error(error)
  } 

  const onStartGenerate = useCallback(async (
    file: File, 
    captureTime: number,
    changeGenerated: (thumbnail: ImagesArrayType) => void
  )=> {
    try {
      changeState('ongoing', 'generate');

      if(!file) return;

      const imageFile = await generateThumbnail(captureTime, file);
      console.log(imageFile)
      const url = await fileToBase64(imageFile);

      changeGenerated({
        url,
        name: imageFile.name,
        type: imageFile.type
      })
      
      successfulAction('generate');
    }catch(error){
      onErrorHandle('generate', error as Error)
    }
  }, [])

  const onGenerateAgain = useCallback(() => {
    beforeAction('generate');
  },[])

  const onAddThumbnail = useCallback(async (onFileChange: (file: File) => void, generatedThumbnail: ImagesArrayType | null) => {
    try {
      ongoingAction('add');

      if(!generatedThumbnail) return;
  
      const file = await base64ToFile(generatedThumbnail);

      onFileChange(file);

      successfulAction('add');

      setTimeout(() => {
        successfulAction('generate', 'before')
      }, 2000)

    } catch (error) {
      onErrorHandle('add' , error as Error);
    }
  }, [])

  const onBackToGenerated = useCallback(() => {
    successfulAction('generate', 'before')
  }, [])

  return {
    onStartGenerate, 
    onBackToGenerated,
    onGenerateAgain, 
    onAddThumbnail,
    resetModal,
  }
}

export default useModalActions;