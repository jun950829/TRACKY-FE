import { RentDetailTypes } from "@/constants/types";
import React from "react";

interface RentDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    rentData: RentDetailTypes;
}

const RentDetailModal: React.FC<RentDetailModalProps> = ({ isOpen, onClose, rentData}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl relative">
            <button
            className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl"
            onClick={onClose}
            >
            &times;
          </button>
          <h2 className="text-xl font-semibold mb-4">대여 상세 정보</h2>
          <div className="space-y-2 text-sm text-gray-700">

            <div><strong>대여고유UUID:</strong> {rentData.rentUuid}</div>
            <div><strong>차량식별키:</strong> {rentData.mdn}</div>
            <div><strong>사용자 이름:</strong> {rentData.renterName}</div>
            <div><strong>사용자 전화번호:</strong> {rentData.renterPhone}</div>
            <div><strong>차량 사용 목적:</strong> {rentData.purpose}</div>
            <div><strong>대여 상태:</strong> {rentData.rentStatus}</div>
            <div><strong>대여 시작 시간:</strong> {rentData.rentStime}</div>
            <div><strong>대여 위치:</strong> {rentData.rentLoc}</div>
            <div><strong>대여 종료 시간:</strong> {rentData.rentEtime}</div>
            <div><strong>반납 위치:</strong> {rentData.returnLoc}</div>
            <div><strong>등록일자:</strong> {new Date(rentData.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    );
  };
  
  export default RentDetailModal;