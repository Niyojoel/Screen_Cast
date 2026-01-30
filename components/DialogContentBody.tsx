import React from 'react'
import { DialogBodyContentProps, DialogContentListFeatureProps } from '..'
import { cn } from '@/lib/utils'

const DialogContentBody = ({
    icon,
    headerNode, 
    subNode,
    className = "",
    actionPopup = true
}: DialogBodyContentProps) => {

  return (
    <div className={cn(`content-body ${actionPopup ? 'items-center' : "items-start"}`, className)}>
      {(headerNode && typeof headerNode === 'string') || icon ? (
        <p className={cn("flex items-center gap-2 text-center")}>
            {icon && <i className="text-pink-100">{icon}</i>}
            {headerNode && <span className="">{headerNode}</span>}
        </p>
      ): headerNode && typeof headerNode === 'object' 
        ? headerNode
        : null
      }
      {subNode && typeof subNode === "string" 
      ? (
        <p className={cn("text-center", {"text-start": !actionPopup})}>
          {subNode}
        </p>)
      : subNode && typeof subNode === 'object' 
        ? subNode 
        : null
      }
    </div>
  )
}

export const DialogContentListFeature = ({
    featureName, 
    featureStatus,
    className = ""
 }: DialogContentListFeatureProps) => (
    <li className={cn('feature', className)}>
        <span className=''>
            {featureName}
        </span>
        <span>
            {featureStatus}
        </span>
    </li>
)

export default DialogContentBody