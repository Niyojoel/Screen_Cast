import { VoidAction } from "@/lib/hooks/useModalContext"
import { WarningActionModalBody } from "@/components"
import { getModalButton } from "@/lib/modalContentUtil"

const exitContent = (
    resetModal: VoidAction, 
    cancelExit: VoidAction, 
) => {
    return {
        body: <WarningActionModalBody header="About to exit modal" text=''/>,
        buttons: [
            getModalButton('Cancel', cancelExit, 'btn-white'),
            getModalButton('Exit', resetModal)
        ]
    }
}

export default exitContent;