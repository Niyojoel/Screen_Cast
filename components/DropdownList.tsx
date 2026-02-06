"use client"
import {memo, useState} from 'react';
import { Img } from './ActionButton';
import {cn } from '@/lib/utils';
import { DropdownListProps, OptionsTriggerProps } from '..';
import {ChevronDown, ChevronUp} from "lucide-react";

const DropdownList = memo(({
    options,
    activeOption,
    onSelectAction,
    className,
    triggerIcon,
    triggerClass,
    disabled
}: DropdownListProps) => {

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const handleLeaveUl = () => isOpen && setIsOpen(false);

  return (
    <div 
        className="dropdown-select" 
        onMouseLeave={handleLeaveUl}
    >
        <div 
            className="dropdown-trigger-wrapper" 
            onClick={() => {if(!disabled) toggleOpen()}}
        >   
            {triggerIcon ? (
                <OptionsTrigger
                    activeOption={activeOption}
                    triggerIcon={triggerIcon}
                    isOpen={isOpen}
                    className={triggerClass ? triggerClass : ""}
                />
            ): (
                <OptionsTrigger
                    activeOption={activeOption}
                    isOpen={isOpen}
                    className={triggerClass ? triggerClass : ""}
                    disabled = {disabled}
                />
            )}
        </div>
        <ul 
            className={cn('dropdown', className || '', {"expand": isOpen})}
        >
            {options.map((option) => {

                const {label, value, icon} =  option;

                const text = value ? value : label;

                const activeCondition = value 
                ? activeOption.value === value 
                : activeOption.label === label; 

                return (
                    <li
                        key={text}
                        className={cn('list-item', {"bg-pink-100 text-white": activeCondition})}
                        onClick={()=> {
                            setIsOpen(false);
                            onSelectAction(option);
                        }}
                    >
                        {option.icon ? 
                        (<figure className='option'> 
                            {icon} 
                            <span>{text}</span>
                        </figure>
                        ) : text}
                        
                        {activeCondition && (
                            <Img
                                src="/assets/icons/check.svg"
                                alt="check"
                            />
                        )}
                    </li>
            )})}
        </ul>
    </div>
  )
});

const OptionsTrigger = ({
    activeOption,
    triggerIcon,
    className,
    isOpen,
    disabled
}: OptionsTriggerProps) => {
    const {label, icon, inactive, placeholder, value} = activeOption;
   
    const text = value ? value : label;

    const ghost = inactive || disabled;

    return (
    <div className ={cn(
        "options-trigger", 
        className, 
        {
        'bg-[#eee]': ghost, 
        "hover:border-gray-25": disabled
        }
        )}>
        <figure className={cn({"text-[#888]": ghost})}>
            {icon && icon}
            {triggerIcon && triggerIcon}
            <span className={cn({
                "text-[#888] text-base font-[450] tracking-[0.005rem]": placeholder,
                "text-[#888]": ghost,
                "font-normal text-base font-sans text-[#888]": value
                })}> 
                    {text}
            </span>
        </figure>

        
        {!isOpen 
            ? <ChevronDown size={20} stroke={disabled ? "#888" : '#212121'}/>
            : <ChevronUp size={20} stroke='#212121'/>}
    </div>
)};

export default DropdownList;