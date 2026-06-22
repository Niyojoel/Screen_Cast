"use client"

import Image from "next/image"
import { ImgProps } from "..";
import { cn } from "@/lib/utils";

const Img = ({
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
);

export default Img;
