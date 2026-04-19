import { OngoingRecordingContentProps, StreamSettingsType } from "@/index"
import { memo, useCallback } from "react"
import Note from "./Note"
import { parseOutputDisplaySetting } from "@/lib/utils"
import { ModalListItem } from "@/components"
import { 
    CircleIcon, 
    CirclePauseIcon, 
    CirclePlayIcon, 
    ImageIcon
} from "lucide-react"
import { ImagesConsole } from "@/components"

const SuccessfulStartRecordingBody = memo(({
    recordingStatus, 
    recordingTimer,
    streamSettings,
    screenShots,
    onPauseResume,
    onTakeScreenShot,
    onScreenShotClick,
}: OngoingRecordingContentProps) => {

    const ongoingRecordingNote = useCallback((streamSettings: StreamSettingsType) => (
        <Note
            settings={streamSettings}
            falseConditionRender={`You are recording on ${parseOutputDisplaySetting(streamSettings.displaySurface)} mode with:`}
            additionalFeature={streamSettings.systemAudio ? <ModalListItem text = "System audio"/> : null}
        />
    ),[parseOutputDisplaySetting]) 

    return (
        <article className='w-full flex flex-col my-2 gap-4 overflow-hidden'>
            <div className='flex flex-col items-center gap-4'>
                <div className='flex items-center w-fit gap-5 rounded-full shadow-md px-5 py-2.5'>
                    <CircleIcon 
                        size={30} 
                        stroke='white' 
                        fill={recordingStatus === "recording" ? 'red' : 'grey'} 
                        className= {recordingStatus === "recording" ? 'animate-pulse' : 'animate-none'}
                    />
                    <button 
                        type='button' 
                        onClick={(e) => onPauseResume()} 
                        className='w-fit h-fit border-none outline-none rounded-full hover:shadow-md'
                    >
                        {recordingStatus === "recording" 
                        ? <CirclePauseIcon size={30} stroke='#ff4393' strokeWidth={1.2}/>
                        : <CirclePlayIcon size={30} stroke='#ff4393' strokeWidth={1.2}/>
                        }   
                    </button>
                    <button 
                        type='button'
                        onClick={(e) => onTakeScreenShot()} 
                        className='w-fit h-fit p-1 border-none outline-none rounded-full hover:shadow-md'
                    >
                        <ImageIcon 
                            size={20} 
                            stroke='#ff4393'
                            strokeWidth={1.2}
                        />
                    </button>
                    <span>
                        {recordingTimer.hour && recordingTimer.hour !== '00'
                        ? `${recordingTimer.hour}:${recordingTimer.minutes}:${recordingTimer.seconds}` 
                        : `${recordingTimer.minutes}:${recordingTimer.seconds}`}
                    </span>
                </div>
                <p className='text-center text-pink-100 text-[16.5px] font-medium'>
                    {recordingStatus === "recording" ?
                    'Recording in progress...' : 'Recording paused'}
                </p>
            </div>

            {screenShots && screenShots.length > 0 && (
                <figure className='flex gap-2.5'>
                    {/* <span className='flex items-center justify-center'> Captures: </span> */}
                    <span className='w-full bg-[#f5f5f5] p-1.5 block overflow-x-auto scroll-smooth'>
                        <ImagesConsole
                            imagesArr={screenShots}
                            onClick ={onScreenShotClick}
                            className = 'h-16'
                            cardClass = 'w-[80px]'
                            btnsClass = 'top-1 right-1'
                            buttonSize = {14}
                        />
                    </span>
                </figure>
            )}
            {/* {ongoingRecordingNote(streamSettings)} */}
        </article>
    )
})

export default SuccessfulStartRecordingBody;