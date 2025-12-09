"use client"

import {FileInput, FormField} from "@/components"
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
  useEffect, 
  useState
} from "react";
import {LoaderPinwheel} from "lucide-react";
import { 
  getThumbnailUploadUrl, 
  getVideoUploadUrl, 
  saveVideoDetails 
} from "@/lib/actions/video";
import { uploadFileToBunny } from "@/lib/helper/uploadToBunny";
import { useRouter } from "next/navigation";

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

  const video = useFileInput(MAX_VIDEO_SIZE);
  const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE);

  useEffect(()=> {
    if(video.duration !== null || 0) setVideoDuration(video.duration!)
  },[video.duration])

  useEffect(() => {
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
    }
    checkForRecordedVideo()
  }, [video])

  const handleInputChange = (e: ChangeEvent<HTMLFormElement>) => {
    const {name, value} = e.target; 
    setFormData(prev=> ({...prev, [name]: value}))
  }

  //catch and alert error in handleFileChange function
  const handleFileChangeError = (message: string)=> {
    setError(message)
  }

  const handleSubmit = async (e: FormEvent)=> {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if(!video.file || !thumbnail.file) setError('Please upload a video and thumbnail');
      if(!formData.title || !formData.description) setError("Please fill in all the details");
      
      //Getting video upload url
      const {
        videoId,
        uploadUrl: videoUploadUrl, 
        accessKey: videoAccessKey
      } = await getVideoUploadUrl();

      if(!videoUploadUrl || !videoAccessKey) throw new Error("Failed to get video upload credentials");

      //Upload video to bunny
      await uploadFileToBunny(video.file!, videoUploadUrl, videoAccessKey);


      
      //Getting thumbnail upload url
      const {
        uploadUrl: thumbnailUploadUrl, 
        cdnUrl: thumbnailCdnUrl,
        accessKey: thumbnailAccessKey
      } = await getThumbnailUploadUrl(videoId);
      
      if(!thumbnailUploadUrl || !thumbnailAccessKey || !thumbnailCdnUrl) throw new Error("Failed to get thumbnail upload credentials");

      console.log("got thumbnail upload url")

      //Upload thumbnail to bunny
      await uploadFileToBunny(thumbnail.file!, thumbnailUploadUrl, thumbnailAccessKey);

      console.log("up to bunny")

      //Save video details to to bunny and then db
      const {userId, videoId: id} = await saveVideoDetails({
        videoId,
        thumbnailUrl: thumbnailCdnUrl,
        ...formData,
        duration: videoDuration
      });

      console.log("saving to db")

      router.push(`/profile/${userId}`)

    } catch (error) {
      console.log("Error submitting form: ", error)
    }finally {
      setIsSubmitting(false)
    };
  }

  return (
    <main className="wrapper-md upload-page ">
      <h1>Upload a video</h1>
      {error && <div className="error-field">{error}</div>}
      <form 
        className="rounded-20 shadow-10 gap-6 w-full flex flex-col px-5 py-7.5" 
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
          label="video"
          type="video"
          accept="video/*"
          file={video.file}
          previewUrl={video.previewUrl}
          inputRef={video.inputRef}
          onChange={video.handleFileChange}
          onReset={video.resetFile}
          handleError={handleFileChangeError}
        /> 
        <FileInput
          id="thumbnail"
          label="thumbnail"
          type="image"
          accept="image/*"
          file={thumbnail.file}
          previewUrl={thumbnail.previewUrl}
          inputRef={thumbnail.inputRef}
          onChange={thumbnail.handleFileChange}
          onReset={thumbnail.resetFile}
          handleError={handleFileChangeError}
        />
        <FormField
          id="visibility"
          label="Visibility"
          as= "select"
          options={visibilities.map((v) => ({value: v, label: v.replace(v.charAt(0), v.charAt(0).toUpperCase())}))}
          value={formData.visibility}
          onChange={handleInputChange}
        />
        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? <LoaderPinwheel/> : "Upload Video"}
        </button>
      </form>
    </main>
  )
}

export default page