"use client"

import {
  Alert, 
  DialogContentBody, 
  FailedActionDialog, 
  FileInput, 
  FormField, 
  OngoingActionDialog
} from "@/components"
import { 
  MAX_THUMBNAIL_SIZE, 
  MAX_VIDEO_SIZE, 
  visibilities 
} from "@/constants";
import { useFileInput } from "@/lib/hooks/useFileInput";
import {
  ChangeEvent, 
  FormEvent, 
  memo, 
  useCallback, 
  useEffect, 
  useMemo,
  useState
} from "react";
import { useRouter } from "next/navigation";
import {LoaderPinwheel, X} from "lucide-react";
import { 
  getThumbnailUploadUrl, 
  getVideoUploadUrl, 
  saveVideoDetails,
} from "@/lib/actions/video";
import { formValues, uploadFileToBunny } from "@/lib/utils";
import { 
  Action,
  ActionStateType,
  ModalButton, 
  ModalContentType, 
  SelectOptionType, 
  VideoFormValues
} from "@/index";
import { DIALOG_ICONS } from "@/constants/lists";
import { useGlobalContext } from "@/lib/hooks/useGlobalContext";
import {getContentByAction, getModalButton} from "@/lib/modalContentUtil";
import Image from "next/image";

const page = () => {
  const router = useRouter();
  const {
    modalOpen,
    modalError,
    modalContentParent,
    changeContentParent,
    showModalError,
    openModal, 
    closeModal, 
    modalAction,
    changeAction,
    successfulAction,
    actionTimeout,
    failedAction,
    beforeAction,
    ongoingAction,
    syncModalContent,
    actionTrue,
    actionContentWrapper,
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

  const handleOnGenerateThumbnail = useCallback(async ()=> {
    try {
      changeState('ongoing');
      //split the process. just generate thumbnail here and load
      if(video.file) await video.handleOnGenerate(captureTime, video.file)
      successfulAction();
    }catch(error){
      const message = error instanceof Error ? error.message : error;
      failedAction();
      console.error(error)
    }
  }, [video, captureTime])

  const onThumbnailModal = () => {
    if(generateContent) openModal({type: 'upload', ...generateContent})
    changeContentParent('generate');
    beforeAction('generate');
  }

  const handleGenerateAgain = useCallback(() => {
    beforeAction('generate');
  },[])
  
  const handleSaveThumbnail = useCallback(() => {
    //to be implemented
  }, [])

  const handleGoToEdit = () => {
    //redirect to some video editing application with video loaded in
  }

  const handleAddThumbnail = () => {
    //just passes generated thumbnail file to fileInput()
    actionTimeout(successfulAction('generate', 'before'), 2000)
  }

  const generateContent = useMemo((): ModalContentType | null => {
  return actionContentWrapper(
    'generate',
    {
      node: 'Failed to generate thumbnail',
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
            <div className="w-full">
              <Image src ={"/assets/images/dummy.jpg"} alt= "generated_thumbnail" fill/>
            </div>}
        />
      ),
      buttons: [
        getModalButton('Generate Again', handleGenerateAgain, 'btn-white'),
        getModalButton('Save', handleSaveThumbnail),
        getModalButton('Add to Upload', handleAddThumbnail)
      ]
    },
    {
      node: (
        <DialogContentBody
          headerNode = 'Generate a Thumbnail from Video'
          icon = {DIALOG_ICONS.alert}
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
                  onChange={(e) => setCaptureTime(Number(e.target.value))}
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
  )
},[actionContentWrapper, getModalButton, handleOnGenerateThumbnail, handleGenerateAgain, handleSaveThumbnail, handleAddThumbnail])

const saveContent = useMemo((): ModalContentType | null => {
  return actionContentWrapper(
    'save_thumbnail',
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
  )
}, [actionContentWrapper, handleSaveThumbnail, getModalButton, successfulAction,])

const addContent = useMemo((): ModalContentType | null=> {
  return actionContentWrapper(
    'add_to_video',
    {
        node: "Thumbnail file could not be accessed",
        buttons: [
            getModalButton('Retry', () => handleAddThumbnail)
        ]
    },
    {
        node: "Processing thumbnail file..."
    },
    {
        node: 'Thumbnail added to video',
        buttons: [getModalButton('Exit', closeModal)]
    },
  )
}, [actionContentWrapper, handleAddThumbnail, getModalButton, closeModal])

const generateThumbnailContent = useMemo((): ModalContentType | null => {
  return modalContentParent === 'generate' ? getContentByAction ([
      generateContent,
      saveContent,
      addContent
    ] 
  ) as ModalContentType : null
}, [actionTrue, getContentByAction])

const editContent = useMemo((): ModalContentType | null => {
  return actionContentWrapper(
    'edit',
    {
        node: "Failed to load editing features",
        buttons: [
            getModalButton('Retry', () => handleGoToEdit)
        ]
    },
    {
        node: "Accessing editing features..."
    },
    null,
  )
}, [actionContentWrapper, handleGoToEdit, getModalButton])

const uploadContent = useMemo((): ModalContentType => {
  return getContentByAction ([
      generateThumbnailContent,
      editContent
    ]
  ) as ModalContentType;
}, [actionTrue, getContentByAction, editContent, generateThumbnailContent])

  //Getting video duration
  useEffect(()=> {
    if(video.duration !== null || 0) setVideoDuration(video.duration!)
  },[video.duration])

  useEffect(() => {
    //Stored recorded video check on upload page and filling into video file input
    const checkForRecordedVideo = async()=> {
      try {
        //close and reset modal action and content from recording on redirect if they exist
        closeModal()

        const storedVideo = sessionStorage.getItem('recordedVideo');

        if(!storedVideo) return;

        const {url, name, type, duration} = JSON.parse(storedVideo);
        const blob = await fetch(url).then(res=> res.blob());
        const file = new File([blob], name, {type, lastModified: Date.now()})

        if(video.inputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          video.inputRef.current.files = dataTransfer.files;

          const event = new Event('change', {bubbles: true});

          video.inputRef.current.dispatchEvent(event);
          video.handleFileChange({
            target: {files: dataTransfer.files}
          } as ChangeEvent<HTMLInputElement>)
        }

        if(duration) setVideoDuration(duration);

        sessionStorage.removeItem("recordedVideo");

        URL.revokeObjectURL(url);

      } catch (error) {
        console.error(error, "Error loading recorded video")
        setError("Error loading recorded video")
      }
    };
    checkForRecordedVideo()
  }, [video, closeModal])

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

  //setting upload modal content
  useEffect(() => {
    if(uploadContent) syncModalContent('upload', uploadContent)
  },[uploadContent])

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
          previewUrl={video.previewUrl}
          inputRef={video.inputRef}
          onChange={video.handleFileChange}
          onReset={video.resetFile}
          handleError={setError}
          onFileDrop = {video.handleFileDrop}
          previewBoxRef={video.previewBoxRef}
          onOpenModal={onThumbnailModal}
          handleOnGenerate={thumbnail.handleOnGenerate}
        /> 
        <FileInput
          id="thumbnail"
          label="Thumbnail"
          type="image"
          accept="image/*"
          file={thumbnail.file}
          previewUrl={thumbnail.previewUrl}
          inputRef={thumbnail.inputRef}
          onChange={thumbnail.handleFileChange}
          onReset={thumbnail.resetFile}
          handleError={setError}
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