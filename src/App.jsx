import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import Pedido from "./pages/Pedido";
import Pagamento from "./pages/Pagamento";
import Estoque from "./pages/Estoque";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/menu"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "GARCON"]}>
            <Menu />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/pedidos"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "GARCON", "COZINHEIRO"]}>
            <Pedido />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/pagamento"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "CAIXA"]}>
            <Pagamento />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/estoque"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Estoque />
          </ProtectedRoute>
        }
      />
      
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <HashRouter>  
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  );
}

export default App;