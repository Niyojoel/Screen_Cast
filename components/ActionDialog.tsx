import { DIALOG_ICONS } from '@/constants/lists'
import DialogContentBody from './DialogContentBody'

export const FailedActionDialog = ({
    customMessage,
    header
}: {customMessage?: string, header?: string}) =>  (
    <DialogContentBody
        icon = {DIALOG_ICONS.failed}
        headerNode = {header || 'Something went wrong'}
        subNode = {customMessage ? `${customMessage}. Try again` : 'Try again'}
    />
)

export const SuccessActionDialog = ({
    message,
    header
}: {message: string, header?: string}) =>  (
    <DialogContentBody
        icon = {DIALOG_ICONS.checked}
        headerNode={header}
        subNode = {message}
    />
)

export const OngoingActionDialog = ({
    message,
}: {message: string}) =>  (
    <DialogContentBody
        icon = {DIALOG_ICONS.loader}
        subNode = {message}
    />
)

export const WarningActionDialog = ({
    header,
    message,
}: {message: string, header?: string}) =>  (
    <DialogContentBody
        icon = {DIALOG_ICONS.alert}
        headerNode={header}
        subNode = {message}
    />
)

export const DialogListItem = ({text}: {text: string | null}) => {

    if(!text) return null;

    return (
    <DialogContentBody
        icon={DIALOG_ICONS.checked}
        headerNode={text}
    />
    ) 
}
