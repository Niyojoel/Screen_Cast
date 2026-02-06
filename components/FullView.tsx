'use client'
import Image from 'next/image';
import { useScreenRecording } from '@/lib/hooks/useScreenRecording';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const FullView = () => {
  const {capture, isFlashing, onCloseFullView} = useScreenRecording()

  if(!capture) return null;

  return (
    <main className='absolute w-full h-full inset-0 z-50'>
      {isFlashing && <div className='absolute inset-0 bg-white z-10 animate-pulse duration-150'/>}
      <Image src={capture.url as string} alt='image-full-view' fill/>
      <button className={cn('float-btn', 'top-5 right-5 size-10')} onClick={onCloseFullView}>
          <X size={22}/>
      </button>
    </main>
  )
}

export default FullView