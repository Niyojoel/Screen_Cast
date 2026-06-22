import { VoidAction } from '@/lib/hooks/useModalContext';
import { LoaderPinwheel } from 'lucide-react';
import React from "react"

export default function SubmitBtn ({isSubmitting, btnText,className="btn-white", onClick}: {
    isSubmitting: boolean,
    onClick?: VoidAction,
    btnText: string, 
    className: "btn-white" | "submit-button" | string
}) {
    return (
        <button type="submit" disabled={isSubmitting} className={className} onClick={onClick}>
            {isSubmitting ? <LoaderPinwheel/> : btnText}
        </button>)
}