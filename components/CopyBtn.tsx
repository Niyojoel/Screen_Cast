"use client"

import React, {
  useState, 
  MouseEvent, 
  memo, 
  useEffect
} from 'react'
import { cn } from '@/lib/utils';
import { CopyBtnProps } from '..';
import {ActionButton, Img} from './';

const CopyBtn = ({
  id, 
  size = 18, 
  className
}: CopyBtnProps) => {
  const [copied, setCopied] = useState(false);

  
  const onCopy = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    
    if(typeof window !== 'undefined' && navigator?.clipboard) {
      const videoUrl = `${window.location.origin}/videos/${id}`

      navigator.clipboard.writeText(videoUrl)
      .then(() => {setCopied(true)})
      .catch((err) => {console.error("failed to copy text: ", err)});
      ;
    }

  }
  
  useEffect(() => {
    if (!copied) return
    const copiedTimeOut = setTimeout(()=>setCopied(false), 2000)
    return ()=> clearTimeout(copiedTimeOut);
  },[copied])

  return (
    <ActionButton
      className={cn("round-btn", className)} 
      disabled={copied} 
      onClick={onCopy}
    >
      <Img 
        src={`/assets/icons/${!copied ? 'link.svg' : 'checkmark.svg'}`} 
        alt="copy" 
        size={size}
      />
    </ActionButton>
  )
};

export default memo(CopyBtn);