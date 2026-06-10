import Image from 'next/image'
import Link from 'next/link'
import {Img, CopyBtn} from '..'
import { VideoCardProps } from '../..'

const VideoCard = ({
  id,
  title,
  thumbnailUrl,
  createdAt,
  userImg,
  username,
  views,
  visibility,
  duration,
}: VideoCardProps) => {

  return (
    <Link href={`/video/${id}`} className='video-card'>
      <Image src={thumbnailUrl} alt="thumbnail" width={290} height={160} className='thumbnail'/>
      <article className=''>
          <div className="">
            <figure>
              <Img 
                src={userImg}
                alt="avatar" 
                size={30} 
                className='aspect-square'
              />
              <figcaption>
                <h3>{username}</h3>
                <p>{visibility}</p>
              </figcaption>
            </figure>
            <aside>
              <Img 
                src="/assets/icons/eye.svg"
                alt="views" 
                size={16} 
                className='aspect-square'
              />
              <span>{views}</span>
            </aside>
          </div>
            <h2>
                {title} - {" "} {createdAt.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric'})}
            </h2>
      </article>
      <CopyBtn id={id} className="float-btn"/>
      {duration && (
        <div className="duration">
            {Math.ceil(duration/60)} {duration/60 > 1 ? "mins": "min"} 
        </div>
      )}
    </Link>
  )
}

export default VideoCard