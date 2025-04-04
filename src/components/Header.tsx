import { Link, useLocation, useNavigate } from "react-router-dom";
import { headerMenus } from "../constants/menus";
import Btn from "./custom/Btn";
import { useAuthStore } from "@/stores/useAuthStore";
import { useLogout } from "@/libs/utils/useLogout";

function Header() {
  
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const token = useAuthStore((state) => state.token);
  const member = useAuthStore((state) => state.member);

  const logout = useLogout();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-3">
        {/* left Logo & menus */}
        <div className="flex items-center space-x-10">
          <div className="text-2xl font-bold text-blue-800" onClick={() => navigate("/")}>Tracky</div>
          <nav className="flex space-x-6 text-sm font-medium">
            {headerMenus.map((item) => {
                const isActive = currentPath === item.path;
                return <Link
                  key={item.path}
                  to={item.path}
                  className={`p-1 border-b-2 transition-all ${
                    isActive
                      ? 'text-black border-black'
                      : 'text-gray-500 border-transparent hover:text-black hover:border-gray-400'
                  }`}
                >
                  {item.name}
                </Link>
              })}
          </nav>
        </div>

        {/* right Login Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
          {token ? (
            <>
              <span className="text-sm text-gray-700">{member?.bizName} 님</span>
              <Btn label="로그아웃" variant="outline" size="sm" onClick={logout} />
            </>
          ) : (
            <Btn label="로그인" variant="primary" size="sm" onClick={() => navigate("/login")} />
          )}
          </div>
        </div>
      </div>
    </header>
  )
}   

export default Header;