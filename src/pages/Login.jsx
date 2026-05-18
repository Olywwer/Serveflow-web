import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ParticleCanvas from "../components/ParticleCanvas";

const USERNAME_MAX = 64;
const PASSWORD_MAX = 128;

function roleRedirect(role) {
  const normalizedRole = (role || "").toLowerCase();

  if (normalizedRole === "admin") {
    return "/dashboard";
  }
  if (normalizedRole === "caixa") {
    return "/vendas";
  }
  if (normalizedRole === "garcon") {
    return "/pedido";
  }
  if (normalizedRole === "cozinheiro") {
    return "/pedido";
  }
  return "/pedido";
}

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerRole, setRegisterRole] = useState("GARCON");

 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

 
  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const u = username.trim();
    const p = password;

    if (!u || !p) {
      setError("Preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const user = signIn(u, p);
      navigate(roleRedirect(user.role));
    } catch (err) {
      setError(err.message || "Usuário ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  
  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const u = registerUsername.trim();
    const p = registerPassword;

    if (!u || !p) {
      setError("Preencha todos os campos do cadastro.");
      return;
    }

    if (p.length < 4) {
      setError("A senha deve ter pelo menos 4 caracteres.");
      return;
    }

    setLoading(true);

    try {
      signUp(u, p, registerRole);
      setSuccess("Usuário cadastrado com sucesso!");

     
      setRegisterUsername("");
      setRegisterPassword("");
      setRegisterRole("GARCON");

     
      setTimeout(() => {
        setActiveTab("login");
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err.message || "Erro ao cadastrar usuário.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <div className="glow-bg top-0 left-0 z-0"></div>
      <div className="glow-bg bottom-0 right-0 z-0"></div>

      <ParticleCanvas />

      <div className="relative z-10 w-[500px] bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-red-500/30">
        
        <div className="p-8 pb-0 text-center">
          <div className="text-5xl mb-2">🍽️</div>
          <h1 className="text-white text-3xl font-bold">
            Serve<span className="text-red-500">Flow</span>
          </h1>
          <p className="text-zinc-500 text-xs mt-1 tracking-widest uppercase">
            Sistema de Restaurante
          </p>
        </div>

       
        <div className="flex border-b border-zinc-800 mt-6">
          <button
            onClick={() => {
              setActiveTab("login");
              setError("");
              setSuccess("");
            }}
            className={`flex-1 py-3 text-center font-medium transition-all ${
              activeTab === "login"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => {
              setActiveTab("register");
              setError("");
              setSuccess("");
            }}
            className={`flex-1 py-3 text-center font-medium transition-all ${
              activeTab === "register"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Cadastrar
          </button>
        </div>

       
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-green-400 text-sm text-center">{success}</p>
            </div>
          )}

          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value.slice(0, USERNAME_MAX))}
                className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-red-500"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.slice(0, PASSWORD_MAX))}
                  className="w-full px-4 py-3 pr-20 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-300"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-red-600 via-pink-500 to-orange-400 disabled:opacity-50"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Novo usuário"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value.slice(0, USERNAME_MAX))}
                className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-red-500"
              />

              <div className="relative">
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  placeholder="Senha (mínimo 4 caracteres)"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value.slice(0, PASSWORD_MAX))}
                  className="w-full px-4 py-3 pr-20 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-300"
                >
                  {showRegisterPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              <select
                value={registerRole}
                onChange={(e) => setRegisterRole(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-red-500"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="CAIXA">CAIXA</option>
                <option value="GARCON">GARÇOM</option>
                <option value="COZINHEIRO">COZINHEIRO</option>
              </select>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-semibold border border-red-500 hover:bg-red-500/10 disabled:opacity-50"
              >
                {loading ? "Cadastrando..." : "Cadastrar"}
              </button>

              {/* Informação sobre usuários padrão */}
              <div className="mt-4 p-3 rounded-lg bg-zinc-800/50 text-center">
                <p className="text-xs text-zinc-500">
                  Usuários padrão: <br />
                  admin / admin123 | garcon / garcon123 <br />
                  caixa / caixa123 | cozinheiro / cozinha123
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}