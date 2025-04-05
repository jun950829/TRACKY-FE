import { CarDetailTypes } from '@/constants/types/types';
import React from 'react';

interface CarDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  carData: CarDetailTypes;
}

const CarDetailModal: React.FC<CarDetailModalProps> = ({ isOpen, onClose, carData }) => {
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
        <h2 className="text-xl font-semibold mb-4">차량 상세 정보</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <div><strong>MDN:</strong> {carData.mdn}</div>
          <div><strong>업체 ID:</strong> {carData.bizId}</div>
          <div><strong>Device ID:</strong> {carData.deviceInfo.id}</div>
          <div><strong>Tid:</strong> {carData.deviceInfo.tid}</div>
          <div><strong>Mid:</strong> {carData.deviceInfo.mid}</div>
          <div><strong>Did:</strong> {carData.deviceInfo.did}</div>
          <div><strong>Pv:</strong> {carData.deviceInfo.pv}</div>
          <div><strong>차종:</strong> {carData.carType}</div>
          <div><strong>번호판:</strong> {carData.carPlate}</div>
          <div><strong>연식:</strong> {carData.carYear}</div>
          <div><strong>용도:</strong> {carData.purpose}</div>
          <div><strong>상태:</strong> {carData.status}</div>
          <div><strong>누적 주행거리:</strong> {carData.sum} km</div>
          <div><strong>등록일자:</strong> {new Date(carData.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailModal;