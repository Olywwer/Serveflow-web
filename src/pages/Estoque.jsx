import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import ParticleCanvas from "../components/ParticleCanvas";

export default function Estoque() {
  const { signOut } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduto, setEditingProduto] = useState(null);
  const [categorias, setCategorias] = useState(["Pizzas", "Hambúrgueres", "Saladas", "Bebidas", "Massas", "Sobremesas"]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  
  
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    categoria: "Pizzas",
    quantidade: "",
    unidade: "un",
    imagem: "",
    imagemPreview: null,
    disponivel: true,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    carregarProdutos();
  }, []);

  const carregarProdutos = () => {
    const produtosSalvos = localStorage.getItem("produtos");
    if (produtosSalvos) {
      setProdutos(JSON.parse(produtosSalvos));
    } else {
      
      const produtosIniciais = [
        { id: 1, nome: "Pizza Margherita", descricao: "Molho de tomate, mussarela, manjericão", preco: 45.90, categoria: "Pizzas", quantidade: 50, unidade: "un", imagem: "🍕", disponivel: true },
        { id: 2, nome: "Pizza Pepperoni", descricao: "Molho de tomate, mussarela, pepperoni", preco: 52.90, categoria: "Pizzas", quantidade: 45, unidade: "un", imagem: "🍕", disponivel: true },
        { id: 3, nome: "Hambúrguer Artesanal", descricao: "Pão brioche, carne 180g", preco: 32.90, categoria: "Hambúrgueres", quantidade: 30, unidade: "un", imagem: "🍔", disponivel: true },
        { id: 4, nome: "Refrigerante", descricao: "Coca-Cola 350ml", preco: 6.90, categoria: "Bebidas", quantidade: 100, unidade: "un", imagem: "🥤", disponivel: true },
        { id: 5, nome: "Suco Natural", descricao: "Laranja 500ml", preco: 12.90, categoria: "Bebidas", quantidade: 40, unidade: "un", imagem: "🧃", disponivel: true },
      ];
      setProdutos(produtosIniciais);
      localStorage.setItem("produtos", JSON.stringify(produtosIniciais));
    }
    setLoading(false);
  };

  const salvarProdutos = (novaLista) => {
    setProdutos(novaLista);
    localStorage.setItem("produtos", JSON.stringify(novaLista));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imagem: reader.result,
          imagemPreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingProduto) {
      
      const novosProdutos = produtos.map(p => 
        p.id === editingProduto.id ? { ...formData, id: p.id } : p
      );
      salvarProdutos(novosProdutos);
      alert("Produto atualizado com sucesso!");
    } else {
      
      const novoProduto = {
        // eslint-disable-next-line react-hooks/purity
        id: Date.now(),
        ...formData,
        preco: parseFloat(formData.preco),
        quantidade: parseInt(formData.quantidade),
      };
      salvarProdutos([...produtos, novoProduto]);
      alert("Produto cadastrado com sucesso!");
    }
    
    resetForm();
    setShowModal(false);
  };

  const handleEdit = (produto) => {
    setEditingProduto(produto);
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      categoria: produto.categoria,
      quantidade: produto.quantidade,
      unidade: produto.unidade,
      imagem: produto.imagem,
      imagemPreview: produto.imagem,
      disponivel: produto.disponivel,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      const novosProdutos = produtos.filter(p => p.id !== id);
      salvarProdutos(novosProdutos);
      alert("Produto excluído com sucesso!");
    }
  };

  const resetForm = () => {
    setEditingProduto(null);
    setFormData({
      nome: "",
      descricao: "",
      preco: "",
      categoria: "Pizzas",
      quantidade: "",
      unidade: "un",
      imagem: "",
      imagemPreview: null,
      disponivel: true,
    });
  };

  const adicionarCategoria = () => {
    if (novaCategoria && !categorias.includes(novaCategoria)) {
      setCategorias([...categorias, novaCategoria]);
      setNovaCategoria("");
      alert("Categoria adicionada!");
    }
  };

  const produtosFiltrados = filtroCategoria === "todas" 
    ? produtos 
    : produtos.filter(p => p.categoria === filtroCategoria);

  const produtosBaixoEstoque = produtos.filter(p => p.quantidade < 10 && p.disponivel);

  return (
    <div className="relative flex flex-col min-h-screen bg-black overflow-hidden">
      <div className="glow-bg top-0 left-0 z-0 pointer-events-none"></div>
      <div className="glow-bg bottom-0 right-0 z-0 pointer-events-none"></div>
      <ParticleCanvas />
      <Sidebar onLogout={signOut} />

      <div className="relative z-10 flex-1 pt-20 pb-8 px-4 sm:px-8 page-enter">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(180deg, #f43f5e, #e11d48)" }} />
                <h1 className="text-3xl font-bold tracking-tight text-white">Estoque</h1>
              </div>
              <p className="text-sm ml-4 text-zinc-400">Gerencie produtos e estoque</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
            >
              + Novo Produto
            </button>
          </div>

          
          {produtosBaixoEstoque.length > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">⚠️</span>
                <h3 className="font-semibold text-yellow-400">Produtos com estoque baixo</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {produtosBaixoEstoque.map(p => (
                  <span key={p.id} className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm">
                    {p.nome}: {p.quantidade} {p.unidade}
                  </span>
                ))}
              </div>
            </div>
          )}

          
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroCategoria("todas")}
              className={`px-4 py-2 rounded-lg transition-all ${filtroCategoria === "todas" ? "bg-red-500 text-white" : "bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800"}`}
            >
              Todas
            </button>
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setFiltroCategoria(cat)}
                className={`px-4 py-2 rounded-lg transition-all ${filtroCategoria === cat ? "bg-red-500 text-white" : "bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading && (
            <div className="rounded-2xl p-12 text-center bg-zinc-900/80">
              <div className="inline-block w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-zinc-400">Carregando produtos...</p>
            </div>
          )}

          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtosFiltrados.map((produto) => (
              <div key={produto.id} className="group rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-red-500/30 hover:scale-[1.02] hover:border-red-500/50 transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="text-6xl mb-4 text-center">{produto.imagem}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{produto.nome}</h3>
                  <p className="text-sm text-zinc-400 mb-2">{produto.descricao}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl font-bold text-green-400">R$ {produto.preco.toFixed(2)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${produto.disponivel ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {produto.disponivel ? 'Disponível' : 'Indisponível'}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Estoque:</span>
                      <span className={`font-semibold ${produto.quantidade < 10 ? 'text-yellow-400' : 'text-white'}`}>
                        {produto.quantidade} {produto.unidade}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2 mt-1">
                      <div 
                        className={`rounded-full h-2 transition-all ${produto.quantidade < 10 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min((produto.quantidade / 100) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(produto)} className="flex-1 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all text-sm">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(produto.id)} className="flex-1 px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm">
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {produtosFiltrados.length === 0 && !loading && (
            <div className="rounded-2xl p-12 text-center bg-zinc-900/80 border border-red-500/30">
              <div className="text-6xl mb-4 opacity-50">📦</div>
              <p className="text-zinc-400">Nenhum produto encontrado</p>
              <p className="text-zinc-500 text-sm mt-1">Clique em "Novo Produto" para adicionar</p>
            </div>
          )}
        </div>
      </div>

     
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-zinc-900 rounded-2xl border border-red-500/30 p-6 m-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{editingProduto ? "Editar Produto" : "Novo Produto"}</h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white text-2xl">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Imagem do Produto</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl bg-zinc-800 flex items-center justify-center text-5xl">
                    {formData.imagemPreview ? (
                      <img src={formData.imagemPreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span>📷</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-red-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-500 file:text-white hover:file:bg-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Nome do Produto</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Descrição</label>
                <textarea
                  rows="3"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Categoria</label>
                  <div className="flex gap-2">
                    <select
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      className="flex-1 px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-red-500"
                    >
                      {categorias.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Quantidade em Estoque</label>
                  <input
                    type="number"
                    required
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Unidade</label>
                  <select
                    value={formData.unidade}
                    onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-red-500"
                  >
                    <option value="un">Unidade</option>
                    <option value="kg">Quilograma</option>
                    <option value="g">Grama</option>
                    <option value="l">Litro</option>
                    <option value="ml">Mililitro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.disponivel}
                    onChange={(e) => setFormData({ ...formData, disponivel: e.target.checked })}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-sm text-zinc-400">Produto disponível para venda</span>
                </label>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-500 text-white font-semibold hover:shadow-lg transition-all">
                  {editingProduto ? "Atualizar Produto" : "Cadastrar Produto"}
                </button>
              </div>
            </form>

           
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <label className="block text-sm font-medium text-zinc-400 mb-2">Adicionar Nova Categoria</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={novaCategoria}
                  onChange={(e) => setNovaCategoria(e.target.value)}
                  placeholder="Nome da nova categoria"
                  className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={adicionarCategoria}
                  className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-all"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}