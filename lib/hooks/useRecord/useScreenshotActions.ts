import { ImagesArrayType } from "@/index";
import { useEffect, useState } from "react";
import { ImageFSActionsType, useModalContext } from "../useModalContext";
import { deleteShotFromLS, getLSShots, saveLSShots } from "@/lib/utils";

const useScreenshotActions = () => {

  const {
    changeImageFSActions,
    changeImageFS,
  } = useModalContext()

  const [screenShots, setScreenShots] = useState<ImagesArrayType[]>([])
  const [index, setIndex] = useState<number | null>(null)

  const populateScreenShots = (shots: Array<ImagesArrayType>) => {
    setScreenShots(shots)
  }

  const onScreenShotClick = (id: string, canSave: boolean = true, checkable?: string) => {

    console.log(screenShots)

    const clickedShot = screenShots.find(shot => shot.name === id); 

    if(!clickedShot) return;

    const clickedIndex = screenShots.indexOf(clickedShot);

    setIndex(clickedIndex);
    
    const FSActions: ImageFSActionsType = {
      onClose: onImageFSClose,
      onSave: canSave ? onScreenShotSave : undefined,
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

    deleteShotFromLS(id)

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
  const onScreenShotSave = (id: string): string => {
    const shotToSave: ImagesArrayType = screenShots.find(shot => shot.name === id)!;

    const lsSavedShots = getLSShots()

    if(lsSavedShots == null) {
      saveLSShots([shotToSave]) 
      return "Saved";
    }

    if (lsSavedShots.includes(shotToSave)) return "Exist"

    lsSavedShots.push(shotToSave)

    saveLSShots(lsSavedShots)
    return "Saved"
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
  },[screenShots, index])
  
  return {
    screenShots,
    populateScreenShots,
    resetScreenShots,
    changeScreenShots,
    onScreenShotClick,
    onImageFSClose,
  }
}

export default useScreenshotActions