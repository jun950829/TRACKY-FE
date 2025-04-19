import { Link, useLocation, useNavigate } from "react-router-dom";
import { headerMenus } from "../constants/datas/menus";
import { useAuthStore } from "@/stores/useAuthStore";
import { useLogout } from "@/libs/utils/useLogout";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { CustomButton } from "@/components/custom/CustomButton";
import Sidebar from "./Sidebar";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  // PC 환경에서는 사이드바를 보여줌
  if (!isMobile) {
    return <Sidebar />;
  }

  // 모바일 환경에서는 기존 헤더를 보여줌
  return (
    <header className={`sticky top-0 z-40 w-full border-b ${
      scrolled 
        ? "bg-background/70 backdrop-blur-md shadow-sm transition-all duration-300" 
        : "bg-transparent transition-all duration-300"
    } text-foreground`}>
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer px-4" 
          onClick={() => navigate("/dashboard")}
        >
          <img 
            src="/icons/tracky-logo.svg" 
            alt="Tracky Logo" 
            className="w-6 h-6 text-foreground"
          />
          <span className="font-bold text-xl text-foreground">Tracky ERP</span>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          {token ? (
            <button
              className="p-2 rounded-md text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          ) : (
            currentPath !== "/login" && (
              <CustomButton
                variant="default"
                size="sm"
                onClick={() => navigate("/login")}
                className="mr-4"
              >
                로그인
              </CustomButton>
            )
          )}
        </div>
      </div>

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

export default Header;