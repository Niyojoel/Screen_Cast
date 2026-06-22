
import Image from 'next/image'
import { EmptyStateProps } from '..';
import { memo } from 'react';

const EmptyState = ({icon, icon_svg, title, description}: EmptyStateProps) => {
  return (
    <section className={`glass-panel empty-state`}>
        <figure className="">
            {icon ? (<Image src={icon} alt="empty-icon" width={46} height={46}/>) : (icon_svg)
            }
        </figure>
        <article>
            <h1>{title}</h1>
            <p>{description}</p>
        </article>
    </section>
  )
};

export default memo(EmptyState)