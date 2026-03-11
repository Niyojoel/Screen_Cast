'use client'

import { 
  SelectOptionType, 
  VideoFormValues 
} from "@/index";
import { 
  ChangeEvent, 
  FormEvent, 
  useCallback, 
  useEffect, 
  useState 
} from "react";
import { useFileInput } from "./useFileInput";
import { 
  MAX_THUMBNAIL_SIZE, 
  MAX_VIDEO_SIZE 
} from "@/constants";
import { VoidAction, useModalContext } from "../useModalContext";
import { 
  base64ToFile, 
  fileLoad, 
  formValues, 
  uploadFileToBunny 
} from "@/lib/utils";
import { 
  getThumbnailUploadUrl, 
  getVideoUploadUrl, 
  saveVideoDetails 
} from "@/lib/actions/video";

const useUploadActions = () => {

  const {
    successfulAction,
    openModal,
    resetModal,
    logActionError,
    failedAction,
    ongoingAction
  } = useModalContext()

  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);

  const [uploaderId, setUploaderId] = useState('');

  const [formData, setFormData] = useState<VideoFormValues>({
    title: "",
    tags: "",
    description: "",
    visibility: "public"
  });

  const video = useFileInput(MAX_VIDEO_SIZE);
  const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE);

  const onOpenModal = (action: 'generate' | 'edit', parent?: 'thumbnail', resetCaptureTime?: VoidAction) => {

    if(video.fileChanged) {
      if(resetCaptureTime) resetCaptureTime()
      video.onFileChanged(false);
    }
    
    openModal({
      action,
      type: 'upload',
      parent: parent || null,
      closeIcon: null, 
      addedCondition: video.fileChanged === false
    });

    //on edit modal open
    if(action === 'edit') onGoToEdit();
  }

  const onGoToEdit = useCallback(() => {
    try {
      ongoingAction('edit');
      logActionError('This feature is not yet available');
      setTimeout(() => failedAction('edit'), 2000)
    } catch (error) {
      throw error;
    }
    //redirect to some video editing application with video loaded in
  }, [])

  const visibilityInputChange = useCallback((option: SelectOptionType) => {
    const value = option.value;
    const name = option.label || "visibility";
    console.log(name, value)
    setFormData(prev=> ({...prev, [name]: value}));
  },[])

  const onInputChange = useCallback((e: ChangeEvent<HTMLFormElement>) => {
    const {name, value} = e.target; 
    setFormData(prev=> ({...prev, [name]: value}));
  },[])

  const onSubmit = useCallback(async (e: FormEvent)=> {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if(!video.file || !thumbnail.file) {
        setError('Please upload a video and thumbnail');
      };
      if(!formData.title || !formData.description) {
        setError("Please fill in all the details");
      };
              
      //Getting video upload url
      const {
        videoId,
        uploadUrl: videoUploadUrl, 
        accessKey: videoAccessKey
      } = await getVideoUploadUrl();

      if(!videoUploadUrl || !videoAccessKey) throw new Error("Failed to get video upload credentials");

      //Upload video to bunny
      await uploadFileToBunny(video.file!, videoUploadUrl, videoAccessKey);

      let thumbnailCdnURL: string ="";

      if(thumbnail.file) {
      //Getting thumbnail upload url
      const {
        uploadUrl: thumbnailUploadUrl, 
        cdnUrl: thumbnailCdnUrl,
        accessKey: thumbnailAccessKey
      } = await getThumbnailUploadUrl(videoId);
      
      if(!thumbnailUploadUrl || !thumbnailAccessKey || !thumbnailCdnUrl) throw new Error("Failed to get thumbnail upload credentials");

      thumbnailCdnURL = thumbnailCdnUrl;

      console.log("got thumbnail upload url")

      //Upload thumbnail to bunny
      await uploadFileToBunny(thumbnail.file!, thumbnailUploadUrl, thumbnailAccessKey);

      console.log("up to bunny")
      }else {
        thumbnailCdnURL = thumbnail.previewUrl!;
      }
      
      //Save video details to to bunny and then db
      const {userId, videoId: id} = await saveVideoDetails({
        videoId,
        thumbnailUrl: thumbnailCdnURL,
        ...formData,
        duration: videoDuration
      });

      console.log("saving to db")

      sessionStorage.clear();

      // for re-routing back to user profile inside upload page
      setUploaderId(userId);
    } catch (error) {
      console.log("Error submitting form: ", error)
    }finally {
      setIsSubmitting(false)
      setUploaderId('');
    };
  },[video, thumbnail, formData])

  //getting video duration
  useEffect(()=> {
    if(video.duration && video.duration > 0) setVideoDuration(video.duration)
  },[video.duration])

  //storing form input values to session storage on change
  useEffect(()=> {
    const storeFormData = () => {
      const storeFormTimer = setTimeout(()=> {
        const addedFormValues = formValues({...formData});
        sessionStorage.setItem('formValues', JSON.stringify(addedFormValues));
      }, 3000)
    
      return ()=> clearTimeout(storeFormTimer);
    };

    storeFormData();
  }, [formData])

  //syncing form data with stored form data values
  //sync in recorded video and thumbnail from recording session 
  useEffect(() => {
    const syncStoredData = () => {
      const storedStrings = sessionStorage.getItem('formValues');

      if(!storedStrings) return;

      const storedFormValues: Record<PropertyKey, string> = JSON.parse(storedStrings);
      
      setFormData(prev => ({...prev, ...storedFormValues}))
    };

    //changed the loading process of the recorded video
    //might not work right
    const checkForRecordedVideo = async()=> {
      try {  
        const storedVideo = sessionStorage.getItem('recordedVideo');

        if(!storedVideo) return;

        successfulAction('redirect')
        setTimeout(resetModal, 2000);
        
        const {videoUrl, name, type, duration} = JSON.parse(storedVideo);
        const blob = await fetch(videoUrl).then(res=> res.blob());
        const videoFile = new File([blob], name, {type, lastModified: Date.now()})

        const videoLoad = await fileLoad(video.onFileChange, videoFile);
        
        if(!videoLoad) throw new Error('Error loading recorded video');

        if(duration) setVideoDuration(duration);

        sessionStorage.removeItem("recordedVideo");

        URL.revokeObjectURL(videoUrl);

        //check for selected screenshot intended to be used as thumbnail
        const selectedShot = sessionStorage.getItem('selectedShot');

        if(!selectedShot) return;
        
        const shot = JSON.parse(selectedShot);

        const thumbnailFile = await base64ToFile(shot);

        const thumbnailLoad = await fileLoad(thumbnail.onFileChange, thumbnailFile);

        if(!thumbnailLoad) throw new Error('Error loading selected thumbnail');

        sessionStorage.removeItem("selectedShot");
      } catch (error) {
        console.error(error);
        error instanceof Error && setError(error.message)
      }
    };

    syncStoredData();
    checkForRecordedVideo();
  },[])

  return {
    error,
    setError,
    isSubmitting,
    formData,
    video,
    thumbnail,
    uploaderId,
    onOpenModal,
    onGoToEdit, 
    visibilityInputChange,
    onInputChange,
    onSubmit,
  }
}

export default useUploadActions;