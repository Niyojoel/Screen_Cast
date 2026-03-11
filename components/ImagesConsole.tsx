'use client'
import {ImagesConsoleProps} from '..'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { 
  Check, 
  CircleCheckBig, 
  Save, 
  X 
} from 'lucide-react'

const ImagesConsole =  ({
  imagesArr,
  className,
  cardClass,
  btnsClass,
  buttonSize,
  onClick,
  onRemove,
}: ImagesConsoleProps) => {

  let active = imagesArr?.length > 0

  return (
    active && <ul className={cn("images-console", className)}>
        {imagesArr?.map((file, index) => {
          const {url, name} = file; 

          const selected: boolean | undefined = 'selected' in file ? file.selected: undefined;

          return (
            <div 
              key={index}
              onClick={()=> onClick(name)}
              className={cn('image-class', cardClass)}
            >
              {onRemove && <span className={cn("btns", btnsClass)}>
                  <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(name)
                  }}
                >
                  <X stroke='white' size={buttonSize || 16}/>
                </button>
              </span>}
              {selected && <CircleCheckBig size={18} stroke='white' fill='#ff4393' strokeWidth={3} className='absolute top-1 right-1 z-[5] shadow-md'/>}
              <Image src={url as string} alt="image" fill/>
            </div>
          )})
        }
    </ul>
  )
}

export default ImagesConsole