import { useRef, useState } from 'react';

const USER_SEARCH_DEBOUNCE_TIME = 500;

export const useHandleSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [debouncedHandle, setDebouncedHandle] = useState('');

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleSearchUsers = (value: string) => {
    setSearchText(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (value.trim().startsWith('@')) {
      timeoutRef.current = setTimeout(() => setDebouncedHandle(value.slice(1)), USER_SEARCH_DEBOUNCE_TIME);
    } else {
      setDebouncedHandle('');
    }
  };

  return {
    searchText,
    isSearchActive: searchText.trim().startsWith('@') && debouncedHandle !== '',
    debouncedHandle,
    handleSearchUsers,
  };
};
