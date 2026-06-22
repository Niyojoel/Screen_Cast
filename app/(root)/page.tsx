import {SharedHeader} from '@/components'
import { SearchParams} from '@/index'
import { Suspense } from 'react'
import { VideosLoading } from './loading'
import HomeVideos from './HomeVideos'

const page = async ({searchParams}: SearchParams) => {
  return (
    <main className='wrapper page'>
      <SharedHeader subHeader="Public Library" title="All Videos"/>
      <Suspense fallback={<VideosLoading/>}>
        <HomeVideos searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

export default page