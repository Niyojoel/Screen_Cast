import { 
    ChangeEvent, 
    useCallback, 
    useState 
} from "react";
import { DropdownOptionsType } from "@/index";
import { updateURLParams } from "../utils";
import { filterOptions } from "@/constants";

const defaultFilter = filterOptions.filter(option => option?.default)[0];

const useSharedHeader = () => {

  const [searchQuery, setSearchQuery] = useState("")

  const [selectedFilter, setSelectedFilter] = useState<DropdownOptionsType>(defaultFilter);

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const onFilterChange = useCallback((
    option: DropdownOptionsType, 
    pathname: string, 
    searchParams: URLSearchParams,
    redirect: (url: string) => void
  ) => {
    setSelectedFilter(option);
    const url = updateURLParams(
        searchParams,
        {filter: option.label || null},
        pathname
    );
    redirect(url);
  },[]);

  const searchDebounce = useCallback((
    searchQuery: string,
    pathname: string, 
    searchParams: URLSearchParams, 
    redirect: (url: string) => void
  ) => {
    const debounceTimer = setTimeout(()=> {
        if(searchQuery !== searchParams.get('query')) {
            const url = updateURLParams(
                searchParams,
                {query: searchQuery || null},
                pathname
            )
            redirect(url);
        }
    }, 500)
    return () => clearTimeout (debounceTimer)
  },[])

  const search_FilterSync = useCallback((
    query: string, 
    activeFilter?: DropdownOptionsType
  ) => {
    setSearchQuery(query || "");
    setSelectedFilter(activeFilter || defaultFilter)
  },[defaultFilter])

  return {
    searchQuery, 
    selectedFilter, 
    onSearchChange, 
    onFilterChange, 
    searchDebounce,
    search_FilterSync
  }
};

export default useSharedHeader;