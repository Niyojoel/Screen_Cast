'use client'
import { useEffect, useRef } from 'react'

const Alert = ({
  error, 
  setError, 
  className
}: {
  error?: string, 
  setError?: (message: string) => void, 
  className?: string
}) => {
  const errorAlertInViewRef = useRef<HTMLSpanElement>(null)
  
  useEffect(() => {
    if(errorAlertInViewRef.current !== null && error && setError) {
        errorAlertInViewRef?.current.scrollIntoView({behavior: 'smooth'})
        const errorTimer = setTimeout(() => setError(''), 3000);
        return ()=> clearTimeout(errorTimer);
    }
  },[error, errorAlertInViewRef])

  return (
    <>
      <span ref={errorAlertInViewRef} className="absolute top-0 left-[50%]"/>
      {error && <label className={`error-alert ${className}`}>{error}
      </label>}
    </>
  )
}

export default Alert