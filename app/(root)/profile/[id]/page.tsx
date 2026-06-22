import { ParamsWithSearch} from '@/index';
import React, { Suspense } from 'react'
import { SharedHeaderLoading, VideosLoading } from '../../loading';
import UserProfile from './UserProfile';
import UserVideos from './UserVideos';
import ScreenShots from './ScreenShots';
import {Tabs, FullView} from '@/components';

export type TabsType = {
  tab: string,
  render: React.ReactElement
} 

const page = async ({params, searchParams} : ParamsWithSearch) => {

  const tabs: Array<TabsType> = [
    {
      tab: "Videos",
      render: <UserVideos params={params} searchParams={searchParams}/>
    },
    {
      tab: "Screenshots",
      render: <ScreenShots/>
    }
  ]

  return (
    <div className='wrapper page'>
      <Suspense fallback={<SharedHeaderLoading/>}>
        <UserProfile params={params}/>
      </Suspense>
      <Suspense fallback={<VideosLoading/>}>
        <Tabs tabs={tabs}/>
      </Suspense>
      <FullView/>
    </div>
  )
}

export default page