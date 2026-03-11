import { VideoSettingsType } from "@/index"
import { parseBrowserDialogOptions } from "@/lib/utils"
import { memo } from "react"
import Note from "./Note"

const BeforeRecordingBody = memo(({videoSettings}: {videoSettings: VideoSettingsType}) => {

    const falseConditionRender = () => (
        <>
            <span className='block'>
                <span>When the browser dialog picker appears, your screen setting option</span> {" "}
                <span className='font-medium'>{`(${parseBrowserDialogOptions(videoSettings.displaySurface)})`}</span> {" "}
                <span>would be preset on the tab.</span>
                {" "} Click in the box underneath to choose which screen to record. You can also enable system audio.
            </span>
            <span className='block'>
            </span>
        </>
    )

    return (
        <Note
            settings={videoSettings}
            falseConditionRender={falseConditionRender()}
            additionalFeature={null}
            featureHeaderText='Active features'
        />
    )
})

export default BeforeRecordingBody