"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function Produtos() {
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lojaId, setLojaId] = useState(null);
  const [lojas, setLojas] = useState([]); // Novo: lista de lojas
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    marca: '',
    categoria: '',
    descricao: '',
    sku: '',
    fabricacao: '',
    validade: '',
    ativo: true,
  });
  const [editProduto, setEditProduto] = useState(null);
  const [estoqueProduto, setEstoqueProduto] = useState({
    produto_id: null,
    loja_id: '',
    quantidade: '',
    preco: '',
    valido_ate: '',
  });
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEstoqueModalOpen, setIsEstoqueModalOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Obter loja_id do usuário
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setLojaId(user.loja_id || 1);
  }, []);

  // Carregar produtos
  useEffect(() => {
    if (!lojaId) return;

    const fetchProdutos = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/produtos?loja_id=${lojaId}`);
        if (!res.ok) throw new Error('Erro ao carregar produtos');
        const { produtos: data } = await res.json();
        setProdutos(data || []);
      } catch (error) {
        showAlert('error', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, [lojaId]);

  // Novo: Carregar lista de lojas
  useEffect(() => {
    const fetchLojas = async () => {
      try {
        const res = await fetch(`${API_URL}/lojas`);
        if (!res.ok) throw new Error('Erro ao carregar lojas');
        const data = await res.json();
        setLojas(data.lojas || data || []);
      } catch (error) {
        showAlert('error', 'Erro ao carregar lojas');
      }
    };
    fetchLojas();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const validateProdutoForm = (produto) => {
    const newErrors = {};
    if (!produto.nome.trim()) newErrors.nome = 'Nome obrigatório';
    if (!produto.sku.trim()) newErrors.sku = 'SKU obrigatório';
    else if (produtos.some(p => p.sku === produto.sku && (!editProduto || p.id !== editProduto.id))) {
      newErrors.sku = 'SKU já existe';
    }
    if (produto.fabricacao && isNaN(new Date(produto.fabricacao))) {
      newErrors.fabricacao = 'Data inválida';
    }
    if (produto.validade && isNaN(new Date(produto.validade))) {
      newErrors.validade = 'Data inválida';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Atualizado: validação do estoque com todos os campos
  const validateEstoqueForm = (estoque) => {
    const newErrors = {};
    if (!estoque.loja_id) newErrors.loja_id = 'Selecione uma filial';
    const qtd = parseFloat(estoque.quantidade);
    const preco = parseFloat(estoque.preco);
    if (isNaN(qtd) || qtd <= 0) newErrors.quantidade = 'Quantidade inválida';
    if (isNaN(preco) || preco <= 0) newErrors.preco = 'Preço inválido';
    if (estoque.valido_ate && isNaN(new Date(estoque.valido_ate))) {
      newErrors.valido_ate = 'Data inválida';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddProduto = async (e) => {
    e.preventDefault();
    if (!validateProdutoForm(novoProduto)) return;

    try {
      const res = await fetch(`${API_URL}/produtos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...novoProduto,
          fabricacao: novoProduto.fabricacao || null,
          validade: novoProduto.validade || null,
        }),
      });
      if (!res.ok) throw new Error('Falha ao criar produto');
      const { produto: novo } = await res.json();

      setProdutos(prev => [...prev, novo]);
      closeModal();
      showAlert('success', 'Produto criado com sucesso!');
    } catch (error) {
      showAlert('error', error.message);
    }
  };

  const handleEditProduto = async (e) => {
    e.preventDefault();
    if (!validateProdutoForm(editProduto)) return;

    try {
      await fetch(`${API_URL}/produtos/${editProduto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editProduto,
          fabricacao: editProduto.fabricacao || null,
          validade: editProduto.validade || null,
        }),
      });

      setProdutos(prev => prev.map(p => p.id === editProduto.id ? editProduto : p));
      closeModal();
      showAlert('success', 'Produto atualizado!');
    } catch (error) {
      showAlert('error', error.message);
    }
  };

  // Atualizado: envio com todos os campos
  const handleAddEstoque = async (e) => {
    e.preventDefault();
    if (!validateEstoqueForm(estoqueProduto)) return;

    try {
      const res = await fetch(`${API_URL}/estoque`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produto_id: estoqueProduto.produto_id,
          loja_id: parseInt(estoqueProduto.loja_id),
          quantidade: parseFloat(estoqueProduto.quantidade),
          preco: parseFloat(estoqueProduto.preco),
          valido_ate: estoqueProduto.valido_ate || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Erro ao atualizar estoque');
      }

      const { estoque: novoEstoque } = await res.json();

      setProdutos(prev => prev.map(p =>
        p.id === estoqueProduto.produto_id
          ? { ...p, estoque: [novoEstoque] }
          : p
      ));

      closeModal();
      showAlert('success', 'Estoque atualizado com sucesso!');
    } catch (error) {
      showAlert('error', error.message);
    }
  };

  const openEditProduto = (produto) => {
    setEditProduto({
      ...produto,
      fabricacao: produto.fabricacao?.split('T')[0] || '',
      validade: produto.validade?.split('T')[0] || '',
    });
    setIsModalOpen(true);
    setErrors({});
  };

  // Atualizado: inicializa com loja_id atual
  const openEstoqueModal = (produto) => {
    setEstoqueProduto({
      produto_id: produto.id,
      loja_id: lojaId?.toString() || '',
      quantidade: '',
      preco: produto.estoque?.[0]?.preco?.toString() || '',
      valido_ate: '',
    });
    setIsEstoqueModalOpen(true);
    setErrors({});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsAddModalOpen(false);
    setIsEstoqueModalOpen(false);
    setEditProduto(null);
    setEstoqueProduto({
      produto_id: null,
      loja_id: '',
      quantidade: '',
      preco: '',
      valido_ate: '',
    });
    setNovoProduto({
      nome: '', marca: '', categoria: '', descricao: '', sku: '',
      fabricacao: '', validade: '', ativo: true,
    });
    setErrors({});
  };

  const handleDeleteProduto = async (id) => {
    if (!window.confirm('Excluir este produto?')) return;
    try {
      await fetch(`${API_URL}/produtos/${id}`, { method: 'DELETE' });
      setProdutos(prev => prev.filter(p => p.id !== id));
      showAlert('success', 'Produto removido!');
    } catch (error) {
      showAlert('error', error.message);
    }
  };

  const handleViewProduct = (produto) => {
    localStorage.setItem('productDetails', JSON.stringify(produto));
    router.push(`/filial/produtos/${produto.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-[#FFFFFF] pt-14 sm:pt-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6">
          <Header />
          {alert.show && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <Alert variant={alert.type === 'success' ? 'default' : 'destructive'}>
                {alert.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>{alert.type === 'success' ? 'Sucesso!' : 'Erro!'}</AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-4 text-center">
            Gerenciamento de Produtos
          </h1>
          <p className="text-sm text-[#2A4E73] mb-6 text-center max-w-2xl mx-auto">
            Gerencie produtos e estoque da filial. Preço é definido ao adicionar ao estoque.
          </p>

          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-[#2A4E73] rounded-md hover:bg-[#AD343E] transition-colors"
            >
              Adicionar Produto
            </button>
          </div>

          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-2 text-center">
              Lista de Produtos
            </h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#2A4E73]" />
              </div>
            ) : produtos.length === 0 ? (
              <p className="text-center py-8 text-[#2A4E73]">Nenhum produto cadastrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base text-[#2A4E73] border-collapse">
                  <thead>
                    <tr className="bg-[#2A4E73] text-white">
                      <th className="px-3 sm:px-4 py-3 text-left rounded-tl-md">SKU</th>
                      <th className="px-3 sm:px-4 py-3 text-left">Nome</th>
                      <th className="px-3 sm:px-4 py-3 text-left">Marca</th>
                      <th className="px-3 sm:px-4 py-3 text-left">Categoria</th>
                      <th className="px-3 sm:px-4 py-3 text-center rounded-tr-md">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b hover:bg-[#CFE8F9] cursor-pointer"
                        onClick={() => handleViewProduct(p)}
                      >
                        <td className="px-3 sm:px-4 py-3">{p.sku}</td>
                        <td className="px-3 sm:px-4 py-3 truncate max-w-[180px]">{p.nome}</td>
                        <td className="px-3 sm:px-4 py-3">{p.marca || '-'}</td>
                        <td className="px-3 sm:px-4 py-3">{p.categoria || '-'}</td>
                        <td className="px-3 sm:px-4 py-3 text-center space-x-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditProduto(p); }}
                            className="px-2 py-1 text-xs bg-[#2A4E73] text-white rounded hover:bg-[#AD343E]"
                          >
                            Editar
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); openEstoqueModal(p); }}
                            className="px-2 py-1 text-xs bg-[#2A4E73] text-white rounded hover:bg-[#AD343E]"
                          >
                            Estoque
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteProduto(p.id); }}
                            className="px-2 py-1 text-xs bg-[#AD343E] text-white rounded hover:bg-[#2A4E73]"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Modal Adicionar/Editar Produto */}
          {(isAddModalOpen || isModalOpen) && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-[#2A4E73]">
                    {isAddModalOpen ? 'Adicionar Produto' : 'Editar Produto'}
                  </h2>
                  <button onClick={closeModal} className="text-2xl text-[#2A4E73] hover:text-[#AD343E]">×</button>
                </div>
                <form onSubmit={isAddModalOpen ? handleAddProduto : handleEditProduto} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Nome *</label>
                    <input
                      type="text"
                      value={isAddModalOpen ? novoProduto.nome : editProduto?.nome}
                      onChange={(e) => isAddModalOpen
                        ? setNovoProduto({ ...novoProduto, nome: e.target.value })
                        : setEditProduto({ ...editProduto, nome: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#CFE8F9]"
                      placeholder="Camiseta Básica"
                    />
                    {errors.nome && <p className="text-[#AD343E] text-xs mt-1">{errors.nome}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">SKU *</label>
                    <input
                      type="text"
                      value={isAddModalOpen ? novoProduto.sku : editProduto?.sku}
                      onChange={(e) => isAddModalOpen
                        ? setNovoProduto({ ...novoProduto, sku: e.target.value })
                        : setEditProduto({ ...editProduto, sku: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#CFE8F9]"
                      placeholder="ABC123"
                    />
                    {errors.sku && <p className="text-[#AD343E] text-xs mt-1">{errors.sku}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Marca</label>
                    <input
                      type="text"
                      value={isAddModalOpen ? novoProduto.marca : editProduto?.marca}
                      onChange={(e) => isAddModalOpen
                        ? setNovoProduto({ ...novoProduto, marca: e.target.value })
                        : setEditProduto({ ...editProduto, marca: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#CFE8F9]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Categoria</label>
                    <input
                      type="text"
                      value={isAddModalOpen ? novoProduto.categoria : editProduto?.categoria}
                      onChange={(e) => isAddModalOpen
                        ? setNovoProduto({ ...novoProduto, categoria: e.target.value })
                        : setEditProduto({ ...editProduto, categoria: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#CFE8F9]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Descrição</label>
                    <input
                      type="text"
                      value={isAddModalOpen ? novoProduto.descricao : editProduto?.descricao}
                      onChange={(e) => isAddModalOpen
                        ? setNovoProduto({ ...novoProduto, descricao: e.target.value })
                        : setEditProduto({ ...editProduto, descricao: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#CFE8F9]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Fabricação</label>
                    <input
                      type="date"
                      value={isAddModalOpen ? novoProduto.fabricacao : editProduto?.fabricacao}
                      onChange={(e) => isAddModalOpen
                        ? setNovoProduto({ ...novoProduto, fabricacao: e.target.value })
                        : setEditProduto({ ...editProduto, fabricacao: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#CFE8F9]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Validade</label>
                    <input
                      type="date"
                      value={isAddModalOpen ? novoProduto.validade : editProduto?.validade}
                      onChange={(e) => isAddModalOpen
                        ? setNovoProduto({ ...novoProduto, validade: e.target.value })
                        : setEditProduto({ ...editProduto, validade: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#CFE8F9]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isAddModalOpen ? novoProduto.ativo : editProduto?.ativo}
                      onChange={(e) => isAddModalOpen
                        ? setNovoProduto({ ...novoProduto, ativo: e.target.checked })
                        : setEditProduto({ ...editProduto, ativo: e.target.checked })
                      }
                      className="h-4 w-4"
                    />
                    <label className="text-sm font-medium text-[#2A4E73]">Ativo</label>
                  </div>
                  <div className="flex gap-3 pt-3">
                    <button type="submit" className="flex-1 py-2 bg-[#2A4E73] text-white rounded hover:bg-[#AD343E]">
                      {isAddModalOpen ? 'Adicionar' : 'Salvar'}
                    </button>
                    <button type="button" onClick={closeModal} className="flex-1 py-2 bg-[#AD343E] text-white rounded hover:bg-[#2A4E73]">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Estoque - Atualizado com todos os campos */}
          {isEstoqueModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-[#2A4E73]">Adicionar ao Estoque</h2>
                  <button onClick={closeModal} className="text-2xl text-[#2A4E73] hover:text-[#AD343E]">×</button>
                </div>
                <form onSubmit={handleAddEstoque} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Filial *</label>
                    <select
                      value={estoqueProduto.loja_id}
                      onChange={(e) => setEstoqueProduto({ ...estoqueProduto, loja_id: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#CFE8F9]"
                    >
                      <option value="">Selecione uma filial</option>
                      {lojas.map((loja) => (
                        <option key={loja.id} value={loja.id}>
                          {loja.nome} ({loja.cidade || loja.id})
                        </option>
                      ))}
                    </select>
                    {errors.loja_id && <p className="text-[#AD343E] text-xs mt-1">{errors.loja_id}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Quantidade *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={estoqueProduto.quantidade}
                      onChange={(e) => setEstoqueProduto({ ...estoqueProduto, quantidade: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#CFE8F9]"
                      placeholder="51"
                    />
                    {errors.quantidade && <p className="text-[#AD343E] text-xs mt-1">{errors.quantidade}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Preço (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={estoqueProduto.preco}
                      onChange={(e) => setEstoqueProduto({ ...estoqueProduto, preco: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#CFE8F9]"
                      placeholder="20.99"
                    />
                    {errors.preco && <p className="text-[#AD343E] text-xs mt-1">{errors.preco}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Válido até</label>
                    <input
                      type="date"
                      value={estoqueProduto.valido_ate}
                      onChange={(e) => setEstoqueProduto({ ...estoqueProduto, valido_ate: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#CFE8F9]"
                    />
                    {errors.valido_ate && <p className="text-[#AD343E] text-xs mt-1">{errors.valido_ate}</p>}
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button type="submit" className="flex-1 py-2 bg-[#2A4E73] text-white rounded hover:bg-[#AD343E]">
                      Adicionar ao Estoque
                    </button>
                    <button type="button" onClick={closeModal} className="flex-1 py-2 bg-[#AD343E] text-white rounded hover:bg-[#2A4E73]">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}