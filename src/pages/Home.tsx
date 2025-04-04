import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">차량 관제 대시보드</h1>
          <p className="text-muted-foreground mt-1">
            실시간 차량 정보 및 상태를 관리합니다
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/emulator")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M16 6H6L4 10M16 6H18L20 10M16 6V4M6 6V4M4 10H20M4 10V17C4 17.5523 4.44772 18 5 18H6C6.55228 18 7 17.5523 7 17V16H17V17C17 17.5523 17.4477 18 18 18H19C19.5523 18 20 17.5523 20 17V10M7 13.5C7 14.3284 6.32843 15 5.5 15C4.67157 15 4 14.3284 4 13.5C4 12.6716 4.67157 12 5.5 12C6.32843 12 7 12.6716 7 13.5ZM20 13.5C20 14.3284 19.3284 15 18.5 15C17.6716 15 17 14.3284 17 13.5C17 12.6716 17.6716 12 18.5 12C19.3284 12 20 12.6716 20 13.5Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            에뮬레이터
          </Button>
          <Button onClick={() => navigate("/about")}>
            사이트 소개
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">등록 차량</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">54</div>
            <p className="text-xs text-muted-foreground mt-1">
              전월 대비 <span className="text-green-500">+12%</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">현재 대여중</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground mt-1">
              전월 대비 <span className="text-green-500">+18%</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">총 주행거리</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14,325 km</div>
            <p className="text-xs text-muted-foreground mt-1">
              전월 대비 <span className="text-green-500">+3.2%</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">평균 정확도</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.3%</div>
            <p className="text-xs text-muted-foreground mt-1">
              안정적인 GPS 신호 상태
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Vehicles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
            <CardDescription>
              최근 24시간 내 시스템 활동 정보
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '14:32', event: '차량 위치 데이터 수신', car: 'A001', status: 'success' },
                { time: '13:15', event: '새 차량 등록', car: 'B042', status: 'success' },
                { time: '11:52', event: '대여 정보 업데이트', car: 'C108', status: 'warning' },
                { time: '09:41', event: 'GPS 연결 끊김', car: 'A023', status: 'error' },
                { time: '08:30', event: '시스템 자동 점검', car: '전체', status: 'info' },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-12 text-xs text-muted-foreground">{item.time}</div>
                  <div className={`w-1.5 h-1.5 mt-1.5 rounded-full ${
                    item.status === 'success' ? 'bg-green-500' :
                    item.status === 'warning' ? 'bg-yellow-500' :
                    item.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{item.event}</p>
                    <p className="text-xs text-muted-foreground">차량: {item.car}</p>
                  </div>
                  <Badge variant={
                    item.status === 'success' ? 'default' :
                    item.status === 'warning' ? 'outline' :
                    item.status === 'error' ? 'destructive' : 'secondary'
                  } className="ml-auto">
                    {
                      item.status === 'success' ? '성공' :
                      item.status === 'warning' ? '경고' :
                      item.status === 'error' ? '오류' : '정보'
                    }
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>최근 주행 차량</CardTitle>
                <CardDescription>
                  최근 주행 기록이 있는 차량 목록
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/cars")}>
                모두 보기
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 'A001', name: '현대 아반떼', status: 'active', distance: '1,235 km', badges: ['업무용', '정상'] },
                { id: 'B042', name: '기아 K5', status: 'idle', distance: '895 km', badges: ['업무용', '점검 필요'] },
                { id: 'C108', name: '쌍용 코란도', status: 'active', distance: '2,345 km', badges: ['영업용', '정상'] },
                { id: 'A023', name: '현대 그랜저', status: 'error', distance: '345 km', badges: ['임원용', 'GPS 오류'] },
              ].map((vehicle, index) => (
                <div key={index} className="flex items-center p-2 hover:bg-accent rounded-md transition-colors cursor-pointer" onClick={() => navigate(`/cars`)}>
                  <div className={`w-2 h-10 rounded-sm mr-3 ${
                    vehicle.status === 'active' ? 'bg-green-500' :
                    vehicle.status === 'idle' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="font-medium">{vehicle.name}</p>
                      <span className="text-xs text-muted-foreground ml-2">{vehicle.id}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <p className="text-xs text-muted-foreground">{vehicle.distance}</p>
                      <div className="flex ml-2 gap-1">
                        {vehicle.badges.map((badge, i) => (
                          <Badge key={i} variant="outline" className="text-xs py-0 h-5">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Home;
