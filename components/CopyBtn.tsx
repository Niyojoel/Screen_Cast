"use client"

import Image from 'next/image'
import React, {useState, MouseEvent, SyntheticEvent, memo } from 'react'
import ActionButton, { Img } from './ActionButton';
import { cn } from '@/lib/utils';
import { CopyBtnProps } from '..';

const CopyBtn = memo(({id, size = 18, className}: CopyBtnProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: MouseEvent | SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if(typeof window !== undefined || null) {
      navigator.clipboard.writeText(`${window.location.origin}/videos/${id}`);
      
      setCopied(true);
    }

    const copiedTimeOut = setTimeout(()=>setCopied(false), 2000)
    return ()=> clearTimeout(copiedTimeOut);
  }
   
  return (
    <button 
      className={cn("round-btn", className)} 
      disabled={copied} 
      onClick={handleCopy}
    >
      <Img 
        src={`/assets/icons/${!copied ? 'link.svg' : 'checkmark.svg'}`} 
        alt="copy" 
        size={size}
      />
    </button>
  )
});

export default CopyBtn;