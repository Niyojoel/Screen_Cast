"use client"

import { useRouter } from "next/navigation"
import {
  ActionButton, 
  CopyBtn, 
  Img, 
  DropdownList
} from "."
import { 
  cn, 
  daysAgo 
} from "@/lib/utils"
import {Dot} from "lucide-react"
import { useEffect } from "react"
import { authClient } from "@/lib/authClient"
import toast from "react-hot-toast"
import { 
  dummySession, 
  visibilities 
} from "@/constants"
import { 
  ModalContentType, 
  VideoDetailHeaderProps 
} from ".."
import { useModalContext } from "@/lib/hooks/useModalContext"
import { 
  useModalContent, 
  useVideoActions 
} from "@/lib/hooks/useVideo"

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
    exit, 
    modalAction,
    syncModalContent,
    modalOpen,
    modalContentParent,
    exitModalContent,
  } = useModalContext()

  const {videoContent} = useModalContent()

  const {
    changeVisibility,
    showDeleteModal,
    onDownload,
    visibilityState,
    onVisibilityChange,
    isUpdating,
  } = useVideoActions()

  // const { data: session } = authClient.useSession();
  const session = dummySession;
  const user = session.user;
  const userId = session?.user?.id;

  let isOwner = false;
  if(userId){
    isOwner = userId === ownerId;
  }

  const redirectToProfile = () => router.push(`/profile/${ownerId}`)
  
  useEffect(()=> {
    let content: ModalContentType | null = null;
    
    if(exit) {
      content = exitModalContent(exit)
    } else if (modalOpen.type === 'video') {
      content = videoContent(
        modalAction,
        modalContentParent,
        toast,
        videoUrl as string,
        videoId,
        thumbnailUrl,
        redirectToProfile,
        onDownload
      )
    } 
    
    if(content) syncModalContent('video', content);
  }, [modalAction, exit])

  useEffect(() => {
    changeVisibility(visibility);
  },[visibility])

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
            onClick = {() => videoUrl && onDownload(videoUrl, toast)}
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
                onSelectAction = {(option) => onVisibilityChange(option, videoId, toast)}
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