import {VideoDetailHeader, VideoPlayer} from '@/components';
import { getVideoById } from '@/lib/actions/video';
import { redirect } from 'next/navigation';

const page = async ({params}: Params) => {
  const {videoId} = await params;

  const {user, video} = await getVideoById(videoId)

  if(!video) redirect('404');

  return (
    <main className='wrapper page'>
      <VideoDetailHeader {...video} userImg={user?.image} ownerId={user?.id!} username={user?.name}/>
      <section className='video-details'>
        <div className="video-content">
          <VideoPlayer videoId={video.videoId}/>
        </div>
      </section>
    </main>
  )
}

export default page