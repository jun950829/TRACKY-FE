import { Link, useLocation, useNavigate } from "react-router-dom";
import { headerMenus } from "../constants/datas/menus";
import { useAuthStore } from "@/stores/useAuthStore";
import { useLogout } from "@/libs/utils/useLogout";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { CustomButton } from "@/components/custom/CustomButton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [screenSize, setScreenSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [submenuStates, setSubmenuStates] = useState<Record<string, boolean>>({});

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
      const width = window.innerWidth;
      if (width >= 1280) {
        setScreenSize('desktop');
        setIsExpanded(true);
      } else if (width >= 480) {
        setScreenSize('tablet');
        setIsExpanded(false);
      } else {
        setScreenSize('mobile');
        setIsExpanded(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleResize(); // 초기 체크

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSubmenu = (menuPath: string) => {
    setSubmenuStates(prev => ({
      ...prev,
      [menuPath]: !prev[menuPath]
    }));
  };

  // Desktop (1280px 이상)
  if (screenSize === 'desktop') {
    return (
      <aside className="h-screen w-1/5 border-r border-foreground/10 bg-background">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-foreground/10 px-4 cursor-pointer" onClick={() => navigate("/dashboard")}>
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
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-md font-bold transition-colors ${
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
                          const isSubActive = location.pathname == submenu.path;
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
          {token && (
            <div className="flex items-center justify-between p-4 border-t border-foreground/10">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-foreground/10" />
                <div className="text-sm">
                  <div className="font-medium">{member?.bizName} 님</div>
<<<<<<< HEAD
=======
                  {/* <div className="text-foreground/70">{member?.email}</div> */}
>>>>>>> 44ac79c2787504b748cf3dc2d5c8db6234351dfc
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
          )}
        </div>
      </aside>
    );
  }

  // Tablet (1279px ~ 480px)
  if (screenSize === 'tablet') {
    return (
      <aside 
        className={`h-screen border-r border-foreground/10 bg-background transition-all duration-300 ${
          isExpanded ? 'w-1/5' : 'w-16'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-foreground/10 px-4 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <img 
              src="/icons/tracky-logo.svg" 
              alt="Tracky Logo" 
              className="w-5 h-5 text-foreground"
            />
            {isExpanded && <span className="ml-2 font-bold text-lg text-foreground">Tracky ERP</span>}
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
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold transition-colors ${
                      isActive || isSubmenuActive
                        ? "bg-foreground/5 text-foreground"
                        : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                    }`}
                  >
                    <menu.icon className="h-4 w-4" />
                    {isExpanded && <span>{menu.name}</span>}
                  </Link>

                  {/* Submenu */}
                  {isExpanded && menu.subMenus && (
                    <div 
                      className={`overflow-hidden transition-all duration-200 ${
                        showSubmenu ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pl-6 space-y-1 py-1">
                        {menu.subMenus.map((submenu) => {
                          const isSubActive = location.pathname == submenu.path;
                          return (
                            <Link
                              key={submenu.path}
                              to={submenu.path}
                              className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                                isSubActive
                                  ? "bg-foreground/5 text-foreground"
                                  : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                              }`}
                            >
                              <submenu.icon className="h-3 w-3" />
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
          {token && (
            <div className={`flex items-center justify-between p-4 border-t border-foreground/10 ${
              isExpanded ? '' : 'justify-center'
            }`}>
              {isExpanded ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-foreground/10" />
                    <div className="text-sm">
                      <div className="font-medium">{member?.bizName} 님</div>
                    </div>
                  </div>
                  <CustomButton
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                  >
                    로그아웃
                  </CustomButton>
                </>
              ) : (
                <div className="h-8 w-8 rounded-full bg-foreground/10" />
              )}
            </div>
          )}
        </div>
      </aside>
    );
  }

  // Mobile (479px 이하)
  return (
    <header className={`sticky top-0 z-40 w-full border-b ${
      scrolled 
        ? "bg-background/70 backdrop-blur-md shadow-sm transition-all duration-300" 
        : "bg-transparent transition-all duration-300"
    } text-foreground`}>
      <div className="fixed border-b border-foreground/10 container flex h-16 items-center justify-between">
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
        <button
          className="p-2 rounded-md text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="top" className="w-full">
          <SheetHeader>
            <SheetTitle>메뉴</SheetTitle>
          </SheetHeader>
          <nav className="mt-4 space-y-2">
            {filteredMenus.map((menu) => {
              const isActive = location.pathname === menu.path;
              const isSubmenuActive = menu.subMenus?.some(submenu => 
                location.pathname.startsWith(submenu.path)
              );
              const isSubmenuOpen = submenuStates[menu.path] || false;

              return (
                <div key={menu.path} className="space-y-1">
                  <div 
                    className={`flex items-center justify-between rounded-md px-3 py-2 text-md font-bold transition-colors ${
                      isActive || isSubmenuActive
                        ? "bg-foreground/5 text-foreground"
                        : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                    }`}
                    onClick={() => menu.subMenus ? toggleSubmenu(menu.path) : navigate(menu.path)}
                  >
                    <div className="flex items-center gap-2">
                      <menu.icon className="h-4 w-4" />
                      <span>{menu.name}</span>
                    </div>
                    {menu.subMenus && (
                      <ChevronDown 
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isSubmenuOpen ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </div>

                  {/* Submenu */}
                  {menu.subMenus && (
                    <div 
                      className={`overflow-hidden transition-all duration-200 ${
                        isSubmenuOpen ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pl-6 space-y-1 py-1">
                        {menu.subMenus.map((submenu) => {
                          const isSubActive = location.pathname == submenu.path;
                          return (
                            <Link
                              key={submenu.path}
                              to={submenu.path}
                              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                isSubActive
                                  ? "bg-foreground/5 text-foreground"
                                  : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
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
          {token && (
            <div className="mt-4 pt-4 border-t border-foreground/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-foreground/10" />
                  <div className="text-sm">
                    <div className="font-medium">{member?.bizName} 님</div>
                  </div>
                </div>
                <CustomButton
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  로그아웃
                </CustomButton>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </header>
  );
}

export default Sidebar; 