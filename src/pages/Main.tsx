import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function Main() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "차량 관리",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 6H6L4 10M16 6H18L20 10M16 6V4M6 6V4M4 10H20M4 10V17C4 17.5523 4.44772 18 5 18H6C6.55228 18 7 17.5523 7 17V16H17V17C17 17.5523 17.4477 18 18 18H19C19.5523 18 20 17.5523 20 17V10M7 13.5C7 14.3284 6.32843 15 5.5 15C4.67157 15 4 14.3284 4 13.5C4 12.6716 4.67157 12 5.5 12C6.32843 12 7 12.6716 7 13.5ZM20 13.5C20 14.3284 19.3284 15 18.5 15C17.6716 15 17 14.3284 17 13.5C17 12.6716 17.6716 12 18.5 12C19.3284 12 20 12.6716 20 13.5Z" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      route: "/cars",
      description: "차량 목록 조회 및 관리"
    },
    {
      title: "대여 관리",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      route: "/rents",
      description: "예약 및 대여 정보 관리"
    },
    {
      title: "차량 등록",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9V12M12 12V15M12 12H15M12 12H9M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      route: "/cars/register",
      description: "새로운 차량 정보 등록"
    },
    {
      title: "대여 등록",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9V12M12 12V15M12 12H15M12 12H9M3 12H6M18 12H21M12 3V6M12 18V21M16.9497 7.05025L14.8284 9.17157M9.17157 14.8284L7.05025 16.9497M7.05025 7.05025L9.17157 9.17157M14.8284 14.8284L16.9497 16.9497" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      route: "/rents/register",
      description: "새로운 대여 정보 등록"
    },
    {
      title: "에뮬레이터",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 6.75H14M9 12H14M9 17.25H14M19.5 12C19.5 16.1421 16.1421 19.5 12 19.5C7.85786 19.5 4.5 16.1421 4.5 12C4.5 7.85786 7.85786 4.5 12 4.5C16.1421 4.5 19.5 7.85786 19.5 12Z" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      route: "/emulator",
      description: "차량 GPS 에뮬레이터"
    },
    {
      title: "대시보드",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H12M12 12H19M12 12V5M12 12V19" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      route: "/",
      description: "차량 관제 대시보드"
    }
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="space-y-2 bg-card p-6 rounded-lg shadow-sm border">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent">
              <path d="M16 6H6L4 10M16 6H18L20 10M16 6V4M6 6V4M4 10H20M4 10V17C4 17.5523 4.44772 18 5 18H6C6.55228 18 7 17.5523 7 17V16H17V17C17 17.5523 17.4477 18 18 18H19C19.5523 18 20 17.5523 20 17V10M7 13.5C7 14.3284 6.32843 15 5.5 15C4.67157 15 4 14.3284 4 13.5C4 12.6716 4.67157 12 5.5 12C6.32843 12 7 12.6716 7 13.5ZM20 13.5C20 14.3284 19.3284 15 18.5 15C17.6716 15 17 14.3284 17 13.5C17 12.6716 17.6716 12 18.5 12C19.3284 12 20 12.6716 20 13.5Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Tracky ERP 시스템
          </h1>
          <p className="text-muted-foreground text-lg">
            차량 관제 시스템 주요 기능을 선택하세요
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Card 
              key={item.route} 
              className="erp-card overflow-hidden cursor-pointer group border-border/50"
              onClick={() => navigate(item.route)}
            >
              <CardHeader className="pb-2 bg-card/70">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mr-4 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    {item.icon}
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-12 pt-6 border-t border-border/30">
          <Button 
            variant="outline" 
            onClick={() => navigate("/about")} 
            className="flex items-center gap-2 border-secondary/50 text-secondary hover:bg-secondary/10 hover:text-secondary hover:border-secondary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            시스템 정보
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Main;
