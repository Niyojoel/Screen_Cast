"use client"
import { VoidActionParam } from '@/lib/hooks/useModalContext'
import React, { ReactElement, useContext, useState } from 'react'
import { createContext } from 'react'

export type AuthViewType = 'sign-in' | 'sign-up'

export type AuthContextType = {
    view: AuthViewType;
    changeAuthView: VoidActionParam<AuthViewType>
} 

const AuthViewContext = createContext<AuthContextType | null>(null)

export default function AuthViewProvider ({children}: {children: ReactElement}) {
    const [view, setView] = useState<AuthViewType>('sign-in')

    const changeAuthView = (authView: AuthViewType): void => {
        setView(authView)
    }

    return <AuthViewContext value={{view, changeAuthView}}>{children}</AuthViewContext>
}

export const useAuthViewContext = () => {
    const value = useContext(AuthViewContext);
    if(value == null) throw new Error("Cannot use outside of the AuthViewContext");

    return value;
}