"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"


const ActionButton = ({
  image, 
  alt,
  children, 
  size, 
  action,
  href,
  noImgClass = false,
  className="",
  imgClassName="" 
}: ActionButtonProps) => {
  const router = useRouter()
  
  if(href) {
    <Link href={href}>
        {image && (
        <BtnImg
            image={image} 
            alt={alt} 
            size={size} 
            noClass={noImgClass}
            className={imgClassName}
        />
        )}
        {children && children}
    </Link>
  }

  return (
        <button 
          className={`cursor-pointer ${className}`} 
          onClick={action}
        >
            {image && (
            <BtnImg
              image={image} 
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


export const BtnImg = ({
  image, 
  alt, 
  size = 16, 
  className,
  noClass = false
}: BtnImgProps) => (
    
  <Image
    src={image}
    alt={alt} 
    width={size} 
    height={size} 
    className={!noClass ? `rounded-full ${className}` : ""}
  />
)
