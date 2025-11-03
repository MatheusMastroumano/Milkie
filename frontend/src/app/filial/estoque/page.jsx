// app/estoque/page.jsx
"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Simulação da loja 1 logada
const MOCK_USER = {
  loja_id: 1,
  loja_nome: 'Loja Central - Filial 1',
  funcao: 'funcionario',
};

export default function EstoqueFilial() {
  const [produtos, setProdutos] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [lojaId] = useState(MOCK_USER.loja_id);
  const [lojaNome] = useState(MOCK_USER.loja_nome);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [novoItem, setNovoItem] = useState({ produto_id: '', quantidade: '', preco: '' });
  const [editItem, setEditItem] = useState(null);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

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

  // Carregar estoque da filial (Loja 1)
  useEffect(() => {
    const fetchEstoque = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/estoque?loja_id=${lojaId}`);
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
  }, [lojaId]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 4000);
  };

  const validateForm = (item) => {
    const err = {};
    if (!item.produto_id) err.produto_id = 'Selecione um produto';
    if (!item.quantidade || parseFloat(item.quantidade) <= 0) err.quantidade = 'Quantidade inválida';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const formatPreco = (value) => {
    return value.replace(/[^\d,]/g, '');
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const payload = {
      produto_id: parseInt(novoItem.produto_id),
      loja_id: lojaId,
      quantidade: parseFloat(novoItem.quantidade),
      preco: parseFloat(novoItem.preco.replace(',', '.')),
    };

    if (!validateForm(payload)) return;

    try {
      const res = await fetch(`${API_URL}/estoque`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Erro ao adicionar');
      }

      const novo = await res.json();
      setEstoque(prev => {
        const exists = prev.find(p => p.produto_id === novo.produto_id);
        return exists
          ? prev.map(p => p.produto_id === novo.produto_id ? novo : p)
          : [...prev, novo];
      });

      setNovoItem({ produto_id: '', quantidade: '', preco: '' });
      setErrors({});
      setIsAddModalOpen(false);
      showAlert('success', 'Item adicionado ao estoque!');
    } catch (err) {
      showAlert('error', err.message);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const payload = {
      produto_id: editItem.produto_id,
      loja_id: lojaId,
      quantidade: parseFloat(editItem.quantidade),
      preco: parseFloat(editItem.preco.replace(',', '.')),
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
        p.produto_id === atualizado.produto_id ? atualizado : p
      ));

      setIsEditModalOpen(false);
      setEditItem(null);
      setErrors({});
      showAlert('success', 'Estoque atualizado!');
    } catch (err) {
      showAlert('error', err.message);
    }
  };

  const openEdit = (item) => {
    setEditItem({
      ...item,
      preco: item.preco.replace('.', ','),
    });
    setIsEditModalOpen(true);
    setErrors({});
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setNovoItem({ produto_id: '', quantidade: '', preco: '' });
    setEditItem(null);
    setErrors({});
  };

  const handleDelete = async (produto_id) => {
    if (!window.confirm('Excluir item do estoque?')) return;
    try {
      await fetch(`${API_URL}/estoque`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produto_id, loja_id: lojaId }),
      });
      setEstoque(prev => prev.filter(p => p.produto_id !== produto_id));
      showAlert('success', 'Item removido!');
    } catch (err) {
      showAlert('error', 'Erro ao excluir');
    }
  };

  const filteredEstoque = estoque.filter(item => {
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
              {alert.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{alert.type === 'success' ? 'Sucesso!' : 'Erro!'}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-2 text-center">
          Estoque da Filial
        </h1>
        <p className="text-sm text-[#2A4E73] mb-6 text-center max-w-2xl mx-auto">
          {lojaNome} — Gerencie o estoque da sua loja. Adicione, edite ou remova itens conforme necessário.
        </p>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
          >
            Adicionar Item
          </button>
        </div>

        <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
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
              placeholder="Nome do produto..."
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#2A4E73]" />
            </div>
          ) : filteredEstoque.length === 0 ? (
            <p className="text-center py-8 text-[#2A4E73]">Nenhum item no estoque.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-[#2A4E73]">
                <thead>
                  <tr className="bg-[#2A4E73] text-white">
                    <th className="px-4 py-3 text-left">Código</th>
                    <th className="px-4 py-3 text-left">Produto</th>
                    <th className="px-4 py-3 text-center">Qtd</th>
                    <th className="px-4 py-3 text-center">Preço</th>
                    <th className="px-4 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEstoque.map(item => {
                    const prod = produtos.find(p => p.id === item.produto_id);
                    return (
                      <tr key={item.produto_id} className="border-b hover:bg-[#CFE8F9]">
                        <td className="px-4 py-3">{item.produto_id}</td>
                        <td className="px-4 py-3 truncate max-w-[200px]">{prod?.nome || 'Desconhecido'}</td>
                        <td className={`px-4 py-3 text-center font-semibold ${item.quantidade < 10 ? 'text-[#AD343E]' : ''}`}>
                          {item.quantidade}
                        </td>
                        <td className="px-4 py-3 text-center">
                          R$ {item.preco.replace('.', ',')}
                        </td>
                        <td className="px-4 py-3 text-center space-x-2">
                          <button
                            onClick={() => openEdit(item)}
                            className="px-3 py-1 text-xs bg-[#2A4E73] text-white rounded hover:bg-[#AD343E]"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(item.produto_id)}
                            className="px-3 py-1 text-xs bg-[#AD343E] text-white rounded hover:bg-[#2A4E73]"
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
          )}
        </section>

        {/* Modal Adicionar */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#2A4E73]">Adicionar Item</h2>
                <button onClick={closeModal} className="text-2xl text-[#2A4E73] hover:text-[#AD343E]">×</button>
              </div>
              <form onSubmit={handleAdd} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[#2A4E73] mb-1">Produto *</label>
                  <select
                    value={novoItem.produto_id}
                    onChange={(e) => setNovoItem({ ...novoItem, produto_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Selecione</option>
                    {produtos.map(p => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                  {errors.produto_id && <p className="text-[#AD343E] text-xs mt-1">{errors.produto_id}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2A4E73] mb-1">Quantidade *</label>
                  <input
                    type="number"
                    value={novoItem.quantidade}
                    onChange={(e) => setNovoItem({ ...novoItem, quantidade: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    min="1"
                  />
                  {errors.quantidade && <p className="text-[#AD343E] text-xs mt-1">{errors.quantidade}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2A4E73] mb-1">Preço (R$) *</label>
                  <input
                    type="text"
                    value={novoItem.preco}
                    onChange={(e) => setNovoItem({ ...novoItem, preco: formatPreco(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="29,90"
                  />
                  {errors.preco && <p className="text-[#AD343E] text-xs mt-1">{errors.preco}</p>}
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 py-2 bg-[#2A4E73] text-white rounded hover:bg-[#AD343E]">
                    Adicionar
                  </button>
                  <button type="button" onClick={closeModal} className="flex-1 py-2 bg-[#AD343E] text-white rounded hover:bg-[#2A4E73]">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Editar */}
        {isEditModalOpen && editItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#2A4E73]">Editar Item</h2>
                <button onClick={closeModal} className="text-2xl text-[#2A4E73] hover:text-[#AD343E]">×</button>
              </div>
              <form onSubmit={handleEdit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[#2A4E73] mb-1">Produto</label>
                  <input
                    type="text"
                    value={produtos.find(p => p.id === editItem.produto_id)?.nome || ''}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2A4E73] mb-1">Quantidade</label>
                  <input
                    type="number"
                    value={editItem.quantidade}
                    onChange={(e) => setEditItem({ ...editItem, quantidade: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2A4E73] mb-1">Preço (R$)</label>
                  <input
                    type="text"
                    value={editItem.preco}
                    onChange={(e) => setEditItem({ ...editItem, preco: formatPreco(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="29,90"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 py-2 bg-[#2A4E73] text-white rounded hover:bg-[#AD343E]">
                    Salvar
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
      <Footer />
    </main>
  );
}