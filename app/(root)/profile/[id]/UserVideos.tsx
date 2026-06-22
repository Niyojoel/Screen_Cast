import { ParamsWithSearch } from '@/index'
import { getAllVideosByUser } from '@/lib/actions/video'
import { Videos } from '@/components'
import { getVideos } from '@/lib/actions/getByIfOnline'


const UserVideos = async({params, searchParams}: ParamsWithSearch) => {
  const {id} = await params
  const searchParams_ = await searchParams
  
  const videos = await getVideos(() => getAllVideosByUser(id, searchParams_))

  return (
    <Videos 
      videos = {videos}
      searchParams = {{
        query: searchParams_.search, filter: searchParams_.filter
      }}
      emptyVideoMessage={{title: "No videos uploaded yet", description: "Your videos will appear here once you upload them"}}
    />
  )
}

export default UserVideos