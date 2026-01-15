import { DIALOG_ICONS } from '@/constants/lists'
import DialogContentBody from './DialogContentBody'

const FailedActionDialog = ({
    customMessage = "Try again"
}: {customMessage?: string}) =>  (
    <DialogContentBody
        icon = {DIALOG_ICONS.failed}
        headerNode = 'Something went wrong'
        subNode = {`${customMessage}. Try again`}
    />
)

export default FailedActionDialog