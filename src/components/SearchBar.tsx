
import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = "Search for incidents..." }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 text-cybergray-500 h-5 w-5 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white dark:bg-cybergray-800 border border-cybergray-200 dark:border-cybergray-700 rounded-lg pl-10 pr-10 py-2.5 text-cybergray-800 dark:text-white placeholder-cybergray-500 focus:outline-none focus:ring-2 focus:ring-cyberblue-500/50 transition-all duration-200"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 text-cybergray-500 hover:text-cybergray-700 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
