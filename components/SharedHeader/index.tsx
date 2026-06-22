import { Img, RecordStream } from '..'
import Search from './Search';
import Filter from './Filter';
import Link from 'next/link';
import { SharedHeaderProps } from '@/index';
import { getUser } from '@/lib/actions/getByIfOnline';

const SharedHeader = async ({
  subHeader, 
  title, 
  userImg
}: SharedHeaderProps) => {

  const user = await getUser()

  return (
    <header className='header'>
        <section className='header-container'>
            <div className='details'>
                {userImg && (
                    <Img
                      src={userImg} 
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
                <Link href={user ? "/upload" : "/auth"}>
                    <Img
                        src="/assets/icons/upload.svg"
                        alt="upload"
                        noClass
                    />
                    <span>Upload a video</span>
                </Link>
                <RecordStream currentUser={user}/>
            </aside>
        </section>
        <section className='search-filter'>
            <Search/>
            <Filter/>
        </section>
    </header>
  )
}

export default SharedHeader;