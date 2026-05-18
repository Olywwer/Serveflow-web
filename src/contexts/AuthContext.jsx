// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();


const STORAGE_KEY = "serveflow_user";
const USERS_KEY = "serveflow_users";


const DEFAULT_USERS = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    role: "ADMIN",
  },
  {
    id: "2",
    username: "garcon",
    password: "garcon123",
    role: "GARCON",
  },
  {
    id: "3",
    username: "caixa",
    password: "caixa123",
    role: "CAIXA",
  },
  {
    id: "4",
    username: "cozinheiro",
    password: "cozinha123",
    role: "COZINHEIRO",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const storedUsers = localStorage.getItem(USERS_KEY);
    if (!storedUsers) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    }

    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erro ao carregar usuário:", e);
      }
    }
    setLoading(false);
  }, []);

  
  const signIn = (username, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!foundUser) {
      throw new Error("Usuário ou senha inválidos");
    }

    const userData = {
      id: foundUser.id,
      username: foundUser.username,
      role: foundUser.role,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  
  const signUp = (username, password, role) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

    
    if (users.some((u) => u.username === username)) {
      throw new Error("Usuário já existe");
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      password,
      role: role.toUpperCase(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return newUser;
  };

  
  const signOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}