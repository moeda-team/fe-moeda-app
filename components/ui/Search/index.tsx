// components/SearchBar.tsx
import { useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import { debounce } from "lodash";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const debouncedSearch = useMemo(
    () =>
      debounce((val: string) => {
        onSearch(val);
      }, 500),
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className="flex items-center border border-primary-500 rounded-full bg-neutral-50 px-4 py-2 w-full shadow-sm">
      <FaSearch className="text-primary-500 mr-2" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search"
        className="bg-transparent focus:outline-none w-full text-neutral-800 text-base"
      />
    </div>
  );
}
