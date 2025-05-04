import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRentStore } from "@/stores/rentStore";
import { AddressSearch } from "@/components/address/AddressSearch";
import { useState } from "react";
import { formatCoordinate } from "@/libs/utils/utils";
import rentApiService from "@/libs/apis/rentsApi";
import { useNavigate } from "react-router-dom";

export function Step3Form() {
  const { setStep3Data, setCurrentStep, rentLocation, returnLocation, ...formData } = useRentStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    setCurrentStep(2);
  };

  const handleSubmit = async () => {
    if (!rentLocation || !returnLocation) {
      alert("대여 및 반납 위치를 모두 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData = {
        mdn: formData.selectedVehicle || "",
        renterName: formData.renterName,
        renterPhone: formData.renterPhone,
        purpose: formData.purpose,
        rentStime: formData.rentStime,
        rentEtime: formData.rentEtime,
        rentLat: formatCoordinate(Number(rentLocation.y)),
        rentLon: formatCoordinate(Number(rentLocation.x)),
        returnLat: formatCoordinate(Number(returnLocation.y)),
        returnLon: formatCoordinate(Number(returnLocation.x)),
        rentLoc: rentLocation.address_name + " " + rentLocation.place_name,
        returnLoc: returnLocation.address_name + " " + returnLocation.place_name,
      };

      const response = await rentApiService.createRent(requestData);
      if (response.status === 200) {
        alert("대여 등록이 완료되었습니다!");
        navigate("/car/rent");
      } else {
        alert("대여 등록에 실패했습니다.");
      }
    } catch (error: any) {
      console.error("대여 등록 실패:", error);
      const errorResponse = error?.response?.data;
      const baseMessage = errorResponse?.message || "대여 등록에 실패했습니다.";
      const detailMessage = errorResponse?.detailMessage;
      alert(detailMessage ? `${detailMessage}` : baseMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>대여 위치</Label>
        <AddressSearch
          onSelect={(location) => setStep3Data({ rentLocation: location, returnLocation })}
          placeholder="대여 위치를 검색하세요"
        />
      </div>

      <div className="space-y-2">
        <Label>반납 위치</Label>
        <AddressSearch
          onSelect={(location) => setStep3Data({ rentLocation, returnLocation: location })}
          placeholder="반납 위치를 검색하세요"
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          이전
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "등록 중..." : "등록하기"}
        </Button>
      </div>
    </div>
  );
} 