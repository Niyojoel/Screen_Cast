"use client"

import { useRouter } from "next/navigation"
import {ActionButton, CopyBtn, Img, DropdownList, Modal, DialogContentBody, FailedActionDialog} from "."
import { cn, daysAgo, downloadVideo } from "@/lib/utils"
import {Dot} from "lucide-react"
import React, { useState } from "react"
import { authClient } from "@/lib/authClient"
import { deleteVideo, updateVideoVisibility } from "@/lib/actions/video"
import toast from "react-hot-toast"
import { dummySession, visibilities } from "@/constants"
import {ActionStatusType, DropdownOptionsType, ModalStateType, VideoDetailHeaderProps, Visibility } from ".."
import { DIALOG_ICONS } from "@/constants/lists"

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

  const [isDeleting, setIsDeleting] = useState<Omit<ActionStatusType, 'before'> | null>(null);
  const [actionResponse, setActionResponse] = useState<Record<string, 'failed' | 'successful' | null>>({'updated': null, 'deleted': null});
  const [visibilityState, setVisibilityState] = useState<DropdownOptionsType>({label: visibility as Visibility});
  const [isUpdating, setIsUpdating] = useState(false);
  const [downloading, setDownloading] = useState<ActionStatusType | null>(null);
  const [modalError, setModalError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<ModalStateType>({state: false, content: null, buttons: null});

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
      setIsDeleting('ongoing');
      await deleteVideo(videoId, thumbnailUrl);
      router.push(`/profile/${userId}`)
      toast("video deleted successfully")
      setActionResponse(prev => ({...prev, deleted: 'successful'}));
    } catch (error) {
      console.error("Error deleting video:", error);
      toast("Error deleting video");
      setActionResponse('failed');
    } finally {
      setIsDeleting(false);
    }
  };

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
      setIsModalOpen({state: true, content: downloadContent(), buttons: downloadBtns})
      setDownloading(true);
      downloadVideo(videoUrl as string);
      setActionResponse('successful')
    } catch (error) {
      console.error(error);
      setModalError("Download failed")
      setActionResponse('failed')
    } finally {
      setDownloading(false);
    }
  }

  const redirectToProfile = () => router.push(`/profile/${ownerId}`)

  const downloadContent = () => (
    downloading ? (
      <DialogContentBody
        icon = {DIALOG_ICONS.loader}
        subNode = "Downloading video.."
      />
    ) : !downloading && actionResponse === "successful" ? 
    (
      <DialogContentBody
        icon = {DIALOG_ICONS.checked} 
        subNode = "Video successfully downloaded"
      />
    ) :  (
      <FailedActionDialog/>
    )
  )

  const downloadBtns = actionResponse === "failed" ? [
    {
      className: "btn-theme",
      action: handleDownload,
      text: 'Try again'
    },
  ] : null
  
  const deleteContentBody = () => (
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
        subNode = 'Video successfully deleted'
      />
    )
  )

  const deleteBtns = [
    {
      className: "btn-white",
      action: () => setIsModalOpen({state: false, content: null}),
      text: 'Cancel'
    },
    {
      className: "btn-destructive",
      action: handleDelete,
      text: !isDeleting ? 'Continue' : 'Deleting...'
    }
  ]

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
                onClick={() => setIsModalOpen({
                  state: true, 
                  content: deleteContentBody(), 
                  buttons: deleteBtns
                })}
                disabled={isDeleting}
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
        {isModalOpen.state && (
          <Modal
            closeIcon={DIALOG_ICONS.close}
            closeModal={()=> setIsModalOpen({state: false, content: null})}
            error={modalError}
            setError={setModalError}              
            contentBody={isModalOpen.content}
            footerButtons={isModalOpen.buttons}
          />
        )}
        </header>
  )
}

export default VideoDetailHeader