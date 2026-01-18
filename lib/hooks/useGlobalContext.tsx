'use client'
import { ActionResponseType, ActionStatusType, ModalButton, ModalStateType} from "@/index";
import { HomeIcon } from "lucide-react";
import {useState, useContext, createContext, useRef, useEffect, useCallback} from "react";

type GlobalContextType = {
  actionResponse: ActionResponseType | null,
  actionStatus: ActionStatusType | null,
  modal: ModalStateType,
  openModal: (content: React.ReactNode, buttons: ModalButton[]) => void,
  closeModal: () => void,
  changeActionResponse: (response: ActionResponseType | null) => void,
  changeActionStatus: (state: ActionStatusType | null) => void,
  modalError: string,
  showModalError: (message: string) => void
}

const GlobalContext = createContext<GlobalContextType | null>(null);

const GlobalProvider = ({children}:{children: React.ReactNode}) => {
  const [modal, setModal] = useState<ModalStateType>({
    state: false, 
    content: null, 
    buttons: null, 
    closeIcon: <HomeIcon size={22}/>
  });
  const [modalError, setModalError] = useState('')
  const [actionResponse, setActionResponse] = useState<'failed' | 'successful' | null>(null);
  const [actionProcessing, setActionProcessing] = useState(false);


  const openModal = useCallback((
    content: React.ReactNode, 
    buttons: ModalButton[],
    closeIcon?: React.ReactNode
  ) => {
    setModal({
      state: true,
      content,
      buttons,
      closeIcon
    })
  }, [])

  const closeModal = useCallback(()=>{
    setModal({
        state: false,
        content: null, 
        buttons: null
    })
  }, [])

  const showModalError = (message: string) => {
    setModalError(message)
  }

  const changeActionProcessing = (state: "true" | "false") => {
    if(state === "true") {
        setActionProcessing(true)
    } else setActionProcessing(false);
  }

  const changeActionResponse = (response: ActionResponseType | null) => setActionResponse(response)
  
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