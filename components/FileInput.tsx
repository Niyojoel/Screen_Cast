'use client'

import Image from 'next/image'
import {
  ChangeEvent, 
  DragEvent, 
  memo, 
  useState 
} from 'react'

import {
  base64ToFile, 
  cn 
} from '@/lib/utils';
import { Img } from './ActionButton';
import {ImagesConsole} from '.';
import { 
  FileInputProps, 
  ThumbnailSuggestionsProps, 
  UploadTriggerProps
} from '..';
import {
  EditIcon, 
  ImagePlus, 
  ImagePlusIcon
} from 'lucide-react';


const FileInput = memo(({
  id,
  label,
  type,
  accept,
  file,
  fileChangeError,
  logError,
  previewUrl,
  inputRef,
  previewBoxRef,
  onChange,
  onReset,
  previousThumbnails,
  removeThumbnail,
  onOpenModal
}: FileInputProps) => {
  
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  //File change
  const catchChangeError = (changeFn: void)=> {
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

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if(!file) return;
    catchChangeError(onChange(file));
  }

  const onFileDrop = (e: DragEvent<HTMLElement>) => {
    try {
      e.preventDefault();
      endDrag();

      const file = e.dataTransfer?.files[0];

      if(!file) return;

      if(!file.type.startsWith(`${type}/`)) return logError(`Incompatible file type`);

      catchChangeError(onChange(file))
    } catch (error) {
      console.log(error);
      error instanceof Error && logError(error.message);
    }
  }

  let uploadTriggerClass = previewUrl ? "no-show" : "show";

  let changeFile = (isDraggedOver || fileChangeError);

  const openModal = {
    generate: () => onOpenModal && onOpenModal('generate', 'thumbnail'),
    edit: () => onOpenModal && onOpenModal('edit')
  }

  const uploadTrigger = ({text, className}: UploadTriggerProps)=> (
    <figure 
      className={cn('figure', uploadTriggerClass, {
        'bg-[#f3f3f3]': isDraggedOver,
        ...className
      })} 
      onClick={()=> inputRef.current?.click()}
      onDragOver={onDragOver} 
      onDragLeave={endDrag}
      onDrop={onFileDrop}
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
        onChange={onFileChange}
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
            onChange ={onChange}
            removeThumbnail = {removeThumbnail!}
          />
      )}
      <div 
        ref={previewBoxRef} 
        className={cn(previewUrl ? "show" : "no-show", {'bg-[#f3f3f3]': changeFile})}
        onDragOver={onDragOver} 
        onDragLeave={endDrag}
        onDrop={onFileDrop}  
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
        {changeFile && <span className={cn('absolute top-[50%] left-[50%] translate-[-50%]', {"text-red-500 text-[14.8px]": !!fileChangeError})}>
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
          {type === 'video' && (
            <>
              <button type='button' onClick={() => openModal.generate()}>
                <i><ImagePlus size={16} stroke='#212121' strokeWidth={1.5}/></i>
              </button>
              <button type='button' onClick={() => openModal.edit()}>
                <i><EditIcon size={16} stroke='#212121' strokeWidth={1.5}/></i>
              </button>
            </>
          )
        }
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
  onChange,
  removeThumbnail
}: ThumbnailSuggestionsProps) => {

  let active = previousThumbnails?.length > 0

  const onUsePreviousThumbnail = async(filename: string) => {
    const selectedThumbnail = previousThumbnails.find(tn => tn.name === filename) 

    const file = selectedThumbnail && await base64ToFile(selectedThumbnail)

    if(file) onChange(file)
  }

  return (
    <section className= {
      cn("thumbnail-select", uploadTriggerClass, {
      "gap": active
    })
    }>
      {uploadTrigger}
      <ImagesConsole
        imagesArr={previousThumbnails}
        onClick={onUsePreviousThumbnail}
        className={{'flex-1': active, "h-30": true, "no-show": !active}}
        onRemove={removeThumbnail}
      />
    </section>
  )
}

export default FileInput

