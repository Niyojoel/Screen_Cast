"use client"

import { useRouter } from "next/navigation"
import {ActionButton, CopyBtn, Img, DropdownList, FailedActionDialog, WarningActionDialog, SuccessActionDialog, OngoingActionDialog} from "."
import { cn, daysAgo, downloadVideo } from "@/lib/utils"
import {Dot} from "lucide-react"
import React, {useCallback, useEffect, useMemo, useState } from "react"
import { authClient } from "@/lib/authClient"
import { deleteVideo, updateVideoVisibility } from "@/lib/actions/video"
import toast from "react-hot-toast"
import { dummySession, visibilities } from "@/constants"
import {ActionResponseType, ActionStatusType, DropdownOptionsType, VideoDetailHeaderProps, Visibility } from ".."
import {ModalContentType, modalButton, modalContent} from "@/constants/lists"
import {useGlobalContext } from "@/lib/hooks/useGlobalContext"

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
    openModal, 
    closeModal, 
    actionResponse,
    actionStatus,
    changeActionStatus,
    changeActionResponse,
    changeModalContent
  } = useGlobalContext()

  const deleteActionStatus = (status: ActionStatusType | null) => changeActionStatus('delete', status)

  const deleteActionResponse = (response: ActionResponseType | null) => changeActionResponse('delete', response)

  const downloadActionStatus = (status: ActionStatusType | null) => changeActionStatus('download', status)

  const downloadActionResponse = (response: ActionResponseType | null) => changeActionResponse('download', response)

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
    deleteActionStatus('before');
    openModal(deleteContent?.body, deleteContent?.buttons)
  }

  const handleDelete = async () => {
    try {
      deleteActionStatus('ongoing');
      await deleteVideo(videoId, thumbnailUrl);
      router.push(`/profile/${userId}`)
      toast.success("video deleted successfully")
      deleteActionResponse('successful');
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Error deleting video");
      deleteActionResponse('failed');
    } finally {
      deleteActionStatus('after');
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
      downloadActionStatus('ongoing')
      openModal(
        downloadContent?.body,
        downloadContent?.buttons
      )
      downloadVideo(videoUrl as string);
      downloadActionResponse('successful')
    } catch (error) {
      console.error(error);
      toast.error("Download failed")
      downloadActionResponse('failed')
    } finally {
      downloadActionStatus('after');
    }
  }

  const redirectToProfile = () => router.push(`/profile/${ownerId}`)

  const deleteContent = useMemo((): ModalContentType | null => {
    return modalContent(
      actionStatus.delete,
      actionResponse.delete,
      {
        body: <FailedActionDialog customMessage="Failed to delete video"/>,
        buttons: [modalButton('Retry', handleDelete, 'btn-destructive')]
      },
      {
        body: <OngoingActionDialog message = "Deleting video.."/>
      },
      {
        body: <SuccessActionDialog message = 'Video successfully deleted'/>
      },
      {
        body: (
          <WarningActionDialog
            header = 'This action cannot be undone'
            message = "Click continue to delete this video completely"
          />
        ),
        buttons: [
          modalButton('Cancel', closeModal, 'btn-white'),
          modalButton('Continue', handleDelete, 'btn-destructive'),
        ]
      },
    )
  }, [actionStatus.delete, actionResponse.delete, modalButton, handleDelete, closeModal])
  
  const downloadContent = useMemo((): ModalContentType | null => {
    return modalContent(
      actionStatus.download,
      actionResponse.download,
      {
        body: <FailedActionDialog customMessage="Failed to download video"/>,
        buttons: [modalButton('Retry', handleDownload)]
      },
      {
        body: <OngoingActionDialog message = "Downloading video.."/>
      },
      {
        body: <SuccessActionDialog message = 'Video successfully downloaded'/>
      },
    )
  }, [actionStatus.download, actionResponse.download, modalButton, handleDownload])


  useEffect(()=> {
    if(actionStatus.delete && deleteContent) changeModalContent(
      deleteContent.body, 
      deleteContent?.buttons
    );
    if(actionStatus.download && downloadContent) changeModalContent(
      downloadContent.body, 
      downloadContent?.buttons
    );
    changeModalContent(null, null)
  }, [deleteContent, downloadContent, actionStatus])

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
              disabled={actionStatus.delete === 'ongoing'}
            >
              Delete Video
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