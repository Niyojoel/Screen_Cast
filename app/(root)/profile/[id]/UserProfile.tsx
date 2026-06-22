import { SharedHeader } from '@/components'
import { getUser } from '@/lib/actions/video'
import React from 'react'
import { DummyUserType } from '@/constants'
import { DBUserType } from '@/index'

const UserProfile = async ({params}: {
  params: Promise<{[key: string]: string}>
}) => {

  const {id} = await params

  const user: DummyUserType | DBUserType = await getUser(id)

  //use intercepted route to display login modal on an attempt to navigate here if user is not logged in
  console.log(user)
  
  return (
    <SharedHeader 
        subHeader={user?.email} 
        title={user?.name} 
        userImg={user?.image ?? '/assets/images/dummy.jpg'}
    />
  )
}

export default UserProfile