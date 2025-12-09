"use client"

import Image from 'next/image'
import Link from 'next/link'
import { ActionButton } from '.'
import { authClient } from '@/lib/authClient'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const router = useRouter();
  const {data: session} = authClient.useSession();
  
  const user = session?.user!;
  const {id, image} = user;

  const redirectToProfile = () => router.push(`/profile/${id}`)

  const handleLogOut = () => authClient.signOut()
  return (
    <header className='navbar'>
        <nav>
            <ActionButton
                image={image || "/assets/icons/logo.svg"}
                alt="logo"
                size={32} 
                href="/"
                noImgClass
            >
                <h1> ScreenCast </h1>
            </ActionButton>
            {user && (
                <figure>
                    <ActionButton
                        image={image || "/assets/images/dummy.jpg"}
                        size={36} 
                        alt="user"
                        imgClassName="aspect-square"
                        action={redirectToProfile}
                    >
                    </ActionButton>
                    <ActionButton
                        image="/assets/icons/logout.svg"
                        size={24} 
                        alt="logout"
                        imgClassName="rotate-180"
                        action={handleLogOut}
                    >
                    </ActionButton>
                </figure>
            )}
        </nav>
    </header>
  )
}

export default Navbar