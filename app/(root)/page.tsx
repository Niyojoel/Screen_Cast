import {SharedHeader, Videos} from '@/components'
import { SearchParams} from '@/index'

const page = async ({searchParams}: SearchParams) => {
  return (
    <main className='wrapper page'>
      <SharedHeader subHeader="Public Library" title="All Videos"/>
      <Videos searchParams={searchParams} emptyVideoMessage={"Try changing your search words"}/>
    </main>
  )
}

export default page