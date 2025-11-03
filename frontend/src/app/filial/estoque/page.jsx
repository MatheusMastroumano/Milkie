"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SimpleConfirm } from '@/components/ui/simple-confirm.jsx';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Header from '@/components/Headerfilial/page';
import Footer from '@/components/Footer/page';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function EstoqueFilial() {
  const [produtos, setProdutos] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [lojaId, setLojaId] = useState(null);
  const [lojaNome, setLojaNome] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [novoItem, setNovoItem] = useState({ produto_id: '', quantidade: '', preco: '' });
  const [editItem, setEditItem] = useState(null);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [confirmDialog, setConfirmDialog] = useState({ show: false, title: '', description: '', onConfirm: null });

  // Estado para novo produto
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

  // Carregar dados do usuário
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setLojaId(user.loja_id || 1);
    setLojaNome(user.loja_nome || 'Filial');
  }, []);

  // Carregar produtos
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const res = await fetch(`${API_URL}/produtos`);
        if (!res.ok) throw new Error('Falha ao carregar produtos');
        const data = await res.json();
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
        const res = await fetch(`${API_URL}/estoque?loja_id=${lojaId}`);
        if (!res.ok) throw new Error('Falha ao carregar estoque');
        const data = await res.json();
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

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // === VALIDAÇÃO PRODUTO ===
  const validateProdutoForm = (produto) => {
    const newErrors = {};
    if (!produto.nome.trim()) newErrors.nome = 'Nome obrigatório';
    if (!produto.sku.trim()) newErrors.sku = 'SKU obrigatório';
    else if (produtos.some(p => p.sku === produto.sku)) {
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

  // === ADICIONAR PRODUTO ===
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
      const response = await res.json();
      const novo = response.produto || response;

      setProdutos(prev => [...prev, novo]);
      
      // Após criar o produto, abrir modal de estoque com o produto selecionado
      setNovoItem({ 
        produto_id: novo.id.toString(),
        quantidade: '',
        preco: ''
      });
      
      setIsAddProductModalOpen(false);
      setIsAddModalOpen(true);
      setNovoProduto({
        nome: '', marca: '', categoria: '', descricao: '', sku: '',
        fabricacao: '', validade: '', ativo: true,
      });
      setErrors({});
      showAlert('success', `Produto "${novo.nome}" criado! Agora adicione ao estoque.`);
    } catch (error) {
      showAlert('error', error.message);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const payload = {
      produto_id: parseInt(novoItem.produto_id),
      loja_id: lojaId,
      quantidade: parseFloat(novoItem.quantidade),
      preco: parseFloat(novoItem.preco),
    };

    if (!validateForm(payload)) return;

    try {
      const res = await fetch(`${API_URL}/estoque`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Erro ao adicionar');
      }

      const response = await res.json();
      const novo = response.estoque || response;
      
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
      preco: parseFloat(editItem.preco),
    };

    if (!validateForm(payload)) return;

    try {
      const res = await fetch(`${API_URL}/estoque`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Erro ao atualizar');

      const response = await res.json();
      const atualizado = response.estoque || response;
      
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
      preco: item.preco.toString(),
    });
    setIsEditModalOpen(true);
    setErrors({});
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsAddProductModalOpen(false);
    setNovoItem({ produto_id: '', quantidade: '', preco: '' });
    setEditItem(null);
    setNovoProduto({
      nome: '', marca: '', categoria: '', descricao: '', sku: '',
      fabricacao: '', validade: '', ativo: true,
    });
    setErrors({});
  };

  const handleDelete = (produto_id) => {
    const produto = produtos.find(p => p.id === produto_id);
    
    setConfirmDialog({
      show: true,
      title: 'Confirmar Exclusão',
      description: `Tem certeza que deseja remover "${produto?.nome || 'este produto'}" do estoque?`,
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_URL}/estoque/${produto_id}/${lojaId}`, {
            method: 'DELETE',
          });
          
          if (!res.ok) throw new Error('Erro ao excluir');
          
          setEstoque(prev => prev.filter(p => p.produto_id !== produto_id));
          showAlert('success', 'Item removido do estoque!');
        } catch (err) {
          showAlert('error', 'Erro ao excluir: ' + err.message);
        }
        setConfirmDialog({ show: false, title: '', description: '', onConfirm: null });
      }
    });
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
          📦 Estoque da Filial
        </h1>
        <p className="text-sm text-[#666] mb-6 text-center max-w-2xl mx-auto">
          {lojaNome} — Gerencie o estoque da sua loja. Crie novos produtos e adicione-os ao estoque.
        </p>

        <div className="flex justify-end mb-4 gap-3">
          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#10B981] rounded-md hover:bg-[#059669] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
          >
            ➕ Criar Produto
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
          >
            📦 Adicionar ao Estoque
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
            <p className="text-center py-8 text-[#2A4E73]">
              {searchTerm ? 'Nenhum produto encontrado.' : 'Nenhum item no estoque.'}
            </p>
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
                        <td className="px-4 py-3 truncate max-w-[200px]">{prod?.nome || 'Produto não encontrado'}</td>
                        <td className={`px-4 py-3 text-center font-semibold ${item.quantidade < 10 ? 'text-[#AD343E]' : ''}`}>
                          {item.quantidade}
                        </td>
                        <td className="px-4 py-3 text-center">
                          R$ {parseFloat(item.preco || 0).toFixed(2).replace('.', ',')}
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

        {/* Modal Criar Produto */}
        {isAddProductModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#2A4E73]">➕ Criar Novo Produto</h2>
                <button onClick={closeModal} className="text-2xl text-[#2A4E73] hover:text-[#AD343E]">×</button>
              </div>
              <form onSubmit={handleAddProduto} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[#2A4E73] mb-1">Nome *</label>
                  <input
                    type="text"
                    value={novoProduto.nome}
                    onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                    placeholder="Ex: Camiseta Básica"
                  />
                  {errors.nome && <p className="text-[#AD343E] text-xs mt-1">{errors.nome}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2A4E73] mb-1">SKU *</label>
                  <input
                    type="text"
                    value={novoProduto.sku}
                    onChange={(e) => setNovoProduto({ ...novoProduto, sku: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                    placeholder="Ex: CAM001"
                  />
                  {errors.sku && <p className="text-[#AD343E] text-xs mt-1">{errors.sku}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Marca</label>
                    <input
                      type="text"
                      value={novoProduto.marca}
                      onChange={(e) => setNovoProduto({ ...novoProduto, marca: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                      placeholder="Ex: Nike"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Categoria</label>
                    <input
                      type="text"
                      value={novoProduto.categoria}
                      onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                      placeholder="Ex: Roupas"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2A4E73] mb-1">Descrição</label>
                  <textarea
                    value={novoProduto.descricao}
                    onChange={(e) => setNovoProduto({ ...novoProduto, descricao: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                    placeholder="Descrição do produto..."
                    rows="2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Fabricação</label>
                    <input
                      type="date"
                      value={novoProduto.fabricacao}
                      onChange={(e) => setNovoProduto({ ...novoProduto, fabricacao: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                    />
                    {errors.fabricacao && <p className="text-[#AD343E] text-xs mt-1">{errors.fabricacao}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Validade</label>
                    <input
                      type="date"
                      value={novoProduto.validade}
                      onChange={(e) => setNovoProduto({ ...novoProduto, validade: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                    />
                    {errors.validade && <p className="text-[#AD343E] text-xs mt-1">{errors.validade}</p>}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#10B981] text-white rounded hover:bg-[#059669] font-medium"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin inline-block" /> : '✅ Criar e Adicionar ao Estoque'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-2 bg-[#AD343E] text-white rounded hover:bg-[#2A4E73]"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Adicionar ao Estoque */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#2A4E73]">📦 Adicionar Item</h2>
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
                    step="0.01"
                    value={novoItem.quantidade}
                    onChange={(e) => setNovoItem({ ...novoItem, quantidade: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    min="0.01"
                    placeholder="10"
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
                    className="w-full px-3 py-2 border rounded-md"
                    min="0.01"
                    placeholder="29.90"
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
                <h2 className="text-xl font-semibold text-[#2A4E73]">✏️ Editar Item</h2>
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
                  <label className="block text-sm font-medium text-[#2A4E73] mb-1">Quantidade *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editItem.quantidade}
                    onChange={(e) => setEditItem({ ...editItem, quantidade: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    min="0.01"
                  />
                  {errors.quantidade && <p className="text-[#AD343E] text-xs mt-1">{errors.quantidade}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2A4E73] mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editItem.preco}
                    onChange={(e) => setEditItem({ ...editItem, preco: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    min="0.01"
                  />
                  {errors.preco && <p className="text-[#AD343E] text-xs mt-1">{errors.preco}</p>}
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

        {/* Dialog de Confirmação */}
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
      <Footer />
    </main>
  );
}