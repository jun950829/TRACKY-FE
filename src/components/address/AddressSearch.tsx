import React, { useState, useEffect, useRef } from 'react';
import { useAddressSearch } from '@/hooks/useAddressSearch';
import { AddressResult } from '@/libs/apis/addressApi';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Search } from 'lucide-react';

type AddressSearchProps = {
  onSelect: (address: AddressResult) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
};

export function AddressSearch({ onSelect, placeholder = "주소를 검색하세요", defaultValue, className = '' }: AddressSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { searchResults, isLoading, error, searchAddress, clearResults } = useAddressSearch();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (defaultValue) {
      setSearchQuery(defaultValue);
      setIsOpen(false);
    }
  }, [defaultValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (searchQuery.trim() && searchQuery !== defaultValue) {
        searchAddress(searchQuery);
        setIsOpen(true);
      } else {
        clearResults();
        setIsOpen(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, searchAddress, clearResults, defaultValue]);

  const handleSelect = (address: AddressResult) => {
    onSelect(address);
    setSearchQuery(address.address_name + " " + address.place_name);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="pr-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
          ) : (
            <Search className="h-4 w-4 text-gray-500" />
          )}
        </div>
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
} 