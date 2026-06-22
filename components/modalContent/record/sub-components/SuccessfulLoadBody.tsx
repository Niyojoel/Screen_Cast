import { SuccessfulLoadBodyProps } from "@/index"
import { memo, useState } from "react"
import { ImagesConsole, ModalBody } from "@/components"
import { NoNameModalActionType } from "@/lib/hooks/useModalContext"
import { Check, Download, Loader2Icon, X } from "lucide-react"
import { showOrHide } from "@/lib/modalContentUtil"
import { MODAL_ICONS } from "@/constants/lists"

const SuccessfulLoadBody = ({
    saveAction,
    onSaveRecording,
    recordedVideoUrl, 
    screenShots,
    videoRef,
    changeVideoPlaying,
    onScreenShotClick, 
}: SuccessfulLoadBodyProps) => {

    const [videoTimeSynced, setVideoTimeSynced] = useState(false)

    const syncVideoTime = (e:  React.SyntheticEvent<HTMLVideoElement>) => {
        const video = e.currentTarget;
        if(video.duration == Infinity || isNaN(video.duration)) {
            video.currentTime = 1e10;

            video.onseeked = function () {
                video.currentTime = 0;
                video.onseeked = null
            }
            setVideoTimeSynced(true)
        }
    }

    return (
        <div className='w-full overflow-hidden flex flex-col gap-2 mb-2'>
            {screenShots && screenShots.length > 0 && (
                <span className='w-full bg-[#f5f5f5] p-1.5 block overflow-x-auto scroll-smooth items-start'>
                    <ImagesConsole
                        imagesArr={screenShots}
                        onClick ={onScreenShotClick}
                        className = 'h-[55px]'
                        cardClass = 'w-[70px]'
                    />
                </span>
            )}
            <div className='w-full relative flex-1'>
                {recordedVideoUrl && (<>
                    <span className={videoTimeSynced ? `w-full show` : "no-show"}>
                        <video 
                            src={recordedVideoUrl} 
                            ref={videoRef}
                            controls 
                            onPlay={() => changeVideoPlaying(true)}
                            onEnded={() => changeVideoPlaying(false)}
                            onPause={() => changeVideoPlaying(false)}
                            onLoadedMetadata={syncVideoTime}
                            className="w-full aspect-video object-contain"
                        />
                        <button className='absolute top-2 right-2 flex items-center bg-gray-200 p-1.5 rounded-full opacity-90 hover:opacity-100 cursor-pointer' onClick={onSaveRecording}>
                            <SaveIcon action={saveAction}/>
                        </button>
                    </span>
                    <ModalBody icon = {MODAL_ICONS.loader} className={videoTimeSynced ? "no-show" : "show"}/>
                </>
                )}
            </div>
        </div>
    )
}

const SaveIcon = ({action}: {action: NoNameModalActionType}) => {
    const {state, response} = action;

    return (
        <>
            <Download 
              size={16} 
              stroke="#ff4393" 
              className={showOrHide(state === 'before')}
            />
            <Loader2Icon 
              size={16} 
              stroke="#ff4393" 
              className={showOrHide(state === 'ongoing')}
            />
            <X 
              size={16} 
              stroke="#ff4393" 
              className={showOrHide(state === 'after' &&  response === 'failed')}
            />
            <Check 
              size={16} 
              stroke="#ff4393" 
              strokeWidth={2.5} 
              className={showOrHide(state === 'after' && response === 'successful')}
            />
        </>
    )
};

export default memo(SuccessfulLoadBody);