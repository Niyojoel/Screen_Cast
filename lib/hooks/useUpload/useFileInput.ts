'use client'
import { 
  ChangeEvent, 
  useCallback, 
  useEffect, 
  useRef, 
  useState 
} from "react";
import {fileToBase64, getVideoDuration } from "../../utils";
import { ImagesArrayType } from "@/index";

export const useFileInput = (maxSize: number) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [fileError, setFileError] = useState('');
  const [fileChanged, setFileChanged] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewBoxRef = useRef<HTMLDivElement>(null);

    //for only thumbnail input functionality
  const [previousThumbnails, setPreviousThumbnails] = useState<ImagesArrayType[]>([])

  const fileChange = useCallback(async (selectedFile: File) => {
    try {
      if (selectedFile.size > maxSize) return setFileError(`${selectedFile.type.startsWith("image/") ? 'Thumbnail' : 'Video'} file size exceed the size limit`);
  
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

      setFileChanged(true);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },[file, previousThumbnails, duration, previewUrl])

  const onFileChange = useCallback(async (file_?: File, e?: ChangeEvent<HTMLInputElement>) => {
    try {
      let file = file_
      if(e) file === e.target.files?.[0];
      if(file) fileChange(file);
    } catch (error) {
      throw error;
    }
  },[fileChange]);
  
  const onResetFile = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null);
    setPreviewUrl(null);
    setDuration(null);
    if (inputRef.current) inputRef.current.value = "";
  },[previewUrl, file, duration, inputRef]);

  const logFileError = (log: string) => {
    setFileError(log)
  }

  //actions relevant to video only 
  //to track when a file is changed, so as to reset thumbnail modal
  const onFileChanged = (state: boolean) => {
    setFileChanged(state);
  } 

  //thumbnail only actions
   const removeThumbnail = (filename: string) => { 
    setPreviousThumbnails(prev => (prev.filter(thumb => thumb.name !== filename)));
  }

  //store previous thumbnail to local storage
  useEffect(()=> {
    const storePreviousThumbnails = () => {
      const thumbnailsLength = previousThumbnails.length;
      if(thumbnailsLength > 0) {
        if(thumbnailsLength > 5) previousThumbnails.pop();

        localStorage.setItem("recentThumbnails", JSON.stringify(previousThumbnails));
      };
    }

    storePreviousThumbnails()
  }, [previousThumbnails])

  useEffect(()=> {
    const syncPreviousThumbnails = () => {
      const parsedData = JSON.parse(localStorage.getItem("recentThumbnails")!);
      if(parsedData !== null && parsedData.length > 0) {
        setPreviousThumbnails(parsedData);
      }
    }

    syncPreviousThumbnails();
  }, [])

  useEffect(() => {
    const onFileError = () => {
      if(fileError) {
        const errorTimer = setTimeout(() => setFileError(''), 3000);
        return ()=> clearTimeout(errorTimer);
      }
    }

    onFileError();
  }, [fileError])

  return { 
    file, 
    previousThumbnails, 
    previewUrl, 
    duration, 
    inputRef, 
    previewBoxRef, 
    onFileChange, 
    onFileChanged, 
    onResetFile, 
    removeThumbnail, 
    fileError, 
    logFileError, 
    fileChanged
  };
};
