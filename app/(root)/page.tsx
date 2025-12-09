import {EmptyState, Header, Pagination, VideoCard} from '@/components'
import { dummyVideoCardProps } from '@/constants'
import { getAllVideos } from '@/lib/actions/video'

const page = async ({searchParams}: SearchParams) => {
  const {query, filter, page} = await searchParams

  const {videos, pagination} = await getAllVideos(query, filter, Number(page) || 1)
  return (
    <main className='wrapper page'>
      <Header subHeader="Public Library" title="All Videos"/>
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
            title="No video found" 
            description="Try changing your search words"
          />
        )
      }
    </main>
  )
}

export default page