"use client"
import {useEffect, useMemo, useState} from 'react';
import { Img } from './ActionButton';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

const DropdownList = ({
    options,
    searchFilter = false,
    action,
}: DropdownListProps) => {

  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

    //****not appropriate for search filter***
  const [selectedOption, setSelectedOption] = useState(searchFilter 
    ? searchParams.get("filter") || options[0].label 
    : options[0].label
  );

  const activeOptionObj = useMemo(()=> {
    return options.find(option => option.label === selectedOption)!;
  }, [options, selectedOption])

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const onSelect = (option: string) => {
    setIsOpen(false);
    setSelectedOption(option);
    action(option);
  };

  const handleLeaveUl = () => isOpen && setIsOpen(false);

  useEffect(() => {
    setSelectedOption(searchParams.get("filter") || options[0].label);
  }, [searchParams]);

  return (
    <div className='relative flex flex-col' onMouseLeave={handleLeaveUl}>
        <div className="flex gap-2 items-center cursor-pointer" onClick={toggleOpen}>
            <OptionsTrigger 
                label={activeOptionObj?.label}
                icon={activeOptionObj?.icon}
                src= {searchFilter ? "/assets/icons/hamburger.svg" : ''}
            />
        </div>
        <ul 
            className={cn('dropdown', {"expand": isOpen})}
        >
            {options.map(({label, icon}) => (
                <li
                    key={label}
                    className={cn('list-item', {"bg-pink-100 text-white": selectedOption === label})}
                    onClick={()=> onSelect(label)}
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

const OptionsTrigger = ({ src, icon, label}: DropdownOptionsType & {src?: string}) => (
    <div className="options-trigger">
        <figure >
            {icon && icon}
            {src && (
                <Img
                src={src} alt="menu"
                size={14}
            />
            )}
            <span>{label}</span>
        </figure>
        <Img
            src="/assets/icons/arrow-down.svg" 
            alt="arrow-down" 
            size={20}
        />
    </div>
)

export default DropdownList