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
        <select 
          id={id} 
          name={id} 
          value={value} 
          onChange={onChange}
        >
          {options?.map(({label, value}) => (<option key={label} value={value}>{label}</option>))}
        </select>
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

export default FormField