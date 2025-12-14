"use client"

import { ActionButton, Img } from '.'
import { authClient } from '@/lib/authClient'
import { useRouter} from 'next/navigation'
import handleLogOut from '@/lib/helper/auth/auth'
import { dummySession } from '@/constants'
import Link from 'next/link'

const Navbar = () => {
  const router = useRouter();

//   const {data: session} = authClient.useSession()

//   const user = session?.user;
//   const {id, image} = user;

const session = dummySession;

const {user} = session;
const {id, image} = user;

  const goToProfile = () => router.push(`/profile/${id}`)

  return (
    <header className='navbar'>
        <nav>
            <Link href="/">
                <Img
                    src="/assets/icons/logo.svg"
                    alt="logo"
                    size={32}
                    noClass
                />
                <h1> ScreenCast </h1>
            </Link>
            {user ? (
                <figure>
                    <ActionButton
                        src={image || "/assets/images/dummy.jpg"}
                        size={36} 
                        alt="user"
                        imgClassName="aspect-square"
                        action={goToProfile}
                    >
                    </ActionButton>
                    <ActionButton
                        src="/assets/icons/logout.svg"
                        size={24} 
                        alt="logout"
                        imgClassName="rotate-180"
                        action={handleLogOut}
                    >
                    </ActionButton>
                </figure>
            ) : (
                <button onClick={()=> router.push('/sign-in')}>
                    <span>Sign In</span>
                </button>
            )}
        </nav>
    </header>
  )
}

export default Navbar