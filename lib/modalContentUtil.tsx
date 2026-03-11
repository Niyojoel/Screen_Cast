
import { ModalButton } from "..";
import { NoNameModalActionType, VoidAction } from "./hooks/useModalContext";

export const getActionStateButtons = (
    action: NoNameModalActionType,
    failedButtons: ModalButton[],
    beforeButtons?: ModalButton[] | null,
    successButtons?: ModalButton[],
): ModalButton[] => {
    if(action.state ==='after' && action.response === 'successful' && successButtons) {
        return successButtons;
    }

    if(action.state ==='after' && action.response === 'failed') {
        return failedButtons;
    }

    if(action.state ==='before' && beforeButtons) return beforeButtons

    return [];
} 

export const getModalButton = (text: string, action: VoidAction, className?: string, icon?: React.ReactNode): ModalButton => {
    return !icon ? {
        text,
        action,
        className: className || "btn-theme"
    }: {
        text,
        action,
        className: className || "btn-theme",
        icon
    }
}

export const showOrHide = (stateTrue: boolean) => stateTrue ? 'show' : 'no-show'