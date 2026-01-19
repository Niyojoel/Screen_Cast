'use client'
import { ModalContentType } from "@/constants/lists";
import { ActionResponseType, ModalButton, ModalStateType, ActionStateType, Action, ModalActionType} from "@/index";
import {useState, useContext, createContext, useCallback, useEffect, Dispatch, SetStateAction} from "react";

export type GlobalContextType = {
  actionResponse: Record<Action, ActionResponseType | null>,
  actionStatus: Record<Action, ActionStateType | null>,
  modal: ModalStateType,
  openModal: (content: React.ReactNode, buttons?: ModalButton[], closeIcon?: React.ReactNode) => void,
  closeModal: () => void,
  changeActionResponse: (action: Action, response: ActionResponseType | null) => void,
  changeActionStatus: (action: Action, status: ActionStateType | null) => void,
  modalError: string,
  showModalError: (message: string) => void,
  recordingState: ActionStateType | null
  changeRecordingState: (state: ActionStateType | null) => void,
  changeModalContent: (body: React.ReactElement | null, buttons?: ModalButton[] | null) => void,
  changeAction: (action: ChangeActionProps) => void,
  successfulAction : () => void,
  actionTimeout: (callback: void, timeout?: number) => void
  failedAction : () => void,
  beforeAction : (type: Action) => void,
  ongoingAction : (type: Action) => void,
  resetAction: () => void, 
  action: ModalActionType
}

type ModalContentStoreType = {
    body: React.ReactElement | null,
    buttons?: ModalButton[] | null
}

type ChangeActionProps = {
  type?: Action,
  state?: ActionStateType,
  response?: ActionResponseType
}

const GlobalContext = createContext<GlobalContextType | null>(null);

const [modalContent, setModalContent] = useState<ModalContentStoreType>({body: null, buttons: null});

const GlobalProvider = ({children}:{children: React.ReactNode}) => {
  const [modal, setModal] = useState<ModalStateType>({
    state: false, 
    content: modalContent.body, 
    buttons: modalContent.buttons, 
    closeIcon: null
  });

  const [modalError, setModalError] = useState('')

  const [action, setAction] = useState<ModalActionType>({
    type: null, 
    state: null, 
    response: null
  })
  const [actionResponse, setActionResponse] = useState<Record<Action, ActionResponseType | null>>({
    'delete': null,
    'download': null,
    'check': null,
    'generate': null,
    'redirect': null,
    'record': null,
    'save': null,
    'load': null
  });
  const [actionStatus, setActionStatus] = useState<Record<Action, ActionStateType | null>>({
    'delete': null,
    'download': null,
    'check': null,
    'generate': null,
    'redirect': null,
    'record': null,
    'save': null,
    'load': null
  });

  const [recordingState, setRecordingState] = useState<ActionStateType | null>(null)

  const openModal = useCallback((
    content: React.ReactNode, 
    buttons?: ModalButton[] | null,
    closeIcon?: React.ReactNode
  ) => {
    setModal({
      state: true,
      content,
      buttons: buttons ? buttons : null,
      closeIcon: closeIcon ? closeIcon : null
    })
  }, [])

  const changeModalContent = useCallback((
    body: React.ReactElement | null, 
    buttons?: ModalButton[] | null,
  ) => {
    setModalContent({body, buttons})
  }, [])

  const resetAction = () => setAction({type: null, state: null, response: null})

  const resetModal = () => {
     if(recordingState) setRecordingState(null);
    resetAction()
  }

  const closeModal = useCallback(()=> {
    resetModal();
    setModal({
        state: false,
        content: null, 
        buttons: null
    })
  }, [])

  const showModalError = useCallback((message: string) => {
    setModalError(message)
  }, [])

  const changeActionStatus = useCallback((action: Action, status: ActionStateType | null) => {
    setActionStatus(prev => ({...prev, [action]: status}))
  }, [])

  const changeAction = useCallback((action: {
    type?: Action,
    state?: ActionStateType,
    response?: ActionResponseType
  }) => {
    setAction(prev => ({...prev, ...action}))
  }, [])

  const successfulAction = () => changeAction({state: 'after', response: 'successful'})

  const failedAction = () => changeAction({state: 'after', response: 'failed'})

  const beforeAction = (type: Action) => setAction({type, state: 'before', response: null})

  const ongoingAction = (type: Action) => setAction({type, state: 'ongoing', response: null})

  const changeActionResponse = useCallback((action: Action,response: ActionResponseType | null) => setActionResponse(prev => ({...prev, [action]: response})), []);

  const changeRecordingState = useCallback((state: ActionStateType | null) => setRecordingState(state), []);

  const actionTimeout = (callback: void, timeout?: number) => {
    const timer = setTimeout(() => callback, timeout || 2000)

    return clearTimeout(timer);
  }

  //likely to complain about size changes on re-renders
  useEffect(()=> {
    setModal(prev =>({...prev, content: modalContent?.body, buttons: modalContent?.buttons}))
  },[modalContent])

  return (
    <GlobalContext.Provider value={{
      modal, 
      openModal, 
      closeModal, 
      actionResponse,
      actionStatus,
      changeActionStatus,
      changeActionResponse,
      modalError,
      showModalError,
      changeRecordingState,
      recordingState,
      changeModalContent,
      changeAction,
      resetAction,
      action,
      successfulAction,
      actionTimeout,
      failedAction,
      beforeAction,
      ongoingAction
    }}>
        {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = ()=> {
  const value = useContext(GlobalContext);
  if(value == null) throw Error ("Cannot use outside of GlobalContext");

  return value;
}

export default GlobalProvider