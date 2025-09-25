"use client";

import { useState } from 'react';
import Header from "@/components/Header/page";

export default function Produtos() {
  const [fornecedores] = useState([
    { id: 1, nome: 'Fornecedor A' },
    { id: 2, nome: 'Fornecedor B' },
  ]);
  const [produtos, setProdutos] = useState([
    {
      id: 1,
      sku: 'ABC123',
      nome: 'Camiseta Básica',
      marca: 'Marca X',
      categoria: 'Roupas',
      descricao: 'Camiseta de algodão',
      fabricacao: '2023-01-01',
      validade: '2025-01-01',
      ativo: true,
      preco: 29.99,
      fornecedor_id: 1,
    },
    {
      id: 2,
      sku: 'XYZ789',
      nome: 'Calça Jeans',
      marca: 'Marca Y',
      categoria: 'Roupas',
      descricao: 'Calça jeans azul',
      fabricacao: '2023-06-01',
      validade: null,
      ativo: true,
      preco: 79.99,
      fornecedor_id: 2,
    },
  ]);
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    marca: '',
    categoria: '',
    descricao: '',
    sku: '',
    fabricacao: '',
    validade: '',
    ativo: true,
    preco: '',
    fornecedor_id: '',
  });
  const [editProduto, setEditProduto] = useState(null);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Função para mostrar notificação e fechar após 3 segundos
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Função para validar o formulário
  const validateForm = (produto) => {
    const newErrors = {};
    if (!produto.nome.trim()) newErrors.nome = 'O nome do produto é obrigatório';
    if (!produto.sku.trim()) newErrors.sku = 'O SKU é obrigatório';
    else if (produtos.some((p) => p.sku === produto.sku && (!editProduto || p.id !== editProduto.id))) {
      newErrors.sku = 'O SKU deve ser único';
    }
    if (!produto.preco) newErrors.preco = 'O preço é obrigatório';
    else if (isNaN(produto.preco) || parseFloat(produto.preco) <= 0) {
      newErrors.preco = 'O preço deve ser um número positivo';
    }
    if (produto.fabricacao && isNaN(new Date(produto.fabricacao))) {
      newErrors.fabricacao = 'Data de fabricação inválida';
    }
    if (produto.validade && isNaN(new Date(produto.validade))) {
      newErrors.validade = 'Data de validade inválida';
    }
    if (!produto.fornecedor_id) newErrors.fornecedor_id = 'Selecione um fornecedor';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para adicionar produto
  const handleAddProduto = (e) => {
    e.preventDefault();
    if (validateForm(novoProduto)) {
      setProdutos([
        ...produtos,
        {
          id: produtos.length + 1,
          ...novoProduto,
          preco: parseFloat(novoProduto.preco),
          fornecedor_id: parseInt(novoProduto.fornecedor_id),
          fabricacao: novoProduto.fabricacao || null,
          validade: novoProduto.validade || null,
        },
      ]);
      setNovoProduto({
        nome: '',
        marca: '',
        categoria: '',
        descricao: '',
        sku: '',
        fabricacao: '',
        validade: '',
        ativo: true,
        preco: '',
        fornecedor_id: '',
      });
      setErrors({});
      showNotification('Produto criado com sucesso! 🎉');
    }
  };

  // Função para editar produto no modal
  const handleEditProduto = (e) => {
    e.preventDefault();
    if (validateForm(editProduto)) {
      setProdutos(
        produtos.map((produto) =>
          produto.id === editProduto.id
            ? {
                ...editProduto,
                preco: parseFloat(editProduto.preco),
                fornecedor_id: parseInt(editProduto.fornecedor_id),
                fabricacao: editProduto.fabricacao || null,
                validade: editProduto.validade || null,
              }
            : produto
        )
      );
      setIsModalOpen(false);
      setEditProduto(null);
      setErrors({});
      showNotification('Produto atualizado com sucesso! ✅');
    }
  };

  // Função para abrir modal de edição
  const openEditProduto = (produto) => {
    setEditProduto({ ...produto, fornecedor_id: produto.fornecedor_id.toString() });
    setIsModalOpen(true);
    setErrors({});
  };

  // Função para fechar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditProduto(null);
    setErrors({});
  };

  // Função para excluir produto
  const handleDeleteProduto = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      setProdutos(produtos.filter((produto) => produto.id !== id));
      if (editProduto && editProduto.id === id) {
        closeModal();
      }
      showNotification('Produto removido com sucesso! 🗑️');
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFFFF] pt-14 sm:pt-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6">
          {/* Título */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-6 text-center">
            Gerenciamento de Produtos
          </h1>

          {/* Formulário para Adicionar Novo Produto */}
          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6 mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Adicionar Novo Produto
            </h2>
            <form onSubmit={handleAddProduto} className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="nome" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  id="nome"
                  value={novoProduto.nome}
                  onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                  placeholder="Ex.: Camiseta Básica"
                />
                {errors.nome && <p className="text-[#AD343E] text-sm mt-1">{errors.nome}</p>}
              </div>
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="sku" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  id="sku"
                  value={novoProduto.sku}
                  onChange={(e) => setNovoProduto({ ...novoProduto, sku: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                  placeholder="Ex.: ABC123"
                />
                {errors.sku && <p className="text-[#AD343E] text-sm mt-1">{errors.sku}</p>}
              </div>
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="marca" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Marca
                </label>
                <input
                  type="text"
                  id="marca"
                  value={novoProduto.marca}
                  onChange={(e) => setNovoProduto({ ...novoProduto, marca: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                  placeholder="Ex.: Marca X"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="categoria" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Categoria
                </label>
                <input
                  type="text"
                  id="categoria"
                  value={novoProduto.categoria}
                  onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                  placeholder="Ex.: Roupas"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="descricao" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  id="descricao"
                  value={novoProduto.descricao}
                  onChange={(e) => setNovoProduto({ ...novoProduto, descricao: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                  placeholder="Ex.: Camiseta de algodão"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="preco" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  id="preco"
                  value={novoProduto.preco}
                  onChange={(e) => setNovoProduto({ ...novoProduto, preco: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                  placeholder="Ex.: 29.99"
                  step="0.01"
                />
                {errors.preco && <p className="text-[#AD343E] text-sm mt-1">{errors.preco}</p>}
              </div>
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="fornecedor_id" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Fornecedor
                </label>
                <select
                  id="fornecedor_id"
                  value={novoProduto.fornecedor_id}
                  onChange={(e) => setNovoProduto({ ...novoProduto, fornecedor_id: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                >
                  <option value="">Selecione um fornecedor</option>
                  {fornecedores.map((fornecedor) => (
                    <option key={fornecedor.id} value={fornecedor.id}>
                      {fornecedor.nome}
                    </option>
                  ))}
                </select>
                {errors.fornecedor_id && <p className="text-[#AD343E] text-sm mt-1">{errors.fornecedor_id}</p>}
              </div>
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="fabricacao" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Data de Fabricação
                </label>
                <input
                  type="date"
                  id="fabricacao"
                  value={novoProduto.fabricacao}
                  onChange={(e) => setNovoProduto({ ...novoProduto, fabricacao: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                />
                {errors.fabricacao && <p className="text-[#AD343E] text-sm mt-1">{errors.fabricacao}</p>}
              </div>
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="validade" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Data de Validade
                </label>
                <input
                  type="date"
                  id="validade"
                  value={novoProduto.validade}
                  onChange={(e) => setNovoProduto({ ...novoProduto, validade: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                />
                {errors.validade && <p className="text-[#AD343E] text-sm mt-1">{errors.validade}</p>}
              </div>
              <div className="flex items-center min-w-[200px]">
                <label htmlFor="ativo" className="block text-sm font-medium text-[#2A4E73] mr-2">
                  Ativo
                </label>
                <input
                  type="checkbox"
                  id="ativo"
                  checked={novoProduto.ativo}
                  onChange={(e) => setNovoProduto({ ...novoProduto, ativo: e.target.checked })}
                  className="h-4 w-4 text-[#2A4E73] border-gray-300 rounded focus:ring-[#CFE8F9]"
                />
              </div>
              <div className="flex items-end min-w-[200px]">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </section>

          {/* Notificação */}
          {notification && (
            <div className="w-full max-w-md mx-auto mb-4 p-4 px-4 py-2 bg-[#CFE8F9] text-[#2A4E73] rounded-md shadow-md text-sm sm:text-base font-medium text-center animate-fadeIn">
              {notification}
            </div>
          )}

          {/* Tabela de Produtos */}
          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Lista de Produtos
            </h2>
            {produtos.length === 0 ? (
              <p className="text-[#2A4E73] text-center">Nenhum produto cadastrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base text-[#2A4E73] border-collapse">
                  <thead>
                    <tr className="bg-[#2A4E73] text-[#FFFFFF]">
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left rounded-tl-md">SKU</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Nome</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Marca</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Categoria</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Preço (R$)</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Fornecedor</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-center rounded-tr-md">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map((produto) => (
                      <tr key={produto.id} className="border-b border-gray-200 hover:bg-[#CFE8F9]">
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{produto.sku}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 truncate max-w-[150px] sm:max-w-[200px]">
                          {produto.nome}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{produto.marca || '-'}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{produto.categoria || '-'}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{produto.preco.toFixed(2)}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          {fornecedores.find((f) => f.id === produto.fornecedor_id)?.nome || 'Sem fornecedor'}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-center space-x-2">
                          <button
                            onClick={() => openEditProduto(produto)}
                            className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteProduto(produto.id)}
                            className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
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

          {/* Modal de Edição de Produto */}
          {isModalOpen && editProduto && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-[#2A4E73]">Editar Produto</h2>
                    <button
                      onClick={closeModal}
                      className="text-[#2A4E73] hover:text-[#AD343E] text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={handleEditProduto} className="space-y-4">
                    <div>
                      <label htmlFor="edit-id" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        ID
                      </label>
                      <input
                        type="text"
                        id="edit-id"
                        value={editProduto.id}
                        disabled
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] bg-gray-100 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-nome" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Nome do Produto
                      </label>
                      <input
                        type="text"
                        id="edit-nome"
                        value={editProduto.nome}
                        onChange={(e) => setEditProduto({ ...editProduto, nome: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: Camiseta Básica"
                      />
                      {errors.nome && <p className="text-[#AD343E] text-sm mt-1">{errors.nome}</p>}
                    </div>
                    <div>
                      <label htmlFor="edit-sku" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        SKU
                      </label>
                      <input
                        type="text"
                        id="edit-sku"
                        value={editProduto.sku}
                        onChange={(e) => setEditProduto({ ...editProduto, sku: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: ABC123"
                      />
                      {errors.sku && <p className="text-[#AD343E] text-sm mt-1">{errors.sku}</p>}
                    </div>
                    <div>
                      <label htmlFor="edit-marca" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Marca
                      </label>
                      <input
                        type="text"
                        id="edit-marca"
                        value={editProduto.marca}
                        onChange={(e) => setEditProduto({ ...editProduto, marca: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: Marca X"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-categoria" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Categoria
                      </label>
                      <input
                        type="text"
                        id="edit-categoria"
                        value={editProduto.categoria}
                        onChange={(e) => setEditProduto({ ...editProduto, categoria: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: Roupas"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-descricao" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Descrição
                      </label>
                      <input
                        type="text"
                        id="edit-descricao"
                        value={editProduto.descricao}
                        onChange={(e) => setEditProduto({ ...editProduto, descricao: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: Camiseta de algodão"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-preco" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Preço (R$)
                      </label>
                      <input
                        type="number"
                        id="edit-preco"
                        value={editProduto.preco}
                        onChange={(e) => setEditProduto({ ...editProduto, preco: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: 29.99"
                        step="0.01"
                      />
                      {errors.preco && <p className="text-[#AD343E] text-sm mt-1">{errors.preco}</p>}
                    </div>
                    <div>
                      <label htmlFor="edit-fornecedor_id" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Fornecedor
                      </label>
                      <select
                        id="edit-fornecedor_id"
                        value={editProduto.fornecedor_id}
                        onChange={(e) => setEditProduto({ ...editProduto, fornecedor_id: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      >
                        <option value="">Selecione um fornecedor</option>
                        {fornecedores.map((fornecedor) => (
                          <option key={fornecedor.id} value={fornecedor.id}>
                            {fornecedor.nome}
                          </option>
                        ))}
                      </select>
                      {errors.fornecedor_id && <p className="text-[#AD343E] text-sm mt-1">{errors.fornecedor_id}</p>}
                    </div>
                    <div>
                      <label htmlFor="edit-fabricacao" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Data de Fabricação
                      </label>
                      <input
                        type="date"
                        id="edit-fabricacao"
                        value={editProduto.fabricacao || ''}
                        onChange={(e) => setEditProduto({ ...editProduto, fabricacao: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      />
                      {errors.fabricacao && <p className="text-[#AD343E] text-sm mt-1">{errors.fabricacao}</p>}
                    </div>
                    <div>
                      <label htmlFor="edit-validade" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Data de Validade
                      </label>
                      <input
                        type="date"
                        id="edit-validade"
                        value={editProduto.validade || ''}
                        onChange={(e) => setEditProduto({ ...editProduto, validade: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      />
                      {errors.validade && <p className="text-[#AD343E] text-sm mt-1">{errors.validade}</p>}
                    </div>
                    <div className="flex items-center">
                      <label htmlFor="edit-ativo" className="block text-sm font-medium text-[#2A4E73] mr-2">
                        Ativo
                      </label>
                      <input
                        type="checkbox"
                        id="edit-ativo"
                        checked={editProduto.ativo}
                        onChange={(e) => setEditProduto({ ...editProduto, ativo: e.target.checked })}
                        className="h-4 w-4 text-[#2A4E73] border-gray-300 rounded focus:ring-[#CFE8F9]"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
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
      </main>
    </>
  );
}