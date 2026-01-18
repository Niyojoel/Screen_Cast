'use client'
import { ActionResponseType, ModalButton, ModalStateType, ActionStatusType, Action} from "@/index";
import {useState, useContext, createContext, useCallback} from "react";

export type GlobalContextType = {
  actionResponse: Record<Action, ActionResponseType | null>,
  actionStatus: Record<Action, ActionResponseType | null>,
  modal: ModalStateType,
  openModal: (content: React.ReactNode, buttons?: ModalButton[], closeIcon?: React.ReactNode) => void,
  closeModal: () => void,
  changeActionResponse: (action: Action, response: ActionResponseType | null) => void,
  changeActionStatus: (action: Action, status: ActionStatusType | null) => void,
  modalError: string,
  showModalError: (message: string) => void,
  recordingState: ActionStatusType | null
  changeRecordingState: (state: ActionStatusType | null) => void
}

const GlobalContext = createContext<GlobalContextType | null>(null);

const GlobalProvider = ({children}:{children: React.ReactNode}) => {
  const [modal, setModal] = useState<ModalStateType>({
    state: false, 
    content: null, 
    buttons: null, 
    closeIcon: null
  });
  const [modalError, setModalError] = useState('')
  const [actionResponse, setActionResponse] = useState<Record<Action, ActionResponseType | null>>({
    'delete': null,
    'download': null,
    'check': null,
    'generate': null,
  });
  const [actionStatus, setActionStatus] = useState<Record<Action, ActionResponseType | null>>({
    'delete': null,
    'download': null,
    'check': null,
    'generate': null,
  });
  const [recordingState, setRecordingState] = useState<ActionStatusType | null>(null)


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

  const closeModal = useCallback(()=> {
    if(recordingState) changeRecordingState(null);
    // if(actionResponse) changeActionResponse({});
    setModal({
        state: false,
        content: null, 
        buttons: null
    })
  }, [])

  const showModalError = useCallback((message: string) => {
    setModalError(message)
  }, [])

  const changeActionStatus = useCallback((action: Action, status: ActionStatusType | null) => {
    setActionStatus(prev => ({...prev, [action]: status}))
  }, [])

  const changeActionResponse = useCallback((action: Action,response: ActionResponseType | null) => setActionResponse(prev => ({...prev, [action]: response})), []);

  const changeRecordingState = useCallback((state: ActionStatusType | null) => setRecordingState(state), []);

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
      recordingState
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