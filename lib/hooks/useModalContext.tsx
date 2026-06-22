'use client'

import { 
  ActionStateType, 
  Action, 
  ModalContentType, 
  BeforeModalActionType, 
  OngoingModalActionType, 
  ModalOpenType,
  ModalType,
  OpenModalArgs,
  ActionResponseType,
  ParentContentType,
  OnOpenArgs,
  ImagesArrayType,
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
import { 
  exitContent, 
  redirectedContent as redirectedContent_
} from "@/components/modalContent";

export type VoidAction = () => void;

export type VoidActionParam<T> = (args: T) => void;

export type VoidActionParams<T, K> = (arg1: T, arg2: K) => void;

export type VoidActionParamsOptional<T, K> = (arg1: T, arg2?: K) => void;

export type VoidActionParamsOptionals<T, K, U> = (arg1: T, arg2?: K, args3?: U) => void;

export type ActionParamOptional<T, K> = (arg1?: T) => K;

export type ActionNoParams<U> = () => U;

export type ActionParam<T, U> = (args: T) => U;

export type ActionParams<T, K, U> = (args: T, arg2?: K) => U;

type ModalContextType = {
  modalOpen: ModalOpenType;
  exit: boolean;
  modalContent: NullableModalContentType;
  openModal: VoidActionParam<OpenModalArgs>;
  closeModal: VoidAction;
  cancelExit: VoidAction;
  exitModal: VoidAction;
  resetModal: VoidAction;
  onOpen: VoidActionParam<OnOpenArgs>;
  actionError: string;
  logActionError: VoidActionParam<string>;
  syncModalContent: VoidActionParams<ModalType, ModalContentType>;
  exitModalContent: ActionParamOptional<VoidAction, ModalContentType>;
  redirectedContent: ActionNoParams<ModalContentType>;
  modalContentParent: ParentContentType | null;
  changeContentParent: VoidActionParam<ParentContentType>;
  successfulAction: VoidActionParamsOptional<Action, ActionType>;
  failedAction: VoidActionParamsOptional<Action, ActionType>;
  beforeAction : VoidActionParam<Action>;
  ongoingAction : VoidActionParam<Action>;
  changeState : VoidActionParamsOptional<ActionStateType, Action>;
  resetAction: VoidAction;
  modalAction: MappedAction;
  imageFS: ImagesArrayType | null;
  changeImageFS: VoidActionParam<ImagesArrayType | null>;
  imageFSActions: ImageFSActionsType | null;
  changeImageFSActions: VoidActionParam<ImageFSActionsType | null>;
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

export type ImageFSActionsType = {
  flash?: boolean;
  onClose?: VoidAction;
  onChecked?: VoidActionParam<string>;
  onSave?: ActionParam<string, string>;
  onDelete?: VoidActionParam<string>;
  imagesEnd?: boolean; 
  onNext?: VoidAction;
  onPrevious?: VoidAction;
}

const ModalContext = createContext<ModalContextType | null>(null);

const ModalProvider = ({children} : {children: React.ReactNode}) => {
  
  const router = useRouter();

  const [modalContent, setModalContent] = useState<NullableModalContentType>({
    body: null, 
    buttons: null
  });
    
  const [modalOpen, setModalOpen] = useState<ModalOpenType>({
    isOpen: false, 
    type: null,
    closeIcon: <X size={20} stroke='#212121'/>
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

  //image display in full screen 
  const [imageFS, setImageFS] = useState<ImagesArrayType | null>(null);

  const [imageFSActions, setImageFSActions] = useState<ImageFSActionsType | null>(null);

  const changeImageFS = (image: ImagesArrayType | null) => {
    setImageFS(image);
  };

  const changeImageFSActions = (actions: ImageFSActionsType | null) => {
    setImageFSActions(actions)
  };   

  const resetAction = useCallback(() => {
    setModalAction(getAction({
      name: '',
      state: null,
      response: null
    }));
    setActionType(null)
  },[getAction])

  const ongoingState = useCallback((action: Action) => modalAction[action]?.state === 'ongoing',[]); 

  //check for ongoing redirect to quit on modal close
  const ongoingRedirectFallback = useCallback(() => {
    if (ongoingState('redirect') || ongoingState('to_profile'))  router.push('/')
  },[ongoingState, router]);

  //to be looked over for amendment
  const closeModal = useCallback(()=> {
    console.log({modalOpen, modalAction})
    setModalOpen(prev => ({
      ...prev,
      isOpen: false,
    }));
  }, [modalOpen, modalAction])

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
    });
  }, [modalContentParent, resetAction, ongoingRedirectFallback, exit])

  const cancelExit = useCallback(() => {
    console.log(exit)
    setExit(false);
  },[exit])

  //Checks user action state to determine if to give warning or to just exit 
  const exitModal = useCallback(() => {
    //on close or home btn click if user is in a state where they have already started creation process this gives an about to exit warning 
    let giveWarning: boolean = false;

    const recordExitWarning = (modalContentParent === "record" && modalAction.name !== "check");

    const generateExitWarning = (modalContentParent === 'thumbnail' && modalAction?.generate?.state == 'after')

    if(recordExitWarning || generateExitWarning) {giveWarning = true};

    if(giveWarning && !exit) {
      //shows warning content
      setExit(true);
      return;
    }
    //If the action state has no commenced any creation just exit without warning
    resetModal();
  },[modalAction, modalContentParent, resetModal, exit])

  const onOpen = useCallback((modal?: OnOpenArgs) => {
    setModalOpen(prev => {
      const props = modal && {
        type: modal.type,
        closeIcon: modal?.closeIcon || prev.closeIcon
      }
      return props ? {isOpen: true, ...props} : {...prev, isOpen: true}
    });
  },[])

  const logActionError = (log: string) => {
    setActionError(log);
  }

  const changeContentParent = useCallback((parent: ParentContentType) => {
    setModalContentParent(_ => parent)
  },[])

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
      state,
      response: response_ ? response_ : null
    }

    setModalAction(_ => {
      return type === "before"
      ? getAction(action as BeforeModalActionType) 
      : getAction(action as OngoingModalActionType)
    })
  }, [modalAction, getAction, actionType])

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
    logActionError('');
  },[changeAction])

  //for initialize a before type action
  const beforeAction = useCallback((name: Action) => initializeAction('before', name),[initializeAction]);

  //for initializing an ongoing type action
  const ongoingAction = useCallback((name: Action) => initializeAction('ongoing', name),[initializeAction]);

  const openModal = useCallback(({
    action, 
    type, 
    parent, 
    closeIcon,
    addedCondition
  } : OpenModalArgs) => {

    const matchedParent_Action = parent ? modalContentParent === parent : modalAction.name === action;

    const isModalType = modalOpen.type === type

    const withCondition = addedCondition ? addedCondition : true

    console.log({modalContentParent, modalAction, modalOpen})

    if(isModalType && matchedParent_Action && withCondition) {
      console.log('opening modal')
      onOpen();
    } else {
      console.log('resetting modal')

      setModalContentParent(parent || null);

      if(typeof action === 'function' ) {
        action();
      } else if (action === 'download' || action === 'edit') {
        ongoingAction(action)
      } else beforeAction(action);     

      const content = closeIcon ? {type, closeIcon} : {type}
      setTimeout(() => onOpen(content), 100);

    }
  },[modalOpen, modalContentParent, modalAction, beforeAction, onOpen, ongoingAction])

  const syncModalContent = useCallback((
    modalType: ModalType, 
    content: ModalContentType
  ) => {
    if(modalOpen.type === modalType) {
      setModalContent(content);
    }
  }, [modalOpen.type])

  //returns the warning text on exit button click including the exit action on exit confirmation
  const exitModalContent = useCallback((resetFn?: VoidAction): ModalContentType => {
    let modalReset = resetModal;

    if(resetFn) {
      modalReset = () => {
        resetModal();
        resetFn();
      }
    }
    return exitContent(modalReset, cancelExit)}
  ,[resetModal, cancelExit])

  const redirectedContent = useCallback((): ModalContentType => redirectedContent_(resetModal),[resetModal])

  useEffect(()=> console.log({modalOpen, modalAction}), [modalOpen, modalAction])

  return <ModalContext.Provider value={{
    modalOpen,
    modalAction,
    modalContent,
    exit,
    modalContentParent,
    actionError,
    logActionError,
    syncModalContent,
    exitModalContent,
    redirectedContent,
    changeContentParent,
    closeModal,
    cancelExit,
    onOpen,
    exitModal,
    resetModal,
    openModal,
    resetAction,
    successfulAction,
    failedAction,
    beforeAction,
    ongoingAction,
    changeState,
    imageFS,
    imageFSActions,
    changeImageFS,
    changeImageFSActions,
  }}>
    {children}
  </ModalContext.Provider>
}

export const useModalContext = ()=> {
  const value = useContext(ModalContext);
  if(value == null) throw Error ("Cannot use outside of ModalContext");

  return value;
}

export default ModalProvider