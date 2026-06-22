"use client"

import { authClient } from '@/lib/authClient'
import { SUPPORTED_OAUTH_PROVIDERS, SUPPORTED_OAUTH_PROVIDERS_DETAILS } from '@/lib/oAuthProviders'
import React from 'react'
import BetterAuthActionBtn from './betterAuthActionBtn'

const SocialAuthButtons = () => {
  return (
    SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
        const {iconImg, name} = SUPPORTED_OAUTH_PROVIDERS_DETAILS[provider]

        return (
            <BetterAuthActionBtn 
              key={provider} 
              action={() => authClient.signIn.social({provider, callbackURL: "/"})}
              className="btn-white"
            >
              { iconImg }
              { name }
            </BetterAuthActionBtn>
        )
    })
  )
}

export default SocialAuthButtons