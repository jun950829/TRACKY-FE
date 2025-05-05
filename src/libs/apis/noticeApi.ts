import { NoticeDetailTypes, NoticeTypes } from "@/constants/types/noticeTypes";
import api from "./api";

const noticeApiRoot = "/notices";

export const adminApiService = {
  createNotice: async (data: NoticeTypes) => {
    console.log("공지사항 등록 데이터", data);
    const response = await api.post(`${noticeApiRoot}`, data);
    return response.data;
  },

  updateNotice: async (data: NoticeDetailTypes) => {
    const response = await api.patch(`${noticeApiRoot}/${data.id}`, data);
    return response.data;
  },

  // 공지사항 목록 조회 함수 추가
  getNotices: async (search?: string, type?: string, size: number = 10, page: number = 0) => {
    const params: any = { size, page };
    
    if (search) params.search = search;
    if (type && type !== 'all') params.type = type;
    
    const response = await api.get(`${noticeApiRoot}`, { params });
    return response;
  },

  // 공지사항 제거
  deleteNotice: async (id: number) => {
    const response = await api.delete(`${noticeApiRoot}/${id}`);
    return response.data;
  },
  
  // 공지사항 검색 함수 추가
  searchNotices: async (keyword: string) => {
    const response = await api.get(`${noticeApiRoot}/search`, {
      params: { keyword }
    });
    return response.data;
  },
};
export default adminApiService;