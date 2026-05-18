// src/pages/Pagamento.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import ParticleCanvas from "../components/ParticleCanvas";

export default function Pagamento() {
  const { signOut } = useAuth();
  const [pedidosPendentes, setPedidosPendentes] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formaPagamento, setFormaPagamento] = useState("dinheiro");
  const [trocoPara, setTrocoPara] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    carregarPedidosPendentes();
  }, []);

  const carregarPedidosPendentes = () => {
    const pedidosSalvos = localStorage.getItem("pedidos");
    if (pedidosSalvos) {
      const pedidos = JSON.parse(pedidosSalvos);
      const pendentes = pedidos.filter(p => p.status === "Entregue" && !p.pago);
      setPedidosPendentes(pendentes);
    }
    setLoading(false);
  };

  const processarPagamento = () => {
    if (!selectedOrder) return;

    const pedidosSalvos = localStorage.getItem("pedidos");
    const pedidos = JSON.parse(pedidosSalvos);
    const index = pedidos.findIndex(p => p.id === selectedOrder.id);
    
    if (index !== -1) {
      pedidos[index] = {
        ...pedidos[index],
        pago: true,
        formaPagamento: formaPagamento,
        dataPagamento: new Date().toISOString(),
        troco: formaPagamento === "dinheiro" && trocoPara ? {
          valorRecebido: parseFloat(trocoPara),
          troco: parseFloat(trocoPara) - selectedOrder.total
        } : null
      };
      
      localStorage.setItem("pedidos", JSON.stringify(pedidos));
      
      
      const vendasSalvas = localStorage.getItem("vendas");
      const vendas = vendasSalvas ? JSON.parse(vendasSalvas) : [];
      vendas.push({
        id: Date.now(),
        pedidoId: selectedOrder.id,
        cliente: selectedOrder.cliente,
        mesa: selectedOrder.mesa,
        total: selectedOrder.total,
        formaPagamento: formaPagamento,
        data: new Date().toISOString(),
        items: selectedOrder.items
      });
      localStorage.setItem("vendas", JSON.stringify(vendas));
      
      alert(`Pagamento de R$ ${selectedOrder.total.toFixed(2)} realizado com sucesso!`);
      setSelectedOrder(null);
      setTrocoPara("");
      carregarPedidosPendentes();
    }
  };

  const totalPendente = pedidosPendentes.reduce((sum, p) => sum + p.total, 0);

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
              <h1 className="text-3xl font-bold tracking-tight text-white">Pagamentos</h1>
            </div>
            <p className="text-sm ml-4 text-zinc-400">Processe os pagamentos dos pedidos</p>
          </div>

         
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-green-600/20 to-green-800/20 backdrop-blur-xl border border-green-500/30">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-zinc-400">Total a Receber</p>
                <p className="text-3xl font-bold text-green-400">R$ {totalPendente.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Pedidos Pendentes</p>
                <p className="text-3xl font-bold text-yellow-400">{pedidosPendentes.length}</p>
              </div>
            </div>
          </div>

          {loading && (
            <div className="rounded-2xl p-12 text-center bg-zinc-900/80">
              <div className="inline-block w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-zinc-400">Carregando...</p>
            </div>
          )}

          {!loading && pedidosPendentes.length === 0 && (
            <div className="rounded-2xl p-12 text-center bg-zinc-900/80 border border-red-500/30">
              <div className="text-6xl mb-4 opacity-50">💳</div>
              <p className="text-zinc-400">Nenhum pedido pendente de pagamento</p>
              <p className="text-zinc-500 text-sm mt-1">Os pedidos entregues aparecerão aqui</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white mb-4">Pedidos para Pagamento</h2>
              {pedidosPendentes.map((pedido) => (
                <div key={pedido.id} onClick={() => setSelectedOrder(pedido)} className={`p-4 rounded-xl bg-zinc-900/80 backdrop-blur-xl border transition-all cursor-pointer ${selectedOrder?.id === pedido.id ? 'border-green-500 bg-green-500/10' : 'border-red-500/30 hover:border-red-500/50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-white">Mesa {pedido.mesa}</p>
                      <p className="text-sm text-zinc-400">{pedido.cliente}</p>
                    </div>
                    <p className="text-xl font-bold text-green-400">R$ {pedido.total.toFixed(2)}</p>
                  </div>
                  <div className="text-sm text-zinc-500">
                    <p>Itens: {pedido.items.reduce((sum, item) => sum + item.quantidade, 0)}</p>
                    <p>{new Date(pedido.data).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            
            {selectedOrder && (
              <div className="rounded-2xl p-6 bg-zinc-900/80 backdrop-blur-xl border border-red-500/30">
                <h2 className="text-xl font-bold text-white mb-4">Finalizar Pagamento</h2>
                
                <div className="mb-6 p-4 rounded-xl bg-zinc-800/50">
                  <p className="text-zinc-400 mb-1">Pedido #{selectedOrder.id}</p>
                  <p className="text-2xl font-bold text-green-400">Total: R$ {selectedOrder.total.toFixed(2)}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Forma de Pagamento</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["dinheiro", "cartao-credito", "cartao-debito", "pix"].map((metodo) => (
                        <button key={metodo} onClick={() => setFormaPagamento(metodo)} className={`px-4 py-3 rounded-lg capitalize transition-all ${formaPagamento === metodo ? "bg-red-500 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}>
                          {metodo === "dinheiro" && "💰 Dinheiro"}
                          {metodo === "cartao-credito" && "💳 Crédito"}
                          {metodo === "cartao-debito" && "💳 Débito"}
                          {metodo === "pix" && "📱 PIX"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formaPagamento === "dinheiro" && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Valor Recebido</label>
                      <input type="number" step="0.01" value={trocoPara} onChange={(e) => setTrocoPara(e.target.value)} placeholder="Digite o valor recebido" className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-red-500" />
                      {trocoPara && parseFloat(trocoPara) >= selectedOrder.total && (
                        <div className="mt-2 p-2 rounded-lg bg-green-500/20">
                          <p className="text-sm text-green-400">Troco: R$ {(parseFloat(trocoPara) - selectedOrder.total).toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <button onClick={processarPagamento} className="w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold hover:shadow-lg transition-all mt-6">
                    Confirmar Pagamento
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}