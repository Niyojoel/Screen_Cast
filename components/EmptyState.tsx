"use client";

import Image from 'next/image'
import { memo } from 'react'
import { EmptyStateProps } from '..';

const EmptyState = memo(({icon, title, description}: EmptyStateProps) => {
  return (
    <section className='empty-state'>
        <figure className="">
            <Image src={icon} alt="empty-icon" width={46} height={46}/>
        </figure>
        <article>
            <h1>{title}</h1>
            <p>{description}</p>
        </article>
    </section>
  )
});

export default EmptyState