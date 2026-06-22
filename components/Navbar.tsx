import { getUser } from '@/lib/actions/getByIfOnline'
import { Img, Logo, LogoutBtn } from '.'
import Link from 'next/link'
import { UserType } from '..'

const Navbar = async () => {
  const user: UserType | null = await getUser()

  return (
    <header className='navbar'>
        <nav className='wrapper'>
            <Logo/>
            {user ? (
                <figure>
                    <Link href={`/profile/${user?.id}`}>
                        <Img
                            src={user?.image || "/assets/images/dummy.jpg"} 
                            alt="user"
                            size={36}
                            className="aspect-square"
                        />    
                    </Link>
                    <LogoutBtn/>
                </figure>
            ) : (
                <Link href="/auth" className="sign-in_btn"><span>Sign In</span></Link>
            )}
        </nav>
    </header>
  )
}

export default Navbar