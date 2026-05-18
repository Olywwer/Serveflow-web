import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", roles: ["ADMIN"] },
  { name: "Fazer Pedido", path: "/menu", roles: ["ADMIN", "GARCON"] },
  { name: "Meus Pedidos", path: "/pedidos", roles: ["ADMIN", "GARCON", "COZINHEIRO"] },
  { name: "Pagamentos", path: "/pagamento", roles: ["ADMIN", "CAIXA"] },
  { name: "Estoque", path: "/estoque", roles: ["ADMIN"] },
];

export default function Sidebar({ onLogout }) {
  const { user } = useAuth();
  const userRole = user?.role || "";

  const filteredMenu = menuItems.filter(
    (item) => item.roles.includes(userRole)
  );

  return (
    <nav className="fixed top-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-b border-red-500/30 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              Serve<span className="text-red-500">Flow</span>
            </span>
            <span className="text-xs text-zinc-500 ml-2 hidden sm:inline capitalize">
              ({userRole.toLowerCase()})
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {filteredMenu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium hidden sm:inline">Sair</span>
          </button>
        </div>

        <div className="md:hidden overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex gap-2 min-w-max">
            {filteredMenu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                    isActive
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}