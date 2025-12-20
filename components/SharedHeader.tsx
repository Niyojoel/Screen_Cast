"use client"
import { dummySession, filterOptions } from '@/constants';
import {ActionButton, Img, DropdownList, RecordStream, OptionsTrigger} from '.'
import { authClient } from '@/lib/authClient'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react';
import { updateURLParams } from '@/lib/utils';
import toast from 'react-hot-toast';

const SharedHeader = ({subHeader, title, userImg}: SharedHeaderProps) => {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedFilter, setSelectedFilter] = useState(searchParams.get("filter") || filterOptions[0].label)

const activeFilterObj = useMemo(()=>{
    return filterOptions.find(option => option.label === selectedFilter)!;
},[selectedFilter, filterOptions])

  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setIsOpen(false);
    const url = updateURLParams(
        searchParams,
        {filter: filter || null},
        pathname
    );
    router.push(url);
  };

  useEffect(() => {
    setSearchQuery(searchParams.get("query") || "");
    setSelectedFilter(searchParams.get("filter") || filterOptions[0].label);
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

const [isOpen, setIsOpen] = useState(false);

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
        <section className='header-container' onMouseEnter={()=> setIsOpen(false)}>
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
            <div className="search" onMouseEnter={()=> setIsOpen(false)}>
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
                selectedOption={selectedFilter}
                toggleOpen = {() => setIsOpen(!isOpen)}
                isOpen = {isOpen}
                onOptionSelect={handleFilterChange}
                triggerElement={<OptionsTrigger 
                    label={activeFilterObj.label} 
                    src="/assets/icons/hamburger.svg"/>
                }
            />
        </section>
    </header>
  )
}

export default SharedHeader;