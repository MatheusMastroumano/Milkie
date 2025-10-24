"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
// Suponha que o loja_id da filial atual esteja disponível (ex.: via contexto ou autenticação)
const LOJA_ID = 1; // Substitua por lógica para obter o loja_id dinamicamente

export default function Produtos() {
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    marca: '',
    categoria: '',
    descricao: '',
    sku: '',
    fabricacao: '',
    validade: '',
    ativo: true,
    fornecedor_id: '',
  });
  const [editProduto, setEditProduto] = useState(null);
  const [estoqueProduto, setEstoqueProduto] = useState({ produto_id: null, quantidade: '', preco: '' });
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEstoqueModalOpen, setIsEstoqueModalOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [produtosRes, fornecedoresRes] = await Promise.all([
          fetch(`${API_URL}/produtos`),
          fetch(`${API_URL}/fornecedores`),
        ]);
        if (!produtosRes.ok) throw new Error('Erro ao buscar produtos');
        if (!fornecedoresRes.ok) throw new Error('Erro ao buscar fornecedores');
        const produtosData = await produtosRes.json();
        const fornecedoresData = await fornecedoresRes.json();
        setProdutos(produtosData.produtos || []);
        setFornecedores(fornecedoresData.fornecedores || []);
      } catch (error) {
        showAlert('error', `Erro ao carregar dados: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const validateProdutoForm = (produto) => {
    const newErrors = {};
    if (!produto.nome.trim()) newErrors.nome = 'O nome do produto é obrigatório';
    if (!produto.sku.trim()) newErrors.sku = 'O SKU é obrigatório';
    else if (produtos.some((p) => p.sku === produto.sku && (!editProduto || p.id !== editProduto.id))) {
      newErrors.sku = 'O SKU deve ser único';
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

  const validateEstoqueForm = (estoque) => {
    const newErrors = {};
    if (!estoque.quantidade || isNaN(estoque.quantidade) || parseFloat(estoque.quantidade) <= 0) {
      newErrors.quantidade = 'A quantidade deve ser um número positivo';
    }
    if (!estoque.preco || isNaN(estoque.preco) || parseFloat(estoque.preco) <= 0) {
      newErrors.preco = 'O preço deve ser um número positivo';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddProduto = async (e) => {
    e.preventDefault();
    if (validateProdutoForm(novoProduto)) {
      try {
        // Criar o produto
        const produtoResponse = await fetch(`${API_URL}/produtos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: novoProduto.nome,
            marca: novoProduto.marca,
            categoria: novoProduto.categoria,
            descricao: novoProduto.descricao,
            sku: novoProduto.sku,
            fabricacao: novoProduto.fabricacao || null,
            validade: novoProduto.validade || null,
            ativo: novoProduto.ativo,
          }),
        });
        if (!produtoResponse.ok) throw new Error('Erro ao adicionar produto');
        const newProduto = await produtoResponse.json();

        // Associar fornecedor
        const fornecedorResponse = await fetch(`${API_URL}/fornecedor_produtos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fornecedor_id: parseInt(novoProduto.fornecedor_id),
            produto_id: newProduto.id,
          }),
        });
        if (!fornecedorResponse.ok) throw new Error('Erro ao associar fornecedor');

        setProdutos([...produtos, { ...newProduto, fornecedores: [{ fornecedor_id: parseInt(novoProduto.fornecedor_id) }] }]);
        setNovoProduto({
          nome: '',
          marca: '',
          categoria: '',
          descricao: '',
          sku: '',
          fabricacao: '',
          validade: '',
          ativo: true,
          fornecedor_id: '',
        });
        setErrors({});
        setIsAddModalOpen(false);
        showAlert('success', 'Produto criado com sucesso! 🎉');
      } catch (error) {
        showAlert('error', `Erro ao adicionar produto: ${error.message}`);
      }
    }
  };

  const handleEditProduto = async (e) => {
    e.preventDefault();
    if (validateProdutoForm(editProduto)) {
      try {
        // Atualizar o produto
        const produtoResponse = await fetch(`${API_URL}/produtos/${editProduto.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: editProduto.nome,
            marca: editProduto.marca,
            categoria: editProduto.categoria,
            descricao: editProduto.descricao,
            sku: editProduto.sku,
            fabricacao: editProduto.fabricacao || null,
            validade: editProduto.validade || null,
            ativo: editProduto.ativo,
          }),
        });
        if (!produtoResponse.ok) throw new Error('Erro ao atualizar produto');

        // Atualizar associação com fornecedor
        const fornecedorResponse = await fetch(`${API_URL}/fornecedor_produtos`, {
          method: 'PUT', // Assumindo endpoint para atualizar fornecedor_produtos
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fornecedor_id: parseInt(editProduto.fornecedor_id),
            produto_id: editProduto.id,
          }),
        });
        if (!fornecedorResponse.ok) throw new Error('Erro ao atualizar fornecedor');

        setProdutos(produtos.map((p) => (p.id === editProduto.id ? { ...editProduto, fornecedores: [{ fornecedor_id: parseInt(editProduto.fornecedor_id) }] } : p)));
        setIsModalOpen(false);
        setEditProduto(null);
        setErrors({});
        showAlert('success', 'Produto atualizado com sucesso! ✅');
      } catch (error) {
        showAlert('error', `Erro ao atualizar produto: ${error.message}`);
      }
    }
  };

  const handleAddEstoque = async (e) => {
    e.preventDefault();
    if (validateEstoqueForm(estoqueProduto)) {
      try {
        // Adicionar ao estoque
        const estoqueResponse = await fetch(`${API_URL}/estoque`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            produto_id: estoqueProduto.produto_id,
            loja_id: LOJA_ID,
            quantidade: parseFloat(estoqueProduto.quantidade),
          }),
        });
        if (!estoqueResponse.ok) throw new Error('Erro ao adicionar ao estoque');

        // Adicionar preço na tabela precos
        const precoResponse = await fetch(`${API_URL}/precos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            produto_id: estoqueProduto.produto_id,
            loja_id: LOJA_ID,
            preco: parseFloat(estoqueProduto.preco),
            valido_de: new Date().toISOString(),
          }),
        });
        if (!precoResponse.ok) throw new Error('Erro ao adicionar preço');

        setEstoqueProduto({ produto_id: null, quantidade: '', preco: '' });
        setIsEstoqueModalOpen(false);
        showAlert('success', 'Produto adicionado ao estoque com sucesso! 📦');
      } catch (error) {
        showAlert('error', `Erro ao adicionar ao estoque: ${error.message}`);
      }
    }
  };

  const openEditProduto = (produto) => {
    setEditProduto({
      ...produto,
      fornecedor_id: produto.fornecedores?.[0]?.fornecedor_id?.toString() || '',
    });
    setIsModalOpen(true);
    setErrors({});
  };

  const openEstoqueModal = (produto) => {
    setEstoqueProduto({ produto_id: produto.id, quantidade: '', preco: '' });
    setIsEstoqueModalOpen(true);
    setErrors({});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsAddModalOpen(false);
    setIsEstoqueModalOpen(false);
    setEditProduto(null);
    setEstoqueProduto({ produto_id: null, quantidade: '', preco: '' });
    setNovoProduto({
      nome: '',
      marca: '',
      categoria: '',
      descricao: '',
      sku: '',
      fabricacao: '',
      validade: '',
      ativo: true,
      fornecedor_id: '',
    });
    setErrors({});
  };

  const handleDeleteProduto = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const response = await fetch(`${API_URL}/produtos/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erro ao excluir produto');
        setProdutos(produtos.filter((produto) => produto.id !== id));
        if (editProduto && editProduto.id === id) {
          closeModal();
        }
        showAlert('success', 'Produto removido com sucesso! 🗑️');
      } catch (error) {
        showAlert('error', `Erro ao excluir produto: ${error.message}`);
      }
    }
  };

  const handleViewProduct = (produto) => {
    localStorage.setItem('productDetails', JSON.stringify({
      ...produto,
      fornecedor: fornecedores.find(f => f.id === produto.fornecedores?.[0]?.fornecedor_id)?.nome || 'Sem fornecedor',
    }));
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
            Gerenciamento de Produtos
          </h1>
          <p className="text-sm text-[#2A4E73] mb-6 text-center max-w-2xl mx-auto">
            Aqui você pode gerenciar todos os produtos da sua filial. Adicione novos produtos ou edite informações existentes. O preço é definido ao adicionar ao estoque.
          </p>

          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
              aria-label="Abrir formulário para adicionar novo produto"
            >
              Adicionar Novo Produto
            </button>
          </div>

          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-2 text-center">
              Lista de Produtos
            </h2>
            <p className="text-sm text-[#2A4E73] mb-4 text-center">
              Visualize todos os produtos cadastrados, incluindo seus detalhes e status.
            </p>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#2A4E73]" />
              </div>
            ) : produtos.length === 0 ? (
              <p className="text-[#2A4E73] text-center py-8">Nenhum produto cadastrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base text-[#2A4E73] border-collapse">
                  <thead>
                    <tr className="bg-[#2A4E73] text-[#FFFFFF]">
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left rounded-tl-md">SKU</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Nome</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Marca</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Categoria</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Fornecedor</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-center rounded-tr-md">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map((produto) => (
                      <tr
                        key={produto.id}
                        className="border-b border-gray-200 hover:bg-[#CFE8F9] cursor-pointer"
                        onClick={() => handleViewProduct(produto)}
                      >
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{produto.sku}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 truncate max-w-[150px] sm:max-w-[200px]">
                          {produto.nome}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{produto.marca || '-'}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{produto.categoria || '-'}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          {fornecedores.find((f) => f.id === produto.fornecedores?.[0]?.fornecedor_id)?.nome || 'Sem fornecedor'}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditProduto(produto);
                            }}
                            className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                            aria-label={`Editar produto ${produto.nome}`}
                          >
                            Editar
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEstoqueModal(produto);
                            }}
                            className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                            aria-label={`Adicionar ${produto.nome} ao estoque`}
                          >
                            Adicionar ao Estoque
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProduto(produto.id);
                            }}
                            className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                            aria-label={`Excluir produto ${produto.nome}`}
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

          {(isAddModalOpen || isModalOpen) && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-labelledby={isAddModalOpen ? "add-modal-title" : "edit-modal-title"} aria-modal="true">
              <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 id={isAddModalOpen ? "add-modal-title" : "edit-modal-title"} className="text-lg sm:text-xl font-semibold text-[#2A4E73]">
                      {isAddModalOpen ? 'Adicionar Novo Produto' : 'Editar Produto'}
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-[#2A4E73] hover:text-[#AD343E] text-2xl font-bold"
                      aria-label="Fechar modal"
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={isAddModalOpen ? handleAddProduto : handleEditProduto} className="space-y-3">
                    <div>
                      <label htmlFor={isAddModalOpen ? "add-nome" : "edit-nome"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Nome do Produto *
                      </label>
                      <input
                        type="text"
                        id={isAddModalOpen ? "add-nome" : "edit-nome"}
                        value={isAddModalOpen ? novoProduto.nome : editProduto?.nome}
                        onChange={(e) => {
                          if (isAddModalOpen) {
                            setNovoProduto({ ...novoProduto, nome: e.target.value });
                          } else {
                            setEditProduto({ ...editProduto, nome: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: Camiseta Básica"
                        aria-invalid={errors.nome ? 'true' : 'false'}
                        aria-describedby={errors.nome ? (isAddModalOpen ? 'add-nome-error' : 'edit-nome-error') : undefined}
                      />
                      {errors.nome && <p id={isAddModalOpen ? "add-nome-error" : "edit-nome-error"} className="text-[#AD343E] text-xs mt-1">{errors.nome}</p>}
                    </div>
                    <div>
                      <label htmlFor={isAddModalOpen ? "add-sku" : "edit-sku"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                        SKU *
                      </label>
                      <input
                        type="text"
                        id={isAddModalOpen ? "add-sku" : "edit-sku"}
                        value={isAddModalOpen ? novoProduto.sku : editProduto?.sku}
                        onChange={(e) => {
                          if (isAddModalOpen) {
                            setNovoProduto({ ...novoProduto, sku: e.target.value });
                          } else {
                            setEditProduto({ ...editProduto, sku: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: ABC123"
                        aria-invalid={errors.sku ? 'true' : 'false'}
                        aria-describedby={errors.sku ? (isAddModalOpen ? 'add-sku-error' : 'edit-sku-error') : undefined}
                      />
                      {errors.sku && <p id={isAddModalOpen ? "add-sku-error" : "edit-sku-error"} className="text-[#AD343E] text-xs mt-1">{errors.sku}</p>}
                    </div>
                    <div>
                      <label htmlFor={isAddModalOpen ? "add-marca" : "edit-marca"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Marca
                      </label>
                      <input
                        type="text"
                        id={isAddModalOpen ? "add-marca" : "edit-marca"}
                        value={isAddModalOpen ? novoProduto.marca : editProduto?.marca}
                        onChange={(e) => {
                          if (isAddModalOpen) {
                            setNovoProduto({ ...novoProduto, marca: e.target.value });
                          } else {
                            setEditProduto({ ...editProduto, marca: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: Marca X"
                      />
                    </div>
                    <div>
                      <label htmlFor={isAddModalOpen ? "add-categoria" : "edit-categoria"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Categoria
                      </label>
                      <input
                        type="text"
                        id={isAddModalOpen ? "add-categoria" : "edit-categoria"}
                        value={isAddModalOpen ? novoProduto.categoria : editProduto?.categoria}
                        onChange={(e) => {
                          if (isAddModalOpen) {
                            setNovoProduto({ ...novoProduto, categoria: e.target.value });
                          } else {
                            setEditProduto({ ...editProduto, categoria: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: Roupas"
                      />
                    </div>
                    <div>
                      <label htmlFor={isAddModalOpen ? "add-descricao" : "edit-descricao"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Descrição
                      </label>
                      <input
                        type="text"
                        id={isAddModalOpen ? "add-descricao" : "edit-descricao"}
                        value={isAddModalOpen ? novoProduto.descricao : editProduto?.descricao}
                        onChange={(e) => {
                          if (isAddModalOpen) {
                            setNovoProduto({ ...novoProduto, descricao: e.target.value });
                          } else {
                            setEditProduto({ ...editProduto, descricao: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: Camiseta de algodão"
                      />
                    </div>
                    <div>
                      <label htmlFor={isAddModalOpen ? "add-fornecedor_id" : "edit-fornecedor_id"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Fornecedor *
                      </label>
                      <select
                        id={isAddModalOpen ? "add-fornecedor_id" : "edit-fornecedor_id"}
                        value={isAddModalOpen ? novoProduto.fornecedor_id : editProduto?.fornecedor_id}
                        onChange={(e) => {
                          if (isAddModalOpen) {
                            setNovoProduto({ ...novoProduto, fornecedor_id: e.target.value });
                          } else {
                            setEditProduto({ ...editProduto, fornecedor_id: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        aria-invalid={errors.fornecedor_id ? 'true' : 'false'}
                        aria-describedby={errors.fornecedor_id ? (isAddModalOpen ? 'add-fornecedor_id-error' : 'edit-fornecedor_id-error') : undefined}
                      >
                        <option value="">Selecione um fornecedor</option>
                        {fornecedores.map((fornecedor) => (
                          <option key={fornecedor.id} value={fornecedor.id}>
                            {fornecedor.nome}
                          </option>
                        ))}
                      </select>
                      {errors.fornecedor_id && <p id={isAddModalOpen ? "add-fornecedor_id-error" : "edit-fornecedor_id-error"} className="text-[#AD343E] text-xs mt-1">{errors.fornecedor_id}</p>}
                    </div>
                    <div>
                      <label htmlFor={isAddModalOpen ? "add-fabricacao" : "edit-fabricacao"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Data de Fabricação
                      </label>
                      <input
                        type="date"
                        id={isAddModalOpen ? "add-fabricacao" : "edit-fabricacao"}
                        value={isAddModalOpen ? novoProduto.fabricacao : editProduto?.fabricacao || ''}
                        onChange={(e) => {
                          if (isAddModalOpen) {
                            setNovoProduto({ ...novoProduto, fabricacao: e.target.value });
                          } else {
                            setEditProduto({ ...editProduto, fabricacao: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        aria-invalid={errors.fabricacao ? 'true' : 'false'}
                        aria-describedby={errors.fabricacao ? (isAddModalOpen ? 'add-fabricacao-error' : 'edit-fabricacao-error') : undefined}
                      />
                      {errors.fabricacao && <p id={isAddModalOpen ? "add-fabricacao-error" : "edit-fabricacao-error"} className="text-[#AD343E] text-xs mt-1">{errors.fabricacao}</p>}
                    </div>
                    <div>
                      <label htmlFor={isAddModalOpen ? "add-validade" : "edit-validade"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Data de Validade
                      </label>
                      <input
                        type="date"
                        id={isAddModalOpen ? "add-validade" : "edit-validade"}
                        value={isAddModalOpen ? novoProduto.validade : editProduto?.validade || ''}
                        onChange={(e) => {
                          if (isAddModalOpen) {
                            setNovoProduto({ ...novoProduto, validade: e.target.value });
                          } else {
                            setEditProduto({ ...editProduto, validade: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        aria-invalid={errors.validade ? 'true' : 'false'}
                        aria-describedby={errors.validade ? (isAddModalOpen ? 'add-validade-error' : 'edit-validade-error') : undefined}
                      />
                      {errors.validade && <p id={isAddModalOpen ? "add-validade-error" : "edit-validade-error"} className="text-[#AD343E] text-xs mt-1">{errors.validade}</p>}
                    </div>
                    <div className="flex items-center">
                      <label htmlFor={isAddModalOpen ? "add-ativo" : "edit-ativo"} className="block text-sm font-medium text-[#2A4E73] mr-2">
                        Ativo
                      </label>
                      <input
                        type="checkbox"
                        id={isAddModalOpen ? "add-ativo" : "edit-ativo"}
                        checked={isAddModalOpen ? novoProduto.ativo : editProduto?.ativo}
                        onChange={(e) => {
                          if (isAddModalOpen) {
                            setNovoProduto({ ...novoProduto, ativo: e.target.checked });
                          } else {
                            setEditProduto({ ...editProduto, ativo: e.target.checked });
                          }
                        }}
                        className="h-4 w-4 text-[#2A4E73] border-gray-300 rounded focus:ring-[#CFE8F9]"
                        aria-label="Produto ativo"
                      />
                    </div>
                    <div className="flex gap-3 pt-3">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-1.5 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        aria-label={isAddModalOpen ? "Adicionar produto" : "Salvar alterações"}
                      >
                        {isAddModalOpen ? 'Adicionar' : 'Salvar'}
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 px-4 py-1.5 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        aria-label="Cancelar"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {isEstoqueModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-labelledby="estoque-modal-title" aria-modal="true">
              <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 id="estoque-modal-title" className="text-lg sm:text-xl font-semibold text-[#2A4E73]">
                      Adicionar ao Estoque
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-[#2A4E73] hover:text-[#AD343E] text-2xl font-bold"
                      aria-label="Fechar modal"
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={handleAddEstoque} className="space-y-3">
                    <div>
                      <label htmlFor="estoque-quantidade" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Quantidade *
                      </label>
                      <input
                        type="number"
                        id="estoque-quantidade"
                        value={estoqueProduto.quantidade}
                        onChange={(e) => setEstoqueProduto({ ...estoqueProduto, quantidade: e.target.value })}
                        className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: 100"
                        step="0.01"
                        aria-invalid={errors.quantidade ? 'true' : 'false'}
                        aria-describedby={errors.quantidade ? 'estoque-quantidade-error' : undefined}
                      />
                      {errors.quantidade && <p id="estoque-quantidade-error" className="text-[#AD343E] text-xs mt-1">{errors.quantidade}</p>}
                    </div>
                    <div>
                      <label htmlFor="estoque-preco" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Preço (R$) *
                      </label>
                      <input
                        type="number"
                        id="estoque-preco"
                        value={estoqueProduto.preco}
                        onChange={(e) => setEstoqueProduto({ ...estoqueProduto, preco: e.target.value })}
                        className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: 29.99"
                        step="0.01"
                        aria-invalid={errors.preco ? 'true' : 'false'}
                        aria-describedby={errors.preco ? 'estoque-preco-error' : undefined}
                      />
                      {errors.preco && <p id="estoque-preco-error" className="text-[#AD343E] text-xs mt-1">{errors.preco}</p>}
                    </div>
                    <div className="flex gap-3 pt-3">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-1.5 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        aria-label="Adicionar ao estoque"
                      >
                        Adicionar
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 px-4 py-1.5 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        aria-label="Cancelar"
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
      <Footer />
    </div>
  );
}