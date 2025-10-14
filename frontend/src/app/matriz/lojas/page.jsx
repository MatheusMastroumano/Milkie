"use client";

import { useState } from 'react';
import Header from "@/components/Header/page";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';

export default function Lojas() {
  const [lojas, setLojas] = useState([
    { id: 1, nome: 'Loja Centro', tipo: 'Matriz', endereco: 'Rua Principal, 123' },
    { id: 2, nome: 'Loja Sul', tipo: 'Filial', endereco: 'Av. Sul, 456' },
  ]);
  const [novaLoja, setNovaLoja] = useState({ nome: '', tipo: 'Filial', endereco: '' });
  const [editLoja, setEditLoja] = useState(null);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Função para mostrar alert
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000);
  };

  // Função para validar o formulário
  const validateForm = (loja, isEdit = false) => {
    const newErrors = {};
    if (!loja.nome.trim()) newErrors.nome = 'O nome da loja é obrigatório';
    if (!loja.endereco.trim()) newErrors.endereco = 'O endereço é obrigatório';
    if (!isEdit && loja.tipo === 'Matriz' && lojas.some((l) => l.tipo === 'Matriz')) {
      newErrors.tipo = 'Já existe uma loja Matriz';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para adicionar loja
  const handleAddLoja = (e) => {
    e.preventDefault();
    if (validateForm(novaLoja)) {
      setLojas([...lojas, { id: lojas.length + 1, ...novaLoja }]);
      showAlert('success', `Loja "${novaLoja.nome}" cadastrada com sucesso!`);
      setNovaLoja({ nome: '', tipo: 'Filial', endereco: '' });
      setErrors({});
    }
  };

  // Função para editar loja no modal
  const handleEditLoja = (e) => {
    e.preventDefault();
    if (validateForm(editLoja, true)) {
      setLojas(lojas.map((loja) => (loja.id === editLoja.id ? { ...editLoja } : loja)));
      showAlert('success', `Loja "${editLoja.nome}" editada com sucesso!`);
      setIsModalOpen(false);
      setEditLoja(null);
      setErrors({});
    }
  };

  // Função para abrir modal de edição
  const openEditLoja = (loja) => {
    setEditLoja({ ...loja });
    setIsModalOpen(true);
    setErrors({});
  };

  // Função para fechar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditLoja(null);
    setErrors({});
  };

  // Função para excluir loja
  const handleDeleteLoja = (id) => {
    const lojaToDelete = lojas.find((loja) => loja.id === id);
    if (window.confirm('Tem certeza que deseja excluir esta loja?')) {
      setLojas(lojas.filter((loja) => loja.id !== id));
      showAlert('success', `Loja "${lojaToDelete.nome}" excluída com sucesso!`);
      if (editLoja && editLoja.id === id) {
        closeModal();
      }
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFFFF] pt-14 sm:pt-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6">
          {/* Alert de Feedback */}
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

          {/* Título */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-6 text-center">
            Gerenciamento de Lojas
          </h1>

          {/* Formulário para Adicionar Nova Loja */}
          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6 mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Adicionar Nova Loja
            </h2>
            <form onSubmit={handleAddLoja} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex-1">
                <label htmlFor="nome" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Nome da Loja
                </label>
                <input
                  type="text"
                  id="nome"
                  value={novaLoja.nome}
                  onChange={(e) => setNovaLoja({ ...novaLoja, nome: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                  placeholder="Ex.: Loja Centro"
                />
                {errors.nome && <p className="text-[#AD343E] text-sm mt-1">{errors.nome}</p>}
              </div>
              <div className="flex-1">
                <label htmlFor="tipo" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Tipo
                </label>
                <select
                  id="tipo"
                  value={novaLoja.tipo}
                  onChange={(e) => setNovaLoja({ ...novaLoja, tipo: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                >
                  <option value="Filial">Filial</option>
                  <option value="Matriz">Matriz</option>
                </select>
                {errors.tipo && <p className="text-[#AD343E] text-sm mt-1">{errors.tipo}</p>}
              </div>
              <div className="flex-1">
                <label htmlFor="endereco" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Endereço
                </label>
                <input
                  type="text"
                  id="endereco"
                  value={novaLoja.endereco}
                  onChange={(e) => setNovaLoja({ ...novaLoja, endereco: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                  placeholder="Ex.: Rua Principal, 123"
                />
                {errors.endereco && <p className="text-[#AD343E] text-sm mt-1">{errors.endereco}</p>}
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

          {/* Tabela de Lojas */}
          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Lista de Lojas
            </h2>
            {lojas.length === 0 ? (
              <p className="text-[#2A4E73] text-center">Nenhuma loja cadastrada.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base text-[#2A4E73] border-collapse">
                  <thead>
                    <tr className="bg-[#2A4E73] text-[#FFFFFF]">
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left rounded-tl-md">ID</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Nome</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Tipo</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Endereço</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-center rounded-tr-md">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lojas.map((loja) => (
                      <tr key={loja.id} className="border-b border-gray-200 hover:bg-[#CFE8F9]">
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{loja.id}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 truncate max-w-[150px] sm:max-w-[200px]">
                          {loja.nome}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{loja.tipo}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 truncate max-w-[200px] sm:max-w-[300px]">
                          {loja.endereco}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-center space-x-2">
                          <button
                            onClick={() => openEditLoja(loja)}
                            className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteLoja(loja.id)}
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
          {isModalOpen && editLoja && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-[#2A4E73]">Editar Loja</h2>
                    <button
                      onClick={closeModal}
                      className="text-[#2A4E73] hover:text-[#AD343E] text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={handleEditLoja} className="space-y-4">
                    <div>
                      <label htmlFor="edit-id" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        ID
                      </label>
                      <input
                        type="text"
                        id="edit-id"
                        value={editLoja.id}
                        disabled
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] bg-gray-100 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-nome" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Nome da Loja
                      </label>
                      <input
                        type="text"
                        id="edit-nome"
                        value={editLoja.nome}
                        onChange={(e) => setEditLoja({ ...editLoja, nome: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: Loja Centro"
                      />
                      {errors.nome && <p className="text-[#AD343E] text-sm mt-1">{errors.nome}</p>}
                    </div>
                    <div>
                      <label htmlFor="edit-tipo" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Tipo
                      </label>
                      <select
                        id="edit-tipo"
                        value={editLoja.tipo}
                        onChange={(e) => setEditLoja({ ...editLoja, tipo: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      >
                        <option value="Filial">Filial</option>
                        <option value="Matriz">Matriz</option>
                      </select>
                      {errors.tipo && <p className="text-[#AD343E] text-sm mt-1">{errors.tipo}</p>}
                    </div>
                    <div>
                      <label htmlFor="edit-endereco" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Endereço
                      </label>
                      <input
                        type="text"
                        id="edit-endereco"
                        value={editLoja.endereco}
                        onChange={(e) => setEditLoja({ ...editLoja, endereco: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: Rua Principal, 123"
                      />
                      {errors.endereco && <p className="text-[#AD343E] text-sm mt-1">{errors.endereco}</p>}
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