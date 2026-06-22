'use client';

import { initialVideoState } from '@/constants';
import { getVideoProcessingStatus, incrementVideoViews } from '@/lib/actions/video';
import { cn, createIframeLink } from '@/lib/utils'
import { LoaderPinwheelIcon } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import { VideoPlayerProps } from '..';

const VideoPlayer = ({id, videoId, videoUrl, className}: VideoPlayerProps & {videoUrl: string}) => {

  const [state, setState] = useState(initialVideoState);
  const iFrameRef = useRef<HTMLIFrameElement>(null);

  // useEffect(()=> {
  //   const checkProcessingStatus = async () => {
  //     const status = await getVideoProcessingStatus(videoId);
  //     setState(prev => ({
  //       ...prev,
  //       isProcessing: !status.isProcessed
  //     }))

  //     return status.isProcessed
  //   }

  //   checkProcessingStatus();

  //   const intervalId = setInterval(async ()=> {
  //     const isProcessed = await checkProcessingStatus();
  //     if(isProcessed) {
  //       clearInterval(intervalId);
  //     }
  //   }, 3000);
  //   return () => {
  //     clearInterval(intervalId);
  //   }
  // }, [videoId]);

  // useEffect(()=> {
  //   if(state.isLoaded && !state.hasIncrementedView && !state.isProcessing) {
  //     const incrementView = async () => {
  //       try {
  //         await incrementVideoViews(id);
  //         setState((prev) => ({...prev, hasIncrementedView: true}));
  //       } catch (error) {
  //         console.error('Failed to increment view count', error);
  //       }
  //     }
  //     incrementView();
  //   }
  // }, [id, state.isLoaded, state.hasIncrementedView, state.isProcessing]);

  return (
    <div className={cn("video-player", className)}>
      {state.isProcessing ? (
        <div className="">
          {/* check out */}
          <LoaderPinwheelIcon/>
        </div>
      ) : (
        // <iframe 
        //   ref={iFrameRef}
        //   src={createIframeLink(videoId)}
        //   loading= "lazy"
        //   title = "Video player"
        //   style={{border: 0, zIndex: 50}}
        //   allowFullScreen
        //   allow='accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture'
        //   onLoad={() => setState((prev) => ({...prev, isLoaded: true}))}
        // />
        <video src={videoUrl} playsInline controls />
      )}
    </div>
  )
};

export default memo(VideoPlayer)