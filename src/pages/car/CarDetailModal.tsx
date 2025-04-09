import { CarDetailTypes } from "@/constants/types/types";
import React from "react";
import { CarStatus } from "@/constants/datas/status";

interface CarDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  carData: CarDetailTypes;
}

const CarDetailModal: React.FC<CarDetailModalProps> = ({ isOpen, onClose, carData }) => {
  if (!isOpen) return null;

  const getStatusLabel = (value: string) => {
    const status = CarStatus.find((s) => s.value === value);
    return status ? status.label : value; // 매칭이 안되면 value 그대로 보여줌
  };

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
          <div>
            <strong>차량 관리번호:</strong> {carData.mdn}
          </div>
          <div>
            <strong>차량 번호:</strong> {carData.carPlate}
          </div>
          <div>
            <strong>차종:</strong> {carData.carType}
          </div>
          <div>
            <strong>연식:</strong> {carData.carYear}
          </div>
          <div>
            <strong>용도:</strong> {carData.purpose}
          </div>
          <div>
            <strong>상태:</strong> {getStatusLabel(carData.status)}
          </div>
          <div>
            <strong>누적 주행거리:</strong> {carData.sum} km
          </div>
          <div>
            <strong>등록일자:</strong> {new Date(carData.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailModal;
