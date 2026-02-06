'use client'
import { ChangeEvent, DragEvent, useCallback, useEffect, useRef, useState } from "react";
import { base64ToFile, fileToBase64, getVideoDuration } from "../../utils";
import { ImagesArrayType } from "@/index";
import { useGlobalContext } from "../useGlobalContext";

export const useFileInput = (maxSize: number) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [fileError, setFileError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const previewBoxRef = useRef<HTMLDivElement>(null);


  //for only thumbnail input functionality
  const [previousThumbnails, setPreviousThumbnails] = useState<ImagesArrayType[]>([])


  const removeThumbnail = (filename: string) => { 
    setPreviousThumbnails(prev => (prev.filter(thumb => thumb.name !== filename)));
  }

  const fileChange = useCallback(async (selectedFile: File) => {
    try {
      if (selectedFile.size > maxSize) return setFileError("Media file size exceed the size limit");
  
      if (previewUrl) URL.revokeObjectURL(previewUrl);
  
      setFile(selectedFile);
  
      const objectUrl = URL.createObjectURL(selectedFile);
  
      setPreviewUrl(objectUrl);
  
      //saving selected thumbnails for previous thumbnail suggestions
      if(selectedFile.type.startsWith("image/")) {
        const thumbnailExists = !!(previousThumbnails.find(({name})=> name === selectedFile.name));
  
        const {name, type} = selectedFile;
  
        if(!thumbnailExists) {
          const url = await fileToBase64(selectedFile);
          setPreviousThumbnails(prev =>([{url, name, type}, ...prev]))
        }
      };
     
      // Extract duration for video files
      if (selectedFile.type.startsWith('video/')) {
        (async function () {
          const videoDuration = await getVideoDuration(objectUrl);
          setDuration(videoDuration);
        })();
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  },[file, previousThumbnails, duration, previewUrl])

  const handleUseGenerated = useCallback((file: File) => {
    try {
      fileChange(file);
    } catch (error) {
      throw error;
    }
  },[fileChange]);
  
  const handleUsePreviousThumbnail = useCallback((filename: string) => {
    try {
      const selectedThumbnail = previousThumbnails?.find(tn => tn.name === filename)
      
      const handleFile = async () => {
        const file = await base64ToFile(selectedThumbnail!)
        fileChange(file);
      };

      handleFile();
    } catch (error) {
      throw error;
    }
  },[previousThumbnails, , fileChange, base64ToFile])

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files?.[0]){
        fileChange(e.target.files[0]);
      }
    } catch (error) {
      throw error;
    }
  },[fileChange]);

  const handleFileDrop = useCallback((e: DragEvent<HTMLElement>) => {
    try {
      if (e.dataTransfer.files?.[0]){
        fileChange(e.dataTransfer.files[0]);
      }
    } catch (error) {
      console.log(error)
      throw error;
    }
  },[fileChange]);
  
  const resetFile = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null);
    setPreviewUrl(null);
    setDuration(null);
    if (inputRef.current) inputRef.current.value = "";
  },[previewUrl, file, duration, inputRef]);

  const logFileError = (log: string) => {
    setFileError(log)
  }

  useEffect(()=> {
    if(previousThumbnails.length > 5) {
      previousThumbnails.pop();
    };

    if(previousThumbnails.length > 0) {
     localStorage.setItem("recentThumbnails", JSON.stringify(previousThumbnails));
    };
  }, [previousThumbnails])

  useEffect(()=> {
    const parsedData = JSON.parse(localStorage.getItem("recentThumbnails")!);
    if(parsedData !== null && parsedData.length > 0) {
      setPreviousThumbnails(parsedData);
    }
  }, [])

  useEffect(() => {
    if(fileError) {
      const errorTimer = setTimeout(() => setFileError(''), 3000);
      return ()=> clearTimeout(errorTimer);
    }
  },[fileError])

  return { file, previousThumbnails, previewUrl, duration, inputRef, previewBoxRef, handleFileChange, handleFileDrop, handleUsePreviousThumbnail, handleUseGenerated, resetFile, removeThumbnail, fileError, logFileError};
};
