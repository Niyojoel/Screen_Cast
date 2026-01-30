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
        subNode = {text ? `${text}. Try again` : 'Try again'}
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
        subNode = {text}
    />
) : (
    <DialogContentBody
        icon = {DIALOG_ICONS.checked}
        subNode = {text}
    />
)

export const OngoingActionDialog = ({
    text,
    className,
}: {text: string, className?: string}) =>  (
    <DialogContentBody
        icon = {DIALOG_ICONS.loader}
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
        subNode = {text}
    />
)

export const DialogListItem = ({text}: {text: string | null}) => {

    if(!text) return null;

    return (
    <DialogContentBody
        icon={<CheckCircleIcon size={16} stroke="#ff4393"/>}
        headerNode={text}
    />
    ) 
}
