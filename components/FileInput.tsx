'use client'

import Image from 'next/image'
import {DragEvent, useState } from 'react'

//for thumbnail suggestion cards component
import { useFileInput } from '@/lib/hooks/useFileInput';
import { MAX_THUMBNAIL_SIZE} from '@/constants';
import { cn } from '@/lib/utils';

const FileInput = ({
  id,
  label,
  type,
  accept,
  file,
  previewUrl,
  inputRef,
  onChange,
  onFileDrop,
  onReset,
  handleError,
}: FileInputProps & {handleError: (message:string)=> void, onFileDrop: (e: DragEvent<HTMLElement>)=> void}) => { 
   const {handleUsePreviousThumbnail,previousThumbnails} = useFileInput(MAX_THUMBNAIL_SIZE);

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

  const UploadTrigger = ({text}: {text: string})=> (
    <figure onClick={()=> inputRef.current?.click()} onDragOver={() => setIsDraggedOver(true)} onDrop={(e) => handleFileChange(onFileDrop(e))}>
      <Image src="/assets/icons/upload.svg" alt="upload" width={24} height={24} hidden={isDraggedOver}/>
      <p className={cn({'bg-gray-300': isDraggedOver})}>{}{isDraggedOver ? "Release file..." : text}</p>
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

      {!previewUrl ? type === "video" ? (
        <UploadTrigger text={`Upload or Drop a ${label} file`}/>
      ):(
        <section className="thumbnail-examples">
          <ul>
            <UploadTrigger text={"Upload or Drop"}/>
            {previousThumbnails.length > 0 && previousThumbnails?.map(tnUrl => (
              <div key= {tnUrl} onClick={()=> handleUsePreviousThumbnail(tnUrl)}>
                <Image src={tnUrl}alt="thumbnail" fill/>
              </div>
            ))}
          </ul>
        </section>
      ):(
        <div>
          {type === "video" ? <video src={previewUrl} controls/> : <Image src={previewUrl} alt={type} fill/>}
          <button type='button' onClick={onReset}>
            <Image src="/assets/icons/close.svg" alt="close" width={16} height={16}/>
          </button>
          <p>{file?.name}</p>
        </div>
      )}
    </section>
  )
}


const ThumbnailsSuggestionCards = ({
  onClick
}: {onClick: () => void}) => {
  const {handleUsePreviousThumbnail,previousThumbnails} = useFileInput(MAX_THUMBNAIL_SIZE);

  return (
    <section className="thumbnail-examples">
      <ul>
        <figure onClick={onClick}>
          <Image src="/assets/icons/upload.svg" alt="upload" width={24} height={24}/>
          <p>Upload/Drop</p>
        </figure>
        {previousThumbnails.length > 0 && previousThumbnails?.map(tnUrl => (
          <div key= {tnUrl} onClick={()=> handleUsePreviousThumbnail(tnUrl)}>
            <Image src={tnUrl}alt="thumbnail" fill/>
          </div>
        ))}
      </ul>
    </section>
  )
}

export default FileInput