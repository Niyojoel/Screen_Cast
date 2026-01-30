import { FailedActionDialog, OngoingActionDialog, SuccessActionDialog } from "@/components";
import { ActionResponseType, ActionStateType, ModalButton, ModalContentType } from "..";
import { NoNameModalActionType } from "./hooks/useGlobalContext";

export type ModalContentTypeAdapted = {
  node: React.ReactElement | string,
  buttons?: ModalButton[]
}

type ModalContentByActionArg = ModalContentTypeAdapted | ModalContentType | null;

const parseContentNode = (
    content: ModalContentTypeAdapted | ModalContentType, 
    bodyEl?: React.ReactElement): ModalContentType => {

    let body: React.ReactElement | null = null;
    
    if('node' in content) {
        body = content.node === 'string' && bodyEl ? bodyEl : content.node as React.ReactElement; 
    }else {
        body = content.body
    }

    if(content?.buttons) return {body, buttons: content?.buttons}
    return {body};
}

export const getActionStateButtons = (
    action: NoNameModalActionType,
    failedButtons: ModalButton[],
    beforeButtons: ModalButton[],
    successButtons?: ModalButton[],
) => {

    if(action.state ==='after' && action.response === 'successful' && successButtons) {
        return successButtons;
    }

    if(action.state ==='after' && action.response === 'failed') {
        return failedButtons;
    }
    
    return beforeButtons
} 

export const getActionStateContent = (
    actionStatus: ActionStateType | Omit<ActionStateType, "before"> | null,
    actionResponse : ActionResponseType | null,
    failedContent: ModalContentTypeAdapted,
    ongoingContent: ModalContentTypeAdapted,
    successContent: ModalContentTypeAdapted | null,
    beforeContent?: ModalContentTypeAdapted
): ModalContentType => {

    if(actionStatus ==='before' && beforeContent) {
        return parseContentNode(beforeContent);
    }

    if(actionStatus ==='after' && actionResponse === 'successful' && successContent) {
        return parseContentNode(successContent, <SuccessActionDialog text={successContent.node as string}/>);
    }

    if(actionStatus ==='after' && actionResponse === 'failed') {
        return parseContentNode(failedContent, <FailedActionDialog text={failedContent.node as string}/>);
    }
    
    return parseContentNode(ongoingContent, <OngoingActionDialog text={ongoingContent.node as string}/>);
}

export const getModalButton = (text: string, action: () => void, className?: string, icon?: React.ReactNode): ModalButton => {
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

export const getContentByAction = (
    contents: ModalContentByActionArg[],
): ModalContentType | ModalContentTypeAdapted => {
    return contents.find(content => content) as ModalContentType | ModalContentTypeAdapted
}

export const contentClassNameByState = (stateTrue: boolean) => stateTrue ? 'show' : 'no-show'