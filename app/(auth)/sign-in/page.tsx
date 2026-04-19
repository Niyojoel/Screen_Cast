"use client"

import { authClient } from '@/lib/authClient'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'

const page = () => {
const onSignIn = async () => {
  try {
    await authClient.signIn.social({provider: "google", callbackURL: "/"})
  }catch (error) {
    toast.error("Error logging user in. Try again")
  }
}
  return (
    <main className='sign-in'>
      <aside className='testimonial'>
        <Link href="/">
          <Image src="/assets/icons/logo.svg" alt="logo" width={32} height={32}/>
          <h1>ScreenCast</h1>
        </Link>
        <div className="description">
          <section>
            <figure>
              {Array.from({length: 5}).map((_, index)=> (
                <Image src="assets/icons/star.svg" alt="star" width={20} height={20} key={index}/>
              ))}
            </figure>
            <p>ScreenCast makes screen recording easy. From short walkthroughs to full fledge presentations. It's fast, smooth and shareable in seconds </p>
            <article>
              <Image src="/assets/images/jason.png" alt="user" width={64} height={64} className='rounded-full'/>
              <div className="">
                <h2>Tope Owolabi</h2>
                <p> A Data Analyst at Golden Waves </p>
              </div>
            </article>
          </section>
        </div>
        <p>ScreenCast {(new Date()).getFullYear()}</p>
      </aside>
      <aside className='google-sign-in'>
        <section>
          <Link href="/">
              <Image src="/assets/icons/logo.svg" alt='logo' width={40} height={40}/>
              <h1>ScreenCast</h1>
          </Link>
          <p>
            Create and share your very first <span>ScreenCast video</span> in no time!
          </p>
          <button onClick={onSignIn}>
          <Image src="/assets/icons/google.svg" alt="google" width={22} height={22}/>
          <span>Sign in with Google</span>
          </button>
        </section>
      </aside>
      <div className="overlay"></div>
    </main>
  )
}

export default page