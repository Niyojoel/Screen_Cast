"use client"

import { DropdownOptionsType } from "@/index"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import DropdownList from "../DropdownList"
import { filterOptions } from '@/constants';
import { Img } from "../"
import { useCallback, useEffect, useState } from "react"
import { updateURLParams } from "@/lib/utils"

const defaultFilter = filterOptions.filter(option => option?.default)[0];

const Filter = () => {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedFilter, setSelectedFilter] = useState<DropdownOptionsType>(defaultFilter);
  
  const onFilterChange = useCallback((filterOption: DropdownOptionsType) => {
    setSelectedFilter(filterOption);
    const url = updateURLParams(
        searchParams,
        {filter: filterOption.label || null},
        pathname
    );
    router.push(url);
  },[router, pathname, searchParams]);

  useEffect(() => {
    const activeFilter = filterOptions.find(option => option.label === searchParams.get("filter"))
    setSelectedFilter(activeFilter || defaultFilter)
  }, [searchParams])

  return (
    <DropdownList
        options={filterOptions}
        activeOption={selectedFilter}
        onSelectAction={onFilterChange}
        triggerIcon={
          <Img 
            src="/assets/icons/hamburger.svg"
            alt="menu"
            size= {14}
          />
        }
        className='z-50'
    />
  )
}

export default Filter