import {EmptyState, SharedHeader, Pagination, VideoCard} from '@/components';
import { dummySession, dummyVideos } from '@/constants';
import { getAllVideosByUser } from '@/lib/actions/video';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async ({params, searchParams} : ParamsWithSearch) => {
  const {id} = await params;
  const {query, filter} = await searchParams;

  const {/*user ,*/ /*videos*/} = await getAllVideosByUser(id, query, filter);

  const videos: VideoWithUserResult[] = dummyVideos;

const session = dummySession;

const {user} = session;
const {id: _id, image} = user;

  if(!user) redirect('/404');
    
  return (
    <div className='wrapper page'>
        <SharedHeader 
          subHeader={user?.email} 
          title={user?.name} 
          userImg={user?.image ?? '/assets/images/dummy.jpg'}
        />
        {videos?.length > 0 ? 
        (<>
          <section className='video-grid'>
            {videos?.map(({video, user}) => (
              <VideoCard 
                key={video?.id} 
                {...video} 
                userImg={user?.image || "/assets/images/dummy.jpg"}  
                username={user?.name || "Guest"}
              />
            ))}
          </section>
          <Pagination /*pagination={pagination}*//> 
        </>
        ) :
        (
          <EmptyState 
            icon="/assets/icons/video.svg" 
            title="No videos uploaded yet" 
            description="Your videos will appear here once you upload them"
          />
        )
      }
    </div>
  )
}

export default page