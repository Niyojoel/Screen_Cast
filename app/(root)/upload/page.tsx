"use client"

import {
  Alert, 
  DialogContentBody, 
  FileInput, 
  FormField, 
} from "@/components"
import { 
  MAX_THUMBNAIL_SIZE, 
  MAX_VIDEO_SIZE, 
  visibilities 
} from "@/constants";
import { useFileInput } from "@/lib/hooks/useUpload/useFileInput";
import {
  ChangeEvent, 
  FormEvent, 
  useEffect, 
  useCallback,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {LoaderPinwheel, X} from "lucide-react";
import { 
  getThumbnailUploadUrl, 
  getVideoUploadUrl, 
  saveVideoDetails,
} from "@/lib/actions/video";
import { base64ToFile, fileToBase64, formValues, generateThumbnail, uploadFileToBunny } from "@/lib/utils";
import {  
  ImagesArrayType,
  ModalContentType, 
  SelectOptionType, 
  UploadAction, 
  VideoFormValues
} from "@/index";
import { exitContent, successfulRedirectContent } from "@/constants/lists";
import { NoNameModalActionType, useGlobalContext } from "@/lib/hooks/useGlobalContext";
import {getActionStateContent, getModalButton} from "@/lib/modalContentUtil";
import Image from "next/image";

const page = () => {
  const router = useRouter();
  const {
    modalOpen,
    actionError,
    modalContentParent,
    changeContentParent,
    logActionError,
    openModal, 
    cancelExit,
    closeModal, 
    resetModal,
    exit,
    modalAction,
    changeAction,
    successfulAction,
    failedAction,
    beforeAction,
    ongoingAction,
    syncModalContent,
    actionTrue,
    resetAction,
    changeState
  } = useGlobalContext()

  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);

  const [formData, setFormData] = useState<VideoFormValues>({
    title: "",
    tags: "",
    description: "",
    visibility: "public"
  });

  
  const video = useFileInput(MAX_VIDEO_SIZE);
  const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE);
  
  const [captureTime, setCaptureTime] = useState(1)
  const [generatedThumbnail, setGeneratedThumbnail] = useState<ImagesArrayType | null>(null)
  const [failedText, setFailedText] = useState<string>('')
  const [fileChanged, setFileChanged] = useState(false);

  const onVideoChanged = () => {
    setFileChanged(true);
  } 

  const onErrorHandle = (action: UploadAction, error: Error) => {
    const message = error instanceof Error ? error.message : `Failed to ${action} thumbnail`;
    setFailedText(message);
    failedAction(action);
    console.error(error)
  } 

  const handleOnGenerateThumbnail = useCallback(async ()=> {
    try {
      changeState('ongoing', 'generate');
      //split the process. just generate thumbnail here and load

      if(!video.file) return;

      const imageFile = await generateThumbnail(captureTime, video.file);
      console.log(imageFile)
      const url = await fileToBase64(imageFile);

      setGeneratedThumbnail({
        url,
        name: imageFile.name,
        type: imageFile.type
      })
      
      successfulAction('generate');
    }catch(error){
      onErrorHandle('generate', error as Error)
    }
  }, [video, captureTime, fileToBase64, generateThumbnail, failedAction, successfulAction])

  //check how it works
  const onOpenModal = useCallback(() => {
    console.log('opening modal')
    if(modalOpen.type === 'upload' && modalAction.name && !fileChanged) {
      openModal();
    } else {
      openModal({type: 'upload'})
      changeContentParent('thumbnail');
      beforeAction('generate');
      if(fileChanged) setFileChanged(false);
    }
  },[beforeAction, changeContentParent, openModal, modalOpen, modalAction])

  const handleGenerateAgain = useCallback(() => {
    beforeAction('generate');
  },[beforeAction])
  
  const handleSaveThumbnail = useCallback(() => {
    try {
      //to be implemented
      //first implement db
      //create a store for saved shots
      //add image to store
      throw new Error('This feature is not yet available')
    } catch (error) {
      error instanceof Error && setFailedText(error.message);
      failedAction('save_thumbnail');
    }
  }, [])

  const handleGoToEdit = () => {
    try {
      throw new Error('This feature is not yet available')
    } catch (error) {
      error instanceof Error && setFailedText(error.message);
      failedAction('edit');
    }
    //redirect to some video editing application with video loaded in
  }

  const handleAddThumbnail = async () => {
    try {
      ongoingAction('add');
      //just passes generated thumbnail file to fileInput()
      if(!generatedThumbnail) return;
  
      const file = await base64ToFile(generatedThumbnail);

      //look out for the effect of using thumbnail
      thumbnail.handleUseGenerated(file);

      successfulAction('add');

      setTimeout(() => {
        successfulAction('generate', 'before')
      }, 2000)

    } catch (error) {
      onErrorHandle('add' , error as Error);
    }
  }

  const onCaptureTimeChange = (e: ChangeEvent<HTMLInputElement>) => {setCaptureTime(Number(e.target.value))};

  const generateContent = useCallback((
    action: NoNameModalActionType,
    captureTime: number,
    imageUrl: string,  
    failedText: string,
  ): ModalContentType | null => {
  return action ? getActionStateContent(
    action.state,
    action.response,
    {
      node: failedText,
      buttons: [
        getModalButton('Try again', handleOnGenerateThumbnail)
      ]
    },
    {
      node: 'Generating thumbnail...'
    },
    {
      node: (
        <DialogContentBody
          subNode={
            //add styles later
            imageUrl && <Image src ={imageUrl} alt= "generated_thumbnail" fill className="w-full object-contain"/>}
            className='relative'
        />
      ),
      buttons: [
        getModalButton('Generate', handleGenerateAgain, 'btn-white'),
        getModalButton('Save', handleSaveThumbnail),
        getModalButton('Upload', handleAddThumbnail)
      ]
    },
    {
      node: (
        <DialogContentBody
          headerNode = 'Generate a Thumbnail from Video'
          subNode = {
            <span className="thumbnail-generate">
              <pre>
                <label htmlFor="gen">
                  Time of video capture : 
                </label>
                <input 
                  id="gen" 
                  hidden={false} 
                  value={captureTime} 
                  onChange={onCaptureTimeChange}
                />
              </pre>
            </span>
          }
        />
      ),
      buttons: [
        getModalButton('Generate', handleOnGenerateThumbnail)
      ]
    },
  ): null
  },[getActionStateContent, getModalButton, handleOnGenerateThumbnail, handleGenerateAgain, handleSaveThumbnail, handleAddThumbnail, onCaptureTimeChange])

  const saveContent = useCallback((action: NoNameModalActionType): ModalContentType | null => {
    return action ? getActionStateContent(
      action.state,
      action.response,
      {
          node: "Failed to save thumbnail",
          buttons: [
              getModalButton('Retry', () => handleSaveThumbnail)
          ]
      },
      {
          node: "Saving thumbnail..."
      },
      {
          node: 'Thumbnail saved to your profile collection',
          buttons: [getModalButton('Ok', () => successfulAction('generate'))]
      },
    ): null
  }, [getActionStateContent, handleSaveThumbnail, getModalButton, successfulAction,])

  const addContent = useCallback((
    action: NoNameModalActionType,
    failedText: string
  ): ModalContentType | null=> {
    return action ? getActionStateContent(
      action.state,
      action.response,
      {
          node: failedText,
          buttons: [
              getModalButton('Retry', handleAddThumbnail)
          ]
      },
      {
          node: "Processing thumbnail file..."
      },
      {
          node: 'Thumbnail added to video',
          buttons: [getModalButton('Exit', closeModal)]
      },
    ): null
  }, [getActionStateContent, handleAddThumbnail, getModalButton, closeModal])

  const editContent = useCallback((
    action: NoNameModalActionType,
    failedText: string
  ): ModalContentType | null => {
    return action ? getActionStateContent(
      action.state,
      action.response,
      {
          node: failedText || "Failed to load editing features",
          buttons: [
              getModalButton('Retry', () => handleGoToEdit)
          ]
      },
      {
          node: "Accessing editing features..."
      },
      null,
    ): null
  }, [getActionStateContent, handleGoToEdit, getModalButton])

  //generic content
  const exitModalContent = useCallback((action: boolean): ModalContentType | null => exitContent(resetModal, cancelExit, action)
  ,[resetModal, cancelExit, exitContent])

  const redirectedContent = useCallback((action: boolean): ModalContentType | null => successfulRedirectContent(resetModal, action),[resetModal, successfulRedirectContent])

  //setting upload modal content
  useEffect(() => {
    let content: ModalContentType | null = null;

    const redirected: boolean = (modalAction?.redirect?.state === 'after' && modalAction?.redirect?.response === 'successful')

    console.log(modalAction)
    
    if(redirected) {
      content = redirectedContent(redirected)
    } else if(exit) {
      content = exitModalContent(exit)
    } else if(modalAction.name === 'generate' && generatedThumbnail) {
      content = generateContent(
        modalAction?.generate, 
        captureTime,
        generatedThumbnail.url as string, 
        failedText
      )
    } else if(modalAction.name === 'save_thumbnail') {
      content = saveContent(modalAction?.save_thumbnail)
    } else if(modalAction.name === 'add') {
      content = addContent(modalAction?.add, failedText)
    } else if(modalAction.name === 'edit') {
      content = editContent(modalAction?.edit, failedText)
    } 
    
    if(content) syncModalContent('upload', content);

  }, [modalAction, exit, generatedThumbnail, failedText, captureTime, modalOpen])

  //resetting failedText on action change
  useEffect(() => setFailedText(''),[modalAction.name]);

  //Getting video duration
  useEffect(()=> {
    if(video.duration !== null || 0) setVideoDuration(video.duration!)
  },[video.duration])

  useEffect(() => {
    //Stored recorded video check on upload page and filling into video file input
    const inputChange = (
      type: typeof video | typeof thumbnail,
      file: File
    ) => {
      if(type.inputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        type.inputRef.current.files = dataTransfer.files;

        const event = new Event('change', {bubbles: true});

        type.inputRef.current.dispatchEvent(event);
        type.handleFileChange({
          target: {files: dataTransfer.files}
        } as ChangeEvent<HTMLInputElement>)
      }
    }
    const checkForRecordedVideo = async()=> {
      try {  
        const storedVideo = sessionStorage.getItem('recordedVideo');

        if(!storedVideo) return;

        successfulAction('redirect')
        setTimeout(resetModal, 2000);
        
        try {
          const {url, name, type, duration} = JSON.parse(storedVideo);
          const blob = await fetch(url).then(res=> res.blob());
          const videoFile = new File([blob], name, {type, lastModified: Date.now()})
  
          inputChange(video, videoFile);

          if(duration) setVideoDuration(duration);
  
          sessionStorage.removeItem("recordedVideo");
  
          URL.revokeObjectURL(url);
        } catch {
          throw new Error('Error loading recorded video')
        }

        //check for selected screenshot intended to be used as thumbnail
        const selectedShot = sessionStorage.getItem('selectedShot');

        if(!selectedShot) return;
        
        try {
          const shot = JSON.parse(selectedShot);
          const thumbnailFile = await base64ToFile(shot);
          inputChange(thumbnail, thumbnailFile);
          sessionStorage.removeItem("selectedShot");
        } catch {
          throw new Error('Error loading selected thumbnail')
        }

      } catch (error) {
        console.error(error);
        error instanceof Error && setError(error.message)
      }
    };

    checkForRecordedVideo()
  }, [/*video, thumbnail*/])

  //storing form input values to session storage on change
  useEffect(()=> {
    const storeFormTimer = setTimeout(()=> {
      const addedFormValues = formValues({...formData});
      sessionStorage.setItem('formValues', JSON.stringify(addedFormValues));
    }, 3000)
  
    return ()=> clearTimeout(storeFormTimer);
  }, [formData])

  //syncing form data with stored form data values
  useEffect(() => {
    const storedStrings = sessionStorage.getItem('formValues');
    const storedFormValues: Record<PropertyKey, string> = storedStrings ? JSON.parse(sessionStorage.getItem('formValues')!) : null;
    
    if(storedFormValues) setFormData(prev => ({...prev, ...storedFormValues}))
  },[])

  const visibilityInputChange =(option: SelectOptionType) => {
    const value = option.value;
    const name = option.label || "visibility";
    console.log(name, value)
    setFormData(prev=> ({...prev, [name]: value}));
  }

  const handleInputChange = (e: ChangeEvent<HTMLFormElement>) => {
    const {name, value} = e.target; 
    setFormData(prev=> ({...prev, [name]: value}));
  }

  const handleSubmit = async (e: FormEvent)=> {
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

      router.push(`/profile/${userId}`)

    } catch (error) {
      console.log("Error submitting form: ", error)
    }finally {
      setIsSubmitting(false)
    };
  }

  return (
    <main className="wrapper-md upload-page">
      <h1> Upload video</h1>
      <Alert error={error} setError={setError}/>
      <form 
        className="form"
        onSubmit={handleSubmit}
      >
        <FormField
          id="title"
          label="Title"
          type="text"
          value={formData.title}
          placeholder="Enter a clear and concise video title"
          onChange={handleInputChange}
        />
        <FormField
          id="tags"
          label="Tags"
          type= "text"
          value={formData.tags}
          placeholder="Add tags to video e.g webdev coding typescript"
          onChange={handleInputChange}
        />
        <FormField
          id="description"
          label="Description"
          as= "textarea"
          value={formData.description}
          placeholder="Describe what the video is about"
          onChange={handleInputChange}
        />
        <FileInput
          id="video"
          label="Video"
          type="video"
          accept="video/*"
          file={video.file}
          fileChangeError={video.fileError}
          logError={video.logFileError}
          previewUrl={video.previewUrl}
          inputRef={video.inputRef}
          onChange={video.handleFileChange}
          onReset={video.resetFile}
          onFileDrop = {video.handleFileDrop}
          previewBoxRef={video.previewBoxRef}
          onOpenModal={onOpenModal}
          onFileChange={onVideoChanged}
        /> 
        <FileInput
          id="thumbnail"
          label="Thumbnail"
          type="image"
          accept="image/*"
          file={thumbnail.file}
          fileChangeError={thumbnail.fileError}
          logError={thumbnail.logFileError}
          previewUrl={thumbnail.previewUrl}
          inputRef={thumbnail.inputRef}
          onChange={thumbnail.handleFileChange}
          onReset={thumbnail.resetFile}
          onFileDrop = {thumbnail.handleFileDrop}
          previewBoxRef={thumbnail.previewBoxRef}
          previousThumbnails = {thumbnail.previousThumbnails}
          handleUsePreviousThumbnail = {thumbnail.handleUsePreviousThumbnail}
          removeThumbnail={thumbnail.removeThumbnail}
        />
        <FormField
          id="visibility"
          label="Visibility"
          as= "select"
          options={visibilities}
          value={formData.visibility}
          onChange={visibilityInputChange}
        />
        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? <LoaderPinwheel/> : "Upload Video"}
        </button>
      </form>
    </main>
  )
}

export default page