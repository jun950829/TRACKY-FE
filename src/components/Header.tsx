import { Link, useLocation, useNavigate } from "react-router-dom";
import { headerMenus } from "../constants/menus";
import Btn from "./custom/Btn";
import { useAuthStore } from "@/stores/useAuthStore";
import { useLogout } from "@/libs/utils/useLogout";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

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

  const logout = useLogout();

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
          onClick={() => navigate("/")}
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
          {headerMenus.map((item) => {
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
        : null}
        {/* right Login Info */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2">
          {token ? (
            <div className="font-medium bg-foreground text-background hover:bg-foreground/90">
              <span className="text-sm text-white">{member?.bizName} 님</span>
              <Button
                variant="default"
                size="sm"
                onClick={logout}
                className="font-medium bg-foreground text-background hover:bg-foreground/90"
                >
                로그아웃
              </Button> 
            </div>
          ) : (
            <div className="font-medium bg-foreground text-background hover:bg-foreground/90">
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate("/login")}
                className="font-medium bg-foreground text-background hover:bg-foreground/90"
                >
                로그인
              </Button> 
            </div>
          )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {token ?
        <div className={`md:hidden border-t border-foreground/10 ${
          scrolled 
            ? "bg-background/70 backdrop-blur-md" 
            : "bg-transparent"
        }`}>
          <div className="container py-4 space-y-4">
            <nav className="grid gap-2">
              {headerMenus.map((item) => {
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
              <Button
                variant="default"
                size="sm"
                className="w-full font-medium bg-foreground text-background hover:bg-foreground/90"
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }}
              >
                로그인
              </Button>
            </div>
          </div>
        </div>
      : null}
    </header>
  );
}

export default Header;