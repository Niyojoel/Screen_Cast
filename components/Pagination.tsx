'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn, generatePagination, updateURLParams } from '@/lib/utils';
import { Img } from './ActionButton';

type PaginationProps = {
  currentPage?: number;
  totalPages?: number;
  queryString?: string;
  filterString?: string;
};

const Pagination = ({
  currentPage = 1, 
  totalPages = 10, 
  queryString ="", 
  filterString=""
}: PaginationProps) => {
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const pages = generatePagination(currentPage, totalPages)

  const createPageUrl = (pageNumber: number)=> {
    return updateURLParams(
      searchParams,
      {
        page: pageNumber.toString(),
        query: queryString?.trim() || null,
        filter: filterString || null
      },
      '/'
    )
  }

  const navigateToPage = (pageNumber: number) => {
    if(pageNumber < 1 || pageNumber > totalPages) return
    router.push(createPageUrl(pageNumber))
  }
  return (
    <section className='pagination'>
      <button
        className={cn('nav-button', {
          'pointer-events-none opacity-50': currentPage === 1
        })}
        onClick={()=> navigateToPage(currentPage - 1)}
        disabled = {currentPage === 1}
        aria-disabled = {currentPage === 1}
      >
        <Img
          src="/assets/icons/arrow-left.svg"
          alt="previous"
        />
        Previous
      </button>

      <div className="">
        {pages.map((page, index) => 
          page === "..." ? (
            <span key={`ellipsis-${index}`}>...</span>
          ) : (
            <button 
              key={`page-${pages}-${index}`}
              onClick={()=> navigateToPage(page as number)}
              className={cn({'bg-pink-100 text-white': currentPage === page})}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        className={cn('nav-button', {
          'pointer-events-none opacity-50': currentPage === totalPages
        })}
        onClick={()=> navigateToPage(currentPage + 1)}
        disabled = {currentPage === totalPages}
        aria-disabled = {currentPage === totalPages}
      >
        <Img
          src="/assets/icons/arrow-right.svg"
          alt="next"
        />
        Next
      </button>
    </section>
  )
}

export default Pagination