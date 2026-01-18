import { DIALOG_ICONS } from '@/constants/lists'
import DialogContentBody from './DialogContentBody'

export const FailedActionDialog = ({
    customMessage = "Try again"
}: {customMessage?: string}) =>  (
    <DialogContentBody
        icon = {DIALOG_ICONS.failed}
        headerNode = 'Something went wrong'
        subNode = {`${customMessage}. Try again`}
    />
)

export const SuccessActionDialog = ({
    message,
}: {message?: string}) =>  (
    <DialogContentBody
        icon = {DIALOG_ICONS.checked}
        subNode = {message}
    />
)

export const LoadingActionDialog = ({
    message,
}: {message?: string}) =>  (
    <DialogContentBody
        icon = {DIALOG_ICONS.loader}
        subNode = {message}
    />
)
