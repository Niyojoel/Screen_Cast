"use client"

import { useRouter } from "next/navigation"
import {ActionButton, CopyBtn, Img, DropdownList, WarningActionDialog} from "."
import { cn, daysAgo, downloadVideo } from "@/lib/utils"
import {Dot} from "lucide-react"
import React, {useCallback, useEffect, useMemo, useState } from "react"
import { authClient } from "@/lib/authClient"
import { deleteVideo, updateVideoVisibility } from "@/lib/actions/video"
import toast from "react-hot-toast"
import { dummySession, visibilities } from "@/constants"
import {DropdownOptionsType, ModalContentType, VideoDetailHeaderProps, Visibility } from ".."
import { exitContent } from "@/constants/lists"
import {NoNameModalActionType, useGlobalContext } from "@/lib/hooks/useGlobalContext"
import { getActionStateContent, getModalButton} from "@/lib/modalContentUtil"

const VideoDetailHeader = ({
    id,
    title,
    createdAt,
    userImg,
    username,
    videoId,
    videoUrl,
    ownerId,
    visibility,
    thumbnailUrl
}: VideoDetailHeaderProps & {videoUrl?: string}) => {
  const router = useRouter()

  const {
    modalOpen,
    exit,
    openModal, 
    closeModal, 
    modalAction,
    changeAction,
    successfulAction,
    changeState,
    failedAction,
    beforeAction,
    ongoingAction,
    syncModalContent,
    actionTrue,
    resetModal,
  } = useGlobalContext()

  const [visibilityState, setVisibilityState] = useState<DropdownOptionsType>({label: visibility as Visibility});
  const [isUpdating, setIsUpdating] = useState(false)

  // const { data: session } = authClient.useSession();
  const session = dummySession;
  const user = session.user;
  const userId = session?.user?.id;

  let isOwner = false;
  if(userId){
      isOwner = userId === ownerId;
  }

  const showDeleteModal = () => {
    beforeAction('delete');
    openModal({type: 'post'})
  }

  const handleDelete = async () => {
    try {
      changeState('ongoing', 'delete');
      await deleteVideo(videoId, thumbnailUrl);
      toast.success("video deleted successfully")
      successfulAction('delete');
      setTimeout(redirectToProfile, 2000)
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Error deleting video");
      failedAction('delete');
    }
  }

  const handleVisibilityChange = async(option: DropdownOptionsType) => {
    if(option !== visibilityState) {
        setIsUpdating(true);
        try {
          await updateVideoVisibility(videoId, option.label as Visibility);
          setVisibilityState(option);
          toast(`Video visibility has been changed to ${option.label}`)
        } catch (error) {
          console.error("Error updating visibility:", error);
          toast("Error updating video visibility");
        }finally {
          setIsUpdating(false);
        }
    }
  }

  const handleDownload = async () => {
    try {
      ongoingAction('download')
      openModal({type: 'post'});
      downloadVideo(videoUrl as string);
      successfulAction('download');
      setTimeout(closeModal, 2000)
    } catch (error) {
      console.error(error);
      !modalAction.download.state && toast.error("Download failed")
      failedAction('download');
    }
  }

  const redirectToProfile = () => router.push(`/profile/${ownerId}`)

  const afterDeleteRedirect = () => { 
    router.push(`/profile/${ownerId}`)
    ongoingAction('to_profile')
  }

  const deleteContent = useCallback((action: NoNameModalActionType): ModalContentType | null => {
    return action ? getActionStateContent (
      action.state,
      action.response,
      {
        node: "Failed to delete video",
        buttons: [getModalButton('Retry', handleDelete, 'btn-destructive')]
      },
      {
        node: "Deleting video.."
      },
      {
        node: 'Video successfully deleted'
      },
      {
        node: (
          <WarningActionDialog
            header = 'This action cannot be undone'
            text = "Click continue to delete this video completely"
          />
        ),
        buttons: [
          getModalButton('Cancel', closeModal, 'btn-white'),
          getModalButton('Continue', handleDelete, 'btn-destructive'),
        ]
      },
    ) : null
  }, [getActionStateContent, getModalButton, handleDelete, closeModal])
  
  const downloadContent = useCallback((action: NoNameModalActionType): ModalContentType | null => {
    return action ? getActionStateContent(
      action.state,
      action.response,
      {
        node: "Failed to download video",
        buttons: [getModalButton('Retry', handleDownload)]
      },
      {
        node: "Downloading video.."
      },
      {
        node: 'Video successfully downloaded'
      },
    ): null
  }, [getActionStateContent, getModalButton, handleDownload])

  const redirectContent = useCallback((action: NoNameModalActionType): ModalContentType | null => {
    return action ? getActionStateContent(
      action.state,
      action.response,
      {
        node: "Failed to redirect to profile",
        buttons: [getModalButton('Retry', afterDeleteRedirect)]
      },
      {
        node: "Redirecting to profile..."
      },
      null
    ): null
  }, [getActionStateContent, getModalButton, handleDownload])

  const exitModalContent = useCallback((action: boolean): ModalContentType | null => {
    return action ? exitContent(resetModal, action) : null
  },[resetModal, exitContent])
  
  useEffect(()=> {
    let content: ModalContentType | null = null;
    
    if(exit) {
      content = exitModalContent(exit)
    }

    if(modalAction.name === 'download') {
      content = downloadContent(modalAction?.download)
    } 
    
    if(modalAction.name === 'delete') {
      content = deleteContent(modalAction?.delete)
    } 

    if(modalAction.name === 'to_profile') {
      content = redirectContent(modalAction?.to_profile)
    } 
    
    if(content) syncModalContent('post', content);
  }, [modalAction, exit])

  return (
    <header className='detail-header'>
      <aside className='user-info'>
          <h1>{title}</h1>
          <figure>
            <ActionButton 
                src={userImg ?? "/assets/images/dummy.jpg"}
                size={24} 
                alt={username ?? "user"}
                className="cursor-pointer"
                action={redirectToProfile}
            >
                <h2>{username ?? "Guest"}</h2>
            </ActionButton>
            <figcaption>
                <span className="mt-1"><Dot/></span>
                <p>{daysAgo(createdAt)}</p>
            </figcaption>
          </figure>
      </aside>
      <aside className="cta">
        <CopyBtn id={id} size={22} className='relative hover:bg-gray-20 p-2'/>
        {user && visibility.toLowerCase() === "public" && (
          <button
            className={cn("round-btn", "hover:bg-gray-20 p-2")}
            onClick = {handleDownload}
          >
            <Img
              src= "/assets/icons/download.svg"
              alt= "download"
              size = {22}
            />
          </button>
        )}
        {isOwner && (
          <div className="user-btn">
            <button
              className="delete-btn"
              onClick={showDeleteModal}
              disabled={modalAction.delete?.state === 'ongoing'}
            >
              Delete
            </button>
            <div className="bar"/>
            {isUpdating ? (
              <div className="update-stats">
                <p>Updating...</p>
              </div>
            ) : (
              <DropdownList
                options={visibilities}
                activeOption = {visibilityState}
                onSelectAction = {handleVisibilityChange}
                triggerIcon={
                  <Img
                    src= "/assets/icons/eye.svg"
                    alt="eye.svg"
                    className="mt-0.5"
                  />
                }
              />
            )}
          </div>
        )}
      </aside>
    </header>
  )
}

export default VideoDetailHeader