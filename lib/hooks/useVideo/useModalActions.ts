import { useCallback } from "react"
import { VoidAction, useModalContext } from "../useModalContext"
import { deleteVideo } from "@/lib/actions/video"

const useModalActions = () => {
  
  const {
    successfulAction,
    failedAction,
    ongoingAction,
    changeState
  } = useModalContext()
   
  const onDelete = useCallback(async (
    videoId: string, 
    thumbnailUrl: string, 
    redirectToProfile: VoidAction,
    toast: any
  ) => {
    try {
      changeState('ongoing', 'delete');
      await deleteVideo(videoId, thumbnailUrl);
      toast.success("video deleted successfully")
      successfulAction('delete');
      setTimeout(() => {
        redirectToProfile();        
        ongoingAction('to_profile')
      }, 2000)
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Error deleting video");
      failedAction('delete');
    }
  },[])

  const afterDeleteRedirect = (redirectToProfile: VoidAction) => { 
    redirectToProfile();
    ongoingAction('to_profile')
  }

  return {
    onDelete,
    afterDeleteRedirect
  }
}

export default useModalActions;