"use client"

import { dummySession } from '@/constants';
import { Img, RecordStream } from '..'
import { authClient } from '@/lib/authClient'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { SharedHeaderProps } from '../..';
import { useModalContext } from '@/lib/hooks/useModalContext';
import Search from './Search';
import Filter from './Filter';

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

  const router = useRouter();

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

  useEffect(() => {
    if(modalAction?.to_profile) {
        successfulAction('to_profile');
        setTimeout(() => resetModal, 2000)
    }
    
    const redirected = modalAction?.redirect?.state === 'after' && modalAction?.redirect?.response === 'successful'
        
    if(redirected) {
        const content = redirectedContent();
        if(content) syncModalContent('record', content);
    }
  },[
      modalAction?.to_profile, 
      modalAction?.redirect?.response, 
      modalAction?.redirect?.state, 
      redirectedContent, 
      resetModal, 
      successfulAction, 
      syncModalContent
    ]) 

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
                <button onClick={onGoToUpload}>
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
            <Search/>
            <Filter/>
        </section>
    </header>
  )
}

export default SharedHeader;