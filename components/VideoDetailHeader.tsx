"use client"

import { useRouter } from "next/navigation"
import {ActionButton, CopyBtn, DropdownList, Img} from "."
import { daysAgo } from "@/lib/utils"
import { CircleAlert } from "lucide-react"
import { useState } from "react"
import { authClient } from "@/lib/authClient"
import { deleteVideo, updateVideoVisibility } from "@/lib/actions/video"
import toast from "react-hot-toast"
import { dummySession, visibilities } from "@/constants"

const VideoDetailHeader = ({
    id,
    title,
    createdAt,
    userImg,
    username,
    videoId,
    ownerId,
    visibility,
    thumbnailUrl
}: VideoDetailHeaderProps) => {
  const router = useRouter()

  const [isDeleting, setIsDeleting] = useState(false);
  const [visibilityState, setVisibilityState] = useState<Visibility>(visibility as Visibility);
  const [isUpdating, setIsUpdating] = useState(false);

  // const { data: session } = authClient.useSession();
  const session = dummySession;
  const userId = session?.user?.id;

  let isOwner = false;
  if(userId){
      isOwner = userId === ownerId;
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteVideo(videoId, thumbnailUrl);
      router.push(`/profile/${userId}`)
      toast("video deleted successfully")
    } catch (error) {
      console.error("Error deleting video:", error);
      toast("Error deleting video");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleVisibilityChange = async(option: string) => {
    if(option !== visibilityState) {
        setIsUpdating(true);
        try {
          await updateVideoVisibility(videoId, option as Visibility);
          setVisibilityState(option as Visibility);
          toast(`Video visibility has been changed to ${option}`)
        } catch (error) {
          console.error("Error updating visibility:", error);
          toast("Error updating video visibility");
        }finally {
          setIsUpdating(false);
        }
    }
  }

  const TriggerVisibility = (
    <div className="visibility-trigger">
      <div className="">
        <Img
          src="/assets/icons/eye.svg"
          alt="views"
          className="mt-0.5"
        />
        <p>{visibilityState}</p>
      </div>
      <Img
        src="/assets/icons/arrow-down.svg"
        alt="arrow down"
      />
    </div>
  )

  const redirectToProfile = () => router.push(`/profile/${ownerId}`)

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
                    //check circle alert
                    <span className="mt-1"><CircleAlert/></span>
                    <p>{daysAgo(createdAt)}</p>
                </figcaption>
            </figure>
        </aside>
        <aside className="cta">
            <CopyBtn id={id} size={24}/>
            {isOwner && (
                <div className="user-btn">
                    <button
                        className="delete-btn"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete Video"}
                    </button>
                    <div className="bar"/>
                    {isUpdating ? (
                        <div className="update-stats">
                            <p>Updating...</p>
                        </div>
                    ) : (
                        <DropdownList
                            options={visibilities}
                            selectedOption = {visibilityState}
                            onOptionSelect = {handleVisibilityChange}
                            triggerElement = {TriggerVisibility}
                        />
                    )}
                </div>
            )}
        </aside>
        </header>
  )
}

export default VideoDetailHeader