import { useState, useCallback } from 'react';
import { addressApiService, AddressResult } from '@/libs/apis/addressApi';

export const useAddressSearch = () => {
  const [searchResults, setSearchResults] = useState<AddressResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAddress = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await addressApiService.searchAddress(query);
      setSearchResults(response.documents);
    } catch (err) {
      setError('주소 검색 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchResults,
    isLoading,
    error,
    searchAddress,
    clearResults,
  };
}; 