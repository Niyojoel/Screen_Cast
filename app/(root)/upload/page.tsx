"use client"

import {
  Alert, 
  FileInput, 
  FormField,
  SubmitBtn, 
} from "@/components"
import { 
  visibilities 
} from "@/constants";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderPinwheel } from "lucide-react";
import { ModalContentType } from "@/index";
import { useModalContext } from "@/lib/hooks/useModalContext";
import { 
  useUploadActions, 
  useModalContent, 
  useGenerateActions
} from "@/lib/hooks/useUpload";

const Page = () => {
  const router = useRouter();
  
  const {
    modalOpen,
    modalContentParent,
    exit,
    modalAction,
    syncModalContent,
    redirectedContent,
    exitModalContent,
    actionError
  } = useModalContext()

  const {
    captureTime,
    generatedThumbnail,
    changeGeneratedThumbnail,
    onCaptureTimeChange,
    resetCaptureTime,
    onImageClick
  } = useGenerateActions()

  const {uploadContent} = useModalContent();

  const {
    error,
    setError,
    isSubmitting,
    formData,
    video,
    thumbnail,
    uploaderId,
    visibilityInputChange,
    onInputChange,
    onSubmit,
    onOpenModal: onOpen,
    onGoToEdit, 
  } = useUploadActions();

  //adding capture time reset to open (reset) modal call if video has been changed
  const onOpenModal = (action: "generate" | "edit", parent?: "thumbnail") => {
    if(video.fileChanged && action === 'generate') {
      onOpen(action, parent, resetCaptureTime)
      return;
    }
    onOpen(action, parent)
  }

  //setting upload modal content
  useEffect(() => {
    let content: ModalContentType | null = null;

    const redirected: boolean = (modalAction?.redirect?.state === 'after' && modalAction?.redirect?.response === 'successful')

    console.log(modalAction)
    
    if(redirected) {
      content = redirectedContent()
    } else if(exit) {
      content = exitModalContent(resetCaptureTime)
    } else if(modalOpen.type === 'upload') {
      content = uploadContent(
        modalAction, 
        modalContentParent,
        video.file as File,
        thumbnail.onFileChange,
        captureTime,
        generatedThumbnail!,
        actionError,
        changeGeneratedThumbnail,
        onCaptureTimeChange,
        onGoToEdit,
        onImageClick,
        resetCaptureTime
      )
    } 

    if(content) syncModalContent('upload', content);

  }, [modalAction, exit, modalOpen, generatedThumbnail, actionError, captureTime])

  useEffect(()=> {
    if(uploaderId) router.push(`/profile/${uploaderId}`)
  },[uploaderId])

  return (
    <main className="wrapper-md upload-page">
      <h1> Upload video</h1>
      <Alert error={error} setError={setError}/>
      <form 
        className="form"
        onSubmit={onSubmit}
      >
        <FormField
          id="title"
          label="Title"
          type="text"
          value={formData.title}
          placeholder="Enter a clear and concise video title"
          onChange={onInputChange}
        />
        <FormField
          id="tags"
          label="Tags"
          type= "text"
          value={formData.tags}
          placeholder="Add tags to video e.g webdev coding typescript"
          onChange={onInputChange}
        />
        <FormField
          id="description"
          label="Description"
          as= "textarea"
          value={formData.description}
          placeholder="Describe what the video is about"
          onChange={onInputChange}
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
          onChange={video.onFileChange}
          onReset={video.onResetFile}
          previewBoxRef={video.previewBoxRef}
          onOpenModal={onOpenModal}
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
          onChange={thumbnail.onFileChange}
          onReset={thumbnail.onResetFile}
          previewBoxRef={thumbnail.previewBoxRef}
          previousThumbnails = {thumbnail.previousThumbnails}
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
        <SubmitBtn isSubmitting={isSubmitting} btnText="Upload Video"/>
      </form>
    </main>
  )
}

export default Page