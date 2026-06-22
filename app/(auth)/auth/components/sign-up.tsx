"use client"

import React from 'react'
import {Form, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import z from "zod"
import { SubmitBtn } from '@/components'
import { authClient } from '@/lib/authClient'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { VoidActionParam } from '@/lib/hooks/useModalContext'

const signUpSchema =z.object({
    name: z.string().min(1),
    email: z.email().min(1),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
})

type SignUpForm = z.infer<typeof signUpSchema> 

const SignUp = ({isSubmitting: handleIsSubmitting}: {isSubmitting: VoidActionParam<boolean>}) => {
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  })

  const router = useRouter()

  const {isSubmitting} = form.formState

  async function handleSignUp (data: SignUpForm) {
    // set submitting to true to disable sig-up tab btn
    handleIsSubmitting(true)

    await authClient.signUp.email({...data, callbackURL: "/"}, {
      onError: (error) => {
        toast.error(error.error.message || "failed to sign up")
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
        <label htmlFor='name'>
          Name
          <input type="text" id="name" name="name" className='w-full border-[1px] border-dark-800'/>
        </label>
        <label htmlFor='email'>
          Email
          <input type="text" id="email" name="email" className='w-full border-[1px] border-dark-800'/>
        </label>
        <label htmlFor='password'>
          Password
          <input type="text" id="password" name="password" className='w-full border-[1px] border-dark-800'/>
        </label>
        <label htmlFor='password'>
          Confirm Password
          <input type="text" id="password" name="password" className='w-full border-[1px] border-dark-800'/>
        </label>
        <SubmitBtn isSubmitting={isSubmitting} btnText="Sign Up" className={"w-full submit-button mt-5"}/>
      </form>
    </div>
    {/* 
  <Form {...form}> 
    <form className='space-y-4' onSubmit={form.handleSubmit(handleSignUp)}>
      <FormField
        control={form.control}
        name="name"
        render={({field}) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field}/>
            </FormControl>
            <FormMessage/>>
          </FormItem>
        )}
      />
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
      <SubmitBtn isSubmitting={isSubmitting} btnText="Sign Up" className={"submit-button"}/>
    </form>
  </Form>
      */}
  </>
}

export default SignUp