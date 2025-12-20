"use client"
import Image from 'next/image';
import {useState} from 'react';
import { Img } from './ActionButton';
import { cn } from '@/lib/utils';

const DropdownList = ({
    options, 
    selectedOption, 
    toggleOpen,
    isOpen,
    triggerElement,
    close,
    onOptionSelect
}: DropdownListProps) => {

  return (
    <div className='relative flex flex-col'>
        <div className="flex gap-2 items-center cursor-pointer" onClick={toggleOpen}>
            {triggerElement}
        </div>
        <ul
            className={cn('dropdown', {"expand": isOpen})}
        >
            {options.map(({label, icon}) => (
                <li 
                    key={label}
                    className={cn('list-item', {"bg-pink-100 text-white": selectedOption === label})}
                    onClick={()=> onOptionSelect(label)}
                >
                    {icon && icon}
                    {label}
                    {selectedOption === label && (
                        <Img
                            src="/assets/icons/check.svg"
                            alt="check"
                        />
                    )}
                </li>
            ))}
        </ul>
    </div>
  )
}

export const OptionsTrigger = ({ src, ...selectedOption}: DropdownOptionsType & {src?: string}) => (
    <div className="options-trigger">
        <figure >
            {selectedOption.icon && selectedOption.icon}
            {src && (
                <Img
                src={src} alt="menu"
                size={14}
            />
            )}
            <span>{selectedOption.label}</span>
        </figure>
        <Img
            src="/assets/icons/arrow-down.svg" 
            alt="arrow-down" 
            size={20}
        />
    </div>
)

export default DropdownList