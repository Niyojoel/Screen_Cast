'use client'

import Image from 'next/image';
import { 
  ChevronLeft,
  ChevronRight,
  Save, 
  Trash, 
  X 
} from 'lucide-react';
import { 
  VoidActionParam, 
  ActionParam,
  useModalContext 
} from '@/lib/hooks/useModalContext';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ImagesArrayType } from '..';
import { useRouter } from 'next/navigation';

const FullView = ({children}: {children?: React.ReactElement}) => {
  const {
    imageFS: imageFS_, 
    imageFSActions,
  } = useModalContext()

  const router = useRouter()

  const [imageFS, setImageFS] = useState<ImagesArrayType | null>(imageFS_)

  const goBack = () => router.back()

  const flash = imageFSActions?.flash === true;
  const onClose = children ? goBack : imageFSActions?.onClose;
  const onSave = imageFSActions?.onSave;
  const onDelete = imageFSActions?.onDelete;
  const onChecked_ = imageFSActions?.onChecked;
  const imagesEnd = imageFSActions?.imagesEnd;
  const onNext = imageFSActions?.onNext;
  const onPrevious = imageFSActions?.onPrevious;

  const onChecked = () => {
    if(!onChecked_ || !imageFS) return;

    setImageFS(prev => ({...prev!, selected: !prev?.selected}));
    onChecked_(imageFS.name)

    const selected = !imageFS.selected;

    const message = !selected ? `${imageFS.name} deselected` : `${imageFS.name} selected as thumbnail`

    const selectedTimer = setTimeout(() => toast(message), 2000)
    return () => clearTimeout(selectedTimer);
  }

  const withToast = (action: VoidActionParam<string> | ActionParam<string, string>, message: string) => {
    if(!imageFS) return;

    const response = action(imageFS.name) 

    console.log(response)

    if (response == "Exist") {
      toast("Image previously saved")
    }
    toast(message);
  }

  useEffect(() => {
    setImageFS(imageFS_);
  },[imageFS_])

  return (
    (imageFS || children) && <main className='absolute inset-0 z-50 flex justify-center items-center'>
      <div 
        className="absolute inset-0 bg-modal-100 backdrop-blur-xs shadow-20 cursor-pointer -z-1" 
        onClick={onClose}
      />
      {imageFS ? (
      <>
        {flash && <div className='absolute inset-0 bg-white z-10 duration-150'/>}
        <div className='w-full flex flex-col items-center justify-center gap-3'>
          <Image 
            src={imageFS.url as string} 
            alt='image-full-view' 
            width={500} 
            height={200} 
            className='w-full max-w-[1200px] object-contain aspect-auto'
          />
          {(onPrevious && onNext) && <span className='flex items-center justify-center gap-5 bg-transparent'>
            {onPrevious && (
              <button 
                type='button' 
                onClick={()=> !imagesEnd && onPrevious()} 
                className={cn('text-[#757575] hover:text-[#313131]', {'text-[#757575]': imagesEnd})}
              >
                <ChevronLeft size={30} strokeWidth={1.5}/>
              </button>
            )}
            {onNext && (
              <button 
                type='button' 
                onClick={()=> !imagesEnd && onNext()}
                className={cn('text-[#757575] hover:text-[#313131]', {'text-[#757575]': imagesEnd})}
              >
                <ChevronRight size={30} strokeWidth={1.5}/>
              </button>
            )}
          </span>}
        </div>
        {imageFSActions && <span className="full_view-btns">
          {onChecked_ && (
            <button type='button' 
              className={cn('py-1')}
              onClick={onChecked}
            >
              <input 
                type='checkbox' 
                checked={imageFS.selected} 
                className='size-[15.5px] font-0'
                readOnly
              />
            </button>
          )}
          {onSave && (
            <button type='button' onClick={() => withToast(onSave, `${imageFS.name} saved to your profile collection`)}>
              <Save size={18} strokeWidth={1.2}/>
            </button>
          )}
          {onDelete && (
            <button onClick={() => withToast(onDelete, `${imageFS.name} deleted`)}>
              <Trash size={16}/>
            </button>
          )}
          {onClose && (
            <button onClick={onClose}>
              <X size={20}/>
            </button>
          )}
        </span>}
      </>) : (
        <div className='w-full h-full flex items-center justify-center'>{children}</div>
      )}
    </main>
  )
}

export default FullView