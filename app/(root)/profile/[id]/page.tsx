import {Header, VideoCard} from '@/components';
import { dummyVideoCardProps } from '@/constants';
import React from 'react'

const page = async ({params} : ParamsWithSearch) => {
    const {id} = await params;
    const user = {email: ""}
  return (
    <div className='wrapper page'>
        <Header 
          subHeader={user?.email || "forward@contacts.gmail"} 
          title='Solomon' 
          userImg="/assets/images/dummy.jpg"
        />
        <section className='video-grid'>
          {dummyVideoCardProps.map(card => (
            <VideoCard key={card.id} {...card}/>
          ))}
        </section>
    </div>
  )
}

export default page