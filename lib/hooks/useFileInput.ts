'use client'
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";

export const useFileInput = (maxSize: number) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  //for only thumbnail input functionality
  const [previousThumbnails, setPreviousThumbnails] = useState<string[]>([])

  
  const handleUsePreviousThumbnail = (url: string): void => {
    let file: File;

    const urlToFile = async (url: string): Promise<File> => {
      const response = await fetch(url);

      if(!response.ok) throw new Error(`Failed to fetch ${response.status} ${response.statusText}`);

      const blob = await response.blob();
      const filename = url.split('/').pop();

      return new File([blob], filename!, {type: blob.type})
    }
    
    (async function() {
      file = await urlToFile(url)
    })();

    fileChange(file!);
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]){
      fileChange(e.target.files[0]);
    }
  };

  const handleFileDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files?.[0]){
      fileChange(e.dataTransfer.files[0]);
    }
  };

  const fileChange = (selectedFile: File) => {
    if (selectedFile.size > maxSize) throw new Error("Media file size exceed the size limit");

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setFile(selectedFile);

    const objectUrl = URL.createObjectURL(selectedFile);

    setPreviewUrl(objectUrl);

    //saving selected thumbnails for previous thumbnail suggestions
    if(selectedFile.type.startsWith("image/") && previewUrl !== null) {
      const thumbnailExists = !!(previousThumbnails.find(tnUrl => tnUrl === objectUrl));
      if(!thumbnailExists) setPreviousThumbnails(prev =>([...prev as string[], objectUrl]))
    };
   
    // Extract duration for video files
    if (selectedFile.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        // Only set duration if it's a valid finite number
        if (isFinite(video.duration) && video.duration > 0) {
          setDuration(Math.round(video.duration)); // Round to nearest integer
        } else {
          setDuration(null); // Set to null if invalid
          throw new Error("This media file is invalid")
        }
        URL.revokeObjectURL(video.src);
      };
      video.src = objectUrl;
    }
  }
  
  const resetFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null);
    setPreviewUrl(null);
    setDuration(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  useEffect(()=> {
    if(previousThumbnails.length > 5) {
      previousThumbnails.pop()
    }
    console.log(previousThumbnails)
    localStorage.setItem("recentThumbnails", JSON.stringify(previousThumbnails));
  }, [previousThumbnails])

  useEffect(()=> {
    setPreviousThumbnails(JSON.parse(localStorage.getItem("recentThumbnails")!));
  }, [])

  return { file, previousThumbnails, previewUrl, duration, inputRef, handleFileChange, handleFileDrop, handleUsePreviousThumbnail, resetFile };
};
