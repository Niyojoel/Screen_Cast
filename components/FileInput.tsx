'use client'

import Image from 'next/image'
import {DragEvent, memo, useCallback, useEffect, useMemo, useState } from 'react'

//for thumbnail suggestion cards component
import {cn } from '@/lib/utils';
import { Img } from './ActionButton';
import {DialogContentBody, ImagesConsole} from '.';
import { FileInputProps, ModalButton, ModalStateType, RecordingStateType, ThumbnailSuggestionsProps } from '..';
import { AlertCircleIcon, CheckCircleIcon, ImagePlus, LoaderCircle, X, XCircle } from 'lucide-react';


const FileInput = memo(({
  id,
  label,
  type,
  accept,
  file,
  previewUrl,
  inputRef,
  previewBoxRef,
  onChange,
  onFileDrop: fileDrop,
  onReset,
  handleError,
  previousThumbnails,
  handleUsePreviousThumbnail,
  handleOnGenerate,
  removeThumbnail,
  setOpenModal
}: FileInputProps & {setOpenModal :({state, content, buttons}: ModalStateType) => void}) => {
  
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [fileDropError, setFileDropError] = useState('');

  //Generate thumbnail features
  const [isGenerating, setIsGenerating] = useState<RecordingStateType>("before");
  const [generated, setGenerated] = useState<'success' | 'failed' | null>(null);
  const [captureTime, setCaptureTime] = useState("1");

  const generateContent = () => (
    isGenerating === 'before' ? (
      <DialogContentBody
        headerNode = 'Generate a Thumbnail from Video'
        icon = {<AlertCircleIcon size={20}/>}
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
                onChange={(e) => {console.log(e.target.value); setCaptureTime(e.target.value)}}
              />
            </pre>
          </span>
        }
      />
    ): isGenerating === 'ongoing' ? (
      <DialogContentBody
        icon = {<LoaderCircle size={24} className="animate-spin"/>}
        subNode = "Generating thumbnail..."
      />
    ): isGenerating === 'after' && generated === "success" ? 
    (
      <DialogContentBody
        icon = {<CheckCircleIcon size={18} fill='#ff4393' stroke="#ffffff"/>}
        headerNode= "Action successful"
        subNode = "Generating thumbnail is being previewed in the thumbnail box"
      />
    ): isGenerating === 'after' && generated === "failed" ? (
      <DialogContentBody
        icon = {<XCircle size={18} stroke="#fef2f2"/>}
        headerNode = 'Something went wrong'
        subNode = "Try again"
      />
    ) : null
  )
  
  const onGenerateThumbnail = useCallback(async ()=> {
    try {
      setIsGenerating('ongoing');
      if(handleOnGenerate && file) await handleOnGenerate(captureTime, file)
      setIsGenerating('after');
      setGenerated('success')
    }catch(error){
      const message = error instanceof Error ? error.message : error;
      setIsGenerating('after');
      setGenerated('failed')
      console.error(error)
    }finally{
      const generatedTimeout = setTimeout(()=>{ 
        setIsGenerating('before')
        setGenerated(null);
      }, 3000);
      clearTimeout(generatedTimeout);
    }
  }, [file, captureTime])

  const closeModal = () => setOpenModal({state: false, content: null, buttons: null})

  const onOpenModal = () => {
  setOpenModal({
    state: true,
    content: generateContent(),
    buttons: generateBtn
    })
  }
  
  const generateBtn = useMemo((): ModalButton[]=> isGenerating !== "after" ? [
    {
      className: "btn-theme",
      action: onGenerateThumbnail,
      text: isGenerating === "before" ? 'Generate' : 'Generating...'
    }
  ] : generated === "success" ? [
    // {
    //   className: "btn-theme",
    //   action: saveThumbnail,
    //   text: "Save To Profile"
    // },
    {
      className: "btn-theme",
      action: closeModal,
      text: "Ok"
    },
  ] : [
    {
      className: "btn-theme",
      action: () => setIsGenerating('before'),
      text: "Retry"
    },
  ]
  ,[
    isGenerating,
    closeModal,
    onGenerateThumbnail,
    generated
  ])


  //File change
  const handleFileChange = (fn: void)=> {
    try {
      fn;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : error;
      handleError(errorMessage as string)
      console.log(error);
    }
  }

  const onFileDrop = (e: DragEvent<HTMLElement>) => {
    const files = e.dataTransfer.files
    if(!files[0].type.startsWith(`${type}/`)) {
      setFileDropError(`???Error: ${type === "image" ? "An" : 'A'} ${type} file is expected...`);
      return;
    }
    fileDrop(e);
  }

  const endDrag = () => setIsDraggedOver(false);

  const onDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDraggedOver(true);
  }

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    endDrag();
    handleFileChange(onFileDrop(e))
  }

  let uploadTriggerClass = previewUrl ? "no-show" : "show"

  useEffect(() => {
    if(fileDropError) {
      const errorTimer = setTimeout(() => setFileDropError(''), 3000);
      return ()=> clearTimeout(errorTimer);
    }
  },[fileDropError])

  const uploadTrigger = ({
    text, 
    className
  }: {
    text: string, 
    className?: Record<string, boolean>
  })=> (
    <figure 
      className={cn('figure', uploadTriggerClass, {
        'bg-gray-200': isDraggedOver,
        ...className
      })} 
      onClick={()=> inputRef.current?.click()}
      onDragOver={onDragOver} 
      onDragLeave={endDrag}
      onDrop={handleDrop}
    >
      <Image 
        src="/assets/icons/upload.svg" 
        alt="upload" 
        width={22} 
        height={22} 
        hidden={isDraggedOver || !!fileDropError}
      />
      <p className={cn({"text-red-500 text-[14.8px]": !!fileDropError})}>
        {isDraggedOver 
        ? "Release file..." 
        : fileDropError 
          ? fileDropError 
          : text
        }
      </p>

      <input
        id={id}
        type='file'
        ref={inputRef}
        accept={accept}
        onChange={(e) => handleFileChange(onChange(e))}
        onReset={onReset}
        hidden
        className='absolute top-[50%] left-[50%] opacity-0'
      />
    </figure>
  );

  return (
    <section className='file-input'>
      <label>{label}
        <span>{label === "Thumbnail" && `(You can upload, ${previousThumbnails?.length! > 0 ? "choose from previous" : ""} or generate one from video)`}
        </span>
      </label>
 
      {type === "video" 
      ? (uploadTrigger({text: `Upload or Drop a ${label} file`})
      ):(
        // <article className=''>
          <ThumbnailSuggestions
            uploadTrigger={uploadTrigger({
              text: "Upload or Drop", 
              className: {"flex-1": previousThumbnails?.length! < 1}
            })}
            uploadTriggerClass={uploadTriggerClass}
            previousThumbnails={previousThumbnails!}
            handleUsePreviousThumbnail ={handleUsePreviousThumbnail!}
            removeThumbnail = {removeThumbnail!}
          />
        // </article>
      )}
      <div ref={previewBoxRef} className={cn(previewUrl ? "show" : "no-show")}>
        {type === "video" ? <video src={previewUrl || undefined} controls/> : <Image src ={previewUrl || "/assets/images/dummy.jpg"} alt={type} fill/>}
        <div className="video-btns">
        `<button type='button' onClick={onReset}>
          <Img
            src="/assets/icons/close.svg" 
            alt="close" 
            size={16} 
            noClass
          />
        </button>
        <button type='button' onClick={onOpenModal}>
          <i><ImagePlus size={16} stroke='#212121' strokeWidth={2}/></i>
        </button>
        </div>
        <p>{file?.name}</p>
      </div>
    </section>
  )
});


const ThumbnailSuggestions = ({
  uploadTrigger, 
  previousThumbnails,
  uploadTriggerClass,
  handleUsePreviousThumbnail,
  removeThumbnail
}: ThumbnailSuggestionsProps) => {

  let active = previousThumbnails?.length > 0

  return (
    <section className= {
      cn("thumbnail-select", uploadTriggerClass, {
      "gap": active
    })
    }>
      {uploadTrigger}
      <ImagesConsole
        imagesArr={previousThumbnails}
        onSelect={handleUsePreviousThumbnail}
        className={{'flex-1': active, "h-30": true, "no-show": !active}}
        removeFn={removeThumbnail}
      />
    </section>
  )
}

export default FileInput

