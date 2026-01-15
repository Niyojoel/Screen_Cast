import React from 'react'
import { ImagesConsoleProps} from '..'
import { cn } from '@/lib/utils'
import { Img } from './ActionButton'
import Image from 'next/image'

const ImagesConsole =  ({
  imagesArr,
  className,
  onSelect,
  removeFn,
}: ImagesConsoleProps) => {

  let active = imagesArr?.length > 0

  return (
    active && <ul className={cn("images-console", className)}>
        {imagesArr?.map(({base64, fileName}) => (
            <div 
              key={fileName}
              onClick={()=> onSelect(fileName)}
            >
              <button 
                className={cn('round-btn', "remove-image")}
                onClick={(e) => {
                  e.stopPropagation()
                  removeFn(fileName)
                }}
              >
                <Img
                  src="/assets/icons/close.svg"
                  alt="remove"
                  size={16}
                />
              </button>
              <Image src={base64 as string} alt="image" fill/>
            </div>
          ))
        }
    </ul>
  )
}

export default ImagesConsole