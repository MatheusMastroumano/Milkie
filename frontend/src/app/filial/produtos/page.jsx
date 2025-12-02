"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from "@/components/Headerfilial/page";
import Footer from "@/components/Footerfilial/page";
import { apiJson } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function ProdutosFilial() {
  const router = useRouter();
  const [lojaId, setLojaId] = useState(null);
  const [lojaNome, setLojaNome] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [novoItem, setNovoItem] = useState({ produto_id: '', quantidade: '', preco: '', valido_ate: '' });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Obter loja do usuário logado
  useEffect(() => {
    (async () => {
      try {
        const auth = await apiJson('/auth/check-auth');
        const id = Number(auth?.user?.loja_id) || null;
        setLojaId(id);
        try {
          const lojas = await apiJson('/lojas');
          const loja = (lojas.lojas || []).find((l) => Number(l.id) === id);
          if (loja) setLojaNome(loja.nome);
        } catch {}
      } catch (e) {
        setErro(e?.message || 'Falha ao identificar loja do usuário');
      }
    })();
  }, []);

  // Carregar produtos
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setLoading(true);
        const data = await apiJson('/produtos');
        const produtosArray = data.produtos || data || [];
        setProdutos(produtosArray);
      } catch (e) {
        setErro(e?.message || 'Erro ao carregar produtos');
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 4000);
  };

  const validateForm = (item) => {
    const err = {};
    if (!item.produto_id) err.produto_id = 'Selecione um produto';
    if (!item.quantidade || parseFloat(item.quantidade) <= 0) err.quantidade = 'Quantidade deve ser maior que 0';
    if (!item.preco || parseFloat(item.preco) <= 0) err.preco = 'Preço deve ser maior que 0';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleAddToEstoque = async (e) => {
    e.preventDefault();
    if (!lojaId) {
      showAlert('error', 'Loja não identificada');
      return;
    }

    const payload = {
      produto_id: parseInt(novoItem.produto_id),
      loja_id: lojaId,
      quantidade: parseFloat(novoItem.quantidade),
      preco: parseFloat(novoItem.preco),
      valido_ate: novoItem.valido_ate || null,
    };

    if (!validateForm(payload)) return;

    try {
      const response = await apiJson('/estoque', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const novo = response.estoque || response;
      
      showAlert('success', 'Produto adicionado ao estoque com sucesso!');
      setNovoItem({ produto_id: '', quantidade: '', preco: '', valido_ate: '' });
      setErrors({});
      setIsAddModalOpen(false);
    } catch (err) {
      showAlert('error', err.message);
    }
  };

  const openAddModal = (produtoId = '') => {
    setNovoItem({ produto_id: produtoId.toString(), quantidade: '', preco: '', valido_ate: '' });
    setIsAddModalOpen(true);
    setErrors({});
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setNovoItem({ produto_id: '', quantidade: '', preco: '', valido_ate: '' });
    setErrors({});
  };

  const handleViewProduct = (produto) => {
    localStorage.setItem('productDetails', JSON.stringify(produto));
    router.push(`/filial/produtos/${produto.id}`);
  };

  const filteredProdutos = produtos.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    return (
      p.nome?.toLowerCase().includes(searchLower) ||
      p.sku?.toLowerCase().includes(searchLower) ||
      p.marca?.toLowerCase().includes(searchLower) ||
      p.categoria?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFFFF] pt-20 pb-20 flex flex-col items-center justify-start transition-all duration-300">
        <div className="w-full max-w-7xl px-4 flex flex-col items-center">
          {alert.show && (
            <div className="w-full mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <Alert variant={alert.type === 'success' ? 'default' : 'destructive'}>
                {alert.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>{alert.type === 'success' ? 'Sucesso!' : 'Erro!'}</AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-2 text-center">
            Produtos - {lojaNome || `Loja ${lojaId || ''}`}
          </h1>
          <p className="text-sm text-[#666] mb-6 text-center max-w-2xl mx-auto">
            Visualize os produtos disponíveis e adicione-os ao estoque da sua loja.
          </p>

          <div className="w-full flex justify-end mb-4 gap-3">
            <button
              onClick={() => openAddModal()}
              className="px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
            >
              Adicionar ao Estoque
            </button>
          </div>

          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6 w-full">
            <div className="mb-6">
              <label htmlFor="search-produto" className="block text-sm font-medium text-[#2A4E73] mb-2">
                Buscar Produto
              </label>
              <input
                id="search-produto"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                placeholder="Nome, SKU, marca ou categoria..."
              />
            </div>

            {erro && (
              <p className="text-center text-red-600 mb-4">{erro}</p>
            )}

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#2A4E73]" />
              </div>
            ) : filteredProdutos.length === 0 ? (
              <p className="text-[#2A4E73] text-center py-8">
                {searchTerm ? 'Nenhum produto encontrado.' : 'Nenhum produto cadastrado.'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base text-[#2A4E73] border-collapse">
                  <thead>
                    <tr className="bg-[#2A4E73] text-[#FFFFFF]">
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left rounded-tl-md">SKU</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Nome</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Marca</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Categoria</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Fornecedores</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-center rounded-tr-md">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProdutos.map((p) => {
                      // Processar fornecedores_ids se for um array JSON
                      let fornecedoresNomes = [];
                      if (p.fornecedores_ids) {
                        try {
                          const ids = Array.isArray(p.fornecedores_ids) ? p.fornecedores_ids : JSON.parse(p.fornecedores_ids);
                          if (Array.isArray(ids) && ids.length > 0) {
                            // Se temos os fornecedores completos na resposta
                            if (p.fornecedores && Array.isArray(p.fornecedores)) {
                              fornecedoresNomes = p.fornecedores.map(f => f.nome || f.fornecedor?.nome).filter(Boolean);
                            } else {
                              // Caso contrário, apenas mostrar os IDs
                              fornecedoresNomes = ids.map(id => `ID: ${id}`);
                            }
                          }
                        } catch (e) {
                          console.error('Erro ao processar fornecedores_ids:', e);
                        }
                      }

                      return (
                        <tr 
                          key={p.id} 
                          className="border-b border-gray-200 hover:bg-[#CFE8F9] cursor-pointer"
                          onClick={() => handleViewProduct(p)}
                        >
                          <td className="px-3 sm:px-4 py-2 sm:py-3">{p.sku}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 truncate max-w-[180px]">{p.nome}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3">{p.marca || '-'}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3">{p.categoria || '-'}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3">
                            {fornecedoresNomes.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {fornecedoresNomes.map((nome, idx) => (
                                  <span key={idx} className="inline-block px-2 py-1 text-xs bg-[#2A4E73] text-white rounded">
                                    {nome}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => openAddModal(p.id)}
                              className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                            >
                              Adicionar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {/* Modal Adicionar ao Estoque */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-labelledby="add-estoque-title" aria-modal="true">
            <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-md w-full">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="add-estoque-title" className="text-lg font-semibold text-[#2A4E73]">Adicionar ao Estoque</h2>
                  <button onClick={closeModal} className="text-[#2A4E73] hover:text-[#AD343E] text-2xl font-bold">×</button>
                </div>
                <form onSubmit={handleAddToEstoque} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Produto *</label>
                    <select
                      value={novoItem.produto_id}
                      onChange={(e) => setNovoItem({ ...novoItem, produto_id: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                    >
                      <option value="">Selecione um produto...</option>
                      {produtos.map((p) => (
                        <option key={p.id} value={p.id}>{p.nome} ({p.sku})</option>
                      ))}
                    </select>
                    {errors.produto_id && <p className="text-[#AD343E] text-xs mt-1">{errors.produto_id}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[#2A4E73] mb-1">Quantidade *</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={novoItem.quantidade} 
                        onChange={(e) => setNovoItem({ ...novoItem, quantidade: e.target.value })} 
                        className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]" 
                        placeholder="10" 
                        min="0.01"
                      />
                      {errors.quantidade && <p className="text-[#AD343E] text-xs mt-1">{errors.quantidade}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2A4E73] mb-1">Preço (R$) *</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={novoItem.preco} 
                        onChange={(e) => setNovoItem({ ...novoItem, preco: e.target.value })} 
                        className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]" 
                        placeholder="29.90" 
                        min="0.01"
                      />
                      {errors.preco && <p className="text-[#AD343E] text-xs mt-1">{errors.preco}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Válido até</label>
                    <input 
                      type="date" 
                      value={novoItem.valido_ate} 
                      onChange={(e) => setNovoItem({ ...novoItem, valido_ate: e.target.value })} 
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]" 
                    />
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button 
                      type="submit" 
                      className="flex-1 px-4 py-1.5 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]" 
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin inline-block" /> : 'Adicionar'}
                    </button>
                    <button 
                      type="button" 
                      onClick={closeModal} 
                      className="flex-1 px-4 py-1.5 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <Footer />
      </main>
      
    </>
  );
}
