import { 
    MappedAction, 
    VoidAction 
} from "@/lib/hooks/useModalContext";
import { ModalContentType } from "@/index";
import RedirectBody from "./RedirectBody";
import { 
    deleteButtons, 
    videoRedirectButtons 
} from "@/constants/lists";
import DeleteBody from "./DeleteBody";

const deleteParentContent = (
    modalAction: MappedAction,
    onDelete: VoidAction, 
    closeModal: VoidAction,
    afterDeleteRedirect: VoidAction,
): ModalContentType => {
    if(modalAction.name === 'delete') {
        return {
            body: <DeleteBody action={modalAction?.delete}/>,
            buttons: deleteButtons (
                modalAction?.delete,
                onDelete,
                closeModal,
            )
        }
    } else {
        return {
            body: <RedirectBody action={modalAction?.to_profile}/>,
            buttons: videoRedirectButtons(
                modalAction?.to_profile,
                afterDeleteRedirect
            )
        }
    }
}

export default deleteParentContent;