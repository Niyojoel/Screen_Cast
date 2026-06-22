import { Logo } from '@/components'
import Image from 'next/image'
import React from 'react'

const Testimonials = () => {
  return (
    <>
        <aside className='testimonial'>
            <Logo className="lg:flex hidden"/>
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
    </>
  )
}

export default Testimonials