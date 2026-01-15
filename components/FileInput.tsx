'use client'

import Image from 'next/image'
import {DragEvent, memo, useCallback, useEffect, useMemo, useState } from 'react'

//for thumbnail suggestion cards component
import {cn } from '@/lib/utils';
import { Img } from './ActionButton';
import {ImagesConsole} from '.';
import { FileInputProps, ModalStateType, ThumbnailSuggestionsProps } from '..';
import {ImagePlus} from 'lucide-react';


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
  removeThumbnail,
  onOpenModal
}: FileInputProps & {onOpenModal? :() => void}) => {
  
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [fileDropError, setFileDropError] = useState('');

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
        <button type='button' onClick={onOpenModal!}>
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

