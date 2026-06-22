"use client"

import { EmptyState, ImagesConsole} from '@/components'
import { useScreenshotActions } from '@/lib/hooks/useRecord'
import { getLSShots} from '@/lib/utils'
import { ImageIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const ScreenShots = () => {
    const {
        screenShots: FSShots,
        populateScreenShots,
        changeScreenShots,
        onScreenShotClick,
    } = useScreenshotActions()

    const lsShots = getLSShots()

    const [screenShots, setScreenShots] = useState(lsShots)
    
    const onImageClick = (id: string) => {
        console.log("Trying to open in full view")
        onScreenShotClick(id, false)
    }

    useEffect(() => {
        populateScreenShots(getLSShots())
    },[])

    useEffect(() => {
        if(FSShots.length > 0) {
            setScreenShots(FSShots)
        }
    },[FSShots])

  return (
    (screenShots?.length > 0) ?
    (<ImagesConsole
        imagesArr={screenShots}
        className={"screenshots_grid"}
        cardClass={"w-full h-[110px]"}
        replaceClass={true}
        onClick={onImageClick}
    /> ):
    (<EmptyState
        icon_svg = {<ImageIcon size={46}/>}
        title = {'No ScreenShots'}
        description = {"Save screenshots taken during recording to see them here"}
    />)
  )
}

export default ScreenShots