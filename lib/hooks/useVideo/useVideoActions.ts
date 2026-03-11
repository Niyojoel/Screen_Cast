import { DropdownOptionsType, Visibility } from "@/index";
import { useCallback, useState } from "react";
import { useModalContext } from "../useModalContext";
import { updateVideoVisibility } from "@/lib/actions/video";
import { downloadVideo } from "@/lib/utils";

const useVideoActions = () => {

  const {
    openModal,
    successfulAction,
    closeModal,
    modalAction,
    failedAction,
  } = useModalContext()

  const [visibilityState, setVisibilityState] = useState<DropdownOptionsType>({label: 'public' as Visibility});
  const [isUpdating, setIsUpdating] = useState(false)

  
  const changeVisibility = (value: string) => {
    setVisibilityState({label: value as Visibility})
  }

  const showDeleteModal = () => {
    openModal ({
      action: 'delete', 
      type: 'video', 
      parent: 'delete',
    })
  }

  const onDownload = useCallback(async (
    videoUrl: string,
    toast: any
  ) => {
    try {
      openModal ({
        action: 'download', 
        type: 'video', 
      });
      const response = await downloadVideo(videoUrl);
      if(response) successfulAction('download');
      setTimeout(closeModal, 2000)
    } catch (error) {
      console.error(error);
      !modalAction.download.state && toast.error("Download failed")
      failedAction('download');
    }
  },[])

  const onVisibilityChange = async(
    option: DropdownOptionsType,
    videoId: string,
    toast: any
  ) => {
    if(option !== visibilityState) {
      setIsUpdating(true);
      try {
        await updateVideoVisibility(videoId, option.label as Visibility);
        setVisibilityState(option);
        toast(`Video visibility has been changed to ${option.label}`)
      } catch (error) {
        console.error("Error updating visibility:", error);
        toast.error("Error updating video visibility");
      }finally {
        setIsUpdating(false);
      }
    }
  }

  return {
    changeVisibility,
    showDeleteModal,
    onDownload,
    onVisibilityChange,
    isUpdating,
    visibilityState,
  }
}

export default useVideoActions;