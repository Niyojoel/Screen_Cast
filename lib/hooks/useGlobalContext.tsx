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
  ThumbnailAction,
  ParentContentType,
  DeleteAction,
} from "@/index";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useState, 
  useContext, 
  createContext, 
  useCallback,
  useEffect
} from "react";
import { getModalButton } from "../modalContentUtil";
import { exitContent } from "@/constants/lists";

type GlobalContextType = {
  modalOpen: ModalOpenType;
  exit: boolean;
  modalContent: NullableModalContentType;
  openModal: (content?: OpenModalArgs) => void;
  closeModal: () => void;
  cancelExit: () => void;
  exitModal: () => void;
  resetModal: () => void;
  actionError: string;
  logActionError: (log: string) => void;
  syncModalContent: (modalType: ModalType, content: ModalContentType) => void;
  exitModalContent: (action: boolean) => ModalContentType;
  modalContentParent: ParentContentType | null;
  changeContentParent: (parent: ParentContentType) => void;
  changeAction: (action: ChangeActionArgs) => void;
  successfulAction: (name?: Action, type?: ActionType) => void,
  failedAction: (name?: Action, type?: ActionType) => void,
  beforeAction : (name: Action) => void;
  ongoingAction : (name: Action) => void;
  changeState : (state: ActionStateType, name?: Action) => void;
  resetAction: () => void;
  modalAction: MappedAction;
  actionTrue: (action: Action | null) => boolean;
}

type NullableModalContentType = {
  [K in keyof ModalContentType]: ModalContentType[K] | null
}

