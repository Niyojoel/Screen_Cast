'use client'
import {ImagesConsoleProps} from '..'
import { cn } from '@/lib/utils'
import { Img } from './ActionButton'
import Image from 'next/image'
import { Save, X } from 'lucide-react'

const ImagesConsole =  ({
  imagesArr,
  className,
  cardClass,
  onClick,
  onSelect,
  onRemove,
  onSave,
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
              <span className="btns">
                 <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(name)
                  }}
                >
                  <X stroke='white' size={16}/>
                </button>
                {onSave && <button type='button' onClick={(e) => {
                  e.stopPropagation();
                  onSave(name)
                }}>
                  <i>
                    <Save size={16} stroke='#212121' strokeWidth={1.2}/>
                  </i>
                </button>}
              </span>

              {onSelect && selected && (
                <input 
                  type='checkbox' 
                  onChange={(e) => onSelect(name)} 
                  checked={selected} 
                  className=''
                />
              )}
              <Image src={url as string} alt="image" fill/>
            </div>
          )})
        }
    </ul>
  )
}

export default ImagesConsole