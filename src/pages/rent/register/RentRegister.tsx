import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRentStore } from "@/stores/rentStore";
import { Step1Form } from "./Step1Form";
import { Step2Form } from "./Step2Form";
import { Step3Form } from "./Step3Form";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function RentRegister() {
  const { currentStep, resetForm } = useRentStore();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  const handleCancel = () => {
    resetForm();
    navigate("/car/rent");
  };

	const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Form />;
      case 2:
        return <Step2Form />;
      case 3:
        return <Step3Form />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">차량 대여 등록</h1>
            <Button variant="outline" onClick={handleCancel}>
              취소
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 ${
                      currentStep > step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>단계별 안내</AlertTitle>
              <AlertDescription>
                {currentStep === 1 && "사용자 정보와 대여할 차량을 선택해주세요."}
                {currentStep === 2 && "대여 기간을 선택하고 차량 가용성을 확인해주세요."}
                {currentStep === 3 && "대여 및 반납 위치를 선택해주세요."}
              </AlertDescription>
            </Alert>
          </div>

          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
}
