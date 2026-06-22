import { Img } from './'
import Link from 'next/link'

const Logo = ({inactive = false, className}: {inactive?: boolean, className?: string}) => {
  
  return (
    <span className={`logo ${className}`}>
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