import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import ParticleCanvas from "../components/ParticleCanvas";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const name = user?.username || "Usuário";
  
  const [stats, setStats] = useState({
    receitaDiaria: 0,
    pedidosHoje: 0,
    clientesAtendidos: 0,
    lucroLiquido: 0,
    ticketMedio: 0,
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    carregarDados();
  }, []);

  const carregarDados = () => {
    const pedidosSalvos = localStorage.getItem("pedidos");
    if (pedidosSalvos) {
      const pedidos = JSON.parse(pedidosSalvos);
      const hoje = new Date().toDateString();
      
      const pedidosHoje = pedidos.filter(p => new Date(p.data).toDateString() === hoje);
      const pedidosPagosHoje = pedidosHoje.filter(p => p.pago);
      
      const receitaDiaria = pedidosPagosHoje.reduce((sum, p) => sum + p.total, 0);
      const totalPedidos = pedidosHoje.length;
      const clientesUnicos = new Set(pedidosHoje.map(p => p.cliente)).size;
      const lucroLiquido = receitaDiaria * 0.4;
      const ticketMedio = totalPedidos > 0 ? receitaDiaria / totalPedidos : 0;
      
      setStats({
        receitaDiaria,
        pedidosHoje: totalPedidos,
        clientesAtendidos: clientesUnicos,
        lucroLiquido,
        ticketMedio,
      });
      
      
      const produtosVendidos = {};
      pedidos.forEach(pedido => {
        pedido.items.forEach(item => {
          if (produtosVendidos[item.nome]) {
            produtosVendidos[item.nome].quantidade += item.quantidade;
          } else {
            produtosVendidos[item.nome] = {
              nome: item.nome,
              quantidade: item.quantidade,
            };
          }
        });
      });
      
      const top5 = Object.values(produtosVendidos)
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 4);
      setTopProducts(top5);
      
      
      const recentes = pedidos.slice(0, 5).map(p => ({
        id: p.id,
        cliente: p.cliente,
        mesa: p.mesa,
        total: p.total,
        status: p.status,
        hora: new Date(p.data).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })
      }));
      setRecentOrders(recentes);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Em preparo": return "text-yellow-400 bg-yellow-500/10";
      case "Entregue": return "text-green-400 bg-green-500/10";
      case "Pendente": return "text-orange-400 bg-orange-500/10";
      default: return "text-zinc-400 bg-zinc-500/10";
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-black overflow-hidden">
      <div className="glow-bg top-0 left-0 z-0 pointer-events-none"></div>
      <div className="glow-bg bottom-0 right-0 z-0 pointer-events-none"></div>
      <ParticleCanvas />
      <Sidebar onLogout={signOut} />

      <div className="relative z-10 flex-1 pt-20 pb-8 px-4 sm:px-8 page-enter">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-1 h-8 rounded-full"
                style={{ background: "linear-gradient(180deg, #f43f5e, #e11d48)" }}
              />
              <h1 className="text-3xl font-bold tracking-tight capitalize text-white">
                Olá, {name}
              </h1>
            </div>
            <p className="text-sm ml-4 text-zinc-400">
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
            <div className="rounded-2xl p-6 bg-zinc-900/80 backdrop-blur-xl border border-red-500/30 hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Receita Diária</span>
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 text-xl">💰</div>
              </div>
              <p className="text-2xl font-bold text-white">R$ {stats.receitaDiaria.toFixed(2)}</p>
            </div>

            <div className="rounded-2xl p-6 bg-zinc-900/80 backdrop-blur-xl border border-red-500/30 hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Pedidos Hoje</span>
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 text-xl">📋</div>
              </div>
              <p className="text-2xl font-bold text-white">{stats.pedidosHoje}</p>
            </div>

            <div className="rounded-2xl p-6 bg-zinc-900/80 backdrop-blur-xl border border-red-500/30 hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Clientes</span>
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 text-xl">👥</div>
              </div>
              <p className="text-2xl font-bold text-white">{stats.clientesAtendidos}</p>
            </div>

            <div className="rounded-2xl p-6 bg-zinc-900/80 backdrop-blur-xl border border-red-500/30 hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Lucro Líquido</span>
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 text-xl">📈</div>
              </div>
              <p className="text-2xl font-bold text-green-400">R$ {stats.lucroLiquido.toFixed(2)}</p>
            </div>

            <div className="rounded-2xl p-6 bg-zinc-900/80 backdrop-blur-xl border border-red-500/30 hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Ticket Médio</span>
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 text-xl">🎫</div>
              </div>
              <p className="text-2xl font-bold text-blue-400">R$ {stats.ticketMedio.toFixed(2)}</p>
            </div>
          </div>

         
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            
            <div className="rounded-2xl p-6 bg-zinc-900/80 backdrop-blur-xl border border-red-500/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-px bg-gradient-to-r from-red-500 to-transparent" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Produtos Mais Vendidos
                </h2>
              </div>
              <div className="space-y-4">
                {topProducts.map((product, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{product.nome}</span>
                      <span className="text-xs text-zinc-400">{product.quantidade} unidades</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-red-600 to-red-400 rounded-full h-2 transition-all"
                        style={{ width: `${(product.quantidade / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                {topProducts.length === 0 && (
                  <p className="text-center text-zinc-500 py-8">Nenhum produto vendido ainda</p>
                )}
              </div>
            </div>

            
            <div className="rounded-2xl p-6 bg-zinc-900/80 backdrop-blur-xl border border-red-500/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-px bg-gradient-to-r from-red-500 to-transparent" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Ações Rápidas
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/menu" className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center hover:bg-red-500/20 transition-all">
                  <div className="text-3xl mb-2">🍽️</div>
                  <p className="text-sm font-semibold text-white">Fazer Pedido</p>
                </Link>
                <Link to="/pedidos" className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center hover:bg-red-500/20 transition-all">
                  <div className="text-3xl mb-2">📋</div>
                  <p className="text-sm font-semibold text-white">Ver Pedidos</p>
                </Link>
                <Link to="/pagamento" className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center hover:bg-red-500/20 transition-all">
                  <div className="text-3xl mb-2">💳</div>
                  <p className="text-sm font-semibold text-white">Pagamentos</p>
                </Link>
              </div>
            </div>
          </div>

          
          <div className="rounded-2xl p-6 bg-zinc-900/80 backdrop-blur-xl border border-red-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-px bg-gradient-to-r from-red-500 to-transparent" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Pedidos Recentes
                </h2>
              </div>
              <Link to="/pedidos" className="text-xs text-red-400 hover:text-red-300 transition-colors">
                Ver todos →
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-zinc-800">
                  <tr className="text-left text-xs text-zinc-500">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">Cliente</th>
                    <th className="pb-3 font-medium">Mesa</th>
                    <th className="pb-3 font-medium">Valor</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="text-sm hover:bg-zinc-800/50 transition-colors">
                      <td className="py-3 text-zinc-400">#{order.id}</td>
                      <td className="py-3 text-white">{order.cliente}</td>
                      <td className="py-3 text-zinc-300">Mesa {order.mesa}</td>
                      <td className="py-3 text-green-400 font-semibold">R$ {order.total.toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                       </td>
                      <td className="py-3 text-zinc-400">{order.hora}</td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-zinc-500">
                        Nenhum pedido realizado ainda
                      </td>
                    </tr>
                  )}
                </tbody>
               </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}