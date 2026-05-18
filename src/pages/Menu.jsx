import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import ParticleCanvas from "../components/ParticleCanvas";
import { useNavigate } from "react-router-dom";

export default function Menu() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [carrinho, setCarrinho] = useState([]);
  const [showCarrinho, setShowCarrinho] = useState(false);
  const [mesa, setMesa] = useState("");
  const [cliente, setCliente] = useState("");
  const [observacao, setObservacao] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    carregarProdutos();
  }, []);

  const carregarProdutos = () => {
    const produtosSalvos = localStorage.getItem("produtos");
    if (produtosSalvos) {
      const produtosLista = JSON.parse(produtosSalvos);
      const disponiveis = produtosLista.filter(p => p.disponivel && p.quantidade > 0);
      setProdutos(disponiveis);
      
      const cats = [...new Set(disponiveis.map(p => p.categoria))];
      setCategorias(["Todos", ...cats]);
    }
  };

  const produtosFiltrados = produtos.filter(item => 
    categoriaSelecionada === "Todos" ? true : item.categoria === categoriaSelecionada
  );

  const adicionarAoCarrinho = (produto) => {
    if (produto.quantidade <= 0) {
      alert("Produto sem estoque!");
      return;
    }
    
    const itemExistente = carrinho.find(item => item.id === produto.id);
    if (itemExistente) {
      if (itemExistente.quantidade + 1 > produto.quantidade) {
        alert(`Quantidade máxima disponível: ${produto.quantidade}`);
        return;
      }
      setCarrinho(carrinho.map(item =>
        item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
      ));
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }
  };

  const removerDoCarrinho = (id) => {
    const itemExistente = carrinho.find(item => item.id === id);
    if (itemExistente.quantidade > 1) {
      setCarrinho(carrinho.map(item =>
        item.id === id ? { ...item, quantidade: item.quantidade - 1 } : item
      ));
    } else {
      setCarrinho(carrinho.filter(item => item.id !== id));
    }
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const finalizarPedido = () => {
    if (carrinho.length === 0) {
      alert("Adicione itens ao carrinho primeiro!");
      return;
    }
    if (!mesa) {
      alert("Informe o número da mesa!");
      return;
    }

    
    const produtosSalvos = localStorage.getItem("produtos");
    const todosProdutos = JSON.parse(produtosSalvos);
    
    const estoqueAtualizado = todosProdutos.map(produto => {
      const itemPedido = carrinho.find(item => item.id === produto.id);
      if (itemPedido) {
        return {
          ...produto,
          quantidade: produto.quantidade - itemPedido.quantidade
        };
      }
      return produto;
    });
    
    localStorage.setItem("produtos", JSON.stringify(estoqueAtualizado));

    const novoPedido = {
      id: Date.now(),
      cliente: cliente || "Cliente",
      mesa: mesa,
      items: carrinho,
      total: calcularTotal(),
      status: "Pendente",
      pago: false,
      data: new Date().toISOString(),
      observacao: observacao,
      atendente: user?.username,
    };

    const pedidosSalvos = localStorage.getItem("pedidos");
    const pedidos = pedidosSalvos ? JSON.parse(pedidosSalvos) : [];
    pedidos.push(novoPedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    setCarrinho([]);
    setMesa("");
    setCliente("");
    setObservacao("");
    setShowCarrinho(false);
    carregarProdutos();
    
    alert(`Pedido #${novoPedido.id} realizado com sucesso! Estoque atualizado.`);
    
    if (window.confirm("Deseja ver seus pedidos?")) {
      navigate("/pedidos");
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(180deg, #f43f5e, #e11d48)" }} />
                <h1 className="text-3xl font-bold tracking-tight text-white">Fazer Pedido</h1>
              </div>
              <p className="text-sm ml-4 text-zinc-400">Escolha os itens do cardápio</p>
            </div>
            <button
              onClick={() => setShowCarrinho(true)}
              className="relative px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-all"
            >
              <span className="text-2xl">🛒</span>
              {carrinho.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {carrinho.reduce((total, item) => total + item.quantidade, 0)}
                </span>
              )}
            </button>
          </div>

          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaSelecionada(cat)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    categoriaSelecionada === cat ? "bg-red-500 text-white" : "bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtosFiltrados.map((produto) => (
              <div key={produto.id} className="group rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-red-500/30 hover:scale-[1.02] hover:border-red-500/50 transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">
                    {produto.imagem ? (
                      <img src={produto.imagem} alt={produto.nome} className="w-20 h-20 mx-auto object-cover rounded-full" />
                    ) : (
                      <span>🍽️</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{produto.nome}</h3>
                  <p className="text-sm text-zinc-400 mb-4 min-h-[60px]">{produto.descricao}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-green-400">R$ {produto.preco.toFixed(2)}</span>
                      <p className="text-xs text-zinc-500">Estoque: {produto.quantidade}</p>
                    </div>
                    <button 
                      onClick={() => adicionarAoCarrinho(produto)}
                      disabled={produto.quantidade <= 0}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        produto.quantidade > 0 
                          ? "bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white" 
                          : "bg-zinc-700/50 text-zinc-500 cursor-not-allowed"
                      }`}
                    >
                      {produto.quantidade > 0 ? "Adicionar" : "Indisponível"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {produtosFiltrados.length === 0 && (
            <div className="rounded-2xl p-12 text-center bg-zinc-900/80 border border-red-500/30">
              <div className="text-6xl mb-4 opacity-50">🍽️</div>
              <p className="text-zinc-400">Nenhum produto disponível no momento</p>
            </div>
          )}
        </div>
      </div>

      
      {showCarrinho && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-zinc-900 rounded-2xl border border-red-500/30 p-6 m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Seu Pedido</h2>
              <button onClick={() => setShowCarrinho(false)} className="text-zinc-400 hover:text-white text-2xl">✕</button>
            </div>

            {carrinho.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-zinc-400">Seu carrinho está vazio</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {carrinho.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-zinc-800 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-white">{item.nome}</h3>
                        <p className="text-sm text-zinc-400">R$ {item.preco.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => removerDoCarrinho(item.id)} className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white">-</button>
                        <span className="text-white font-semibold">{item.quantidade}</span>
                        <button onClick={() => adicionarAoCarrinho(item)} className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white">+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-800 pt-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-zinc-400">Total:</span>
                    <span className="text-2xl font-bold text-green-400">R$ {calcularTotal().toFixed(2)}</span>
                  </div>

                  <div className="space-y-3">
                    <input type="text" placeholder="Número da Mesa *" value={mesa} onChange={(e) => setMesa(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-red-500" />
                    <input type="text" placeholder="Nome do Cliente (opcional)" value={cliente} onChange={(e) => setCliente(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-red-500" />
                    <textarea placeholder="Observações (opcional)" value={observacao} onChange={(e) => setObservacao(e.target.value)} rows="3" className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-red-500" />
                  </div>
                </div>

                <button onClick={finalizarPedido} className="w-full py-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-500 text-white font-semibold hover:shadow-lg transition-all">
                  Confirmar Pedido
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}