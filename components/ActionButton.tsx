"use client"

import Image from "next/image"
import { memo } from "react"
import { ActionButtonProps, ImgProps } from "..";
import { cn } from "@/lib/utils";

const ActionButton = memo(({
  src, 
  alt,
  children, 
  text,
  size, 
  action,
  disable,
  noImgClass = false,
  className="",
  imgClassName="" 
}: ActionButtonProps) => {
  
  return (
    <button 
      className={cn("cursor-pointer", className)} 
      onClick={action}
      disabled={disable}
    >
        {(src && alt) && (
        <Img
          src={src} 
          alt={alt} 
          size={size} 
          className={imgClassName}
        />
        )}
        {text && text}
        {children && children}
    </button>
  )
});

export default ActionButton;


export const Img = memo(({
  src, 
  alt, 
  size = 16, 
  className,
  noClass = false
}: ImgProps) => (
    
  <Image
    src={src}
    alt={alt as string}
    width={size} 
    height={size} 
    style={{color: '#888'}}
    className={cn(!noClass ? `rounded-full` : "", className)}
  />
));
