"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SimpleConfirm } from '@/components/ui/simple-confirm.jsx';
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";
import { apiJson } from "@/lib/api";



export default function Estoque() {
  const router = useRouter();
  const [lojas, setLojas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [selectedLoja, setSelectedLoja] = useState("");
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({ show: false, title: '', description: '', onConfirm: null });

  const [novoEstoque, setNovoEstoque] = useState({
    produto_id: "",
    loja_id: "",
    quantidade: "",
    preco: "",
    valido_ate: "",
  });

  const [editEstoque, setEditEstoque] = useState({
    produto_id: "",
    loja_id: "",
    quantidade: "",
    preco: "",
    valido_ate: "",
  });

  useEffect(() => {
    setNovoEstoque((prev) => ({ ...prev, loja_id: selectedLoja }));
  }, [selectedLoja]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false }), 5000);
  };

  useEffect(() => {
    async function carregarDados() {
      try {
        const [produtosJson, lojasJson] = await Promise.all([
          apiJson('/produtos'),
          apiJson('/lojas'),
        ]);

        const produtosArray = produtosJson.produtos || produtosJson || [];
        const lojasArray = lojasJson.lojas || lojasJson || [];

        setProdutos(produtosArray);
        setLojas(lojasArray);
      } catch (err) {
        showAlert("error", "Erro ao carregar dados: " + err.message);
      }
    }
    carregarDados();
  }, []);

  useEffect(() => {
    if (!selectedLoja) {
      setEstoque([]);
      setLoading(false);
      return;
    }
    
    async function carregarEstoque() {
      try {
        setLoading(true);
        const json = await apiJson(`/estoque?loja_id=${selectedLoja}`);
        const estoqueArray = json.estoque || json || [];
        setEstoque(estoqueArray);
      } catch (err) {
        showAlert("error", "Erro ao carregar estoque: " + err.message);
        setEstoque([]);
      } finally {
        setLoading(false);
      }
    }
    carregarEstoque();
  }, [selectedLoja]);

  const validateEstoqueForm = (item) => {
    const err = {};
    if (!item.produto_id) err.produto_id = 'Selecione um produto';
    if (!item.loja_id) err.loja_id = 'Selecione uma loja';
    if (!item.quantidade || parseFloat(item.quantidade) <= 0) err.quantidade = 'Quantidade deve ser maior que 0';
    if (!item.preco || parseFloat(item.preco) <= 0) err.preco = 'Preço deve ser maior que 0';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validateEstoqueForm(novoEstoque)) return;

    try {
      const payload = {
        produto_id: parseInt(novoEstoque.produto_id),
        loja_id: parseInt(novoEstoque.loja_id),
        quantidade: parseFloat(novoEstoque.quantidade),
        preco: parseFloat(novoEstoque.preco),
        valido_ate: novoEstoque.valido_ate || null,
      };

      const response = await apiJson('/estoque', {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const novoItem = response.estoque || response;

      setEstoque(prev => {
        const exists = prev.find(p => p.produto_id === novoItem.produto_id && p.loja_id === novoItem.loja_id);
        return exists
          ? prev.map(p => p.produto_id === novoItem.produto_id && p.loja_id === novoItem.loja_id ? novoItem : p)
          : [...prev, novoItem];
      });

      showAlert("success", "Item adicionado ao estoque!");
      setNovoEstoque({
        produto_id: "",
        loja_id: selectedLoja,
        quantidade: "",
        preco: "",
        valido_ate: "",
      });
      setIsAddModalOpen(false);
      setErrors({});
    } catch (err) {
      showAlert("error", err.message);
    }
  };

  const openEditModal = (item) => {
    setEditEstoque({
      produto_id: item.produto_id.toString(),
      loja_id: item.loja_id.toString(),
      quantidade: item.quantidade.toString(),
      preco: item.preco.toString(),
      valido_ate: item.valido_ate?.split('T')[0] || "",
    });
    setIsEditModalOpen(true);
    setErrors({});
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!validateEstoqueForm(editEstoque)) return;

    try {
      const payload = {
        quantidade: parseFloat(editEstoque.quantidade),
        preco: parseFloat(editEstoque.preco),
        valido_ate: editEstoque.valido_ate || null,
      };

      const updatedItem = await apiJson(`/estoque/${editEstoque.produto_id}/${editEstoque.loja_id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setEstoque(prev => prev.map(p =>
        p.produto_id === updatedItem.produto_id && p.loja_id === updatedItem.loja_id
          ? updatedItem
          : p
      ));

      showAlert("success", "Estoque atualizado com sucesso!");
      setIsEditModalOpen(false);
    } catch (err) {
      showAlert("error", err.message);
    }
  };

  const handleDelete = (produto_id, loja_id) => {
    const produto = produtos.find(p => p.id === produto_id);
    const loja = lojas.find(l => l.id === loja_id);
    
    setConfirmDialog({
      show: true,
      title: 'Confirmar Exclusão',
      description: `Tem certeza que deseja remover "${produto?.nome || 'Produto'}" do estoque da "${loja?.nome || 'Loja'}"?`,
      onConfirm: async () => {
        try {
          await apiJson(`/estoque/${produto_id}/${loja_id}`, { method: "DELETE" });

          showAlert("success", "Item removido do estoque!");
          setEstoque(prev => prev.filter(p => !(p.produto_id === produto_id && p.loja_id === loja_id)));
        } catch (err) {
          showAlert("error", err.message);
        }
        setConfirmDialog({ show: false, title: '', description: '', onConfirm: null });
      }
    });
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setNovoEstoque({ produto_id: "", loja_id: selectedLoja, quantidade: "", preco: "", valido_ate: "" });
    setEditEstoque({ produto_id: "", loja_id: "", quantidade: "", preco: "", valido_ate: "" });
    setErrors({});
  };

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

        <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-4 text-center">
          Gerenciamento de Estoque - Matriz
        </h1>
        <p className="text-sm text-[#2A4E73] mb-6 text-center max-w-2xl mx-auto">
          Gerencie o estoque de todas as filiais. Edite quantidade, preço e validade.
        </p>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={!selectedLoja}
            className="px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Adicionar ao Estoque
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-[#2A4E73] mb-1">
            Selecione uma Filial
          </label>
          <select
            value={selectedLoja}
            onChange={(e) => setSelectedLoja(e.target.value)}
            className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
          >
            <option value="">Selecione uma filial...</option>
            {lojas.map((loja) => (
              <option key={loja.id} value={loja.id}>
                {loja.nome} ({loja.tipo})
              </option>
            ))}
          </select>
        </div>

        <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-2 text-center">
            Itens no Estoque
          </h2>
          <p className="text-sm text-[#2A4E73] mb-4 text-center">
            Visualize e edite o estoque da filial selecionada.
          </p>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#2A4E73]" />
            </div>
          ) : !selectedLoja ? (
            <p className="text-[#2A4E73] text-center py-8">Selecione uma filial para visualizar o estoque.</p>
          ) : estoque.length === 0 ? (
            <p className="text-[#2A4E73] text-center py-8">Nenhum item cadastrado no estoque.</p>
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
                  {estoque.map((item) => {
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
                          {/* BOTÃO EDITAR — 100% IGUAL AO DA PÁGINA DE PRODUTOS */}
                          <button
                            onClick={() => openEditModal(item)}
                            className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                            aria-label={`Editar estoque do produto ${produto?.nome}`}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(item.produto_id, item.loja_id)}
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
                      value={novoEstoque.produto_id}
                      onChange={(e) => setNovoEstoque({ ...novoEstoque, produto_id: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                    >
                      <option value="">Selecione um produto...</option>
                      {produtos.map((p) => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                      ))}
                    </select>
                    {errors.produto_id && <p className="text-[#AD343E] text-xs mt-1">{errors.produto_id}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Filial *</label>
                    <select
                      value={novoEstoque.loja_id}
                      onChange={(e) => setNovoEstoque({ ...novoEstoque, loja_id: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                    >
                      <option value="">Selecione uma filial...</option>
                      {lojas.map((loja) => (
                        <option key={loja.id} value={loja.id}>{loja.nome} ({loja.tipo})</option>
                      ))}
                    </select>
                    {errors.loja_id && <p className="text-[#AD343E] text-xs mt-1">{errors.loja_id}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[#2A4E73] mb-1">Quantidade *</label>
                      <input type="number" step="0.01" value={novoEstoque.quantidade} onChange={(e) => setNovoEstoque({ ...novoEstoque, quantidade: e.target.value })} className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]" placeholder="10" />
                      {errors.quantidade && <p className="text-[#AD343E] text-xs mt-1">{errors.quantidade}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2A4E73] mb-1">Preço (R$) *</label>
                      <input type="number" step="0.01" value={novoEstoque.preco} onChange={(e) => setNovoEstoque({ ...novoEstoque, preco: e.target.value })} className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]" placeholder="29.90" />
                      {errors.preco && <p className="text-[#AD343E] text-xs mt-1">{errors.preco}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Válido até</label>
                    <input type="date" value={novoEstoque.valido_ate} onChange={(e) => setNovoEstoque({ ...novoEstoque, valido_ate: e.target.value })} className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]" />
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
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4" role="dialog" aria-labelledby="edit-estoque-title" aria-modal="true">
            <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-md w-full">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="edit-estoque-title" className="text-lg font-semibold text-[#2A4E73]">Editar Estoque</h2>
                  <button onClick={closeModal} className="text-[#2A4E73] hover:text-[#AD343E] text-2xl font-bold">×</button>
                </div>
                <form onSubmit={handleEdit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[#2A4E73] mb-1">Quantidade *</label>
                      <input type="number" step="0.01" value={editEstoque.quantidade} onChange={(e) => setEditEstoque({ ...editEstoque, quantidade: e.target.value })} className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]" placeholder="10" />
                      {errors.quantidade && <p className="text-[#AD343E] text-xs mt-1">{errors.quantidade}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2A4E73] mb-1">Preço (R$) *</label>
                      <input type="number" step="0.01" value={editEstoque.preco} onChange={(e) => setEditEstoque({ ...editEstoque, preco: e.target.value })} className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]" placeholder="29.90" />
                      {errors.preco && <p className="text-[#AD343E] text-xs mt-1">{errors.preco}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Válido até</label>
                    <input type="date" value={editEstoque.valido_ate} onChange={(e) => setEditEstoque({ ...editEstoque, valido_ate: e.target.value })} className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]" />
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
      <br /><br /><br /><br /><br /><br /><br />
      <Footer />
    </main>
  );
}