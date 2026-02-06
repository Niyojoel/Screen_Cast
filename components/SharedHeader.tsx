"use client"
import { dummySession, filterOptions } from '@/constants';
import {Img, DropdownList, RecordStream} from '.'
import { authClient } from '@/lib/authClient'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { updateURLParams } from '@/lib/utils';
import toast from 'react-hot-toast';
import { DropdownOptionsType, ModalContentType, SharedHeaderProps } from '..';
import { useGlobalContext } from '@/lib/hooks/useGlobalContext';
import { successfulRedirectContent } from '@/constants/lists';

const SharedHeader = ({subHeader, title, userImg}: SharedHeaderProps) => {

  const {modalAction, successfulAction, resetModal, syncModalContent} = useGlobalContext()

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeFilter = useMemo(()=> filterOptions.find(option => option.label === searchParams.get ("filter")), [filterOptions, searchParams])

  const defaultFilter = useMemo(()=> filterOptions.filter(option => option?.default)[0], [filterOptions, searchParams])

  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")
  const [selectedFilter, setSelectedFilter] = useState<DropdownOptionsType>(activeFilter || defaultFilter);

  const handleFilterChange = (option: DropdownOptionsType) => {
    setSelectedFilter(option);
    const url = updateURLParams(
        searchParams,
        {filter: option.label || null},
        pathname
    );
    router.push(url);
  };

  useEffect(() => {
    setSearchQuery(searchParams.get("query") || "");
    setSelectedFilter(activeFilter || defaultFilter)
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
  const redirectedContent = useCallback((action: boolean): ModalContentType | null => successfulRedirectContent(resetModal, action),[resetModal, successfulRedirectContent])

  useEffect(() => {
    if(modalAction?.to_profile) {
        successfulAction('to_profile');
        setTimeout(() => resetModal, 2000)
    }
    
    const redirected = modalAction?.redirect?.state === 'after' && modalAction?.redirect?.response === 'successful'
        
    if(redirected) {
        const content = redirectedContent(redirected);
        if(content) syncModalContent('record', content);
    }
  },[modalAction?.to_profile]) 

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
                <button
                    onClick={handleGoToUpload}
                >
                    <Img
                        src="/assets/icons/upload.svg"
                        alt="upload"
                        noClass
                    />
                    <span>Upload a video</span>
                </button>
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
                activeOption={selectedFilter}
                onSelectAction={handleFilterChange}
                triggerIcon={<Img 
                    src="/assets/icons/hamburger.svg"
                    alt="menu"
                    size= {14}
                />
                }
                className='z-50'
            />
        </section>
    </header>
  )
}

export default SharedHeader;