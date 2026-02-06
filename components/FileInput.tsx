'use client'

import Image from 'next/image'
import {DragEvent, memo, useEffect, useState } from 'react'

//for thumbnail suggestion cards component
import {cn } from '@/lib/utils';
import { Img } from './ActionButton';
import {ImagesConsole} from '.';
import { FileInputProps, ThumbnailSuggestionsProps } from '..';
import {ImagePlus} from 'lucide-react';


const FileInput = memo(({
  id,
  label,
  type,
  accept,
  file,
  fileChangeError,
  logError,
  onFileChange,
  previewUrl,
  inputRef,
  previewBoxRef,
  onChange,
  onFileDrop,
  onReset,
  previousThumbnails,
  handleUsePreviousThumbnail,
  removeThumbnail,
  onOpenModal
}: FileInputProps & {
  onFileChange?: () => void, 
  onOpenModal?: () => void, 
  fileChangeError: string,
  logError: (log: string) => void
}) => {
  
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  //File change
  const catchError = (changeFn: void)=> {
    try {
      changeFn;
    } catch (error) {
      console.log(error);
      error instanceof Error && logError(error.message);
    }
  }

  const endDrag = () => setIsDraggedOver(false);

  const onDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDraggedOver(true);
  }

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    try {
      e.preventDefault();
      endDrag();
      if(!e.dataTransfer?.files[0].type.startsWith(`${type}/`)) return logError(`Incompatible file type`);
      catchError(onFileDrop(e))
      if(onFileChange) onFileChange();
    } catch (error) {
      console.log(error);
      error instanceof Error && logError(error.message);
    }
  }

  let uploadTriggerClass = previewUrl ? "no-show" : "show";

  let changeFile = (isDraggedOver || fileChangeError);

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
        hidden={isDraggedOver || !!fileChangeError}
      />
      <p className={cn({"text-red-500 text-[14.8px]": !!fileChangeError})}>
        {isDraggedOver 
        ? "Release file..." 
        : fileChangeError 
          ? fileChangeError 
          : text
        }
      </p>

      <input
        id={id}
        type='file'
        ref={inputRef}
        accept={accept}
        onChange={(e) => catchError(onChange(e))}
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
      )}
      <div 
        ref={previewBoxRef} 
        className={cn(previewUrl ? "show" : "no-show", {'bg-gray-200': changeFile})}
        onDragOver={onDragOver} 
        onDragLeave={endDrag}
        onDrop={handleDrop}  
      >
        {type === "video" 
        ? (
          <video 
            src={previewUrl || undefined} 
            controls 
            className={cn({'opacity-0': changeFile})}
          /> 
        ): (
          <Image 
            src ={previewUrl || "/assets/images/dummy.jpg"} 
            alt={type} 
            fill 
            className={cn({'opacity-0': changeFile})}
          />
        )}
        {changeFile && <span className={cn( 'absolute top-30 left-72', {"text-red-500 text-[14.8px]": !!fileChangeError})}>
          {isDraggedOver 
          ? "Release file..." 
          : fileChangeError
            ? fileChangeError 
            : null
          }
        </span>}
        <div className="preview-btns">
          <button type='button' onClick={onReset}>
            <Img
              src="/assets/icons/close.svg" 
              alt="close" 
              size={16} 
              noClass
            />
          </button>
          {type === 'video' && <button type='button' onClick={onOpenModal!}>
            <i><ImagePlus size={16} stroke='#212121' strokeWidth={2}/></i>
          </button>}
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

  useEffect(()=> console.log(previousThumbnails),[previousThumbnails])

  return (
    <section className= {
      cn("thumbnail-select", uploadTriggerClass, {
      "gap": active
    })
    }>
      {uploadTrigger}
      <ImagesConsole
        imagesArr={previousThumbnails}
        onClick={handleUsePreviousThumbnail}
        className={{'flex-1': active, "h-30": true, "no-show": !active}}
        onRemove={removeThumbnail}
      />
    </section>
  )
}

export default FileInput

