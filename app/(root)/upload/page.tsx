"use client"

import {Alert, DialogContentBody, FailedActionDialog, FileInput, FormField, Modal} from "@/components"
import { 
  MAX_THUMBNAIL_SIZE, 
  MAX_VIDEO_SIZE, 
  visibilities 
} from "@/constants";
import { useFileInput } from "@/lib/hooks/useFileInput";
import {
  ChangeEvent, 
  FormEvent, 
  FormEventHandler, 
  useCallback, 
  useEffect, 
  useMemo, 
  useRef, 
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
import { ModalButton, ModalStateType, SelectOptionType, VideoFormValues} from "@/index";
import { DIALOG_ICONS } from "@/constants/lists";

const page = () => {
  const router = useRouter();
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);

  const [formData, setFormData] = useState<VideoFormValues>({
    title: "",
    tags: "",
    description: "",
    visibility: "public"
  });

  const [openModal, setOpenModal] = useState<ModalStateType>({state: false, content: null, buttons: null});
  const [modalError, setModalError] = useState('');
  const [captureTime, setCaptureTime] = useState(1)

  const video = useFileInput(MAX_VIDEO_SIZE);
  const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE);

  const closeModal = () => setOpenModal({state: false, content: null, buttons: null})

   //Generate thumbnail features
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<'success' | 'failed' | null>(null);

  const generateContent = () => (
    !isGenerating 
    ? !generated 
      ? (
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
      ): generated === 'success' 
        ? (
          <DialogContentBody
            icon = {DIALOG_ICONS.checked}
            headerNode= "Action successful"
            subNode = "Generating thumbnail is being previewed in the thumbnail box"
          /> 
        ) : generated === 'failed' ? (
          <FailedActionDialog customMessage = "Failed to generate thumbnail"/>
        )
      : null
    : (
      <DialogContentBody
        icon = {DIALOG_ICONS.loader}
        subNode = "Generating thumbnail..."
      />
    )
  )
  
  const onGenerateThumbnail = useCallback(async ()=> {
    try {
      setIsGenerating(true);
      if(video.file) await video.handleOnGenerate(captureTime, video.file)
      setIsGenerating(false);
      setGenerated('success')
    }catch(error){
      const message = error instanceof Error ? error.message : error;
      setIsGenerating(false);
      setGenerated('failed')
      console.error(error)
    }finally{
      const generatedTimeout = setTimeout(()=>{ 
        setGenerated(null);
      }, 3000);
      clearTimeout(generatedTimeout);
    }
  }, [video, captureTime])

  const onOpenModal = () => {
  setOpenModal({
    state: true,
    content: generateContent(),
    buttons: generateBtn
    })
  }

  const retryGenerate = () => {
    setIsGenerating(false);
    setGenerated(null);
  }
  
  const saveThumbnail = useCallback(() => {
    //to be implemented
  }, [video])
  
  const generateBtn = useMemo((): ModalButton[]=> {
    let buttons: ModalButton[] = [];

    if(!isGenerating && !generated) {
      buttons = [
        {
          className: "btn-theme",
          action: onGenerateThumbnail,
          text: 'Generate'
        }
      ]   
    } else if (!isGenerating && generated === "success") {
      buttons = [
        {
          className: "btn-theme",
          action: closeModal,
          text: "Ok"
        }
      ]
    } else if (!isGenerating && generated === "failed") {
      buttons = [
        {
          className: "btn-theme",
          action: saveThumbnail,
          text: "Save To Profile"
        },
        {
          className: "btn-theme",
          action: retryGenerate,
          text: "Retry Again"
        },
      ]
    }else if (isGenerating && !setGenerated) {
      buttons = [
        {
          className: "btn-theme",
          action: () => null,
          text: 'Generate'
        }
      ]   
    }
    return buttons;
  }
  ,[
    isGenerating,
    closeModal,
    onGenerateThumbnail,
    generated
  ])


  //Getting video duration
  useEffect(()=> {
    if(video.duration !== null || 0) setVideoDuration(video.duration!)
  },[video.duration])

  useEffect(() => {
    //Stored recorded video check on upload page and filling into video file input
    const checkForRecordedVideo = async()=> {
      try {
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
  }, [video])

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
          previewUrl={video.previewUrl}
          inputRef={video.inputRef}
          onChange={video.handleFileChange}
          onReset={video.resetFile}
          handleError={setError}
          onFileDrop = {video.handleFileDrop}
          previewBoxRef={video.previewBoxRef}
          setOpenModal={setOpenModal}
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
          setOpenModal={setOpenModal}
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
      {openModal.state && (
      <Modal
        closeModal={closeModal}
        closeIcon = {<X size={18}/>}
        contentBody= {openModal.content}
        footerButtons= {openModal.buttons}
        error={modalError}
        setError={setModalError}
      />)
      }
    </main>
  )
}

export default page