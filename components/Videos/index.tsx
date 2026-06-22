import VideoCard from './VideoCard'
import Pagination from '../Pagination'
import EmptyState from '../EmptyState'
import { VideosWithPagination } from '@/index'


interface VideosParamsType {
  videos: VideosWithPagination,
  searchParams: {
    query: string | undefined,
    filter: string
  }
  emptyVideoMessage: {title: string, description: string}
}

const index = async({
  videos: videosResult, 
  searchParams: {query, filter}, 
  emptyVideoMessage
}: VideosParamsType) => {

  const {videos, count, pagination} = videosResult

  return (
    videos?.length > 0 ? 
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
        {pagination.totalPages > 1 && (
          <Pagination 
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            queryString={query}
            filterString={filter}
          />)
        }
      </>
      ) :
      (
        <EmptyState 
          icon="/assets/icons/video.svg" 
          title= {emptyVideoMessage.title}
          description={emptyVideoMessage.description}
        />
      )
  )
}

export default index