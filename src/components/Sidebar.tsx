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
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const token = useAuthStore((state) => state.token);
  const member = useAuthStore((state) => state.member);
  const isAdmin = useAuthStore((state) => state.isAdmin);

  const logout = useLogout();

  // 현재 경로가 submenu의 경로인지 확인
  const isSubmenuPath = (path: string) => {
    return headerMenus.some(menu => 
      menu.subMenus?.some(submenu => 
        location.pathname.startsWith(submenu.path)
      )
    );
  };

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
      <aside className="h-screen w-64 border-r border-foreground/10 bg-background">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-foreground/10 px-4">
            <img 
              src="/icons/tracky-logo.svg" 
              alt="Tracky Logo" 
              className="w-6 h-6 text-foreground"
            />
            <span className="ml-2 font-bold text-xl text-foreground">Tracky ERP</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-2">
            {filteredMenus.map((menu) => {
              const isActive = location.pathname === menu.path;
              const isSubmenuActive = menu.subMenus?.some(submenu => 
                location.pathname.startsWith(submenu.path)
              );
              const showSubmenu = hoveredMenu === menu.path || isSubmenuActive;

              return (
                <div 
                  key={menu.path} 
                  className="relative"
                  onMouseEnter={() => setHoveredMenu(menu.path)}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <Link
                    to={menu.path}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive || isSubmenuActive
                        ? "bg-foreground/5 text-foreground"
                        : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                    }`}
                  >
                    <menu.icon className="h-4 w-4" />
                    <span>{menu.name}</span>
                  </Link>

                  {/* Submenu */}
                  {menu.subMenus && (
                    <div 
                      className={`overflow-hidden transition-all duration-200 ${
                        showSubmenu ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pl-6 space-y-1 py-1">
                        {menu.subMenus.map((submenu) => {
                          const isSubActive = location.pathname.startsWith(submenu.path);
                          return (
                            <Link
                              key={submenu.path}
                              to={submenu.path}
                              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                isSubActive
                                  ? "bg-foreground/5 text-foreground"
                                  : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                              }`}
                            >
                              <submenu.icon className="h-4 w-4" />
                              <span>{submenu.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="border-t border-foreground/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-foreground/10" />
                <div className="text-sm">
                  <div className="font-medium">{member?.bizName} 님</div>
                  <div className="text-foreground/70">{member?.email}</div>
                </div>
              </div>
              <CustomButton
                variant="ghost"
                size="sm"
                onClick={logout}
              >
                로그아웃
              </CustomButton>
            </div>
          </div>
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