type ChangeActionArgs = Omit<Required<ModalActionType>, 'name'> & {
  name?: Action,
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
  
  const router = useRouter();

  const [modalContent, setModalContent] = useState<NullableModalContentType>({
    body: null, 
    buttons: null
  });
    
  const [modalOpen, setModalOpen] = useState<ModalOpenType>({
    isOpen: false, 
    type: null,
    closeIcon: <X size={22}/>
  });

  const getAction = useCallback((action: ModalActionType) => {
    const {state, response, name} = action
    return {
      name,
      [name]: {state, response}
    } as MappedAction
  },[])

  const [modalAction, setModalAction] = useState<MappedAction>(getAction({
    name: '',
    state: null,
    response: null
  }))

  const [exit, setExit] = useState(false);

  const [modalContentParent, setModalContentParent] = useState<ParentContentType | null>(null)

  const [actionError, setActionError] = useState('')

  //To store an action type whether it is a before or ongoing action
  const [actionType, setActionType] = useState<ActionType | null>(null)

  const resetAction = useCallback(() => {
    setModalAction(getAction({
      name: '',
      state: null,
      response: null
    }));
    setActionType(null)
  },[modalAction])

  const ongoingState = useCallback((action: Action) => modalAction[action]?.state === 'ongoing',[]); 

  //check for ongoing redirect to quit on modal close
  const ongoingRedirectFallback = useCallback(() => {
    if (ongoingState('redirect') || ongoingState('to_profile'))  router.push('/')
  },[ongoingState]);

  //to be looked over for amendment
  const closeModal = useCallback(()=> {
    setModalOpen(prev => ({
      ...prev,
      isOpen: false,
    }));
  }, [])

  const resetModal = useCallback(()=> {
    setModalContent({body: null, buttons: null});
    if(modalContentParent) setModalContentParent(null);
    if(exit) setExit(false);
    ongoingRedirectFallback();
    resetAction();
    setActionType(null);
    setModalOpen({
      isOpen: false,
      type: null,
      closeIcon: <X size={22}/>
    });
  }, [modalContentParent, resetAction, ongoingRedirectFallback, exit])

  const cancelExit = () => {
    console.log(exit)
    setExit(false);
  }

  const exitModal = useCallback(() => {
    let giveWarning: boolean = false;

    const recordWarning = (modalContentParent === "record" && modalAction.name !== "check");

    const generateWarning = (modalContentParent === 'thumbnail' && modalAction?.generate?.state !== ('before' || 'ongoing'))

    if(recordWarning || generateWarning) {giveWarning = true};

    if(giveWarning && !exit) {
      setExit(true);
      return;
    }
    resetModal();
  },[modalAction, modalContentParent, resetModal])

  //working issue with display modal
  const openModal = useCallback((modal?: OpenModalArgs) => {
    setModalOpen(prev => {
      const props = modal && {
        type: modal.type,
        closeIcon: modal?.closeIcon || prev.closeIcon
      }
      console.log(prev);
      return props ? {isOpen: true, ...props} : {...prev, isOpen: true}
    });
  },[])

  const logActionError = (log: string) => {
    setActionError(log);
  }

  const changeContentParent = useCallback((parent: ParentContentType) => {
    setModalContentParent(_ => parent)
  },[])

  const assignTypeToName = (
    type: ModalType, 
    name: Action
  ) => {
    if(type === 'record') {
      return name as RecordAction;
    }else if (type === 'upload') {
      if(name !== 'edit') return name as ThumbnailAction;  
      return name as UploadAction;
    }else {
      if(name !== 'download') return name as DeleteAction
      return name as PostAction
    };
  }

  const changeAction = useCallback((action_: ChangeActionArgs) => {
    const {state} = action_;
    
    const name_ = action_?.name;
    const response_ = action_?.response;
    const type_ = action_?.type;

    const newAction = name_ && modalAction.name !== name_ || type_;
    
    if(newAction) {         
      setActionType(state as ActionType);
    }

    const type = newAction ? state : actionType
    const name = name_ || modalAction.name

    const action = {
      name,
      // assignTypeToName(modalOpen.type!, name as Action),
      state,
      response: response_ ? response_ : null
    }

    setModalAction(_ => {
      return type === "before"
      ? getAction(action as BeforeModalActionType) 
      : getAction(action as OngoingModalActionType)
    })
  }, [modalAction, modalOpen, assignTypeToName, getAction, actionType])

  //for controlling action response in after state
  const changeResponse = useCallback((response: ActionResponseType, name?: Action, type?: ActionType) => {
    const after = {
      name,
      state: 'after' as ActionStateType, 
      response
    }
    const action = type ? {type, ...after} : after
      
    changeAction(action)
  },[changeAction])

  const successfulAction = useCallback((name?: Action, type?: ActionType) => {
    if(type) {
      changeResponse('successful', name, type)
    } else {
      changeResponse('successful', name)
    }
  },[changeResponse]);

  const failedAction = useCallback((name?: Action, type?: ActionType) => {
    if(type) {
      changeResponse('failed', name, type)
    } else {
      changeResponse('failed', name)
    }
  },[changeResponse]);
  //--------------------------

  //for changing a state from before to ongoing
  const changeState = useCallback((state: ActionStateType, name?: Action) => {
    const action = {
      name,
      state, 
      response: null
    }
    changeAction(action)
  },[changeAction])

  //for initialize action with state
  const initializeAction = useCallback((state: ActionStateType, name: Action) => {
    const action = {
      name,
      state, 
      response: null
    }

    changeAction(action);
  },[changeAction])

  //for initialize a before type action
  const beforeAction = useCallback((name: Action) => initializeAction('before', name),[initializeAction]);

  //for initializing an ongoing type action
  const ongoingAction = useCallback((name: Action) => initializeAction('ongoing', name),[initializeAction]);

  const actionTrue = useCallback((action: Action | null): boolean => modalAction.name === action,[modalAction.name]);

  const syncModalContent = useCallback((
    modalType: ModalType, 
    content: ModalContentType
  ) => {
    if(modalOpen.type === modalType) {
      setModalContent(content);
    }
  }, [modalOpen.type])

  //generic modal content
  const exitModalContent = useCallback((action: boolean): ModalContentType => exitContent(resetModal, cancelExit, action)
  ,[resetModal, cancelExit, exitContent])

  useEffect(()=> console.log(modalOpen), [modalOpen])

  return <GlobalContext.Provider value={{
    modalOpen,
    modalContent,
    exit,
    modalContentParent,
    actionError,
    logActionError,
    syncModalContent,
    exitModalContent,
    changeContentParent,
    closeModal,
    cancelExit,
    exitModal,
    resetModal,
    openModal,
    changeAction,
    resetAction,
    modalAction,
    successfulAction,
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