import { VoidAction } from "@/lib/hooks/useModalContext"
import { SuccessfulActionModalBody } from "@/components"
import { getModalButton } from "@/lib/modalContentUtil"

const redirectedContent = (resetModal: VoidAction) => {
  return {
    body: <SuccessfulActionModalBody header='Redirected Successfully' text=''/>,
    buttons: [
      getModalButton('Ok', resetModal)
    ]
  }
}

export default redirectedContent;