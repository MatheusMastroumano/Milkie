"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, Search } from 'lucide-react';
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
    loja_id: '',
  });
  const [editEstoque, setEditEstoque] = useState(null);
  const [selectedLojaId, setSelectedLojaId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [lojaSearchTerm, setLojaSearchTerm] = useState("");
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const validateForm = (item) => {
    const err = {};
    if (!item.produto_id) err.produto_id = 'Selecione um produto';
    if (!item.quantidade || parseFloat(item.quantidade) <= 0) err.quantidade = 'Quantidade inválida';
    if (!item.preco || parseFloat(item.preco) <= 0) err.preco = 'Preço inválido';
    if (isMatriz && !item.loja_id) err.loja_id = 'Selecione uma loja';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handlePrecoChange = (e, setFn) => {
    let value = e.target.value.replace(/[^\d,]/g, '');
    setFn(prev => ({ ...prev, preco: value }));
  };

  const handleAddEstoque = async (e) => {
    e.preventDefault();
    const payload = {
      produto_id: parseInt(novoEstoque.produto_id),
      loja_id: isMatriz ? parseInt(novoEstoque.loja_id) : lojaId,
      quantidade: parseFloat(novoEstoque.quantidade),
      preco: parseFloat(novoEstoque.preco.replace(',', '.')),
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
        const exists = prev.find(p => p.produto_id === novo.produto_id && p.loja_id === novo.loja_id);
        return exists
          ? prev.map(p => p.produto_id === novo.produto_id && p.loja_id === novo.loja_id ? novo : p)
          : [...prev, novo];
      });

      setNovoEstoque({ produto_id: '', quantidade: '', preco: '', loja_id: '' });
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
      preco: parseFloat(editEstoque.preco.replace(',', '.')),
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

      closeModal();
      showAlert('success', 'Estoque atualizado!');
    } catch (err) {
      showAlert('error', err.message);
    }
  };

  const openEdit = (item) => {
    setEditEstoque({
      ...item,
      loja_id: item.loja_id.toString(),
      preco: item.preco.replace('.', ','),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditEstoque(null);
    setErrors({});
  };

  const handleDelete = async (produto_id, loja_id) => {
    if (!confirm('Excluir do estoque?')) return;
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
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-[#FFFFFF] pt-14 sm:pt-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6">
          <Header />
          {alert.show && (
            <Alert variant={alert.type === 'success' ? 'default' : 'destructive'} className="mb-6">
              {alert.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{alert.type === 'success' ? 'Sucesso!' : 'Erro!'}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-6 text-center">
            Gerenciamento de Estoque
          </h1>

          {/* Adicionar ao Estoque */}
          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6 mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Adicionar ao Estoque
            </h2>
            <form onSubmit={handleAddEstoque} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2A4E73] mb-1">Produto</label>
                <select
                  value={novoEstoque.produto_id}
                  onChange={(e) => setNovoEstoque({ ...novoEstoque, produto_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Selecione</option>
                  {produtos.map(p => (
                    <option key={p.id} value={p.id}>{p.nome} ({p.sku})</option>
                  ))}
                </select>
                {errors.produto_id && <p className="text-[#AD343E] text-xs">{errors.produto_id}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2A4E73] mb-1">Quantidade</label>
                <input
                  type="number"
                  value={novoEstoque.quantidade}
                  onChange={(e) => setNovoEstoque({ ...novoEstoque, quantidade: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="10"
                />
                {errors.quantidade && <p className="text-[#AD343E] text-xs">{errors.quantidade}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2A4E73] mb-1">Preço (R$)</label>
                <input
                  type="text"
                  value={novoEstoque.preco}
                  onChange={(e) => handlePrecoChange(e, setNovoEstoque)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="29,90"
                />
                {errors.preco && <p className="text-[#AD343E] text-xs">{errors.preco}</p>}
              </div>

              {isMatriz && (
                <div>
                  <label className="block text-sm font-medium text-[#2A4E73] mb-1">Loja</label>
                  <select
                    value={novoEstoque.loja_id}
                    onChange={(e) => setNovoEstoque({ ...novoEstoque, loja_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Selecione</option>
                    {lojas.map(l => (
                      <option key={l.id} value={l.id}>{l.nome}</option>
                    ))}
                  </select>
                  {errors.loja_id && <p className="text-[#AD343E] text-xs">{errors.loja_id}</p>}
                </div>
              )}

              <div className="flex items-end">
                <button type="submit" className="w-full px-4 py-2 bg-[#2A4E73] text-white rounded hover:bg-[#AD343E]">
                  Adicionar
                </button>
              </div>
            </form>
          </section>

          {/* Consulta de Estoque */}
          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Consulta de Estoque por Loja
            </h2>

            {/* Busca de Loja */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#2A4E73] mb-2">Buscar Loja</label>
              <div className="relative">
                <input
                  type="text"
                  value={lojaSearchTerm}
                  onChange={(e) => setLojaSearchTerm(e.target.value)}
                  className="w-full sm:w-80 pl-10 pr-4 py-2 border rounded-md"
                  placeholder="Nome, tipo ou endereço..."
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2A4E73] h-5 w-5" />
              </div>
            </div>

            {/* Lojas encontradas */}
            {lojaSearchTerm && (
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLojas.map(loja => (
                  <div
                    key={loja.id}
                    onClick={() => {
                      setSelectedLojaId(loja.id.toString());
                      setLojaSearchTerm('');
                    }}
                    className="p-4 bg-white border rounded-lg cursor-pointer hover:bg-[#CFE8F9]"
                  >
                    <h4 className="font-semibold text-[#2A4E73]">{loja.nome}</h4>
                    <p className="text-sm text-gray-600">{loja.tipo}</p>
                    <p className="text-sm text-gray-500">{loja.endereco}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Seleção de Loja */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#2A4E73] mb-2">Loja Selecionada</label>
              <select
                value={selectedLojaId}
                onChange={(e) => setSelectedLojaId(e.target.value)}
                className="w-full sm:w-80 px-3 py-2 border rounded-md"
              >
                <option value="">Selecione uma loja</option>
                {lojas.map(loja => (
                  <option key={loja.id} value={loja.id}>
                    {loja.nome} ({loja.tipo}) - {loja.endereco}
                  </option>
                ))}
              </select>
            </div>

            {/* Busca de Produto */}
            {selectedLojaId && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#2A4E73] mb-2">Pesquisar Produto</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-96 px-4 py-2 border rounded-md"
                  placeholder="Digite o nome do produto..."
                />
              </div>
            )}

            {/* Tabela de Estoque */}
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#2A4E73]" />
              </div>
            ) : selectedLojaId ? (
              filteredEstoque.length === 0 ? (
                <p className="text-center py-8 text-[#2A4E73]">Nenhum produto no estoque.</p>
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
                          <tr key={`${item.produto_id}-${item.loja_id}`} className="border-b hover:bg-[#CFE8F9]">
                            <td className="px-4 py-3">{item.produto_id}</td>
                            <td className="px-4 py-3 truncate max-w-[200px]">{prod?.nome || 'Desconhecido'}</td>
                            <td className={`px-4 py-3 text-center font-semibold ${item.quantidade < 10 ? 'text-[#AD343E]' : ''}`}>
                              {item.quantidade}
                            </td>
                            <td className="px-4 py-3 text-center space-x-2">
                              <button onClick={() => openEdit(item)} className="px-3 py-1 text-xs bg-[#2A4E73] text-white rounded hover:bg-[#AD343E]">Editar</button>
                              <button onClick={() => handleDelete(item.produto_id, item.loja_id)} className="px-3 py-1 text-xs bg-[#AD343E] text-white rounded hover:bg-[#2A4E73]">Excluir</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <p className="text-center py-8 text-[#2A4E73]">Selecione uma loja para ver o estoque.</p>
            )}
          </section>

          {/* Modal de Edição */}
          {isModalOpen && editEstoque && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-[#2A4E73]">Editar Estoque</h2>
                  <button onClick={closeModal} className="text-2xl text-[#2A4E73] hover:text-[#AD343E]">×</button>
                </div>
                <form onSubmit={handleEditEstoque} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Produto</label>
                    <input type="text" value={produtos.find(p => p.id === editEstoque.produto_id)?.nome || ''} disabled className="w-full px-3 py-2 bg-gray-100 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Quantidade</label>
                    <input type="number" value={editEstoque.quantidade} onChange={(e) => setEditEstoque({ ...editEstoque, quantidade: e.target.value })} className="w-full px-3 py-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Preço (R$)</label>
                    <input type="text" value={editEstoque.preco} onChange={(e) => handlePrecoChange(e, setEditEstoque)} className="w-full px-3 py-2 border rounded-md" placeholder="29,90" />
                  </div>
                  {isMatriz && (
                    <div>
                      <label className="block text-sm font-medium text-[#2A4E73] mb-1">Loja</label>
                      <select value={editEstoque.loja_id} onChange={(e) => setEditEstoque({ ...editEstoque, loja_id: e.target.value })} className="w-full px-3 py-2 border rounded-md">
                        <option value="">Selecione</option>
                        {lojas.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
                      </select>
                    </div>
                  )}
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 py-2 bg-[#2A4E73] text-white rounded hover:bg-[#AD343E]">Salvar</button>
                    <button type="button" onClick={closeModal} className="flex-1 py-2 bg-[#AD343E] text-white rounded hover:bg-[#2A4E73]">Cancelar</button>
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