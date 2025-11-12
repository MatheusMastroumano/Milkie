"use client";

import { useState, useEffect } from 'react';
import Header from "@/components/Header/page";
import { apiJson } from '@/lib/api';



export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [novoFornecedor, setNovoFornecedor] = useState({ 
    nome: '', 
    cnpj_cpf: '', 
    ativo: true 
  });
  const [editFornecedor, setEditFornecedor] = useState(null);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Buscar fornecedores da API
  useEffect(() => {
    fetchFornecedores();
  }, []);

  const fetchFornecedores = async () => {
    try {
      setLoading(true);
      const data = await apiJson('/fornecedores');
      setFornecedores(data.fornecedores || []);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
      alert(`Erro ao carregar fornecedores: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Validação do formulário (sem produtos_fornecidos)
  const validateForm = (fornecedor, isEdit = false) => {
    const newErrors = {};
    
    if (!fornecedor.nome.trim()) {
      newErrors.nome = 'O nome do fornecedor é obrigatório';
    }
    
    if (!fornecedor.cnpj_cpf.trim()) {
      newErrors.cnpj_cpf = 'CNPJ/CPF é obrigatório';
    } else {
      const cnpjCpfLimpo = fornecedor.cnpj_cpf.replace(/[^\d]/g, '');
      if (cnpjCpfLimpo.length !== 11 && cnpjCpfLimpo.length !== 14) {
        newErrors.cnpj_cpf = 'CNPJ deve ter 14 dígitos ou CPF deve ter 11 dígitos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Adicionar fornecedor
  const handleAddFornecedor = async (e) => {
    e.preventDefault();
    if (validateForm(novoFornecedor)) {
      try {
        await apiJson('/fornecedores', {
          method: 'POST',
          body: JSON.stringify({
            nome: novoFornecedor.nome,
            cnpj_cpf: novoFornecedor.cnpj_cpf,
            ativo: novoFornecedor.ativo,
          }),
        });

        await fetchFornecedores();
        setNovoFornecedor({ nome: '', cnpj_cpf: '', ativo: true });
        setErrors({});
        alert('Fornecedor adicionado com sucesso!');
      } catch (error) {
        alert(`Erro ao adicionar fornecedor: ${error.message}`);
      }
    }
  };

  // Editar fornecedor
  const handleEditFornecedor = async (e) => {
    e.preventDefault();
    if (validateForm(editFornecedor, true)) {
      try {
        await apiJson(`/fornecedores/${editFornecedor.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            nome: editFornecedor.nome,
            cnpj_cpf: editFornecedor.cnpj_cpf,
            ativo: editFornecedor.ativo,
          }),
        });

        await fetchFornecedores();
        setIsModalOpen(false);
        setEditFornecedor(null);
        setErrors({});
        alert('Fornecedor atualizado com sucesso!');
      } catch (error) {
        alert(`Erro ao atualizar fornecedor: ${error.message}`);
      }
    }
  };

  // Abrir modal de edição
  const openEditFornecedor = (forn) => {
    setEditFornecedor({ ...forn });
    setIsModalOpen(true);
    setErrors({});
  };

  // Fechar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditFornecedor(null);
    setErrors({});
  };

  // Excluir fornecedor
  const handleDeleteFornecedor = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
      try {
        await apiJson(`/fornecedores/${id}`, {
          method: 'DELETE',
        });

        await fetchFornecedores();
        if (editFornecedor && editFornecedor.id === id) {
          closeModal();
        }
        alert('Fornecedor excluído com sucesso!');
      } catch (error) {
        alert(`Erro ao excluir fornecedor: ${error.message}`);
      }
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFFFF] pt-14 sm:pt-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-6 text-center">
            Gerenciamento de Fornecedores
          </h1>

          {/* Formulário para Adicionar */}
          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6 mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Adicionar Novo Fornecedor
            </h2>
            <form onSubmit={handleAddFornecedor} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-[#2A4E73] mb-1">
                    Nome do Fornecedor *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    value={novoFornecedor.nome}
                    onChange={(e) => setNovoFornecedor({ ...novoFornecedor, nome: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                    placeholder="Ex.: Distribuidora ABC"
                  />
                  {errors.nome && <p className="text-[#AD343E] text-sm mt-1">{errors.nome}</p>}
                </div>
                <div>
                  <label htmlFor="cnpj_cpf" className="block text-sm font-medium text-[#2A4E73] mb-1">
                    CNPJ/CPF *
                  </label>
                  <input
                    type="text"
                    id="cnpj_cpf"
                    value={novoFornecedor.cnpj_cpf}
                    onChange={(e) => setNovoFornecedor({ ...novoFornecedor, cnpj_cpf: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                    placeholder="Ex.: 12.345.678/0001-90"
                  />
                  {errors.cnpj_cpf && <p className="text-[#AD343E] text-sm mt-1">{errors.cnpj_cpf}</p>}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label htmlFor="ativo" className="text-sm font-medium text-[#2A4E73]">
                  Ativo
                </label>
                <input
                  type="checkbox"
                  id="ativo"
                  checked={novoFornecedor.ativo}
                  onChange={(e) => setNovoFornecedor({ ...novoFornecedor, ativo: e.target.checked })}
                  className="h-4 w-4 text-[#2A4E73] border-gray-300 rounded focus:ring-[#CFE8F9]"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
              >
                Adicionar
              </button>
            </form>
          </section>

          {/* Tabela de Fornecedores */}
          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Lista de Fornecedores
            </h2>
            {loading ? (
              <p className="text-[#2A4E73] text-center">Carregando...</p>
            ) : fornecedores.length === 0 ? (
              <p className="text-[#2A4E73] text-center">Nenhum fornecedor cadastrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base text-[#2A4E73] border-collapse">
                  <thead>
                    <tr className="bg-[#2A4E73] text-[#FFFFFF]">
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left rounded-tl-md">ID</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Nome</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">CNPJ/CPF</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Ativo</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-center rounded-tr-md">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fornecedores.map((forn) => (
                      <tr key={forn.id} className="border-b border-gray-200 hover:bg-[#CFE8F9]">
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{forn.id}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{forn.nome}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{forn.cnpj_cpf}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{forn.ativo ? 'Sim' : 'Não'}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-center space-x-2">
                          <button
                            onClick={() => openEditFornecedor(forn)}
                            className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteFornecedor(forn.id)}
                            className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] transition-colors"
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

          {/* Modal de Edição */}
          {isModalOpen && editFornecedor && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-[#2A4E73]">Editar Fornecedor</h2>
                    <button
                      onClick={closeModal}
                      className="text-[#2A4E73] hover:text-[#AD343E] text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={handleEditFornecedor} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2A4E73] mb-1">ID</label>
                      <input
                        type="text"
                        value={editFornecedor.id}
                        disabled
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] bg-gray-100 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2A4E73] mb-1">Nome *</label>
                      <input
                        type="text"
                        value={editFornecedor.nome}
                        onChange={(e) => setEditFornecedor({ ...editFornecedor, nome: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                      />
                      {errors.nome && <p className="text-[#AD343E] text-sm mt-1">{errors.nome}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2A4E73] mb-1">CNPJ/CPF *</label>
                      <input
                        type="text"
                        value={editFornecedor.cnpj_cpf}
                        onChange={(e) => setEditFornecedor({ ...editFornecedor, cnpj_cpf: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                      />
                      {errors.cnpj_cpf && <p className="text-[#AD343E] text-sm mt-1">{errors.cnpj_cpf}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-[#2A4E73]">Ativo</label>
                      <input
                        type="checkbox"
                        checked={editFornecedor.ativo}
                        onChange={(e) => setEditFornecedor({ ...editFornecedor, ativo: e.target.checked })}
                        className="h-4 w-4 text-[#2A4E73] border-gray-300 rounded focus:ring-[#CFE8F9]"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] transition-colors"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] transition-colors"
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