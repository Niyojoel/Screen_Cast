import { Videos } from '@/components'
import { SearchParams } from '@/index'
import { getVideos } from '@/lib/actions/getByIfOnline'
import { getAllVideos } from '@/lib/actions/video'
import React from 'react'

const HomeVideos = async ({searchParams}: SearchParams) => {
  const searchParams_ = await searchParams
  
  const videos = await getVideos(() => getAllVideos(searchParams_))

  return (
    <Videos 
      videos = {videos}
      searchParams = {{
          query: searchParams_.search, 
          filter: searchParams_.filter
      }}
      emptyVideoMessage={{title: "No videos available", description: "You can try adjusting your search input"}}
    />
  )
}

export default HomeVideos