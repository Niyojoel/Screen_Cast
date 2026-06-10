"use client"

import { updateURLParams } from "@/lib/utils"
import { Img } from "../ActionButton"
import { ChangeEvent, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const Search = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("")

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
    
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
  },[searchQuery, pathname, searchParams, router]);

  useEffect(() => {
    setSearchQuery(searchParams.get('query') || "");
  }, [searchParams]);

  return (
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
  )
}

export default Search