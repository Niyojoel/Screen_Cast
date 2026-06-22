"use client"

import { ActionButton, Logo } from '@/components'
import { SignIn, SignUp, SocialAuthButtons, Testimonials} from './components'
import { useAuthViewContext } from './authViewContext'
import { useEffect, useState } from 'react'
import { getUser } from '@/lib/actions/getByIfOnline'
import { useRouter } from 'next/navigation'

const Page = () => {
  const {view, changeAuthView} = useAuthViewContext()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  const handleIsSubmitting = (processing: boolean) => {
    setIsSubmitting(processing)
  }

  useEffect(() => {
    const checkUser = async () => {
        const user = await getUser()
        if (user) router.back()
    }
    checkUser()
  },[router])

  return (
    <main className='auth'>
        <Testimonials/>
        <section className='flex items-center justify-center lg:w-1/2 w-full lg:h-screen'>
            <div className="flex flex-col">
                <h1 className='text-2xl font-semibold tracking-tight text-gray-800 mb-5 text-center'>
                    Get started creating your <span className='text-pink-100'>video</span>
                </h1>
                <div className='rounded-20 bg-white shadow-10 flex flex-col px-5 py-5 gap-5 max-w-84'>
                    <p className='text-lg font-medium text-pink-500'>
                        {view === "sign-up" 
                            ? "Create an account" 
                            : "Welcome Back !"
                        }
                    </p>
                    {/* auth form */}
                    {view === "sign-in" ? (<SignIn isSubmitting={handleIsSubmitting}/>) : (<SignUp isSubmitting={handleIsSubmitting}/>)}
                    {/* social-auth button */}
                    <SocialAuthButtons/>
                    {/* toggle link */}
                    <div className='text-center text-sm text-gray-600'>
                        {view === "sign-up" ? (
                            <>
                            <span className='mr-3 text-dark-900 text-base'>You have an Account ? </span>
                            <ActionButton 
                                type="button" 
                                action={() => changeAuthView('sign-in')} 
                                showLoading={false} 
                                className='text-pink-100' 
                                disabled={isSubmitting}
                            >
                                Sign In
                            </ActionButton>
                            </>
                        ) : (
                            <>
                            <span className='mr-3 text-dark-900 text-base'>
                                Need to create an account ?
                            </span>
                            <ActionButton 
                                type="button" 
                                action={() => changeAuthView('sign-up')} 
                                showLoading={false} 
                                className='hover:text-pik-100 text-pink-100' 
                                disabled={isSubmitting}
                            >
                                Sign Up
                            </ActionButton>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
        <Logo className='p-7 lg:hidden visible'/>
    </main>
  )
}

export default Page