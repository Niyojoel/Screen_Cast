import { ImagesArrayType } from "@/index";
import { useEffect, useState } from "react";
import { ImageFSActionsType, useModalContext } from "../useModalContext";


const useScreenshotActions = () => {

  const {
    changeImageFSActions,
    changeImageFS,
  } = useModalContext()

  const [screenShots, setScreenShots] = useState<ImagesArrayType[]>([])
  const [index, setIndex] = useState<number | null>(null)

  const onScreenShotClick = (id: string, checkable?: string) => {

    const clickedShot = screenShots.find(shot => shot.name === id); 

    if(!clickedShot) return;

    const clickedIndex = screenShots.indexOf(clickedShot);

    setIndex(clickedIndex);
    
    let FSActions: ImageFSActionsType = {
      onClose: onImageFSClose,
      onSave: onScreenShotSave,
      onDelete: onScreenShotRemove,
      onNext: screenShots.length > 1 ? onNextImage : undefined,
      onPrevious: screenShots.length > 1 ? onPreviousImage : undefined,
      imagesEnd: false
    }
    
    if (checkable) FSActions.onChecked = onScreenShotSelect;
    
    changeImageFS(clickedShot);
    changeImageFSActions(FSActions) 
  }

  const onNextImage = () => {
    setIndex(prev => {
      if(prev! >= screenShots.length - 1) return prev;
      return ++prev!;
    })
  }

  const onPreviousImage = () => {
    setIndex(prev => {
      if(prev! <= 0) return prev;
      return --prev!;
    })
  }

  const onImageFSClose = () => {
    changeImageFS(null);
    changeImageFSActions(null);
  }

  const onScreenShotRemove = (id: string) => {
    setScreenShots(shots => {
      return shots.filter(shot => shot.name !== id)
    });
    if(screenShots.length > 0) {
      setIndex(prev => {
        if(prev! >= screenShots.length - 1) {
          return --prev!;
        }else return prev
      })
      return;
    } else setTimeout(() => onImageFSClose(), 1000);
  }
    //work-in-progress
  const onScreenShotSave = (id: string) => {
    const shotToSave = screenShots.find(shot => shot.name === id);
    
    //add selected shot into a database for screenshot collection in profile;
  }

  const onScreenShotSelect = (id: string) => {
    setScreenShots(shots => {
      return shots.map(shot => {
        if(shot.name === id) {
          shot = {...shot, selected: !shot.selected}
        }else {
          shot = {...shot, selected: false}
        };
        return shot;
      })
    })
  }

  const resetScreenShots = () => {
    setScreenShots([])
  }

  const changeScreenShots = (shots: ImagesArrayType) => {
    setScreenShots(prev => [...prev, shots])
  }

  useEffect(() => {
    const currentShot = screenShots[index!];
    changeImageFS(currentShot);

    // if(index) {
    //   if(index >= screenShots.length - 1 || index === 0)  {
    //     changeImageFSActions({ 
    //       onClose: onImageFSClose,
    //       onSave: onScreenShotSave,
    //       onDelete: onScreenShotRemove,
    //       onNext: screenShots.length > 1 ? onNextImage : undefined,
    //       onPrevious: screenShots.length > 1 ? onPreviousImage : undefined,
    //       imagesEnd: true
    //     })
    //   }
    // } 
  },[screenShots, index])
  
  return {
    screenShots,
    resetScreenShots,
    changeScreenShots,
    onScreenShotClick,
  }
}

export default useScreenshotActions