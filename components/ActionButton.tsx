"use client"

import Image from "next/image"
import Link from "next/link"

const ActionButton = ({
  src, 
  alt,
  children, 
  size, 
  action,
  disable,
  href,
  noImgClass = false,
  className="",
  imgClassName="" 
}: ActionButtonProps) => {
  
  if(href) (
    <Link href={href}>
        {src && (
        <Img
          src={src} 
          alt={alt}
          size={size} 
          noClass={noImgClass}
          className={imgClassName}
        />
        )}
        {children && children}
    </Link>
  )

  return (
    <button 
      className={`cursor-pointer ${className}`} 
      onClick={action}
      disabled={disable}
    >
        {src && (
        <Img
          src={src} 
          alt={alt} 
          size={size} 
          className={imgClassName}
        />
        )}
        {children && children}
    </button>
  )
}

export default ActionButton


export const Img = ({
  src, 
  alt, 
  size = 16, 
  className,
  noClass = false
}: ImgProps) => (
    
  <Image
    src={src}
    alt={alt} 
    width={size} 
    height={size} 
    className={!noClass ? `rounded-full ${className}` : ""}
  />
)
