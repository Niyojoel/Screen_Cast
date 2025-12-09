"use client"

import Image from 'next/image'
import React, {useState, MouseEvent } from 'react'

const CopyBtn = ({id, size=18, className}: CopyBtnProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: MouseEvent) => {
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
      className="copy-btn" 
      disabled={copied} 
      onClick={handleCopy}
    >
      {<Image 
        src={`/assets/icons/${!copied ? 'link.svg' : 'checkmark.svg'}`} 
        alt="copy" 
        width={size} 
        height={size}
      />}
    </button>
  )
}

export default CopyBtn;