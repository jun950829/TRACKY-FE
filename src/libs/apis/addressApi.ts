import axios from 'axios';

export interface AddressResult {
  address_name: string;
  place_name: string;
  category_name: string;
  road_address_name: string;
  x: string; // longitude
  y: string; // latitude
}

export interface AddressSearchResponse {
  documents: AddressResult[];
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
}

class AddressApiService {
  private readonly baseUrl = 'https://dapi.kakao.com/v2/local/search/keyword.json';
  private readonly apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;

  async searchAddress(query: string): Promise<AddressSearchResponse> {
    try {
      const response = await axios.get<AddressSearchResponse>(this.baseUrl, {
        params: {
          query,
        },
        headers: {
          Authorization: `KakaoAK ${this.apiKey}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('주소 검색 중 오류 발생:', error);
      throw error;
    }
  }
}

export const addressApiService = new AddressApiService(); 