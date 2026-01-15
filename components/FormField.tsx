"use client"

import DropdownList from "./DropdownList"
import { DropdownOptionsType, FormFieldProps} from ".."
import { useState } from "react"

const FormField = ({
    id,
    label,
    type,
    value,
    placeholder,
    onChange,
    as='input',
    options=[]
}: FormFieldProps) => {
  return (
    <div className='form-field'>
      <label htmlFor={id}>{label}</label>
      {as == 'textarea' ? (
        <textarea
          id={id} 
          name={id} 
          value={value} 
          onChange={onChange} 
          placeholder={placeholder} 
          rows={3}
        />
      ) : as == 'select' ? (
        <Select 
          onChange={onChange}
          options={options}
        />
      ) : (
        <input 
          id={id} 
          type={type} 
          name={id} 
          value={value} 
          onChange={onChange} 
          placeholder={placeholder}
        />
      )}
    </div>
  )
}


const Select =  ({options, onChange}: Required<Pick<FormFieldProps, 'options'| 'onChange'>>) => {

  const [selectedOption, setSelectedOption] = useState<DropdownOptionsType>({label: 'Select visibility (Public or Private)', placeholder: true})

  const selectAction = (option: DropdownOptionsType) => {
    setSelectedOption(option);
    onChange({name: option.label, value: option.value})
  }

  return (
     <DropdownList
      activeOption={selectedOption}
      options={options}
      onSelectAction={selectAction}
    />
  )
}

export default FormField