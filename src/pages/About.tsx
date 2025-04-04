import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function About() {
  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">차량 관제 시스템 소개</h1>
          <p className="text-muted-foreground">
            실시간 차량 위치 정보 수집, 관리, 분석을 위한 통합 솔루션
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>시스템 개요</CardTitle>
              <CardDescription>Tracky 차량 관제 시스템의 주요 기능</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium flex items-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 text-primary">
                    <path d="M16 6H6L4 10M16 6H18L20 10M16 6V4M6 6V4M4 10H20M4 10V17C4 17.5523 4.44772 18 5 18H6C6.55228 18 7 17.5523 7 17V16H17V17C17 17.5523 17.4477 18 18 18H19C19.5523 18 20 17.5523 20 17V10M7 13.5C7 14.3284 6.32843 15 5.5 15C4.67157 15 4 14.3284 4 13.5C4 12.6716 4.67157 12 5.5 12C6.32843 12 7 12.6716 7 13.5ZM20 13.5C20 14.3284 19.3284 15 18.5 15C17.6716 15 17 14.3284 17 13.5C17 12.6716 17.6716 12 18.5 12C19.3284 12 20 12.6716 20 13.5Z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  실시간 차량 위치 추적
                </h3>
                <p className="text-sm text-muted-foreground">
                  GPS 데이터를 기반으로 차량의 실시간 위치, 속도, 방향 정보를 수집하고 모니터링합니다.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium flex items-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 text-primary">
                    <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  주행 이력 관리
                </h3>
                <p className="text-sm text-muted-foreground">
                  차량별 주행 경로, 시간, 거리 정보를 기록하고 분석 자료로 활용합니다.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium flex items-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 text-primary">
                    <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  차량 정보 관리
                </h3>
                <p className="text-sm text-muted-foreground">
                  차량 정보, 정비 이력, 운전자 정보 등을 체계적으로 관리합니다.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>기술 정보</CardTitle>
              <CardDescription>Tracky 시스템의 주요 구성 요소</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">프론트엔드</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">React</Badge>
                    <Badge variant="outline">TypeScript</Badge>
                    <Badge variant="outline">Tailwind CSS</Badge>
                    <Badge variant="outline">Framer Motion</Badge>
                    <Badge variant="outline">Shadcn UI</Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">백엔드</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Node.js</Badge>
                    <Badge variant="outline">Express</Badge>
                    <Badge variant="outline">PostgreSQL</Badge>
                    <Badge variant="outline">Redis</Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">데이터 처리</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">실시간 데이터 처리</Badge>
                    <Badge variant="outline">지오코딩</Badge>
                    <Badge variant="outline">시계열 데이터 분석</Badge>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    시스템 버전: <span className="font-mono">v1.0.0</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    최종 업데이트: <span className="font-mono">2023-04-01</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default About;
