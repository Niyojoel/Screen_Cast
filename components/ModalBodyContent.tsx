import { 
    CustomActionModalProps, 
    CustomActionModalProps2, 
    ModalBodyProps
} from '..'
import { cn } from '@/lib/utils'
import { MODAL_ICONS } from '@/constants/lists'
import { CheckCircleIcon } from 'lucide-react'


const ModalBody = ({
    icon,
    headerNode, 
    subNode,
    className = "",
    actionPopup = true
}: ModalBodyProps) => {

  return (
    <div className={cn(`content-body ${actionPopup ? 'items-center' : "items-start"}`, className)}>
      {(headerNode && typeof headerNode === 'string') || icon ? (
        <p className={cn("flex items-center gap-2 text-center")}>
            {icon && <i className="text-pink-100">{icon}</i>}
            {headerNode && <span className="font-medium">{headerNode}</span>}
        </p>
      ): headerNode && typeof headerNode === 'object' 
        ? headerNode
        : null
      }
      {subNode && typeof subNode === "string" 
      ? (
        <p className={cn("text-center", {"text-start": !actionPopup})}>
          {subNode}
        </p>)
      : subNode && typeof subNode === 'object' 
        ? subNode 
        : null
      }
    </div>
  )
}

export const FailedActionModalBody = ({
    text,
    className,
    header
}: CustomActionModalProps) =>  (
    <ModalBody
        icon = {MODAL_ICONS.failed}
        headerNode = {header || 'Something went wrong'}
        className={className}
        subNode = {text ? text : 'Try again'}
    />

)

export const SuccessfulActionModalBody = ({
    text,
    className,
    header
}: CustomActionModalProps) => header ? (
    <ModalBody
        icon = {MODAL_ICONS.checked}
        headerNode={header}
        className={className}
        subNode = {text && text}
    />

) : (
    <ModalBody
        icon = {MODAL_ICONS.checked}
        className={className}
        subNode = {text}
    />

)

export const OngoingActionModalBody = ({
    text,
    className,
}: CustomActionModalProps2) =>  (
    <ModalBody
        icon = {MODAL_ICONS.loader}
        className={className}
        subNode = {text}
    />

)

export const WarningActionModalBody = ({
    header,
    text,
    className,
}: CustomActionModalProps2) =>  (
    <ModalBody
        icon = {MODAL_ICONS.alert}
        headerNode={header}
        className={className}
        subNode = {text}
    />

)

export const ModalListItem = ({text, icon}: {text: string | null, icon?: React.ReactElement}) => {

    if(!text) return null;

    return (
    <ModalBody
        icon={icon || <CheckCircleIcon size={16} stroke="#ff4393"/>}
        headerNode={text}
        className='w-fit'
    />
    ) 
}


export default ModalBody