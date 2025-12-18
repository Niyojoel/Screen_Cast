'use client'

import Image from 'next/image'
import {useEffect, useState } from 'react'

//for thumbnail suggestion cards component
import {cn } from '@/lib/utils';
import { Img } from './ActionButton';


const FileInput = ({
  id,
  label,
  type,
  accept,
  file,
  previewUrl,
  inputRef,
  previewBoxRef,
  onChange,
  onFileDrop,
  onReset,
  handleError,
  previousThumbnails,
  handleUsePreviousThumbnail,
  handleGenerateThumbnail,
  canGenerateThumbnail,
  videoFile,
}: FileInputProps & {canGenerateThumbnail?: boolean, videoFile?: File | null}) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  console.log(canGenerateThumbnail);

  const handleFileChange =(fn: void)=> {
    try {
      fn;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : error;
      handleError(errorMessage as string)
      console.log(error);
    }
  }

  const endDrag = () => setIsDraggedOver(false);

  let uploadTriggerClass = previewUrl ? "no-show" : "show"

  const uploadTrigger = ({
    text, 
    className
  }: {
    text: string, 
    className?: Record<string, boolean>
  })=> (
    <figure 
      className={cn(uploadTriggerClass, {
        'bg-gray-200': isDraggedOver,
        ...className
      })} 
      onClick={()=> inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggedOver(true);
      }} 
      onDragLeave={endDrag}
      onDrop={(e) => {
        e.preventDefault();
        endDrag();
        handleFileChange(onFileDrop(e))
      }}
    >
      <Image 
        src="/assets/icons/upload.svg" 
        alt="upload" 
        width={24} 
        height={24} 
        hidden={isDraggedOver}
      />
      <p>{isDraggedOver ? "Release file..." : text}</p>

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
  )

  return (
    <section className='file-input'>
      <p>{label} 
        <span>{label === "Thumbnail" && `(You can upload, ${previousThumbnails?.length! > 0 ? "choose from previous" : ""} or generate one from video)`}
        </span>
      </p>
 
      {type === "video" 
      ? (uploadTrigger({text: `Upload or Drop a ${label} file`})
      ):(
        <article>
          <ThumbnailSuggestions
            uploadTrigger={uploadTrigger({
              text: "Upload or Drop", 
              className: {"flex-1": previousThumbnails?.length! < 1}
            })}
            uploadTriggerClass={uploadTriggerClass}
            previousThumbnails={previousThumbnails!}
            handleUsePreviousThumbnail ={handleUsePreviousThumbnail!}
          />
          <ThumbnailGenerate
            handleGenerateThumbnail={handleGenerateThumbnail!}
            uploadTriggerClass={uploadTriggerClass}
            videoFile={videoFile!}
            canGenerateThumbnail={canGenerateThumbnail!}
          />
        </article>
      )}
      <div ref={previewBoxRef} className={cn(previewUrl ? "show" : "no-show")}>
        {type === "video" ? <video src={previewUrl || undefined} controls/> : <Image src ={previewUrl || "/assets/images/dummy.jpg"} alt={type} fill/>}
        <button type='button' onClick={onReset}>
          <Img
            src="/assets/icons/close.svg" 
            alt="close" 
            size={16} 
            noClass
          />
        </button>
        <p>{file?.name}</p>
      </div>
    </section>
  )
};

const ThumbnailSuggestions = ({
  uploadTrigger, 
  previousThumbnails,
  uploadTriggerClass,
  handleUsePreviousThumbnail
}: ThumbnailSuggestionsProps) => {

  let active = previousThumbnails?.length > 0

  return (
    <section className= {
      cn("previous-thumbnails", uploadTriggerClass, {
      "gap": active
    })
    }>
      {uploadTrigger}
    <ul className={cn({
      'flex-1': active
      })}>
        {active && previousThumbnails?.map(({base64, fileName}) => (
            <div 
              key={fileName}
              onClick={()=> handleUsePreviousThumbnail(fileName)}
            >
              <Image src={base64 as string} alt="thumbnail" fill/>
            </div>
          ))
        }
      </ul>
    </section>
  )
}

const ThumbnailGenerate = ({
  handleGenerateThumbnail,
  videoFile,
  canGenerateThumbnail,
  uploadTriggerClass
}: ThumbnailGenerateProps) => {

  const [isGenerating, setIsGenerating] = useState(false);
  const [captureTime, setCaptureTime] = useState(1);

  return (
    <span className={uploadTriggerClass}>
      <pre>
        <label htmlFor="gen">Time of video capture : </label>
        <input 
          id="gen" 
          type="text" 
          hidden={false} 
          value={captureTime} 
          onChange={(e) => setCaptureTime(Number(e.target.value))}
        />
      </pre>
      <button type="button"
        disabled={!canGenerateThumbnail! || isGenerating} 
        onClick={() => {
          setIsGenerating(true);
          handleGenerateThumbnail(captureTime, videoFile)
          setIsGenerating(false);
        }} 
      >
        {isGenerating ? "Generating..." : 'Generate thumbnail'}
      </button>
    </span>
  )
}

export default FileInput

