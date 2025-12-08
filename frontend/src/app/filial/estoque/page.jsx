"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SimpleConfirm } from '@/components/ui/simple-confirm.jsx';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Header from '@/components/Headerfilial/page';
import Footer from '@/components/Footerfilial/page';
import { apiJson } from '@/lib/api';

export default function EstoqueFilial() {
  const [produtos, setProdutos] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [lojaId, setLojaId] = useState(null);
  const [lojaNome, setLojaNome] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [novoItem, setNovoItem] = useState({ produto_id: '', quantidade: '', preco: '', valido_ate: '' });
  const [editItem, setEditItem] = useState(null);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [confirmDialog, setConfirmDialog] = useState({ show: false, title: '', description: '', onConfirm: null });

  // Carregar dados do usuário autenticado
  useEffect(() => {
    (async () => {
      try {
        const auth = await apiJson('/auth/check-auth');
        setLojaId(Number(auth?.user?.loja_id) || null);
        // Tentar descobrir o nome da loja via /lojas
        try {
          const lojasData = await apiJson('/lojas');
          const loja = (lojasData.lojas || []).find((l) => Number(l.id) === Number(auth?.user?.loja_id || null));
          if (loja) setLojaNome(loja.nome);
        } catch {}
      } catch {
        setLojaId(null);
      }
    })();
  }, []);

  // Carregar produtos
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const data = await apiJson('/produtos');
        const produtosArray = data.produtos || data || [];
        setProdutos(produtosArray);
      } catch (err) {
        showAlert('error', 'Erro ao carregar produtos: ' + err.message);
      }
    };
    fetchProdutos();
  }, []);

  // Carregar estoque da filial
  useEffect(() => {
    if (!lojaId) return;
    
    const fetchEstoque = async () => {
      try {
        setLoading(true);
        const data = await apiJson(`/estoque?loja_id=${lojaId}`);
        const estoqueArray = data.estoque || data || [];
        setEstoque(estoqueArray);
      } catch (err) {
        showAlert('error', 'Erro ao carregar estoque: ' + err.message);
        setEstoque([]);
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
    if (!item.quantidade || parseFloat(item.quantidade) <= 0) err.quantidade = 'Quantidade deve ser maior que 0';
    if (!item.preco || parseFloat(item.preco) <= 0) err.preco = 'Preço deve ser maior que 0';
    if (item.valido_ate) {
      const today = new Date();
      today.setHours(0,0,0,0);
      const d = new Date(item.valido_ate);
      d.setHours(0,0,0,0);
      if (d < today) err.valido_ate = 'Validade não pode ser no passado';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleAdd = async (e) => {
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
      
      setEstoque(prev => {
        const exists = prev.find(p => p.produto_id === novo.produto_id);
        return exists
          ? prev.map(p => p.produto_id === novo.produto_id ? novo : p)
          : [...prev, novo];
      });

      setNovoItem({ produto_id: '', quantidade: '', preco: '', valido_ate: '' });
      setErrors({});
      setIsAddModalOpen(false);
      showAlert('success', 'Item adicionado ao estoque!');
    } catch (err) {
      showAlert('error', err.message);
    }
  };

  const openEditModal = (item) => {
    setEditItem({
      produto_id: item.produto_id.toString(),
      quantidade: item.quantidade.toString(),
      preco: item.preco.toString(),
      valido_ate: item.valido_ate?.split('T')[0] || "",
    });
    setIsEditModalOpen(true);
    setErrors({});
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!lojaId) {
      showAlert('error', 'Loja não identificada');
      return;
    }

    const payload = {
      quantidade: parseFloat(editItem.quantidade),
      preco: parseFloat(editItem.preco),
      valido_ate: editItem.valido_ate || null,
    };

    if (!validateForm({ ...editItem, ...payload })) return;

    try {
      const updatedItem = await apiJson(`/estoque/${editItem.produto_id}/${lojaId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setEstoque(prev => prev.map(p =>
        p.produto_id === updatedItem.produto_id
          ? updatedItem
          : p
      ));

      showAlert("success", "Estoque atualizado com sucesso!");
      setIsEditModalOpen(false);
      setEditItem(null);
      setErrors({});
    } catch (err) {
      showAlert("error", err.message);
    }
  };

  const handleDelete = (produto_id) => {
    const produto = produtos.find(p => p.id === produto_id);
    
    setConfirmDialog({
      show: true,
      title: 'Confirmar Exclusão',
      description: `Tem certeza que deseja remover "${produto?.nome || 'este produto'}" do estoque?`,
      onConfirm: async () => {
        try {
          await apiJson(`/estoque/${produto_id}/${lojaId}`, {
            method: 'DELETE',
          });
          
          setEstoque(prev => prev.filter(p => p.produto_id !== produto_id));
          showAlert('success', 'Item removido do estoque!');
        } catch (err) {
          showAlert('error', 'Erro ao excluir: ' + err.message);
        }
        setConfirmDialog({ show: false, title: '', description: '', onConfirm: null });
      }
    });
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setNovoItem({ produto_id: '', quantidade: '', preco: '', valido_ate: '' });
    setEditItem(null);
    setErrors({});
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
          Gerenciamento de Estoque - {lojaNome || 'Filial'}
        </h1>
        <p className="text-sm text-[#2A4E73] mb-6 text-center max-w-2xl mx-auto">
          Gerencie o estoque da sua loja. Edite quantidade, preço e validade.
        </p>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
          >
            Adicionar ao Estoque
          </button>
        </div>

        <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-2 text-center">
            Itens no Estoque
          </h2>
          <p className="text-sm text-[#2A4E73] mb-4 text-center">
            Visualize e edite o estoque da sua loja.
          </p>

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
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#2A4E73]" />
            </div>
          ) : filteredEstoque.length === 0 ? (
            <p className="text-[#2A4E73] text-center py-8">
              {searchTerm ? 'Nenhum produto encontrado.' : 'Nenhum item cadastrado no estoque.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base text-[#2A4E73] border-collapse">
                <thead>
                  <tr className="bg-[#2A4E73] text-[#FFFFFF]">
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left rounded-tl-md">Produto</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-center">Qtd</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-center">Preço</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-center">Validade</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-center rounded-tr-md">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEstoque.map((item) => {
                    const produto = produtos.find((p) => p.id === item.produto_id);
                    return (
                      <tr key={`${item.produto_id}-${item.loja_id}`} className="border-b border-gray-200 hover:bg-[#CFE8F9]">
                        <td className="px-3 sm:px-4 py-2 sm:py-3 truncate max-w-[200px]">{produto?.nome || "Indisponível"}</td>
                        <td className={`px-3 sm:px-4 py-2 sm:py-3 text-center font-semibold ${item.quantidade < 10 ? "text-[#AD343E]" : ""}`}>
                          {item.quantidade}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-center">
                          R$ {parseFloat(item.preco || 0).toFixed(2).replace(".", ",")}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-center">
                          {item.valido_ate ? new Date(item.valido_ate).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-center space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => openEditModal(item)}
                            className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                            aria-label={`Editar estoque do produto ${produto?.nome}`}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(item.produto_id)}
                            className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                            aria-label={`Excluir item do estoque`}
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

        {/* Modal Adicionar ao Estoque */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4" role="dialog" aria-labelledby="add-estoque-title" aria-modal="true">
            <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-md w-full">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="add-estoque-title" className="text-lg font-semibold text-[#2A4E73]">Adicionar ao Estoque</h2>
                  <button onClick={closeModal} className="text-[#2A4E73] hover:text-[#AD343E] text-2xl font-bold">×</button>
                </div>
                <form onSubmit={handleAdd} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Produto *</label>
                    <select
                      value={novoItem.produto_id}
                      onChange={(e) => setNovoItem({ ...novoItem, produto_id: e.target.value })}
                      className="w-full"
                    >
                      <option value="">Selecione um produto...</option>
                      {produtos.map((p) => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                      ))}
                    </select>
                    {errors.produto_id && <p className="text-[#AD343E] text-xs mt-1">{errors.produto_id}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[#2A4E73] mb-1">Quantidade *</label>
                      <input type="number" step="0.01" value={novoItem.quantidade} onChange={(e) => setNovoItem({ ...novoItem, quantidade: e.target.value })} className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]" placeholder="10" />
                      {errors.quantidade && <p className="text-[#AD343E] text-xs mt-1">{errors.quantidade}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2A4E73] mb-1">Preço (R$) *</label>
                      <input type="number" step="0.01" value={novoItem.preco} onChange={(e) => setNovoItem({ ...novoItem, preco: e.target.value })} className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]" placeholder="29.90" />
                      {errors.preco && <p className="text-[#AD343E] text-xs mt-1">{errors.preco}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Válido até</label>
                    <input type="date" min={new Date().toISOString().split("T")[0]} value={novoItem.valido_ate} onChange={(e) => setNovoItem({ ...novoItem, valido_ate: e.target.value })} className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]" />
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button type="submit" className="flex-1 px-4 py-1.5 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]" disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin inline-block" /> : 'Adicionar'}
                    </button>
                    <button type="button" onClick={closeModal} className="flex-1 px-4 py-1.5 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Editar Estoque */}
        {isEditModalOpen && editItem && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4" role="dialog" aria-labelledby="edit-estoque-title" aria-modal="true">
            <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-md w-full">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="edit-estoque-title" className="text-lg font-semibold text-[#2A4E73]">Editar Estoque</h2>
                  <button onClick={closeModal} className="text-[#2A4E73] hover:text-[#AD343E] text-2xl font-bold">×</button>
                </div>
                <form onSubmit={handleEdit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Produto</label>
                    <input
                      type="text"
                      value={produtos.find(p => p.id === parseInt(editItem.produto_id))?.nome || ''}
                      disabled
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] bg-gray-100 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[#2A4E73] mb-1">Quantidade *</label>
                      <input type="number" step="0.01" value={editItem.quantidade} onChange={(e) => setEditItem({ ...editItem, quantidade: e.target.value })} className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]" placeholder="10" />
                      {errors.quantidade && <p className="text-[#AD343E] text-xs mt-1">{errors.quantidade}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2A4E73] mb-1">Preço (R$) *</label>
                      <input type="number" step="0.01" value={editItem.preco} onChange={(e) => setEditItem({ ...editItem, preco: e.target.value })} className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]" placeholder="29.90" />
                      {errors.preco && <p className="text-[#AD343E] text-xs mt-1">{errors.preco}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Válido até</label>
                    <input type="date" min={new Date().toISOString().split("T")[0]} value={editItem.valido_ate} onChange={(e) => setEditItem({ ...editItem, valido_ate: e.target.value })} className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]" />
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button type="submit" className="flex-1 px-4 py-1.5 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]" disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin inline-block" /> : 'Salvar'}
                    </button>
                    <button type="button" onClick={closeModal} className="flex-1 px-4 py-1.5 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <SimpleConfirm
          isOpen={confirmDialog.show}
          onClose={() => setConfirmDialog({ show: false, title: '', description: '', onConfirm: null })}
          title={confirmDialog.title}
          description={confirmDialog.description}
          type="warning"
          confirmText="Excluir"
          cancelText="Cancelar"
          onConfirm={confirmDialog.onConfirm}
        />
      </div>
      <br /> <br />
      <Footer />
    </main>
    
  );
}
