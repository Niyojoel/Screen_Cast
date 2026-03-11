"use client"

import { 
    dummySession, 
    filterOptions 
} from '@/constants';
import {
    Img, 
    DropdownList, 
    RecordStream
} from '.'
import { authClient } from '@/lib/authClient'
import { 
    usePathname, 
    useRouter, 
    useSearchParams
} from 'next/navigation';
import { 
    useEffect, 
    useMemo 
} from 'react';
import toast from 'react-hot-toast';
import { 
    DropdownOptionsType, 
    SharedHeaderProps 
} from '..';
import { useModalContext } from '@/lib/hooks/useModalContext';
import useSharedHeader from '@/lib/hooks/useSharedHeader';

const SharedHeader = ({
  subHeader, 
  title, 
  userImg
}: SharedHeaderProps) => {

  const {
    modalAction, 
    successfulAction, 
    resetModal, 
    syncModalContent, 
    redirectedContent
  } = useModalContext()

  const {
    searchQuery,
    selectedFilter,
    onFilterChange: filterChange,
    onSearchChange,
    searchDebounce,
    search_FilterSync
} = useSharedHeader()

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeFilter = useMemo(()=> filterOptions.find(option => option.label === searchParams.get ("filter")),[searchParams])

  //const {data: session} = authClient?.useSession();

  const session = dummySession;

  const {user} = dummySession;

  const onGoToUpload = () => {
    if(user) {
      router.push('/upload')
    }else {
      router.push("/sign-in");
      toast('You need to sign in to access Upload page')
    }
  }

  const redirect = (url: string) => router.push(url);

  const onFilterChange = (option: DropdownOptionsType) => {
    filterChange(
      option, 
      pathname, 
      searchParams, 
      redirect
    )
  }
  
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

  useEffect(() => {
    searchDebounce(
      searchQuery, 
      pathname, 
      searchParams, 
      redirect
    );
  },[searchQuery, pathname, searchParams]);

  useEffect(() => {
    search_FilterSync(searchParams.get('query')!, activeFilter)
  }, [searchParams, activeFilter]);

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
                    onClick={onGoToUpload}
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
                    onChange={onSearchChange}
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
                onSelectAction={onFilterChange}
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