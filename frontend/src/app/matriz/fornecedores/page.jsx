"use client";

import { useState } from 'react';
import Header from "@/components/Header/page";

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([
    { id: 1, nome: 'Fornecedor A', cnpj_cpf: '12.345.678/0001-90', endereco: 'Rua A, 100', ativo: true },
    { id: 2, nome: 'Fornecedor B', cnpj_cpf: '98.765.432/0001-00', endereco: 'Av. B, 200', ativo: false },
  ]);
  const [novoFornecedor, setNovoFornecedor] = useState({ nome: '', cnpj_cpf: '', endereco: '', ativo: true });
  const [editFornecedor, setEditFornecedor] = useState(null);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para validar o formulário
  const validateForm = (fornecedor, isEdit = false) => {
    const newErrors = {};
    if (!fornecedor.nome.trim()) newErrors.nome = 'O nome do fornecedor é obrigatório';
    if (!isEdit && fornecedores.some((f) => f.nome === fornecedor.nome)) {
      newErrors.nome = 'Já existe um fornecedor com esse nome';
    }
    if (fornecedor.cnpj_cpf && !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{11}$/.test(fornecedor.cnpj_cpf.replace(/[^\d]/g, ''))) {
      newErrors.cnpj_cpf = 'CNPJ/CPF inválido (formato: 12.345.678/0001-90 ou 12345678901)';
    }
    if (!fornecedor.endereco.trim()) newErrors.endereco = 'O endereço é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para adicionar fornecedor
  const handleAddFornecedor = (e) => {
    e.preventDefault();
    if (validateForm(novoFornecedor)) {
      setFornecedores([...fornecedores, { id: fornecedores.length + 1, ...novoFornecedor }]);
      setNovoFornecedor({ nome: '', cnpj_cpf: '', endereco: '', ativo: true });
      setErrors({});
    }
  };

  // Função para editar fornecedor no modal
  const handleEditFornecedor = (e) => {
    e.preventDefault();
    if (validateForm(editFornecedor, true)) {
      setFornecedores(fornecedores.map((forn) => (forn.id === editFornecedor.id ? { ...editFornecedor } : forn)));
      setIsModalOpen(false);
      setEditFornecedor(null);
      setErrors({});
    }
  };

  // Função para abrir modal de edição
  const openEditFornecedor = (forn) => {
    setEditFornecedor({ ...forn });
    setIsModalOpen(true);
    setErrors({});
  };

  // Função para fechar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditFornecedor(null);
    setErrors({});
  };

  // Função para excluir fornecedor
  const handleDeleteFornecedor = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
      setFornecedores(fornecedores.filter((forn) => forn.id !== id));
      if (editFornecedor && editFornecedor.id === id) {
        closeModal();
      }
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFFFF] pt-14 sm:pt-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6">
          {/* Título */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-6 text-center">
            Gerenciamento de Fornecedores
          </h1>

          {/* Formulário para Adicionar Novo Fornecedor */}
          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6 mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Adicionar Novo Fornecedor
            </h2>
            <form onSubmit={handleAddFornecedor} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex-1">
                <label htmlFor="nome" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Nome do Fornecedor
                </label>
                <input
                  type="text"
                  id="nome"
                  value={novoFornecedor.nome}
                  onChange={(e) => setNovoFornecedor({ ...novoFornecedor, nome: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                  placeholder="Ex.: Fornecedor A"
                />
                {errors.nome && <p className="text-[#AD343E] text-sm mt-1">{errors.nome}</p>}
              </div>
              <div className="flex-1">
                <label htmlFor="cnpj_cpf" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  CNPJ/CPF
                </label>
                <input
                  type="text"
                  id="cnpj_cpf"
                  value={novoFornecedor.cnpj_cpf}
                  onChange={(e) => setNovoFornecedor({ ...novoFornecedor, cnpj_cpf: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                  placeholder="Ex.: 12.345.678/0001-90 ou 12345678901"
                />
                {errors.cnpj_cpf && <p className="text-[#AD343E] text-sm mt-1">{errors.cnpj_cpf}</p>}
              </div>
              <div className="flex-1">
                <label htmlFor="endereco" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Endereço
                </label>
                <input
                  type="text"
                  id="endereco"
                  value={novoFornecedor.endereco}
                  onChange={(e) => setNovoFornecedor({ ...novoFornecedor, endereco: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                  placeholder="Ex.: Rua A, 100"
                />
                {errors.endereco && <p className="text-[#AD343E] text-sm mt-1">{errors.endereco}</p>}
              </div>
              <div className="flex-1">
                <label htmlFor="ativo" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Ativo
                </label>
                <select
                  id="ativo"
                  value={novoFornecedor.ativo}
                  onChange={(e) => setNovoFornecedor({ ...novoFornecedor, ativo: e.target.value === 'true' })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                >
                  <option value={true}>Sim</option>
                  <option value={false}>Não</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </section>

          {/* Tabela de Fornecedores */}
          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Lista de Fornecedores
            </h2>
            {fornecedores.length === 0 ? (
              <p className="text-[#2A4E73] text-center">Nenhum fornecedor cadastrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base text-[#2A4E73] border-collapse">
                  <thead>
                    <tr className="bg-[#2A4E73] text-[#FFFFFF]">
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left rounded-tl-md">ID</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Nome</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">CNPJ/CPF</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Endereço</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Ativo</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-center rounded-tr-md">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fornecedores.map((forn) => (
                      <tr key={forn.id} className="border-b border-gray-200 hover:bg-[#CFE8F9]">
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{forn.id}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 truncate max-w-[150px] sm:max-w-[200px]">
                          {forn.nome}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 truncate max-w-[150px] sm:max-w-[200px]">
                          {forn.cnpj_cpf || 'Não informado'}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 truncate max-w-[200px] sm:max-w-[300px]">
                          {forn.endereco}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{forn.ativo ? 'Sim' : 'Não'}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-center space-x-2">
                          <button
                            onClick={() => openEditFornecedor(forn)}
                            className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteFornecedor(forn.id)}
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
                      <label htmlFor="edit-id" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        ID
                      </label>
                      <input
                        type="text"
                        id="edit-id"
                        value={editFornecedor.id}
                        disabled
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] bg-gray-100 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-nome" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Nome do Fornecedor
                      </label>
                      <input
                        type="text"
                        id="edit-nome"
                        value={editFornecedor.nome}
                        onChange={(e) => setEditFornecedor({ ...editFornecedor, nome: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: Fornecedor A"
                      />
                      {errors.nome && <p className="text-[#AD343E] text-sm mt-1">{errors.nome}</p>}
                    </div>
                    <div>
                      <label htmlFor="edit-cnpj_cpf" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        CNPJ/CPF
                      </label>
                      <input
                        type="text"
                        id="edit-cnpj_cpf"
                        value={editFornecedor.cnpj_cpf}
                        onChange={(e) => setEditFornecedor({ ...editFornecedor, cnpj_cpf: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: 12.345.678/0001-90 ou 12345678901"
                      />
                      {errors.cnpj_cpf && <p className="text-[#AD343E] text-sm mt-1">{errors.cnpj_cpf}</p>}
                    </div>
                    <div>
                      <label htmlFor="edit-endereco" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Endereço
                      </label>
                      <input
                        type="text"
                        id="edit-endereco"
                        value={editFornecedor.endereco}
                        onChange={(e) => setEditFornecedor({ ...editFornecedor, endereco: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: Rua A, 100"
                      />
                      {errors.endereco && <p className="text-[#AD343E] text-sm mt-1">{errors.endereco}</p>}
                    </div>
                    <div>
                      <label htmlFor="edit-ativo" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Ativo
                      </label>
                      <select
                        id="edit-ativo"
                        value={editFornecedor.ativo}
                        onChange={(e) => setEditFornecedor({ ...editFornecedor, ativo: e.target.value === 'true' })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      >
                        <option value={true}>Sim</option>
                        <option value={false}>Não</option>
                      </select>
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