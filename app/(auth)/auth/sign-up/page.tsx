"use client"

import React, { useEffect } from 'react'
import { useAuthViewContext } from '../authViewContext'
import { useRouter } from 'next/navigation'

const SignUp = () => {
  const { changeAuthView } = useAuthViewContext()

  const router = useRouter()

  useEffect(() => {
    changeAuthView('sign-up');
    router.push('/auth')
  }, [router, changeAuthView])

  return <></>
}

export default SignUp