"use client"

import { useRouter } from "next/navigation"
import {ActionButton, CopyBtn, Img, DropdownList, Modal, DialogContentBody, FailedActionDialog} from "."
import { cn, daysAgo, downloadVideo } from "@/lib/utils"
import {Dot} from "lucide-react"
import React, { memo, useMemo, useState } from "react"
import { authClient } from "@/lib/authClient"
import { deleteVideo, updateVideoVisibility } from "@/lib/actions/video"
import toast from "react-hot-toast"
import { dummySession, visibilities } from "@/constants"
import {DropdownOptionsType, ModalButton, ModalStateType, VideoDetailHeaderProps, Visibility } from ".."
import { DIALOG_ICONS } from "@/constants/lists"
import { GlobalContextType, useGlobalContext } from "@/lib/hooks/useGlobalContext"

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
    modal,
    modalError,
    showModalError,
    openModal, 
    closeModal, 
    actionResponse,
    actionProcessing,
    changeActionProcessing,
    changeActionResponse,
  } = useGlobalContext()

  const [visibilityState, setVisibilityState] = useState<DropdownOptionsType>({label: visibility as Visibility});

  // const { data: session } = authClient.useSession();
  const session = dummySession;
  const user = session.user;
  const userId = session?.user?.id;

  let isOwner = false;
  if(userId){
      isOwner = userId === ownerId;
  }

  const handleDelete = async () => {
    try {
      changeActionProcessing(true);
      await deleteVideo(videoId, thumbnailUrl);
      router.push(`/profile/${userId}`)
      toast.success("video deleted successfully")
      changeActionResponse('successful');
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Error deleting video");
      changeActionResponse('failed');
    } finally {
      changeActionProcessing(false);
    }
  };

  const handleVisibilityChange = async(option: DropdownOptionsType) => {
    if(option !== visibilityState) {
        changeActionProcessing(true);
        try {
          await updateVideoVisibility(videoId, option.label as Visibility);
          setVisibilityState(option);
          toast(`Video visibility has been changed to ${option.label}`)
        } catch (error) {
          console.error("Error updating visibility:", error);
          toast("Error updating video visibility");
        }finally {
          changeActionProcessing(false);
        }
    }
  }

  const handleDownload = async () => {
    try {
      openModal(
        <DownloadModalContent 
          actionProcessing={actionProcessing} 
          actionResponse={actionResponse}
        />,
        downloadBtns
      )
      changeActionProcessing(true);
      downloadVideo(videoUrl as string);
      changeActionResponse('successful')
    } catch (error) {
      console.error(error);
      toast.error("Download failed")
      changeActionResponse('failed')
    } finally {
      changeActionProcessing(false);
    }
  }

  const redirectToProfile = () => router.push(`/profile/${ownerId}`)

  const downloadBtns = useMemo((): ModalButton[] => actionResponse === "failed" ? [
    {
      className: "btn-theme",
      action: handleDownload,
      text: 'Try again'
    },
  ] : [], [actionResponse])

  const deleteBtns = useMemo((): ModalButton[] => [
    {
      className: "btn-white",
      action: closeModal,
      text: 'Cancel'
    },
    {
      className: "btn-destructive",
      action: handleDelete,
      text: !actionProcessing ? 'Continue' : 'Deleting...'
    }
  ], [actionProcessing])

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
              onClick={() => openModal(
                <DeleteModalContent 
                  actionResponse={actionResponse}
                />, 
                deleteBtns
              )}
              disabled={actionProcessing}
            >
              Delete Video
            </button>
            <div className="bar"/>
            {actionProcessing ? (
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
      <Modal
        closeIcon={modal.closeIcon}
        closeModal={closeModal}
        error={modalError}
        setError={showModalError}
        footerButtons={modal.buttons}
        contentBody={modal.content}
      />
    </header>
  )
}

const DownloadModalContent = memo(({
  actionProcessing, 
  actionResponse 
}: Pick<GlobalContextType, 'actionProcessing' | 'actionResponse'>): React.ReactNode | null=> {
  let node: React.ReactNode | null = null;

  if(actionProcessing) {
    node = (
      <DialogContentBody
        icon = {DIALOG_ICONS.loader}
        subNode = "Downloading video.."
      />
    )
  } else if (actionResponse === "successful") {
    node = (
      <DialogContentBody
        icon = {DIALOG_ICONS.checked} 
        subNode = "Video successfully downloaded"
      />
    )
  } else if (actionResponse === "failed") {
    node = <FailedActionDialog customMessage="Failed to download video"/>
  } else node = null
  return node;
})

const DeleteModalContent = memo(({actionResponse}: Pick<GlobalContextType, 'actionResponse'>) => (
  actionResponse === null ? (
    <DialogContentBody
      icon = {DIALOG_ICONS.alert}
      headerNode = 'This action cannot be undone'
      subNode = "Click continue to delete this video completely"
    />
  ): actionResponse === "failed" ? (
    <FailedActionDialog/>
  ): (
    <DialogContentBody
      icon = {DIALOG_ICONS.checked}
      headerNode = 'Done'
      subNode = 'Video successfully deleted'
    />
  )
))

export default VideoDetailHeader