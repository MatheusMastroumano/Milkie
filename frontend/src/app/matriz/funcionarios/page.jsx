"use client";

import { useState, useEffect } from 'react';
import Header from "@/components/Header/page";

export default function Funcionarios() {
  const [lojas, setLojas] = useState([
    { id: 1, nome: 'Loja Centro', tipo: 'Matriz', endereco: 'Rua Principal, 123' },
    { id: 2, nome: 'Loja Sul', tipo: 'Filial', endereco: 'Av. Sul, 456' },
  ]);
  const [funcionarios, setFuncionarios] = useState([
    { id: 1, loja_id: 1, nome: 'Ana Silva', cargo: 'Gerente', telefone: '(11) 98765-4321' },
    { id: 2, loja_id: 1, nome: 'João Santos', cargo: 'Vendedor', telefone: '(11) 91234-5678' },
    { id: 3, loja_id: 2, nome: 'Maria Oliveira', cargo: 'Vendedor', telefone: '(11) 93456-7890' },
  ]);
  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: '',
    cargo: '',
    telefone: '',
    loja_id: '',
  });
  const [editFuncionario, setEditFuncionario] = useState(null);
  const [selectedLojaId, setSelectedLojaId] = useState('');
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Função para mostrar notificação e fechar após 3 segundos
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Função para validar o formulário
  const validateForm = (funcionario) => {
    const newErrors = {};
    if (!funcionario.nome.trim()) newErrors.nome = 'O nome do funcionário é obrigatório';
    if (!funcionario.cargo.trim()) newErrors.cargo = 'O cargo é obrigatório';
    if (!funcionario.telefone.trim()) newErrors.telefone = 'O telefone é obrigatório';
    else if (!/^\(\d{2}\)\s\d{5}-\d{4}$/.test(funcionario.telefone))
      newErrors.telefone = 'Formato de telefone inválido (ex.: (11) 98765-4321)';
    if (!funcionario.loja_id) newErrors.loja_id = 'Selecione uma loja';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para formatar telefone enquanto digita
  const handleTelefoneChange = (e, setFuncionario) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos
    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setFuncionario((prev) => ({ ...prev, telefone: value }));
  };

  // Função para adicionar funcionário
  const handleAddFuncionario = (e) => {
    e.preventDefault();
    if (validateForm(novoFuncionario)) {
      setFuncionarios([
        ...funcionarios,
        { id: funcionarios.length + 1, ...novoFuncionario, loja_id: parseInt(novoFuncionario.loja_id) },
      ]);
      setNovoFuncionario({ nome: '', cargo: '', telefone: '', loja_id: '' });
      setErrors({});
      showNotification('Funcionário criado com sucesso! 🎉');
    }
  };

  // Função para editar funcionário no modal
  const handleEditFuncionario = (e) => {
    e.preventDefault();
    if (validateForm(editFuncionario)) {
      setFuncionarios(
        funcionarios.map((func) =>
          func.id === editFuncionario.id ? { ...editFuncionario, loja_id: parseInt(editFuncionario.loja_id) } : func
        )
      );
      setIsModalOpen(false);
      setEditFuncionario(null);
      setErrors({});
      showNotification('Funcionário atualizado com sucesso! ✅');
    }
  };

  // Função para abrir modal de edição
  const openEditFuncionario = (funcionario) => {
    setEditFuncionario({ ...funcionario, loja_id: funcionario.loja_id.toString() });
    setIsModalOpen(true);
    setErrors({});
  };

  // Função para fechar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditFuncionario(null);
    setErrors({});
  };

  // Função para excluir funcionário
  const handleDeleteFuncionario = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      setFuncionarios(funcionarios.filter((func) => func.id !== id));
      if (editFuncionario && editFuncionario.id === id) closeModal();
      showNotification('Funcionário removido com sucesso! 🗑️');
    }
  };

  // Filtrar funcionários pela loja selecionada
  const filteredFuncionarios = selectedLojaId
    ? funcionarios.filter((func) => func.loja_id === parseInt(selectedLojaId))
    : [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFFFF] pt-14 sm:pt-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6">
          {/* Título */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-6 text-center">
            Gerenciamento de Funcionários
          </h1>

          {/* Formulário para Adicionar Funcionário */}
          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6 mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Adicionar Novo Funcionário
            </h2>
            <form onSubmit={handleAddFuncionario} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex-1">
                <label htmlFor="nome" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Nome do Funcionário
                </label>
                <input
                  type="text"
                  id="nome"
                  value={novoFuncionario.nome}
                  onChange={(e) => setNovoFuncionario({ ...novoFuncionario, nome: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                  placeholder="Ex.: Ana Silva"
                />
                {errors.nome && <p className="text-[#AD343E] text-sm mt-1">{errors.nome}</p>}
              </div>
              <div className="flex-1">
                <label htmlFor="cargo" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Cargo
                </label>
                <input
                  type="text"
                  id="cargo"
                  value={novoFuncionario.cargo}
                  onChange={(e) => setNovoFuncionario({ ...novoFuncionario, cargo: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                  placeholder="Ex.: Gerente"
                />
                {errors.cargo && <p className="text-[#AD343E] text-sm mt-1">{errors.cargo}</p>}
              </div>
              <div className="flex-1">
                <label htmlFor="telefone" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  id="telefone"
                  value={novoFuncionario.telefone}
                  onChange={(e) => handleTelefoneChange(e, setNovoFuncionario)}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                  placeholder="(XX) XXXXX-XXXX"
                  maxLength={15}
                />
                {errors.telefone && <p className="text-[#AD343E] text-sm mt-1">{errors.telefone}</p>}
              </div>
              <div className="flex-1">
                <label htmlFor="loja_id" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Loja
                </label>
                <select
                  id="loja_id"
                  value={novoFuncionario.loja_id}
                  onChange={(e) => setNovoFuncionario({ ...novoFuncionario, loja_id: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                >
                  <option value="">Selecione uma loja</option>
                  {lojas.map((loja) => (
                    <option key={loja.id} value={loja.id}>
                      {loja.nome}
                    </option>
                  ))}
                </select>
                {errors.loja_id && <p className="text-[#AD343E] text-sm mt-1">{errors.loja_id}</p>}
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

          {/* Seleção de Loja e Funcionários */}
          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Funcionários por Loja
            </h2>
            <div className="mb-6">
              <label htmlFor="select-loja" className="block text-sm font-medium text-[#2A4E73] mb-2">
                Selecionar Loja
              </label>
              <select
                id="select-loja"
                value={selectedLojaId}
                onChange={(e) => setSelectedLojaId(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
              >
                <option value="">Selecione uma loja</option>
                {lojas.map((loja) => (
                  <option key={loja.id} value={loja.id}>
                    {loja.nome}
                  </option>
                ))}
              </select>
            </div>
            {notification && (
              <div className="w-full max-w-md mx-auto mb-4 p-4 px-4 py-2 bg-[#CFE8F9] text-[#2A4E73] rounded-md shadow-md text-sm sm:text-base font-medium text-center animate-fadeIn">
                {notification}
              </div>
            )}
            {selectedLojaId ? (
              filteredFuncionarios.length === 0 ? (
                <p className="text-[#2A4E73] text-center">Nenhum funcionário cadastrado para esta loja.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm sm:text-base text-[#2A4E73] border-collapse">
                    <thead>
                      <tr className="bg-[#2A4E73] text-[#FFFFFF]">
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left rounded-tl-md">ID</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Nome</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Cargo</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Telefone</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Loja</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-center rounded-tr-md">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFuncionarios.map((func) => (
                        <tr key={func.id} className="border-b border-gray-200 hover:bg-[#CFE8F9]">
                          <td className="px-3 sm:px-4 py-2 sm:py-3">{func.id}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 truncate max-w-[150px] sm:max-w-[200px]">
                            {func.nome}
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3">{func.cargo}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3">{func.telefone}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3">
                            {lojas.find((loja) => loja.id === func.loja_id)?.nome || 'Loja Não Encontrada'}
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 text-center space-x-2">
                            <button
                              onClick={() => openEditFuncionario(func)}
                              className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteFuncionario(func.id)}
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
              )
            ) : (
              <p className="text-[#2A4E73] text-center">Selecione uma loja para ver os funcionários.</p>
            )}
          </section>

          {/* Modal de Edição de Funcionário */}
          {isModalOpen && editFuncionario && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-[#2A4E73]">Editar Funcionário</h2>
                    <button
                      onClick={closeModal}
                      className="text-[#2A4E73] hover:text-[#AD343E] text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={handleEditFuncionario} className="space-y-4">
                    <div>
                      <label htmlFor="edit-id" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        ID
                      </label>
                      <input
                        type="text"
                        id="edit-id"
                        value={editFuncionario.id}
                        disabled
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] bg-gray-100 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-nome" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Nome do Funcionário
                      </label>
                      <input
                        type="text"
                        id="edit-nome"
                        value={editFuncionario.nome}
                        onChange={(e) => setEditFuncionario({ ...editFuncionario, nome: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: Ana Silva"
                      />
                      {errors.nome && <p className="text-[#AD343E] text-sm mt-1">{errors.nome}</p>}
                    </div>
                    <div>
                      <label htmlFor="edit-cargo" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Cargo
                      </label>
                      <input
                        type="text"
                        id="edit-cargo"
                        value={editFuncionario.cargo}
                        onChange={(e) => setEditFuncionario({ ...editFuncionario, cargo: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: Gerente"
                      />
                      {errors.cargo && <p className="text-[#AD343E] text-sm mt-1">{errors.cargo}</p>}
                    </div>
                    <div>
                      <label htmlFor="edit-telefone" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Telefone
                      </label>
                      <input
                        type="text"
                        id="edit-telefone"
                        value={editFuncionario.telefone}
                        onChange={(e) => handleTelefoneChange(e, setEditFuncionario)}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="(XX) XXXXX-XXXX"
                        maxLength={14}
                      />
                      {errors.telefone && <p className="text-[#AD343E] text-sm mt-1">{errors.telefone}</p>}
                    </div>
                    <div>
                      <label htmlFor="edit-loja_id" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Loja
                      </label>
                      <select
                        id="edit-loja_id"
                        value={editFuncionario.loja_id}
                        onChange={(e) => setEditFuncionario({ ...editFuncionario, loja_id: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      >
                        <option value="">Selecione uma loja</option>
                        {lojas.map((loja) => (
                          <option key={loja.id} value={loja.id}>
                            {loja.nome}
                          </option>
                        ))}
                      </select>
                      {errors.loja_id && <p className="text-[#AD343E] text-sm mt-1">{errors.loja_id}</p>}
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