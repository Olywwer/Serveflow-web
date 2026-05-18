import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import ParticleCanvas from "../components/ParticleCanvas";

export default function Pedidos() {
  const { signOut, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    carregarPedidos();
  }, []);

  const carregarPedidos = () => {
    const pedidosSalvos = localStorage.getItem("pedidos");
    if (pedidosSalvos) {
      const pedidos = JSON.parse(pedidosSalvos);
      pedidos.sort((a, b) => new Date(b.data) - new Date(a.data));
      setOrders(pedidos);
    }
    setLoading(false);
  };

  const atualizarStatus = (id, novoStatus) => {
    const pedidosSalvos = localStorage.getItem("pedidos");
    const pedidos = JSON.parse(pedidosSalvos);
    const pedidoIndex = pedidos.findIndex(p => p.id === id);
    
    if (pedidoIndex !== -1) {
      pedidos[pedidoIndex].status = novoStatus;
      localStorage.setItem("pedidos", JSON.stringify(pedidos));
      carregarPedidos();
      
      if (novoStatus === "Entregue") {
        alert(`Pedido #${id} entregue! Agora pode ser encaminhado para pagamento.`);
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Pendente": return "text-orange-400 bg-orange-500/10";
      case "Em preparo": return "text-yellow-400 bg-yellow-500/10";
      case "Entregue": return "text-green-400 bg-green-500/10";
      case "Cancelado": return "text-red-400 bg-red-500/10";
      default: return "text-zinc-400 bg-zinc-500/10";
    }
  };

  const pedidosFiltrados = orders.filter(pedido => {
    if (filter === "todos") return true;
    return pedido.status.toLowerCase() === filter.toLowerCase();
  });

  const stats = {
    total: orders.length,
    pendentes: orders.filter(p => p.status === "Pendente").length,
    emPreparo: orders.filter(p => p.status === "Em preparo").length,
    entregues: orders.filter(p => p.status === "Entregue").length,
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-black overflow-hidden">
      <div className="glow-bg top-0 left-0 z-0 pointer-events-none"></div>
      <div className="glow-bg bottom-0 right-0 z-0 pointer-events-none"></div>
      <ParticleCanvas />
      <Sidebar onLogout={signOut} />

      <div className="relative z-10 flex-1 pt-20 pb-8 px-4 sm:px-8 page-enter">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(180deg, #f43f5e, #e11d48)" }} />
              <h1 className="text-3xl font-bold tracking-tight text-white">Meus Pedidos</h1>
            </div>
            <p className="text-sm ml-4 text-zinc-400">Acompanhe e gerencie todos os pedidos</p>
          </div>

          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="rounded-xl p-4 bg-zinc-900/80 text-center border border-red-500/30">
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-zinc-400">Total</p>
            </div>
            <div className="rounded-xl p-4 bg-zinc-900/80 text-center border border-orange-500/30">
              <p className="text-2xl font-bold text-orange-400">{stats.pendentes}</p>
              <p className="text-xs text-zinc-400">Pendentes</p>
            </div>
            <div className="rounded-xl p-4 bg-zinc-900/80 text-center border border-yellow-500/30">
              <p className="text-2xl font-bold text-yellow-400">{stats.emPreparo}</p>
              <p className="text-xs text-zinc-400">Em Preparo</p>
            </div>
            <div className="rounded-xl p-4 bg-zinc-900/80 text-center border border-green-500/30">
              <p className="text-2xl font-bold text-green-400">{stats.entregues}</p>
              <p className="text-xs text-zinc-400">Entregues</p>
            </div>
          </div>

          
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {["todos", "pendente", "em preparo", "entregue", "cancelado"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg capitalize transition-all ${filter === f ? "bg-red-500 text-white" : "bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800"}`}>
                {f === "todos" ? "Todos" : f}
              </button>
            ))}
          </div>

          {loading && (
            <div className="rounded-2xl p-12 text-center bg-zinc-900/80">
              <div className="inline-block w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-zinc-400">Carregando pedidos...</p>
            </div>
          )}

          {!loading && pedidosFiltrados.length === 0 && (
            <div className="rounded-2xl p-12 text-center bg-zinc-900/80 border border-red-500/30">
              <div className="text-6xl mb-4 opacity-50">📋</div>
              <p className="text-zinc-400">Nenhum pedido encontrado.</p>
              <p className="text-zinc-500 text-sm mt-1">Faça um pedido no menu "Fazer Pedido"</p>
            </div>
          )}

          
          {!loading && pedidosFiltrados.length > 0 && (
            <div className="flex flex-col gap-4">
              {pedidosFiltrados.map((pedido) => (
                <div key={pedido.id} className="rounded-xl bg-zinc-900/80 backdrop-blur-xl border border-red-500/30 hover:scale-[1.01] hover:border-red-500/50 transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-mono text-red-400">#PED-{pedido.id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(pedido.status)}`}>{pedido.status}</span>
                          {pedido.pago && <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400">Pago</span>}
                        </div>
                        <h3 className="text-lg font-bold text-white">Mesa {pedido.mesa} - {pedido.cliente}</h3>
                        <p className="text-xs text-zinc-500 mt-1">{new Date(pedido.data).toLocaleString("pt-BR")}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-400">R$ {pedido.total.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="border-t border-zinc-800 pt-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {pedido.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-zinc-300">{item.quantidade}x {item.nome}</span>
                            <span className="text-zinc-400">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      {pedido.observacao && (
                        <div className="mt-3 p-2 rounded-lg bg-zinc-800/50">
                          <p className="text-xs text-zinc-400"><span className="font-semibold">Obs:</span> {pedido.observacao}</p>
                        </div>
                      )}
                    </div>

                    {(user?.role === "ADMIN" || user?.role === "COZINHEIRO") && pedido.status !== "Entregue" && pedido.status !== "Cancelado" && (
                      <div className="flex gap-2">
                        {pedido.status === "Pendente" && (
                          <button onClick={() => atualizarStatus(pedido.id, "Em preparo")} className="px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500 hover:text-white transition-all">
                            Iniciar Preparo
                          </button>
                        )}
                        {pedido.status === "Em preparo" && (
                          <button onClick={() => atualizarStatus(pedido.id, "Entregue")} className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-all">
                            Marcar Entregue
                          </button>
                        )}
                        <button onClick={() => atualizarStatus(pedido.id, "Cancelado")} className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}