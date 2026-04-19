import { NoteProps } from "@/index"
import { memo } from "react"
import { ModalListItem } from "@/components"

const Note = memo(({
    settings,
    falseConditionRender,
    additionalFeature,
    featureHeaderText,
    className,
}: NoteProps) => {
    return (
    <div className='w-full flex flex-col gap-2.5 mb-3.5 bg-transparent'>
        <p className='text-[15.5px] text-gray-600'>
                {
                settings.displaySurface !== 'camera only'
                ? falseConditionRender
                : `You are using camera only.`
                }
            </p>
        <div className="w-full flex flex-col gap-2 bg-transparent">
            {featureHeaderText && <span className=''>{featureHeaderText}{' :'}</span>}
            <ul className="w-full flex gap-3.5 items-center flex-wrap">
                {additionalFeature && additionalFeature}
                {settings.camera === 'with' && <ModalListItem text='Camera'/>}
                {settings.withMic && <ModalListItem text='Microphone'/>} 
                <ModalListItem
                    text={settings.cursor === 'always' ? 'Cursor display' : settings.cursor === 'motion' ? 'Cursor display on motion' : 'Cursor hidden'}
                />
            </ul>
        </div>
    </div>
    )
})

export default Note;