'use client'

import Image from 'next/image'
import { ChangeEvent } from 'react'

const FileInput = ({
  id,
  label,
  type,
  accept,
  file,
  previewUrl,
  inputRef,
  onChange,
  onReset,
  handleError
}: FileInputProps & {handleError: (message:string)=> void}) => { 

  const handleFileChange =(e: ChangeEvent<HTMLInputElement>)=> {
    try {
      onChange(e);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : error;
      handleError(errorMessage as string)
      console.log(error);
    }
  }

  return (
    <section className='file-input'>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type='file'
        ref={inputRef}
        accept={accept}
        onChange={handleFileChange}
        onReset={onReset}
        hidden
      />

      {!previewUrl ? (
        <figure onClick={()=> inputRef.current?.click()}>
          <Image src="/assets/icons/upload.svg" alt="upload" width={24} height={24}/>
          <p>Click to upload your {label}</p>
        </figure>
      ):(
        <div className="">
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

export default FileInput