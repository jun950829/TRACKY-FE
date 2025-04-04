import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface EmulatorSettingsProps {
  interval: number;
  onIntervalChange: (interval: number) => void;
  isTracking: boolean;
}

export default function EmulatorSettings({ 
  interval, 
  onIntervalChange,
  isTracking
}: EmulatorSettingsProps) {
  const intervals = [
    { value: 10, label: "10초" },
    { value: 60, label: "1분" },
    { value: 120, label: "2분" },
    { value: 180, label: "3분" },
  ];

  return (
    <Card className="bg-card/50 border-border/30">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3">전송 주기 설정</h3>
        <p className="text-xs text-muted-foreground mb-4">
          GPS 데이터를 서버로 전송하는 주기를 설정합니다.
          선택한 주기마다 데이터를 묶어서 API로 전송합니다.
        </p>

        <RadioGroup 
          value={interval.toString()} 
          onValueChange={(value: string) => onIntervalChange(parseInt(value, 10))}
          className="grid grid-cols-2 gap-2"
          disabled={isTracking}
        >
          {intervals.map((intervalOption) => (
            <div key={intervalOption.value} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={intervalOption.value.toString()} 
                id={`interval-${intervalOption.value}`} 
                disabled={isTracking}
              />
              <Label 
                htmlFor={`interval-${intervalOption.value}`}
                className={`${isTracking ? "text-muted-foreground" : ""}`}
              >
                {intervalOption.label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {isTracking && (
          <p className="text-xs text-amber-500 mt-3 flex items-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
              <path d="M12 9V12M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            추적 중에는 주기를 변경할 수 없습니다
          </p>
        )}
      </CardContent>
    </Card>
  );
} 