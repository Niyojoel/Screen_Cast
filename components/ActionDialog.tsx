import { DIALOG_ICONS } from '@/constants/lists'
import DialogContentBody from './DialogContentBody'
import { CheckCircleIcon } from 'lucide-react'

export const FailedActionDialog = ({
    text,
    className,
    header
}: {text?: string, header?: string, className?: string}) =>  (
    <DialogContentBody
        icon = {DIALOG_ICONS.failed}
        headerNode = {header || 'Something went wrong'}
        className={className}
        subNode = {text ? text : 'Try again'}
    />

)

export const SuccessActionDialog = ({
    text,
    className,
    header
}: {text: string, header?: string, className?: string}) => header ? (
    <DialogContentBody
        icon = {DIALOG_ICONS.checked}
        headerNode={header}
        className={className}
        subNode = {text && text}
    />

) : (
    <DialogContentBody
        icon = {DIALOG_ICONS.checked}
        className={className}
        subNode = {text}
    />

)

export const OngoingActionDialog = ({
    text,
    className,
}: {text: string, className?: string}) =>  (
    <DialogContentBody
        icon = {DIALOG_ICONS.loader}
        className={className}
        subNode = {text}
    />

)

export const WarningActionDialog = ({
    header,
    text,
    className,
}: {text: string, header?: string, className?: string}) =>  (
    <DialogContentBody
        icon = {DIALOG_ICONS.alert}
        headerNode={header}
        className={className}
        subNode = {text}
    />

)

export const DialogListItem = ({text, icon}: {text: string | null, icon?: React.ReactElement}) => {

    if(!text) return null;

    return (
    <DialogContentBody
        icon={icon || <CheckCircleIcon size={16} stroke="#ff4393"/>}
        headerNode={text}
    />
    ) 
}
