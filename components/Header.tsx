import Image from 'next/image'
import Link from 'next/link'
import {ActionButton, BtnImg, DropdownList, RecordStream} from '.'

const Header = ({subHeader, title, userImg}: SharedHeaderProps) => {
  return (
    <header className='header'>
        <section className='header-container'>
            <div className='details'>
                {userImg && (
                    <BtnImg
                        image={userImg} 
                        alt="user_image" 
                        size={66}
                    />
                )}
                <article>
                    <p>{subHeader}</p>
                    <h1>{title}</h1>
                </article>
            </div>
            <aside>
                <ActionButton
                    image="/assets/icons/upload.svg"
                    alt="upload"
                    href="/upload"
                    noImgClass
                >
                    <span>Upload a video</span>
                </ActionButton>
                <RecordStream/>
            </aside>
        </section>
        <section className='search-filter'>
            <div className="search">
                <input type="text" placeholder='Search for videos, tags, folders...' />
                <BtnImg 
                    image="/assets/icons/search.svg" 
                    alt="search" 
                    noClass
                />
            </div>
            <DropdownList/>
        </section>
    </header>
  )
}

export default Header;