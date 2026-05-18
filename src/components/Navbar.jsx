import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserPages } from "../utils/permissions";

export default function Sidebar() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [accessiblePages, setAccessiblePages] = useState([]);

  useEffect(() => {
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(userData);
      
      
      const pages = getUserPages(userData?.role);
      setAccessiblePages(pages);
    }
  }, []);



  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-zinc-900/90 backdrop-blur-xl border-r border-red-500/30 z-20">
      <div className="flex flex-col h-full">
        
        <div className="p-6 border-b border-red-500/30">
          <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            Sistema de Pedidos
          </h1>
          {user && (
            <p className="text-xs text-zinc-500 mt-2">
              Olá, {user.nome || user.email}
            </p>
          )}
        </div>

      
        <nav className="flex-1 p-4 space-y-2">
          {accessiblePages.map(({ path, label, description, icon: Icon }) => {
            const isActive = location.pathname === path;
            
            return (
              <Link
                key={path}
                to={path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                  }
                `}
              >
                {Icon && <Icon className="w-5 h-5" />}
                <div className="flex-1">
                  <div className="font-medium text-sm">{label}</div>
                  {description && (
                    <div className="text-xs opacity-70">{description}</div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        
        <div className="p-4 border-t border-red-500/30">
          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium text-sm">Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
}