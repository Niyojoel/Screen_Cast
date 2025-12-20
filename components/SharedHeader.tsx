"use client"
import { dummySession, filterOptions } from '@/constants';
import {ActionButton, Img, DropdownList, RecordStream} from '.'
import { authClient } from '@/lib/authClient'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { updateURLParams } from '@/lib/utils';
import toast from 'react-hot-toast';

const SharedHeader = ({subHeader, title, userImg}: SharedHeaderProps) => {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")

  const handleFilterChange = (filter: string) => {
    const url = updateURLParams(
        searchParams,
        {filter: filter || null},
        pathname
    );
    router.push(url);
  };

  useEffect(() => {
    setSearchQuery(searchParams.get("query") || "");
  }, [searchParams]);

  useEffect(() => {
    const debounceTimer = setTimeout(()=> {
        if(searchQuery !== searchParams.get('query')) {
            const url = updateURLParams(
                searchParams,
                {query: searchQuery || null},
                pathname
            )
            router.push(url);
        }
    }, 500)
    return () => clearTimeout (debounceTimer)
  },[searchParams, searchQuery, pathname, router]);

//   const {data: session} = authClient?.useSession();

const session = dummySession;

const {user} = dummySession;

const handleGoToUpload = () => {
    if(user) {
        router.push('/upload')
    }else {
        router.push("/sign-in");
        toast('You need to sign in to access Upload page')
    }
}

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
                <ActionButton
                    src="/assets/icons/upload.svg"
                    alt="upload"
                    noImgClass
                    action={handleGoToUpload}
                >
                    <span>Upload a video</span>
                </ActionButton>
                <RecordStream/>
            </aside>
        </section>
        <section className='search-filter'>
            <div className="search">
                <input 
                    type="text" 
                    placeholder='Search for videos, tags, folders...'
                    onChange={(e)=> setSearchQuery(e.target.value)}
                    />
                <Img 
                    src="/assets/icons/search.svg" 
                    alt="search" 
                    noClass
                />
            </div>
            <DropdownList
                options={filterOptions}
                action={handleFilterChange}
                searchFilter
            />
        </section>
    </header>
  )
}

export default SharedHeader;