import VideoCard from './VideoCard'
import Pagination from '../Pagination'
import EmptyState from '../EmptyState'
import { SearchParams, VideoWithUserResult } from '@/index'
import { dummyVideos } from '@/constants'
import { getAllVideos } from '@/lib/actions/video'

const index = async({searchParams}: SearchParams) => {
  const {query, filter, page} = await searchParams

  const {/*videos,*/ pagination} = await getAllVideos(query, filter, Number(page) || 1)
    
  const videos: VideoWithUserResult[] = dummyVideos;
  return (
    <>
    {videos?.length > 0 ? 
        (<>
          <div className='video-center'>
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
          </div>
          {/*pagination.totalPages > 1 && (
            <Pagination 
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            queryString={query}
            filterString={filter}
          />) 
          */}
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
    </>
  )
}

export default index