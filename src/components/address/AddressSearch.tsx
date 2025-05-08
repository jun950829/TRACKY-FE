import React, { useState, useEffect, useRef } from 'react';
import { useAddressSearch } from '@/hooks/useAddressSearch';
import { AddressResult } from '@/libs/apis/addressApi';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddressSearchProps {
  onSelect: (address: AddressResult) => void;
  placeholder?: string;
  className?: string;
}

export const AddressSearch: React.FC<AddressSearchProps> = ({
  onSelect,
  placeholder = '주소를 검색하세요',
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { searchResults, isLoading, error, searchAddress, clearResults } = useAddressSearch();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      searchAddress(query);
      setIsOpen(true);
    } else {
      clearResults();
      setIsOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelect = (address: AddressResult) => {
    onSelect(address);
    setQuery(address.address_name + " " + address.place_name);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="pr-10"
        />
        <Button 
          onClick={handleSearch}
          disabled={isLoading}
          className="shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isOpen && (searchResults.length > 0 || error) && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg">
          <ScrollArea className="h-[200px]">
            <div className="p-1">
              {error ? (
                <div className="p-2 text-sm text-red-500">{error}</div>
              ) : (
                <ul className="space-y-1">
                  {searchResults.map((result, index) => (
                    <li
                      key={index}
                      className="cursor-pointer rounded-md px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => handleSelect(result)}
                    >
                      <div className="font-medium">{result.address_name} {result.place_name}</div>
                      {result.road_address_name && (
                        <div className="text-xs text-gray-500">{result.category_name}</div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}; 