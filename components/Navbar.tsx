"use client"

import { 
    ActionButton, 
    Logo 
} from '.'
import { authClient } from '@/lib/authClient'
import { 
    useRouter, 
    redirect
} from 'next/navigation'
import { dummySession } from '@/constants'

const Navbar = () => {
  const router = useRouter();

//   const {data: session} = authClient.useSession()

//   const user = session?.user;
//   const {id, image} = user;

const onLogOut = () => authClient.signOut({
    fetchOptions: {
        onSuccess: () => {
            redirect('/')
        }
    }
})

const session = dummySession;

const {user} = session;
const {id, image} = user;

  const goToProfile = () => router.push(`/profile/${id}`)

  return (
    <header className='navbar'>
        <nav className='wrapper'>
            <Logo/>
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
                        action={onLogOut}
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