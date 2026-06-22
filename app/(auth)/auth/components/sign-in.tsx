"use client"

import React from 'react'
import {Form, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import z from "zod"
import { FormField, SubmitBtn } from '@/components'
import { authClient } from '@/lib/authClient'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { VoidActionParam } from '@/lib/hooks/useModalContext'

const signInSchema = z.object({
    email: z.email().min(1),
    password: z.string().min(8),
})

type SignInForm = z.infer<typeof signInSchema> 

const SignIn = ({isSubmitting: handleIsSubmitting}: {isSubmitting: VoidActionParam<boolean>}) => {
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const router = useRouter()

  const {isSubmitting} = form.formState

  async function handleSignIn (data: SignInForm) {
    // set submitting to true to disable sig-up tab btn
    handleIsSubmitting(true)

    await authClient.signIn.email({...data, callbackURL: "/"}, {
      onError: (error) => {
        toast.error(error.error.message || "failed to sign in")
      },
      onSuccess: () => {
        handleIsSubmitting(false)
        router.push("/")
      }
    })
  }

  return <>
    <div className='w-full'>
      <form action="">
        <label htmlFor='email'>
          Email
          <input type="text" id="email" name="email" className='w-full border-[1px] border-dark-800'/>
        </label>
        <label htmlFor='password'>
          Password
          <input type="text" id="password" name="password" className='w-full border-[1px] border-dark-800'/>
        </label>
        <SubmitBtn isSubmitting={isSubmitting} btnText="Sign In" className={"w-full submit-button mt-5"}/>
      </form>
    </div>
      {/* 
  <Form {...form}> 
    <form className='space-y-4' onSubmit={form.handleSubmit(handleSignIn)}>
      <FormField
        control={form.control}
        name="email"
        render={({field}) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" {...field}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({field}) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <PasswordInput type="password" {...field}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />
      <SubmitBtn isSubmitting={isSubmitting} btnText="Sign In" className={"submit-button"}/>
    </form>
  </Form>
  */}
  </>
}

export default SignIn