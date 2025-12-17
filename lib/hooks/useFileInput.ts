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
  const [thumbnailsUrl, setThumbnailsUrl] = useState<string[]>([])
  

  const handleUsePreviousThumbnail = (filename: string): void => {
    const selectedThumbnail = previousThumbnails?.find(tn => tn.fileName === filename)
    console.log(selectedThumbnail);
    
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

    console.log(selectedFile);

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setFile(selectedFile);

    const objectUrl = URL.createObjectURL(selectedFile);

    setPreviewUrl(objectUrl);

    console.log(file, previewUrl);

    //saving selected thumbnails for previous thumbnail suggestions
    if(selectedFile.type.startsWith("image/")) {
      const thumbnailExists = !!(previousThumbnails.find(({fileName})=> fileName === selectedFile.name));

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result;

        if(!thumbnailExists) {
          setPreviousThumbnails(prev =>([...prev, {
            base64: base64 as string | ArrayBuffer, 
            fileName: selectedFile.name, 
            fileType: selectedFile.type
          }]))
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
      previousThumbnails.pop()
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

  return { file, previousThumbnails, previewUrl, duration, inputRef, previewBoxRef, handleFileChange, handleFileDrop, handleUsePreviousThumbnail, resetFile };
};
