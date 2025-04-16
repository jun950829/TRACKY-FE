import { Link, useLocation, useNavigate } from "react-router-dom";
import { headerMenus } from "../constants/datas/menus";
import { useAuthStore } from "@/stores/useAuthStore";
import { useLogout } from "@/libs/utils/useLogout";
import { CustomButton } from "@/components/custom/CustomButton";
import { useEffect, useState } from "react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const token = useAuthStore((state) => state.token);
  const member = useAuthStore((state) => state.member);
  const isAdmin = useAuthStore((state) => state.isAdmin);

  const logout = useLogout();

  // 관리자 메뉴를 포함한 메뉴 목록 필터링
  const filteredMenus = headerMenus.filter(menu => {
    if (menu.path === "/admin" || menu.path === "/emulator") {
      return isAdmin;
    }
    return true;
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleResize(); // 초기 체크

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if(!isMobile) {
    return (
      <aside 
        className={`relative left-0 top-0 h-screen bg-background border-r transition-all duration-300 w-48`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Toggle */}
          <div className="flex items-center justify-between p-4 border-b">
              <div 
                className="flex items-center gap-2 cursor-pointer" 
                onClick={() => navigate("/dashboard")}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-foreground"
                >
                  <path 
                    d="M16 6H6L4 10M16 6H18L20 10M16 6V4M6 6V4M4 10H20M4 10V17C4 17.5523 4.44772 18 5 18H6C6.55228 18 7 17.5523 7 17V16H17V17C17 17.5523 17.4477 18 18 18H19C19.5523 18 20 17.5523 20 17V10M7 13.5C7 14.3284 6.32843 15 5.5 15C4.67157 15 4 14.3284 4 13.5C4 12.6716 4.67157 12 5.5 12C6.32843 12 7 12.6716 7 13.5ZM20 13.5C20 14.3284 19.3284 15 18.5 15C17.6716 15 17 14.3284 17 13.5C17 12.6716 17.6716 12 18.5 12C19.3284 12 20 12.6716 20 13.5Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-bold text-xl text-foreground">Tracky ERP</span>
              </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {filteredMenus.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-foreground/5 font-medium'
                      : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                  }`}
                >
                  {item.icon && <item.icon size={20} />}
                  {<span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User Info and Logout */}
          {token ? (
            <div className="p-4 border-t">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">{member?.bizName} 님</span>
                <CustomButton
                  variant="default"
                  size="sm"
                  onClick={logout}
                  className="w-full"
                >
                  로그아웃
                </CustomButton>
              </div>
            </div>
          ) : (
            <div className="p-4 border-t">
              <div className="flex flex-col gap-2">
                <CustomButton
                    variant="default"
                    size="sm"
                    onClick={() => navigate("/login")}
                    className="w-full"
                  >
                    로그인
                </CustomButton>
              </div>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // 모바일 환경에서는 기존 헤더를 보여줌
  return (
    <header className={`sticky top-0 z-40 w-full border-b ${
      scrolled 
        ? "bg-background/70 backdrop-blur-md shadow-sm transition-all duration-300" 
        : "bg-transparent transition-all duration-300"
    } text-foreground`}>
      {/* Mobile Menu */}
      {token && mobileMenuOpen ? (
        <div className={`md:hidden border-t border-foreground/10 ${
          scrolled 
            ? "bg-background/70 backdrop-blur-md" 
            : "bg-transparent"
        }`}>
          <div className="container py-4 space-y-4">
            <nav className="grid gap-2">
              {filteredMenus.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 text-sm rounded-md ${
                      isActive
                        ? 'bg-foreground/5 font-medium'
                        : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="pt-2 w-full border-t border-foreground/10 flex justify-center">
              {token ? (
                <CustomButton
                  variant="default"
                  size="sm"
                  className="w-3/4"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  로그아웃
                </CustomButton>
              ) : (
                (currentPath !== "/login" && 
                  <CustomButton
                    variant="default"
                    size="sm"
                    className="w-3/4"
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                  >
                    로그인
                  </CustomButton>
                )
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Sidebar; 