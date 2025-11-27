"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';
import { apiJson, apiFormData } from '@/lib/api';



export default function Produtos() {
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lojaId, setLojaId] = useState(null);
  const [lojas, setLojas] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    marca: '',
    categoria: '',
    descricao: '',
    sku: '',
    fabricacao: '',
    validade: '',
    imagem_url: '',
    ativo: true,
    fornecedores_ids: [],
  });
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [previewImagem, setPreviewImagem] = useState(null);
  const [uploadingImagem, setUploadingImagem] = useState(false);
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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setLojaId(user.loja_id || 1);
  }, []);

  useEffect(() => {
    if (!lojaId) return;

    const fetchProdutos = async () => {
      try {
        setLoading(true);
        const { produtos: data } = await apiJson(`/produtos?loja_id=${lojaId}`);
        setProdutos(data || []);
      } catch (error) {
        showAlert('error', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, [lojaId]);

  useEffect(() => {
    const fetchLojas = async () => {
      try {
        const data = await apiJson('/lojas');
        setLojas(data.lojas || data || []);
      } catch (error) {
        showAlert('error', 'Erro ao carregar lojas');
      }
    };
    fetchLojas();
  }, []);

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const data = await apiJson('/fornecedores');
        setFornecedores(data.fornecedores || data || []);
      } catch (error) {
        console.error('Erro ao carregar fornecedores:', error);
      }
    };
    fetchFornecedores();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const validateProdutoForm = (produto) => {
    const newErrors = {};
    if (!produto.nome?.trim()) newErrors.nome = 'Nome obrigatório';
    if (!produto.sku?.trim()) newErrors.sku = 'SKU obrigatório';
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagemSelecionada(file);
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagem(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImagem = async () => {
    if (!imagemSelecionada) return null;

    try {
      setUploadingImagem(true);
      const formData = new FormData();
      formData.append('imagem', imagemSelecionada);

      const response = await apiFormData('/produtos/upload-imagem', formData);
      return response.imagem_url;
    } catch (error) {
      showAlert('error', `Erro ao fazer upload da imagem: ${error.message}`);
      return null;
    } finally {
      setUploadingImagem(false);
    }
  };

  const handleAddProduto = async (e) => {
    e.preventDefault();
    if (!validateProdutoForm(novoProduto)) return;

    try {
      // Fazer upload da imagem se houver
      let imagemUrl = novoProduto.imagem_url;
      if (imagemSelecionada) {
        imagemUrl = await handleUploadImagem();
        if (!imagemUrl) return; // Se o upload falhar, não continua
      }

      // Garantir que fornecedores_ids seja um array válido de números
      let fornecedoresIds = [];
      if (Array.isArray(novoProduto.fornecedores_ids) && novoProduto.fornecedores_ids.length > 0) {
        fornecedoresIds = novoProduto.fornecedores_ids
          .map(id => {
            const numId = typeof id === 'string' ? Number(id) : id;
            return isNaN(numId) ? null : numId;
          })
          .filter(id => id !== null && id > 0);
      }

      console.log('Frontend - Estado novoProduto.fornecedores_ids:', novoProduto.fornecedores_ids);
      console.log('Frontend - Fornecedores IDs processados:', fornecedoresIds);

      const payload = {
        nome: novoProduto.nome,
        marca: novoProduto.marca,
        categoria: novoProduto.categoria,
        descricao: novoProduto.descricao,
        sku: novoProduto.sku,
        fabricacao: novoProduto.fabricacao || null,
        validade: novoProduto.validade || null,
        imagem_url: imagemUrl || null,
        ativo: novoProduto.ativo !== undefined ? novoProduto.ativo : true
      };

      // Sempre incluir fornecedores_ids, mesmo que seja null ou array vazio
      if (fornecedoresIds.length > 0) {
        payload.fornecedores_ids = fornecedoresIds;
      } else {
        payload.fornecedores_ids = null;
      }

      console.log('Frontend - Payload completo enviado:', JSON.stringify(payload, null, 2));
      console.log('Frontend - Tipo de fornecedores_ids no payload:', typeof payload.fornecedores_ids);
      console.log('Frontend - É array?', Array.isArray(payload.fornecedores_ids));
      console.log('Frontend - Valor de fornecedores_ids:', payload.fornecedores_ids);

      const { produto: novo } = await apiJson('/produtos', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      console.log('Frontend - Produto recebido do backend:', novo);

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
      // Fazer upload da imagem se houver uma nova imagem selecionada
      let imagemUrl = editProduto.imagem_url;
      if (imagemSelecionada) {
        imagemUrl = await handleUploadImagem();
        if (!imagemUrl) {
          showAlert('error', 'Erro ao fazer upload da imagem. Tente novamente.');
          return;
        }
      }

      // Processar fornecedores_ids - converter strings para números
      let fornecedoresIds = [];
      if (Array.isArray(editProduto.fornecedores_ids) && editProduto.fornecedores_ids.length > 0) {
        fornecedoresIds = editProduto.fornecedores_ids
          .map(id => {
            const numId = typeof id === 'string' ? Number(id) : id;
            return isNaN(numId) ? null : numId;
          })
          .filter(id => id !== null && id > 0);
      }

      const payload = {
        nome: editProduto.nome,
        marca: editProduto.marca,
        categoria: editProduto.categoria,
        descricao: editProduto.descricao,
        sku: editProduto.sku,
        fabricacao: editProduto.fabricacao || null,
        validade: editProduto.validade || null,
        ativo: editProduto.ativo !== undefined ? editProduto.ativo : true,
        imagem_url: imagemUrl || null,
      };

      // Sempre incluir fornecedores_ids, mesmo que seja null ou array vazio
      if (fornecedoresIds.length > 0) {
        payload.fornecedores_ids = fornecedoresIds;
      } else {
        payload.fornecedores_ids = null;
      }

      const { updatedProduto } = await apiJson(`/produtos/${editProduto.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      // Recarregar produtos para obter os dados atualizados com fornecedores
      const { produtos: produtosAtualizados } = await apiJson(`/produtos?loja_id=${lojaId}`);
      setProdutos(produtosAtualizados || []);

      closeModal();
      showAlert('success', 'Produto atualizado com sucesso!');
    } catch (error) {
      showAlert('error', error.message);
    }
  };

  const handleAddEstoque = async (e) => {
    e.preventDefault();
    if (!validateEstoqueForm(estoqueProduto)) return;

    try {
      const { estoque: novoEstoque } = await apiJson('/estoque', {
        method: 'POST',
        body: JSON.stringify({
          produto_id: estoqueProduto.produto_id,
          loja_id: parseInt(estoqueProduto.loja_id),
          quantidade: parseFloat(estoqueProduto.quantidade),
          preco: parseFloat(estoqueProduto.preco),
          valido_ate: estoqueProduto.valido_ate || null,
        }),
      });

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
    // Extrair fornecedores_ids do campo JSON ou da relação
    let fornecedoresIds = [];
    if (produto.fornecedores_ids && Array.isArray(produto.fornecedores_ids)) {
      fornecedoresIds = produto.fornecedores_ids.map(id => id.toString());
    } else if (produto.fornecedores && Array.isArray(produto.fornecedores)) {
      fornecedoresIds = produto.fornecedores.map(fp => fp.fornecedor_id?.toString() || fp.fornecedor?.id?.toString()).filter(Boolean);
    }
    
    setEditProduto({
      ...produto,
      fabricacao: produto.fabricacao?.split('T')[0] || '',
      validade: produto.validade?.split('T')[0] || '',
      fornecedores_ids: fornecedoresIds,
    });
    // Limpar imagem selecionada e preview ao abrir edição
    setImagemSelecionada(null);
    setPreviewImagem(null);
    setIsModalOpen(true);
    setErrors({});
  };

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
      fabricacao: '', validade: '', imagem_url: '', ativo: true,
      fornecedores_ids: [],
    });
    setImagemSelecionada(null);
    setPreviewImagem(null);
    setErrors({});
  };

  const handleDeleteProduto = async (id) => {
    if (!window.confirm('Excluir este produto?')) return;
    try {
      await apiJson(`/produtos/${id}`, { method: 'DELETE' });
      setProdutos(prev => prev.filter(p => p.id !== id));
      showAlert('success', 'Produto removido!');
    } catch (error) {
      showAlert('error', error.message);
    }
  };

  const handleViewProduct = (produto) => {
    localStorage.setItem('productDetails', JSON.stringify(produto));
    router.push(`/matriz/produtos/${produto.id}`);
  };

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
          Gerenciamento de Produtos
        </h1>
        <p className="text-sm text-[#2A4E73] mb-6 text-center max-w-2xl mx-auto">
          Gerencie produtos e estoque da filial. Preço é definido ao adicionar ao estoque.
        </p>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
            aria-label="Abrir formulário para adicionar novo produto"
          >
            Adicionar Produto
          </button>
        </div>

        <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-2 text-center">
            Lista de Produtos
          </h2>
          <p className="text-sm text-[#2A4E73] mb-4 text-center">
            Visualize todos os produtos cadastrados, incluindo SKU, nome, marca e categoria.
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
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Fornecedores</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-center rounded-tr-md">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((p) => (
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
                        {p.fornecedores && p.fornecedores.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {p.fornecedores.map((fp, idx) => (
                              <span key={idx} className="inline-block px-2 py-1 text-xs bg-[#2A4E73] text-white rounded">
                                {fp.fornecedor?.nome || 'N/A'}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-center space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openEditProduto(p)}
                          className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                          aria-label={`Editar produto ${p.nome}`}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => openEstoqueModal(p)}
                          className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                          aria-label={`Adicionar ao estoque do produto ${p.nome}`}
                        >
                          Estoque
                        </button>
                        <button
                          onClick={() => handleDeleteProduto(p.id)}
                          className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                          aria-label={`Excluir produto ${p.nome}`}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-labelledby={isAddModalOpen ? "add-produto-title" : "edit-produto-title"} aria-modal="true">
            <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 id={isAddModalOpen ? "add-produto-title" : "edit-produto-title"} className="text-lg font-semibold text-[#2A4E73]">
                    {isAddModalOpen ? 'Adicionar Produto' : 'Editar Produto'}
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
                      Nome *
                    </label>
                    <input
                      id={isAddModalOpen ? "add-nome" : "edit-nome"}
                      type="text"
                      value={isAddModalOpen ? novoProduto.nome : editProduto?.nome}
                      onChange={(e) => isAddModalOpen
                        ? setNovoProduto({ ...novoProduto, nome: e.target.value })
                        : setEditProduto({ ...editProduto, nome: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="Camiseta Básica"
                      aria-invalid={errors.nome ? 'true' : 'false'}
                      aria-describedby={errors.nome ? (isAddModalOpen ? 'add-nome-error' : 'edit-nome-error') : undefined}
                    />
                    {errors.nome && (
                      <p id={isAddModalOpen ? "add-nome-error" : "edit-nome-error"} className="text-[#AD343E] text-xs mt-1">{errors.nome}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={isAddModalOpen ? "add-sku" : "edit-sku"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                      SKU *
                    </label>
                    <input
                      id={isAddModalOpen ? "add-sku" : "edit-sku"}
                      type="text"
                      value={isAddModalOpen ? novoProduto.sku : editProduto?.sku}
                      onChange={(e) => isAddModalOpen
                        ? setNovoProduto({ ...novoProduto, sku: e.target.value })
                        : setEditProduto({ ...editProduto, sku: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="ABC123"
                      aria-invalid={errors.sku ? 'true' : 'false'}
                      aria-describedby={errors.sku ? (isAddModalOpen ? 'add-sku-error' : 'edit-sku-error') : undefined}
                    />
                    {errors.sku && (
                      <p id={isAddModalOpen ? "add-sku-error" : "edit-sku-error"} className="text-[#AD343E] text-xs mt-1">{errors.sku}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={isAddModalOpen ? "add-marca" : "edit-marca"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Marca
                    </label>
                    <input
                      id={isAddModalOpen ? "add-marca" : "edit-marca"}
                      type="text"
                      value={isAddModalOpen ? novoProduto.marca : editProduto?.marca}
                      onChange={(e) => isAddModalOpen
                        ? setNovoProduto({ ...novoProduto, marca: e.target.value })
                        : setEditProduto({ ...editProduto, marca: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor={isAddModalOpen ? "add-categoria" : "edit-categoria"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Categoria
                    </label>
                    <input
                      id={isAddModalOpen ? "add-categoria" : "edit-categoria"}
                      type="text"
                      value={isAddModalOpen ? novoProduto.categoria : editProduto?.categoria}
                      onChange={(e) => isAddModalOpen
                        ? setNovoProduto({ ...novoProduto, categoria: e.target.value })
                        : setEditProduto({ ...editProduto, categoria: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor={isAddModalOpen ? "add-descricao" : "edit-descricao"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Descrição
                    </label>
                    <input
                      id={isAddModalOpen ? "add-descricao" : "edit-descricao"}
                      type="text"
                      value={isAddModalOpen ? novoProduto.descricao : editProduto?.descricao}
                      onChange={(e) => isAddModalOpen
                        ? setNovoProduto({ ...novoProduto, descricao: e.target.value })
                        : setEditProduto({ ...editProduto, descricao: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor={isAddModalOpen ? "add-fabricacao" : "edit-fabricacao"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Fabricação
                    </label>
                    <input
                      id={isAddModalOpen ? "add-fabricacao" : "edit-fabricacao"}
                      type="date"
                      value={isAddModalOpen ? novoProduto.fabricacao : editProduto?.fabricacao}
                      onChange={(e) => isAddModalOpen
                        ? setNovoProduto({ ...novoProduto, fabricacao: e.target.value })
                        : setEditProduto({ ...editProduto, fabricacao: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor={isAddModalOpen ? "add-validade" : "edit-validade"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Validade
                    </label>
                    <input
                      id={isAddModalOpen ? "add-validade" : "edit-validade"}
                      type="date"
                      value={isAddModalOpen ? novoProduto.validade : editProduto?.validade}
                      onChange={(e) => isAddModalOpen
                        ? setNovoProduto({ ...novoProduto, validade: e.target.value })
                        : setEditProduto({ ...editProduto, validade: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-2">
                      Fornecedores
                    </label>
                    <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto bg-white">
                      {fornecedores.filter(f => f.ativo).length === 0 ? (
                        <p className="text-sm text-gray-500">Nenhum fornecedor ativo cadastrado</p>
                      ) : (
                        fornecedores.filter(f => f.ativo).map(fornecedor => {
                          const fornecedorIdStr = fornecedor.id.toString();
                          const fornecedorIdNum = fornecedor.id;
                          
                          // Verificar se está selecionado - comparar tanto string quanto número
                          const currentIds = isAddModalOpen
                            ? (novoProduto.fornecedores_ids || [])
                            : (editProduto?.fornecedores_ids || []);
                          
                          const isSelected = currentIds.some(id => 
                            id === fornecedorIdStr || 
                            id === fornecedorIdNum || 
                            Number(id) === fornecedorIdNum ||
                            String(id) === fornecedorIdStr
                          );
                          
                          return (
                            <label
                              key={fornecedor.id}
                              className="flex items-center space-x-2 py-2 px-2 hover:bg-[#CFE8F9] rounded cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  let newIds;
                                  if (e.target.checked) {
                                    // Adicionar o ID como string para manter consistência
                                    if (!currentIds.includes(fornecedorIdStr) && !currentIds.includes(fornecedorIdNum)) {
                                      newIds = [...currentIds, fornecedorIdStr];
                                    } else {
                                      newIds = currentIds;
                                    }
                                  } else {
                                    // Remover o ID (tanto string quanto número)
                                    newIds = currentIds.filter(id => 
                                      id !== fornecedorIdStr && 
                                      id !== fornecedorIdNum &&
                                      Number(id) !== fornecedorIdNum &&
                                      String(id) !== fornecedorIdStr
                                    );
                                  }
                                  
                                  console.log('Checkbox alterado - Fornecedor ID:', fornecedorIdStr, 'Checked:', e.target.checked);
                                  console.log('IDs antes:', currentIds);
                                  console.log('IDs depois:', newIds);
                                  
                                  if (isAddModalOpen) {
                                    setNovoProduto({ ...novoProduto, fornecedores_ids: newIds });
                                  } else {
                                    setEditProduto({ ...editProduto, fornecedores_ids: newIds });
                                  }
                                }}
                                className="h-4 w-4 text-[#2A4E73] focus:ring-[#CFE8F9] border-gray-300 rounded"
                              />
                              <span className="text-sm text-[#2A4E73]">
                                {fornecedor.nome} - {fornecedor.cnpj_cpf}
                              </span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {isAddModalOpen && (
                    <div>
                      <label htmlFor="add-imagem" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Imagem do Produto
                      </label>
                      <input
                        id="add-imagem"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      />
                      {previewImagem && (
                        <div className="mt-2">
                          <img 
                            src={previewImagem} 
                            alt="Preview" 
                            className="max-w-full h-32 object-contain rounded-md border border-gray-300"
                          />
                        </div>
                      )}
                      {uploadingImagem && (
                        <p className="text-xs text-[#2A4E73] mt-1">Enviando imagem...</p>
                      )}
                    </div>
                  )}

                  {isModalOpen && (
                    <>
                      <div>
                        <label htmlFor="edit-imagem" className="block text-sm font-medium text-[#2A4E73] mb-1">
                          Nova Imagem do Produto (opcional)
                        </label>
                        <input
                          id="edit-imagem"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        />
                        {previewImagem && (
                          <div className="mt-2">
                            <img 
                              src={previewImagem} 
                              alt="Preview" 
                              className="max-w-full h-32 object-contain rounded-md border border-gray-300"
                            />
                          </div>
                        )}
                        {editProduto?.imagem_url && !previewImagem && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-600 mb-1">Imagem atual:</p>
                            <img 
                              src={editProduto.imagem_url.startsWith('http') ? editProduto.imagem_url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${editProduto.imagem_url}`}
                              alt="Imagem atual"
                              className="max-w-full h-32 object-contain rounded-md border border-gray-300"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        {uploadingImagem && (
                          <p className="text-xs text-[#2A4E73] mt-1">Enviando imagem...</p>
                        )}
                      </div>
                      <div>
                        <label className="flex items-center text-sm font-medium text-[#2A4E73]">
                          <input
                            type="checkbox"
                            checked={editProduto?.ativo}
                            onChange={(e) => setEditProduto({ ...editProduto, ativo: e.target.checked })}
                            className="mr-2 h-4 w-4 text-[#2A4E73] focus:ring-[#CFE8F9]"
                            aria-label="Produto ativo"
                          />
                          Produto Ativo
                        </label>
                      </div>
                    </>
                  )}

                  <div className="flex gap-3 pt-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-1.5 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      disabled={loading}
                      aria-label={isAddModalOpen ? "Adicionar produto" : "Salvar alterações"}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin inline-block" />
                      ) : (
                        isAddModalOpen ? 'Adicionar' : 'Salvar'
                      )}
                    </button>
                    <button
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

        {/* Modal Estoque */}
        {isEstoqueModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-labelledby="estoque-modal-title" aria-modal="true">
            <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="estoque-modal-title" className="text-lg font-semibold text-[#2A4E73]">
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
                    <label htmlFor="estoque-loja" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Filial *
                    </label>
                    <select
                      id="estoque-loja"
                      value={estoqueProduto.loja_id}
                      onChange={(e) => setEstoqueProduto({ ...estoqueProduto, loja_id: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      aria-invalid={errors.loja_id ? 'true' : 'false'}
                      aria-describedby={errors.loja_id ? 'estoque-loja-error' : undefined}
                    >
                      <option value="">Selecione uma filial</option>
                      {lojas.map((loja) => (
                        <option key={loja.id} value={loja.id}>
                          {loja.nome} ({loja.cidade || loja.id})
                        </option>
                      ))}
                    </select>
                    {errors.loja_id && (
                      <p id="estoque-loja-error" className="text-[#AD343E] text-xs mt-1">{errors.loja_id}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="estoque-quantidade" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Quantidade *
                    </label>
                    <input
                      id="estoque-quantidade"
                      type="number"
                      step="0.01"
                      value={estoqueProduto.quantidade}
                      onChange={(e) => setEstoqueProduto({ ...estoqueProduto, quantidade: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="51"
                      aria-invalid={errors.quantidade ? 'true' : 'false'}
                      aria-describedby={errors.quantidade ? 'estoque-quantidade-error' : undefined}
                    />
                    {errors.quantidade && (
                      <p id="estoque-quantidade-error" className="text-[#AD343E] text-xs mt-1">{errors.quantidade}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="estoque-preco" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Preço (R$) *
                    </label>
                    <input
                      id="estoque-preco"
                      type="number"
                      step="0.01"
                      value={estoqueProduto.preco}
                      onChange={(e) => setEstoqueProduto({ ...estoqueProduto, preco: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="20.99"
                      aria-invalid={errors.preco ? 'true' : 'false'}
                      aria-describedby={errors.preco ? 'estoque-preco-error' : undefined}
                    />
                    {errors.preco && (
                      <p id="estoque-preco-error" className="text-[#AD343E] text-xs mtparameter-1">{errors.preco}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="estoque-validade" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Válido até
                    </label>
                    <input
                      id="estoque-validade"
                      type="date"
                      value={estoqueProduto.valido_ate}
                      onChange={(e) => setEstoqueProduto({ ...estoqueProduto, valido_ate: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                    />
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-1.5 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin inline-block" /> : 'Adicionar ao Estoque'}
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 px-4 py-1.5 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
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
      <br /><br /><br /><br /><br /><br /><br />
      <Footer />
    </main>
  );
}