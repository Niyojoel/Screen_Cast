"use client"

import { LoaderIcon } from '@/constants/lists'
import { cn } from '@/lib/utils'
import React, {ComponentProps, MouseEvent, ReactNode, useTransition } from 'react'
import toast from 'react-hot-toast'

type ActionResponse = {error: boolean, message?: string} 

interface ActionButtonProps extends ComponentProps<"button"> {
  action?: () => Promise<ActionResponse> | Promise<void> | void,
  children: ReactNode,
  showLoading?: boolean,
}

const ActionButton = ({
  action, 
  onClick,
  children,
  showLoading=true,
  disabled,
  className,
  ...props
  }: ActionButtonProps) => {

    const [isPending, startTransition] = useTransition()

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      if(onClick) {
        onClick(event)
      }

      if(action) {
        startTransition(async () => {
          try {
            const data = await action();

            if( data ) {
              if (data.error) {
                toast(data.message ?? "Error")
              } else if (data.message) {
                toast(data.message)
              }
            }

          } catch(error) {
            console.error(error)
          }
        })
      }
    }

  return (
    <button 
      onClick={handleClick}
      disabled={disabled || isPending}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {action ? 
        (isPending ? (showLoading ? (<LoaderIcon/>) : (children))
          : (children)) : 
        (children)
      }
    </button>
  )
}

export default ActionButton