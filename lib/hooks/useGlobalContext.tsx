'use client'
import { ActionResponseType, ModalButton, ModalStateType, RecordingStateType} from "@/index";
import {useState, useContext, createContext, useRef, useEffect, useCallback} from "react";

export type GlobalContextType = {
  actionResponse: ActionResponseType | null,
  actionProcessing: boolean,
  modal: ModalStateType,
  openModal: (content: React.ReactNode, buttons?: ModalButton[], closeIcon?: React.ReactNode) => void,
  closeModal: () => void,
  changeActionResponse: (response: ActionResponseType) => void,
  changeActionProcessing: (state:boolean) => void,
  modalError: string,
  showModalError: (message: string) => void,
  recordingState: RecordingStateType | null
  changeRecordingState: (state: RecordingStateType | null) => void
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
  const [actionResponse, setActionResponse] = useState<ActionResponseType>(null);
  const [actionProcessing, setActionProcessing] = useState(false);
  const [recordingState, setRecordingState] = useState<RecordingStateType | null>(null)


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

  const closeModal = useCallback(()=>{
    if(recordingState) changeRecordingState(null);
    if(actionResponse) setActionResponse(null);
    setModal({
        state: false,
        content: null, 
        buttons: null
    })
  }, [])

  const showModalError = useCallback((message: string) => {
    setModalError(message)
  }, [])

  const changeActionProcessing = useCallback((state: boolean) => {
    setActionProcessing(state)
  }, [])

  const changeActionResponse = useCallback((response: ActionResponseType) => setActionResponse(response), []);

  const changeRecordingState = useCallback((state: RecordingStateType | null) => setRecordingState(state), []);

  return (
    <GlobalContext.Provider value={{
      modal, 
      openModal, 
      closeModal, 
      actionResponse,
      actionProcessing,
      changeActionProcessing,
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