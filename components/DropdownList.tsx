"use client"
import {useEffect, useMemo, useState} from 'react';
import { Img } from './ActionButton';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

const DropdownList = ({
    options,
    searchFilter = false,
    action,
    optionsStyle
}: DropdownListProps & {optionsStyle?: Record<string, string>}) => {

  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  //Getting active filter option using search params
  const activeFilterOption = useMemo(()=> {
    return options.find(option => option.label === searchParams.get("filter"))!;
  }, [options, searchParams])

//Getting default option via default property on option object
  const defaultOption = useMemo(()=>{
    const index = options.findIndex(option => option.default);
    return options[index];
}, [options]);

  const [selectedOption, setSelectedOption] = useState<DropdownOptionsType>(searchFilter 
    ? activeFilterOption || defaultOption 
    : defaultOption
  );

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const onSelect = (option: DropdownOptionsType) => {
    setIsOpen(false);
    setSelectedOption(option);
    action(option.label);
  };

  const handleLeaveUl = () => isOpen && setIsOpen(false);

  useEffect(() => {
    if(searchFilter){
        setSelectedOption(activeFilterOption || defaultOption);
    }else {
        setSelectedOption(defaultOption)
    }
  }, [searchParams, searchFilter, defaultOption]);
  
  return (
    <div className='relative flex flex-col' onMouseLeave={handleLeaveUl}>
        <div className="flex gap-2 items-center cursor-pointer" onClick={toggleOpen}>

            <OptionsTrigger 
                label={selectedOption.label}
                icon={selectedOption.icon}
                src= {searchFilter ? "/assets/icons/hamburger.svg" : ''}
            />
        </div>
        <ul 
            className={cn('dropdown', {"expand": isOpen})}
        >
            {options.map(({label, icon}) => (
                <li
                    key={label}
                    style={optionsStyle}
                    className={cn('list-item', {"bg-pink-100 text-white": selectedOption.label === label})}
                    onClick={()=> onSelect({label, icon})}
                >
                    {icon ? (<figure> {icon} {label}</figure>) : label}
                    
                    {selectedOption.label === label && (
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

const OptionsTrigger = ({ src, className="", icon, label}: OptionsTriggerProps) => (
    <div className ={cn("options-trigger", className)}>
        <figure>
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