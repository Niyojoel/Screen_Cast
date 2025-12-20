"use client"

import {VideoDetailHeader, VideoInfo, VideoPlayer} from '@/components';
import { dummyVideos } from '@/constants';
import { getTranscript, getVideoById } from '@/lib/actions/video';
import { redirect } from 'next/navigation';

const page = async ({params}: Params) => {
  const {id} = await params;

  // const {user, /*video*/} = await getVideoById(id);

  const video: VideoObject = dummyVideos[0].video;
  const user = dummyVideos[0].user

  // const transcript = await getTranscript(id);

  if(!video) redirect('404');

  return (
    <main className='wrapper page'>
      <VideoDetailHeader
        id={video.id}
        title={video.title}
        createdAt={video.createdAt}
        userImg={user?.image}
        username={user?.name!}
        videoId={video.videoId}
        ownerId={video.userId}
        visibility={video.visibility}
        thumbnailUrl={video.thumbnailUrl}
      />
      <section className='video-details'>
        <div className="video-content">
          <VideoPlayer id={video.id} videoId={video.videoId}/>
        </div>
        <VideoInfo
          // transcript= {transcript}
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