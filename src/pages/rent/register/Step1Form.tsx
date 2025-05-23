import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRentStore } from "@/stores/rentStore";
import { formatPhoneNumber } from "@/libs/utils/phoneFormat";
import { useState, useEffect } from "react";
import rentApiService from "@/libs/apis/rentsApi";

type MdnListType = {
  mdn: string;
  status: string;
}

export function Step1Form() {
  const { setStep1Data, setCurrentStep, renterName, renterPhone, purpose, selectedVehicle } = useRentStore();
  const [mdnList, setMdnList] = useState<MdnListType[]>([]);
  const [phoneValue, setPhoneValue] = useState(renterPhone);

  useEffect(() => {
    const fetchMdns = async () => {
      try {
        const result = await rentApiService.getMdns();
        setMdnList(result.data);
      } catch (e) {
        console.error("mdn 목록을 불러오는 중 오류 발생", e);
      }
    };
    fetchMdns();
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneValue(formatted);
  };

  const handleNext = () => {
    if (!renterName || !phoneValue || !purpose || !selectedVehicle) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    setStep1Data({
      renterName,
      renterPhone: phoneValue,
      purpose,
      selectedVehicle: selectedVehicle || "",
    });
    setCurrentStep(2);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>사용자 이름</Label>
        <Input
          placeholder="예: 홍길동"
          value={renterName}
          onChange={(e) => setStep1Data({ renterName: e.target.value, renterPhone, purpose, selectedVehicle: selectedVehicle || "" })}
        />
      </div>

      <div className="space-y-2">
        <Label>사용자 전화번호</Label>
        <Input
          placeholder="예: 010-1234-5678"
          value={phoneValue}
          onChange={handlePhoneChange}
          inputMode="numeric"
          maxLength={13}
        />
      </div>

      <div className="space-y-2">
        <Label>사용 목적</Label>
        <Input
          placeholder="예: 출장, 업무용"
          value={purpose}
          onChange={(e) => setStep1Data({ renterName, renterPhone, purpose: e.target.value, selectedVehicle: selectedVehicle || "" })}
        />
      </div>

      <div className="space-y-2">
        <Label>차량 선택</Label>
        <Select
          value={selectedVehicle || ""}
          onValueChange={(value) => setStep1Data({ renterName, renterPhone, purpose, selectedVehicle: value || "" })}
        >
          <SelectTrigger>
            <SelectValue placeholder="차량을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {mdnList.map((mdn: MdnListType, idx: number) => (
              <SelectItem key={idx} value={mdn.mdn}>
                {mdn.mdn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleNext}>다음</Button>
      </div>
    </div>
  );
} 