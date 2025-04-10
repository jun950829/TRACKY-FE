import { Link, useLocation, useNavigate } from "react-router-dom";
import { headerMenus } from "../constants/datas/menus";
import { useAuthStore } from "@/stores/useAuthStore";
import { useLogout } from "@/libs/utils/useLogout";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { CustomButton } from "@/components/custom/CustomButton";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const token = useAuthStore((state) => state.token);
  const member = useAuthStore((state) => state.member);
  const isAdmin = useAuthStore((state) => state.isAdmin);

  const logout = useLogout();

  // 관리자 메뉴를 포함한 메뉴 목록 필터링
  const filteredMenus = headerMenus.filter(menu => {
    if (menu.path === "/admin") {
      return isAdmin;
    }
    return true;
  });

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

        {/* Desktop Nav */}
        {token ?
        <nav className="hidden md:flex items-center space-x-1">
          {filteredMenus.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm rounded-md transition-colors relative group ${
                  isActive
                    ? 'font-medium'
                    : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground/80 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
        : null
        }
        
        {/* right Login Info */}
        <div className="hidden md:flex items-center space-x-4">
          {token ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{member?.bizName} 님</span>
              <CustomButton
                variant="default"
                size="sm"
                onClick={logout}
              >
                로그아웃
              </CustomButton> 
            </div>
          ) : (
            currentPath !== "/login" && (
            <CustomButton
              variant="default"
              size="sm"
              onClick={() => navigate("/login")}
            >
              로그인
            </CustomButton> 
            )
          )}
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
            <div className="pt-2 border-t border-foreground/10">
              {token ? (
                <CustomButton
                  variant="default"
                  size="sm"
                  className="w-full mx-8"
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
                    className="w-full  mx-8"
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