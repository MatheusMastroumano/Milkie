// app/estoque/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function Estoque() {
  const router = useRouter();
  const [lojas, setLojas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lojaId, setLojaId] = useState(null);
  const [isMatriz, setIsMatriz] = useState(false);

  const [novoEstoque, setNovoEstoque] = useState({
    produto_id: '',
    quantidade: '',
    preco: '',
    valido_ate: '',
    loja_id: '',
  });
  const [editEstoque, setEditEstoque] = useState(null);
  const [selectedLojaId, setSelectedLojaId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [lojaSearchTerm, setLojaSearchTerm] = useState("");
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Carregar usuário
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const id = user.loja_id || null;
    const matriz = user.funcao === 'admin' || user.tipo_loja === 'matriz';

    setLojaId(id);
    setIsMatriz(matriz);

    if (!matriz && id) {
      setSelectedLojaId(id.toString());
      setNovoEstoque(prev => ({ ...prev, loja_id: id.toString() }));
    }
  }, []);

  // Carregar lojas
  useEffect(() => {
    const fetchLojas = async () => {
      try {
        const res = await fetch(`${API_URL}/lojas`);
        if (!res.ok) throw new Error('Falha ao carregar lojas');
        const data = await res.json();
        setLojas(data.lojas || []);
      } catch (err) {
        showAlert('error', 'Erro ao carregar lojas');
      }
    };
    fetchLojas();
  }, []);

  // Carregar produtos
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const res = await fetch(`${API_URL}/produtos`);
        if (!res.ok) throw new Error('Falha ao carregar produtos');
        const data = await res.json();
        setProdutos(data.produtos || []);
      } catch (err) {
        showAlert('error', 'Erro ao carregar produtos');
      }
    };
    fetchProdutos();
  }, []);

  // Carregar estoque
  useEffect(() => {
    const fetchEstoque = async () => {
      if (!selectedLojaId && !isMatriz) return;
      try {
        setLoading(true);
        const url = isMatriz
          ? `${API_URL}/estoque`
          : `${API_URL}/estoque?loja_id=${selectedLojaId}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Falha ao carregar estoque');
        const data = await res.json();
        setEstoque(data.estoque || []);
      } catch (err) {
        showAlert('error', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEstoque();
  }, [selectedLojaId, isMatriz]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false }), 4000);
  };

  // Validação simples (igual ao de produtos)
  const validateForm = (item) => {
    const err = {};
    if (!item.produto_id) err.produto_id = 'Selecione um produto';
    if (!item.quantidade || parseFloat(item.quantidade) <= 0) err.quantidade = 'Quantidade inválida';
    
    const precoNum = parseFloat(item.preco);
    if (isNaN(precoNum) || precoNum <= 0) err.preco = 'Preço inválido';

    if (isMatriz && !item.loja_id) err.loja_id = 'Selecione uma loja';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // POST: igual ao de produtos
  const handleAddEstoque = async (e) => {
    e.preventDefault();

    const payload = {
      produto_id: parseInt(novoEstoque.produto_id),
      loja_id: isMatriz ? parseInt(novoEstoque.loja_id) : lojaId,
      quantidade: parseFloat(novoEstoque.quantidade),
      preco: parseFloat(novoEstoque.preco),
      valido_ate: novoEstoque.valido_ate || null,
    };

    if (!validateForm(payload)) return;

    try {
      const res = await fetch(`${API_URL}/estoque`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Erro ao adicionar ao estoque');
      }

      const novo = await res.json();
      setEstoque(prev => {
        const exists = prev.find(p => p.produto_id === novo.produto_id && p.loja_id === novo.loja_id);
        return exists
          ? prev.map(p => p.produto_id === novo.produto_id && p.loja_id === novo.loja_id ? novo : p)
          : [...prev, novo];
      });

      setNovoEstoque({ produto_id: '', quantidade: '', preco: '', loja_id: '', valido_ate: '' });
      setErrors({});
      setIsAddModalOpen(false);
      showAlert('success', 'Adicionado ao estoque!');
    } catch (err) {
      showAlert('error', err.message);
    }
  };

  const handleEditEstoque = async (e) => {
    e.preventDefault();

    const payload = {
      produto_id: editEstoque.produto_id,
      loja_id: parseInt(editEstoque.loja_id),
      quantidade: parseFloat(editEstoque.quantidade),
      preco: parseFloat(editEstoque.preco),
      valido_ate: editEstoque.valido_ate || null,
    };

    if (!validateForm(payload)) return;

    try {
      const res = await fetch(`${API_URL}/estoque`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Erro ao atualizar');

      const atualizado = await res.json();
      setEstoque(prev => prev.map(p =>
        p.produto_id === atualizado.produto_id && p.loja_id === atualizado.loja_id ? atualizado : p
      ));

      setIsModalOpen(false);
      setEditEstoque(null);
      setErrors({});
      showAlert('success', 'Estoque atualizado!');
    } catch (err) {
      showAlert('error', err.message);
    }
  };

  const openEdit = (item) => {
    setEditEstoque({
      ...item,
      loja_id: item.loja_id.toString(),
      preco: item.preco.toString(),
      valido_ate: item.valido_ate ? item.valido_ate.split('T')[0] : '',
    });
    setIsModalOpen(true);
    setErrors({});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsAddModalOpen(false);
    setEditEstoque(null);
    setNovoEstoque({ produto_id: '', quantidade: '', preco: '', loja_id: '', valido_ate: '' });
    setErrors({});
  };

  const handleDelete = async (produto_id, loja_id) => {
    if (!window.confirm('Excluir do estoque?')) return;
    try {
      await fetch(`${API_URL}/estoque`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produto_id, loja_id }),
      });
      setEstoque(prev => prev.filter(p => !(p.produto_id === produto_id && p.loja_id === loja_id)));
      showAlert('success', 'Removido!');
    } catch (err) {
      showAlert('error', 'Erro ao excluir');
    }
  };

  const filteredLojas = lojas.filter(l =>
    l.nome.toLowerCase().includes(lojaSearchTerm.toLowerCase()) ||
    l.tipo?.toLowerCase().includes(lojaSearchTerm.toLowerCase()) ||
    l.endereco?.toLowerCase().includes(lojaSearchTerm.toLowerCase())
  );

  const filteredEstoque = estoque
    .filter(item => selectedLojaId ? item.loja_id === parseInt(selectedLojaId) : true)
    .filter(item => {
      const prod = produtos.find(p => p.id === item.produto_id);
      return prod?.nome.toLowerCase().includes(searchTerm.toLowerCase());
    });

  return (
    <main className="min-h-screen bg-[#FFFFFF] pt-14 sm:pt-16 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6">
        <Header />
        {alert.show && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <Alert variant={alert.type === 'success' ? 'default' : 'destructive'}>
              {alert.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>{alert.type === 'success' ? 'Sucesso!' : 'Erro!'}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-4 text-center">
          Gerenciamento de Estoque
        </h1>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setIsAddModalOpen(true);
              setNovoEstoque(prev => ({ ...prev, loja_id: selectedLojaId }));
            }}
            className="px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
          >
            Adicionar Item ao Estoque
          </button>
        </div>

        <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-2 text-center">
            Lista de Itens no Estoque
          </h2>

          {/* Busca Loja */}
          <div className="mb-6">
            <label htmlFor="search-loja" className="block text-sm font-medium text-[#2A4E73] mb-2">
              Buscar Loja
            </label>
            <input
              type="text"
              id="search-loja"
              value={lojaSearchTerm}
              onChange={(e) => setLojaSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
              placeholder="Nome, tipo ou endereço..."
            />
          </div>

          {lojaSearchTerm && (
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLojas.map(loja => (
                <div
                  key={loja.id}
                  onClick={() => {
                    setSelectedLojaId(loja.id.toString());
                    setLojaSearchTerm('');
                  }}
                  className="p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-[#CFE8F9] transition-colors"
                >
                  <h4 className="font-semibold text-[#2A4E73]">{loja.nome}</h4>
                  <p className="text-sm text-gray-600 capitalize">{loja.tipo}</p>
                  <p className="text-sm text-gray-500">{loja.endereco}</p>
                </div>
              ))}
            </div>
          )}

          {/* Seleção de Loja */}
          <div className="mb-6">
            <label htmlFor="select-loja" className="block text-sm font-medium text-[#2A4E73] mb-2">
              Loja Selecionada
            </label>
            <select
              id="select-loja"
              value={selectedLojaId}
              onChange={(e) => setSelectedLojaId(e.target.value)}
              className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
            >
              <option value="">Selecione uma loja</option>
              {lojas.map(loja => (
                <option key={loja.id} value={loja.id}>
                  {loja.nome} ({loja.tipo})
                </option>
              ))}
            </select>
          </div>

          {/* Busca Produto */}
          {selectedLojaId && (
            <div className="mb-6">
              <label htmlFor="search-produto" className="block text-sm font-medium text-[#2A4E73] mb-2">
                Buscar Produto
              </label>
              <input
                type="text"
                id="search-produto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                placeholder="Nome do produto..."
              />
            </div>
          )}

          {/* Tabela */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#2A4E73]" />
            </div>
          ) : selectedLojaId ? (
            filteredEstoque.length === 0 ? (
              <p className="text-[#2A4E73] text-center py-8">Nenhum produto no estoque dessa loja.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base text-[#2A4E73] border-collapse">
                  <thead>
                    <tr className="bg-[#2A4E73] text-[#FFFFFF]">
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left rounded-tl-md">Código</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Produto</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-center">Qtd</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-center">Preço</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-center rounded-tr-md">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEstoque.map(item => {
                      const prod = produtos.find(p => p.id === item.produto_id);
                      return (
                        <tr key={`${item.produto_id}-${item.loja_id}`} className="border-b border-gray-200 hover:bg-[#CFE8F9]">
                          <td className="px-3 sm:px-4 py-2 sm:py-3">{item.produto_id}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 truncate max-w-[200px]">{prod?.nome || 'Desconhecido'}</td>
                          <td className={`px-3 sm:px-4 py-2 sm:py-3 text-center font-semibold ${item.quantidade < 10 ? 'text-[#AD343E]' : ''}`}>
                            {item.quantidade}
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 text-center">
                            R$ {parseFloat(item.preco).toFixed(2).replace('.', ',')}
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 text-center space-x-2">
                            <button
                              onClick={() => openEdit(item)}
                              className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(item.produto_id, item.loja_id)}
                              className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <p className="text-[#2A4E73] text-center py-8">Selecione uma loja para visualizar o estoque.</p>
          )}
        </section>

        {/* MODAIS */}
        {(isAddModalOpen || isModalOpen) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#2A4E73]">
                    {isAddModalOpen ? 'Adicionar Item ao Estoque' : 'Editar Item do Estoque'}
                  </h2>
                  <button onClick={closeModal} className="text-[#2A4E73] hover:text-[#AD343E] text-2xl font-bold">×</button>
                </div>
                <form onSubmit={isAddModalOpen ? handleAddEstoque : handleEditEstoque} className="space-y-3">

                  {/* Produto */}
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Produto *</label>
                    <select
                      value={isAddModalOpen ? novoEstoque.produto_id : editEstoque?.produto_id || ''}
                      onChange={(e) => {
                        const setFn = isAddModalOpen ? setNovoEstoque : setEditEstoque;
                        setFn(prev => ({ ...prev, produto_id: e.target.value }));
                      }}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                    >
                      <option value="">Selecione um produto</option>
                      {produtos.map(prod => (
                        <option key={prod.id} value={prod.id}>{prod.nome}</option>
                      ))}
                    </select>
                    {errors.produto_id && <p className="text-[#AD343E] text-xs mt-1">{errors.produto_id}</p>}
                  </div>

                  {/* Quantidade */}
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Quantidade *</label>
                    <input
                      type="number"
                      value={isAddModalOpen ? novoEstoque.quantidade : editEstoque?.quantidade || ''}
                      onChange={(e) => {
                        const setFn = isAddModalOpen ? setNovoEstoque : setEditEstoque;
                        setFn(prev => ({ ...prev, quantidade: e.target.value }));
                      }}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      min="1"
                      placeholder="50"
                    />
                    {errors.quantidade && <p className="text-[#AD343E] text-xs mt-1">{errors.quantidade}</p>}
                  </div>

                  {/* PREÇO: IGUAL AO DE PRODUTOS */}
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Preço (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={isAddModalOpen ? novoEstoque.preco : editEstoque?.preco || ''}
                      onChange={(e) => {
                        const setFn = isAddModalOpen ? setNovoEstoque : setEditEstoque;
                        setFn(prev => ({ ...prev, preco: e.target.value }));
                      }}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="19.99"
                      min="0"
                    />
                    {errors.preco && <p className="text-[#AD343E] text-xs mt-1">{errors.preco}</p>}
                  </div>

                  {/* Validade */}
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Válido até</label>
                    <input
                      type="date"
                      value={isAddModalOpen ? novoEstoque.valido_ate : editEstoque?.valido_ate || ''}
                      onChange={(e) => {
                        const setFn = isAddModalOpen ? setNovoEstoque : setEditEstoque;
                        setFn(prev => ({ ...prev, valido_ate: e.target.value }));
                      }}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                    />
                  </div>

                  {/* Loja (somente matriz) */}
                  {(isMatriz || isAddModalOpen) && (
                    <div>
                      <label className="block text-sm font-medium text-[#2A4E73] mb-1">Loja *</label>
                      <select
                        value={isAddModalOpen ? novoEstoque.loja_id : editEstoque?.loja_id || ''}
                        onChange={(e) => {
                          const setFn = isAddModalOpen ? setNovoEstoque : setEditEstoque;
                          setFn(prev => ({ ...prev, loja_id: e.target.value }));
                        }}
                        className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      >
                        <option value="">Selecione uma loja</option>
                        {lojas.map(loja => (
                          <option key={loja.id} value={loja.id}>{loja.nome} ({loja.tipo})</option>
                        ))}
                      </select>
                      {errors.loja_id && <p className="text-[#AD343E] text-xs mt-1">{errors.loja_id}</p>}
                    </div>
                  )}

                  <div className="flex gap-3 pt-3">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-[#2A4E73] text-white rounded hover:bg-[#AD343E] transition-colors"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin inline-block" /> : (isAddModalOpen ? 'Adicionar' : 'Salvar')}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 py-2 bg-[#AD343E] text-white rounded hover:bg-[#2A4E73] transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}