import { Img } from './ActionButton'
import Link from 'next/link'

const Logo = ({inactive = false}: {inactive?: boolean}) => {
  
  return (
    <span className='logo'>
        <Link href={inactive ? "#" : "/"}>
          <Img
            src="/assets/icons/logo.svg"
            alt="logo"
            size={32}
            noClass
        />
        <h1> ScreenCast </h1>
        </Link>
    </span>
  )
}

export default Logo