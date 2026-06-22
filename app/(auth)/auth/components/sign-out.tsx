"use client"
import React from 'react'
import { Img } from '../../../../components'
import { redirect } from 'next/navigation'
import { authClient } from '@/lib/authClient'
import BetterAuthActionBtn from '@/app/(auth)/auth/components/betterAuthActionBtn'

const LogoutBtn = () => {
  const onLogOut = () => authClient.signOut({
      fetchOptions: {
          onSuccess: () => {
              redirect('/')
          }
      }
  })

  return (
    <BetterAuthActionBtn
        action={onLogOut}
    >
        <Img
            src="/assets/icons/logout.svg"
            size={24} 
            alt="logout"
            className="rotate-180"
        />
    </BetterAuthActionBtn>
  )
}

export default LogoutBtn