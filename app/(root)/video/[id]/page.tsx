import {VideoDetailHeader, VideoInfo, VideoPlayer} from '@/components';
import { dummyVideo } from '@/constants';
import { Params, VideoWithUserResult } from '@/index';
import { getTranscript, getVideoById } from '@/lib/actions/video';
import { getUser, getVideo } from '@/lib/actions/getByIfOnline';
import { redirect } from 'next/navigation';

const page = async ({params}: Params) => {
  const {id} = await params;
  const user = await getUser()

  const videoWithUser = await getVideo(() => getVideoById(id)); 

  const {video, user:owner} = videoWithUser

  const transcript = await getTranscript(id) || undefined;

  if(!video) redirect('404');

  return (
    <main className='wrapper page'>
      <VideoDetailHeader
        id={video.id}
        title={video.title}
        createdAt={video.createdAt}
        userImg={owner?.image}
        username={owner?.name}
        videoId={video.videoId}
        videoUrl={video.videoUrl}
        ownerId={video.userId}
        currentUser={user}
        visibility={video.visibility}
        thumbnailUrl={video.thumbnailUrl}
      />
      <section className='video-details'>
        <div className="video-content">
          <VideoPlayer id={video.id} videoId={video.videoId} videoUrl={video.videoUrl}/>
        </div>
        <VideoInfo
          transcript= {transcript}
          title={video.title}
          createdAt={video.createdAt}
          description={video.description}
          videoId={video.id}
          videoUrl={video.videoUrl}
        />
      </section>
    </main>
  )
}

export default page