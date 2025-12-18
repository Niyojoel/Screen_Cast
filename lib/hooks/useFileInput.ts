'use client'
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { base64ToFile, getVideoDuration } from "../utils";

export const useFileInput = (maxSize: number) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewBoxRef = useRef<HTMLDivElement>(null);

  //for only thumbnail input functionality
  const [previousThumbnails, setPreviousThumbnails] = useState<PreviousThumbnailsType[]>([])

  const handleGenerateThumbnail = (captureTime: number = 2, videoFile: File): void => {

    const video = document.createElement('video');
    if(!(videoFile instanceof File)) {
      throw new Error('The video file is invalid')
    }
    video.src = URL.createObjectURL(videoFile!);
    video.crossOrigin ="anonymous";

    video.onloadeddata = () => {
      video.currentTime = Math.min(captureTime, video.duration);
    }

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');

      if(!ctx) throw new Error ('Could not get canvas context');
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(blob => {
        if(blob) {
          const imageUrl = URL.createObjectURL(blob);
          const imageName = imageUrl.split('/')[0];
          const imageFile = new File([blob], imageName, {type: blob.type});

          fileChange(imageFile);

          URL.revokeObjectURL(video.src);
        }else {
          throw new Error('Failed to create blob')
        }
      }, 'image/jpg', 0.9);
    };

    video.onerror = () => {
      throw new Error('failed to load video');
    }
  }
  
  const handleUsePreviousThumbnail = (filename: string): void => {
    const selectedThumbnail = previousThumbnails?.find(tn => tn.fileName === filename)
    
    const handleFile = async () => {
      const file = await base64ToFile(selectedThumbnail!)
      fileChange(file);
    };
    handleFile();
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]){
      fileChange(e.target.files[0]);
    }
  };

  const handleFileDrop = (e: DragEvent<HTMLElement>) => {
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
    if(selectedFile.type.startsWith("image/")) {
      const thumbnailExists = !!(previousThumbnails.find(({fileName})=> fileName === selectedFile.name));

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result;

        if(!thumbnailExists) {
          setPreviousThumbnails(prev =>([{
            base64: base64 as string | ArrayBuffer, 
            fileName: selectedFile.name, 
            fileType: selectedFile.type
          }, ...prev]))
        }
      }
      reader.readAsDataURL(selectedFile);
    };
   
    // Extract duration for video files
    if (selectedFile.type.startsWith('video/')) {
      (async function () {
        const videoDuration = await getVideoDuration(objectUrl);
        setDuration(videoDuration);
      })();
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
      previousThumbnails.pop();
    };

    if(previousThumbnails.length > 0) {
     localStorage.setItem("recentThumbnails", JSON.stringify(previousThumbnails));
    };
    console.log(previousThumbnails);
  }, [previousThumbnails])

  useEffect(()=> {
    const parsedData = JSON.parse(localStorage.getItem("recentThumbnails")!);
    if(parsedData !== null && parsedData.length > 0) {
      setPreviousThumbnails(parsedData);
    }
  }, [])

  return { file, previousThumbnails, previewUrl, duration, inputRef, previewBoxRef, handleFileChange, handleFileDrop, handleUsePreviousThumbnail, handleGenerateThumbnail, resetFile };
};
