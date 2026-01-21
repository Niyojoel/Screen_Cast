'use client'
import { ModalContentType } from "@/constants/lists";
import { ActionResponseType, ModalButton, ModalStateType, ActionStatusType, Action} from "@/index";
import {useState, useContext, createContext, useCallback, useEffect} from "react";

export type GlobalContextType = {
  actionResponse: Record<Action, ActionResponseType | null>,
  actionStatus: Record<Action, ActionStatusType | null>,
  modal: ModalStateType,
  openModal: (content: React.ReactNode, buttons?: ModalButton[], closeIcon?: React.ReactNode) => void,
  closeModal: () => void,
  changeActionResponse: (action: Action, response: ActionResponseType | null) => void,
  changeActionStatus: (action: Action, status: ActionStatusType | null) => void,
  modalError: string,
  showModalError: (message: string) => void,
  recordingState: ActionStatusType | null
  changeRecordingState: (state: ActionStatusType | null) => void,
  changeModalContent: (body: React.ReactElement | null, buttons?: ModalButton[] | null) => void,
  changeRecordingResponse: (response: ActionResponseType | null) => void,
  recordingResponse: ActionResponseType | null
}

type ModalContentStoreType = {
    body: React.ReactElement | null,
    buttons?: ModalButton[] | null
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
  const [actionResponse, setActionResponse] = useState<Record<Action, ActionResponseType | null>>({
    'delete': null,
    'download': null,
    'check': null,
    'generate': null,
    'redirect': null,
    'record': null,
    'save_recording': null,
  });
  const [actionStatus, setActionStatus] = useState<Record<Action, ActionStatusType | null>>({
    'delete': null,
    'download': null,
    'check': null,
    'generate': null,
    'redirect': null,
    'record': null,
    'save_recording': null,
  });
  const [recordingState, setRecordingState] = useState<ActionStatusType | null>(null)
  const [recordingResponse, setRecordingResponse] = useState<ActionResponseType | null>(null)


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

  const closeModal = useCallback(()=> {
    if(recordingState) changeRecordingState(null);
    if(recordingResponse) changeRecordingResponse(null);
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

  const changeRecordingResponse = useCallback((state: ActionResponseType | null) => setRecordingResponse(state), []);

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
      changeRecordingResponse,
      recordingState,
      changeModalContent,
      recordingResponse
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