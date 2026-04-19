import {  LoadBodyProps } from "@/index"
import { memo } from "react"
import { showOrHide } from "@/lib/modalContentUtil"
import { 
    FailedActionModalBody, 
    OngoingActionModalBody, 
    WarningActionModalBody,
    ModalBody
} from "@/components";
import { SuccessfulLoadBody } from "./sub-components";

const LoadBody = memo(({
    action,
    saveAction,
    onSaveRecording,
    recordedVideoUrl,
    screenShots,
    videoRef,
    changeVideoPlaying,
    onScreenShotClick, 
}: LoadBodyProps) => {
    const {state, response} = action;

    return (
        <>
            <WarningActionModalBody 
              header="About to stop recording" 
              text='Click End button' 
              className={showOrHide(state === 'before')} 
            />

            <OngoingActionModalBody 
              text='Loading recorded video...' 
              className={showOrHide(state === 'ongoing')}
            />
            <FailedActionModalBody 
              text='Sorry, recorded blob seem lost or not loading' 
              className={showOrHide(state === 'after' &&  response === 'failed')}
            />
            <ModalBody 
                subNode={
                    <SuccessfulLoadBody 
                        saveAction={saveAction}
                        onSaveRecording={onSaveRecording}
                        recordedVideoUrl={recordedVideoUrl} 
                        screenShots={screenShots}
                        videoRef={videoRef}
                        changeVideoPlaying={changeVideoPlaying}
                        onScreenShotClick={onScreenShotClick}               
                    />
                } 
                className={showOrHide(state === 'after' && response === 'successful')}
                actionPopup={false}
            />
        </>
    )
})

export default LoadBody;