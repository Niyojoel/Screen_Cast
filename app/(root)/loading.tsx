
import React from 'react'

const Loading = () => {
  return (
    <div>loading page...</div>
  )
}

export const VideoCardLoading = () => {
    return (
        <div className='flex flex-col rounded-2xl min-w-[200px] w-full border border-gray-20 aspect-[16/9]'>
            <div className='thumbnail w-70'/>
            <article className='flex flex-col gap-3 px-3.5 pt-4 pb-3 rounded-b-2xl;'>
                <figure className='w-full h-full rounded-18 bg-gray-100'/>
                <figure className='w-full h-full rounded-18 bg-gray-100'/>
            </article>
        </div>
    )
}

export const VideosLoading = () => {
    return (
        <div className='video-center'>
            <section className='video-grid'>
              {Array.from({length : 12}).map((_, index) => (
                <VideoCardLoading key={index}/>))
              }
            </section>
        </div>
    )
}

export const SharedHeaderLoading = () => {
    return (
        <header className='header'>
        <section className='header-container'>
            <div className='details'>
                <figure className='w-16 h-16 bg-gray-100 rounded-full'/>
                <article>
                    <div className='bg-[#666] w-10'/>
                    <div className='bg-[#666] w-10'/>
                </article>
            </div>
            <aside>
                <div className='bg-[#666] w-16'/>
                <div className='bg-[#666] w-16'/>
            </aside>
        </section>
        <section className='search-filter'>
            <div className='bg-[#666] w-24'/>
            <div className='bg-[#666] w-16'/>
        </section>
    </header>
    )
}

export default Loading