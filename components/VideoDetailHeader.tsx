"use client"

import { useRouter } from "next/navigation"
import {ActionButton, CopyBtn} from "."
import { daysAgo } from "@/lib/utils"
import { CircleAlert } from "lucide-react"

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

  const redirectToProfile = () => router.push(`/profile/${id}`)
  return (
    <header className='detail-header'>
        <aside className='user-info'>
            <h1>{title}</h1>
            <figure>
                <ActionButton 
                    image={userImg || "/assets/images/dummy.jpg"}
                    size={24} 
                    alt={username || "user"}
                    className="cursor-pointer"
                    action={redirectToProfile}
                >
                    <h2>{username}</h2>
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
        </aside>
        </header>
  )
}

export default VideoDetailHeader