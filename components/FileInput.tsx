'use client'

import Image from 'next/image'
import {ChangeEvent, DragEvent, useEffect, useState } from 'react'

//for thumbnail suggestion cards component
import { base64ToUrl, cn } from '@/lib/utils';
import { ClassValue } from 'clsx';


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
  handleUsePreviousThumbnail
}: FileInputProps) => {

  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const handleFileChange =(fn: void)=> {
    try {
      fn;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : error;
      handleError(errorMessage as string)
      console.log(error);
    }
  }

  console.log(previousThumbnails);

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
      <Image src="/assets/icons/upload.svg" alt="upload" width={24} height={24} hidden={isDraggedOver}/>
      <p>{isDraggedOver ? "Release file..." : text}</p>
    </figure>
  )

  return (
    <section className='file-input'>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type='file'
        ref={inputRef}
        accept={accept}
        onChange={(e) => handleFileChange(onChange(e))}
        onReset={onReset}
        hidden
      />

      {type === "video" 
      ? (uploadTrigger({text: `Upload or Drop a ${label} file`})
      ):(
        <PreviousThumbnails
          uploadTrigger={uploadTrigger({
            text: "Upload or Drop", 
            className: {"flex-1": previousThumbnails?.length! < 1}
          })}
          uploadTriggerClass={uploadTriggerClass}
          previousThumbnails={previousThumbnails!}
          handleUsePreviousThumbnail ={handleUsePreviousThumbnail!}
        />
      )}
      <div ref={previewBoxRef} className={cn(previewUrl ? "show" : "no-show")}>
        {type === "video" ? <video src={previewUrl || undefined} controls/> : <Image src ={previewUrl || "/assets/images/dummy.jpg"} alt={type} fill/>}
        <button type='button' onClick={onReset}>
          <Image src="/assets/icons/close.svg" alt="close" width={16} height={16}/>
        </button>
        <p>{file?.name}</p>
      </div>
    </section>
  )
};

const PreviousThumbnails = ({
  uploadTrigger, 
  previousThumbnails,
  uploadTriggerClass,
  handleUsePreviousThumbnail
}: PreviousThumbnailsProps) => {

  const [thumbnailSuggestions, setThumbnailSuggestions] = useState<PreviousThumbnailsType[]>(previousThumbnails);

  useEffect(()=> {
    /*const getThumbnailsWithUrls = async () => {
      const promise = previousThumbnails?.map(async(tn) => {
        const blobUrl = await base64ToUrl(tn.base64 as string)
        return {...tn, url: blobUrl}
      });

      const thumbnailsWithUrls = await Promise.all(promise);
      const newThumbnail = thumbnailsWithUrls[thumbnailsWithUrls?.length - 1]
      setThumbnailSuggestions(prev => ([...prev, newThumbnail]));
    };
    const timer = setTimeout (()=>getThumbnailsWithUrls(),200)
    return () => clearTimeout(timer)} */
    if(previousThumbnails) {
      setThumbnailSuggestions(previousThumbnails)
    }
  },[previousThumbnails]);

  return (
    <section className= {
      cn("previous-thumbnails", uploadTriggerClass, {
      "gap": thumbnailSuggestions?.length > 0
    })
    }>
      {uploadTrigger}
    <ul className={cn({
      'flex-1': thumbnailSuggestions.length > 0
      })}>
        {thumbnailSuggestions?.length > 0 && thumbnailSuggestions?.map(({base64, fileName}) => (
            <div 
              key={fileName}
              onClick={()=> handleUsePreviousThumbnail &&handleUsePreviousThumbnail(fileName)}
            >
              <Image src={base64 as string} alt="thumbnail" fill/>
            </div>
          ))
        }
      </ul>
    </section>
  )
}

export default FileInput

