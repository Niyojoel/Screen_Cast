'use client'
import { 
  ActionStateType, 
  Action, 
  ModalContentType, 
  BeforeModalActionType, 
  OngoingModalActionType, 
  RecordAction, 
  PostAction, 
  UploadAction, 
  ModalOpenType,
  ModalType,
  OpenModalArgs,
  ActionResponseType,
  GenerateAction,
  ParentContentType,
} from "@/index";
import { X } from "lucide-react";
import {
  useState, 
  useContext, 
  createContext, 
  useCallback
} from "react";

type GlobalContextType = {
  modalOpen: ModalOpenType;
  modalContent: NullableModalContentType;
  openModal: (content: OpenModalArgs) => void;
  closeModal: () => void;
  modalError: string;
  showModalError: (message: string) => void;
  syncModalContent: (actionType: ModalType, content: ModalContentType) => void;
  modalContentParent: ParentContentType | null;
  changeContentParent: (parent: ParentContentType) => void;
  changeAction: (action: ChangeActionArgs) => void;
  actionTimeout: (callback: () => void, timeout?: number) => void;
  successfulAction: (name: Action, type?: ActionType) => void,
  failedAction: (name: Action, type?: ActionType) => void,
  beforeAction : (name: Action) => void;
  ongoingAction : (name: Action) => void;
  changeState : (name: Action,state: ActionStateType) => void;
  resetAction: () => void;
  modalAction: MappedAction;
  actionTrue: (action: Action | null) => boolean;
}

type NullableModalContentType = {
  [K in keyof ModalContentType]: ModalContentType[K] | null
}

type ChangeActionArgs = Required<ModalActionType> & {
  type?: ActionType;
}

export type ModalActionType = BeforeModalActionType | OngoingModalActionType

export type ActionType = 'before' | 'ongoing'

export type NoNameModalActionType = Omit<ModalActionType, 'name'>

type ActionNameType = Action | ''

export type MappedAction = {name: ActionNameType} & {
  [P in ActionNameType]: NoNameModalActionType
}

const GlobalContext = createContext<GlobalContextType | null>(null);

const GlobalProvider = ({children} : {children: React.ReactNode}) => {

  const [modalContent, setModalContent] = useState<NullableModalContentType>({
    body: null, 
    buttons: null
  });
    
  const [modalOpen, setModalOpen] = useState<ModalOpenType>({
    isOpen: false, 
    type: null,
    closeIcon: <X size={22}/>
  });

  const getAction = (action: ModalActionType) => {
    const {state, response, name} = action
    return {
      name,
      [name]: {state, response}
    } as MappedAction
  }

  //might have to rewrite each action individually
  const [modalAction, setModalAction] = useState<MappedAction>(getAction({
    name: '',
    state: null,
    response: null
  }))

  const [modalContentParent, setModalContentParent] = useState<ParentContentType | null>(null)

  const [modalError, setModalError] = useState('')

  //To store an action type whether it is a before or ongoing action
  const [actionType, setActionType] = useState<ActionType | null>(null)

  const resetAction = () => {
    setModalAction(getAction({
      name: '',
      state: null,
      response: null
    }));
    setActionType(null)
  }

  //to be looked over for amendment
  const closeModal = useCallback(()=> {
    setModalContent({body: null, buttons: null});
    if(modalContentParent) setModalContentParent(null);
    resetAction();
    setActionType(null);
    setModalOpen({
      isOpen: false,
      type: null,
      closeIcon: <X size={22}/>
    });
  }, [])

  const openModal = ({type, closeIcon}: OpenModalArgs) => {
    setModalOpen(prev => ({
      isOpen: true, 
      type,
      closeIcon: closeIcon || prev.closeIcon
    }));
  }

  const changeContentParent = (parent: ParentContentType) => {
    setModalContentParent(_ => parent)
  }

  const showModalError = (error: string) => setModalError(error);

  const assignTypeToName = (
    type: ModalType, 
    name: Action
  ) => {
    if(type === 'record') {
      return name as RecordAction;
    }else if (type === 'upload') {
      if(name !== 'edit') return name as GenerateAction;  
      return name as UploadAction;
    }else return name as PostAction;
  }

  const changeAction = useCallback((action_: ChangeActionArgs) => {
    const {state, name: name_} = action_;
    
    const response_ = action_?.response;
    const type_ = action_?.type;

    const newAction = name_ && modalAction.name !== name_ || type_;
    
    if(newAction){         
      setActionType(state as ActionType);
    }

    const type = newAction ? state : actionType
    const name = name_ || modalAction.name

    console.log(name_)
    console.log(state)
    console.log(modalOpen.type)

    const action = {
      name: assignTypeToName(modalOpen.type!, name as Action),
      state,
      response: response_ ? response_ : null
    }

    setModalAction(_ => {
      return type === "before"
      ? getAction(action as BeforeModalActionType) 
      : getAction(action as OngoingModalActionType)
    })
  }, [])

  //for controlling action response in after state
  const changeResponse = (response: ActionResponseType, name: Action, type?: ActionType) => {
    const after = {
      name,
      state: 'after' as ActionStateType, 
      response
    }
    const action = type ? {type, ...after} : after
      
    changeAction(action)
  }

  const successfulAction = (name: Action, type?: ActionType) => {
    if(type) {
      changeResponse('successful', name, type)
    } else {
      changeResponse('successful', name)
    }
  };

  const failedAction = (name: Action, type?: ActionType) => {
    if(type) {
      changeResponse('failed', name, type)
    } else {
      changeResponse('failed', name)
    }
  };
  //--------------------------

  //for changing a state from before to ongoing
  const changeState = (name: Action, state: ActionStateType) => {
    const action = {
      name,
      state, 
      response: null
    }
    changeAction(action)
  }

  //for initialize action with state
  const initializeAction = (state: ActionStateType, name: Action) => {
    const action = {
      name,
      state, 
      response: null
    }

    changeAction(action);
  }

  //for initialize a before type action
  const beforeAction = (name: Action) => initializeAction('before', name);

  //for initializing an ongoing type action
  const ongoingAction = (name: Action) => initializeAction('ongoing', name);

  const actionTimeout = (callback: () => void, timeout?: number) => {
    const time = timeout || 2000;
    const timer = setTimeout(() => {
      callback()
    }, time);
    clearTimeout(timer);
  }

  const actionTrue = (action: Action | null): boolean => modalAction.name === action;

  const syncModalContent = useCallback((
    modelType: ModalType, 
    content: ModalContentType
  ) => {
    if(modalOpen.type === modelType) {
      setModalContent(content);
    }
  }, [modalOpen.type])

  return <GlobalContext.Provider value={{
    modalOpen,
    modalContent,
    modalContentParent,
    modalError,
    showModalError,
    syncModalContent,
    changeContentParent,
    closeModal,
    openModal,
    changeAction,
    resetAction,
    modalAction,
    successfulAction,
    actionTimeout,
    failedAction,
    beforeAction,
    ongoingAction,
    changeState,
    actionTrue,
  }}>
    {children}
  </GlobalContext.Provider>
}

export const useGlobalContext = ()=> {
  const value = useContext(GlobalContext);
  if(value == null) throw Error ("Cannot use outside of GlobalContext");

  return value;
}

export default GlobalProvider