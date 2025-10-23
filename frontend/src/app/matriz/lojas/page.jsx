"use client";

import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function Lojas() {
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [novaLoja, setNovaLoja] = useState({ 
    nome: '', 
    tipo: 'filial', 
    CEP: '', 
    numero: '', 
    complemento: '',
    ativo: true 
  });
  const [editLoja, setEditLoja] = useState(null);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetchLojas();
  }, []);

  const fetchLojas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/lojas`);
      if (!response.ok) throw new Error('Erro ao buscar lojas');
      const data = await response.json();
      setLojas(data.lojas || []);
    } catch (error) {
      showAlert('error', `Erro ao carregar lojas: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000);
  };

  const validateForm = (loja, isEdit = false) => {
    const newErrors = {};
    
    if (!loja.nome?.trim()) {
      newErrors.nome = 'O nome da loja é obrigatório';
    }
    
    if (!loja.CEP?.trim()) {
      newErrors.CEP = 'O CEP é obrigatório';
    } else if (!/^\d{5}-?\d{3}$/.test(loja.CEP)) {
      newErrors.CEP = 'CEP inválido. Use o formato 00000-000';
    }
    
    if (!loja.numero || loja.numero <= 0) {
      newErrors.numero = 'O número é obrigatório e deve ser positivo';
    }
    
    if (!loja.complemento?.trim()) {
      newErrors.complemento = 'O complemento é obrigatório';
    }
    
    if (!isEdit && loja.tipo === 'matriz' && lojas.some((l) => l.tipo === 'matriz')) {
      newErrors.tipo = 'Já existe uma loja Matriz cadastrada';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddLoja = async (e) => {
    e.preventDefault();
    
    if (!validateForm(novaLoja)) return;

    try {
      const lojaData = {
        ...novaLoja,
        numero: parseInt(novaLoja.numero),
        tipo: novaLoja.tipo.toLowerCase()
      };

      const response = await fetch(`${API_URL}/lojas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lojaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensagem || 'Erro ao criar loja');
      }

      showAlert('success', `Loja "${novaLoja.nome}" cadastrada com sucesso!`);
      
      setNovaLoja({ 
        nome: '', 
        tipo: 'filial', 
        CEP: '', 
        numero: '', 
        complemento: '',
        ativo: true 
      });
      setErrors({});
      setIsAddModalOpen(false);
      await fetchLojas();
    } catch (error) {
      showAlert('error', `Erro ao cadastrar loja: ${error.message}`);
    }
  };

  const handleEditLoja = async (e) => {
    e.preventDefault();
    
    if (!validateForm(editLoja, true)) return;

    try {
      const lojaData = {
        ...editLoja,
        numero: parseInt(editLoja.numero),
        tipo: editLoja.tipo.toLowerCase()
      };

      const response = await fetch(`${API_URL}/lojas/${editLoja.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lojaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensagem || 'Erro ao atualizar loja');
      }

      showAlert('success', `Loja "${editLoja.nome}" editada com sucesso!`);
      setIsModalOpen(false);
      setEditLoja(null);
      setErrors({});
      await fetchLojas();
    } catch (error) {
      showAlert('error', `Erro ao editar loja: ${error.message}`);
    }
  };

  const openEditLoja = (loja) => {
    setEditLoja({ ...loja });
    setIsModalOpen(true);
    setErrors({});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsAddModalOpen(false);
    setEditLoja(null);
    setNovaLoja({ 
      nome: '', 
      tipo: 'filial', 
      CEP: '', 
      numero: '', 
      complemento: '', 
      ativo: true 
    });
    setErrors({});
  };

  const handleDeleteLoja = async (id) => {
    const lojaToDelete = lojas.find((loja) => loja.id === id);
    
    if (!window.confirm(`Tem certeza que deseja excluir a loja "${lojaToDelete.nome}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/lojas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensagem || 'Erro ao excluir loja');
      }

      showAlert('success', `Loja "${lojaToDelete.nome}" excluída com sucesso!`);
      
      if (editLoja && editLoja.id === id) {
        closeModal();
      }
      
      await fetchLojas();
    } catch (error) {
      showAlert('error', `Erro ao excluir loja: ${error.message}`);
    }
  };

  const formatCEP = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
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
          Gerenciamento de Lojas
        </h1>
        <p className="text-sm text-[#2A4E73] mb-6 text-center max-w-2xl mx-auto">
          Aqui você pode gerenciar todas as lojas da sua rede. Adicione novas lojas, edite informações existentes ou remova lojas inativas com facilidade.
        </p>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
            aria-label="Abrir formulário para adicionar nova loja"
          >
            Adicionar Nova Loja
          </button>
        </div>

        <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-2 text-center">
            Lista de Lojas
          </h2>
          <p className="text-sm text-[#2A4E73] mb-4 text-center">
            Visualize todas as lojas cadastradas, incluindo seus detalhes e status.
          </p>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#2A4E73]" />
            </div>
          ) : lojas.length === 0 ? (
            <p className="text-[#2A4E73] text-center py-8">Nenhuma loja cadastrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base text-[#2A4E73] border-collapse">
                <thead>
                  <tr className="bg-[#2A4E73] text-[#FFFFFF]">
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left rounded-tl-md">ID</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Nome</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Tipo</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">CEP</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Número</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Status</th>
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
                      <td className="px-3 sm:px-4 py-2 sm:py-3 capitalize">{loja.tipo}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3">{loja.CEP}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3">{loja.numero}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          loja.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {loja.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-center space-x-2">
                        <button
                          onClick={() => openEditLoja(loja)}
                          className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                          aria-label={`Editar loja ${loja.nome}`}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteLoja(loja.id)}
                          className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                          aria-label={`Excluir loja ${loja.nome}`}
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
            <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 id={isAddModalOpen ? "add-modal-title" : "edit-modal-title"} className="text-lg font-semibold text-[#2A4E73]">
                    {isAddModalOpen ? 'Adicionar Nova Loja' : 'Editar Loja'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-[#2A4E73] hover:text-[#AD343E] text-2xl font-bold"
                    aria-label="Fechar modal"
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={isAddModalOpen ? handleAddLoja : handleEditLoja} className="space-y-3">
                  <div>
                    <label htmlFor={isAddModalOpen ? "add-nome" : "edit-nome"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Nome da Loja *
                    </label>
                    <input
                      id={isAddModalOpen ? "add-nome" : "edit-nome"}
                      type="text"
                      value={isAddModalOpen ? novaLoja.nome : editLoja?.nome}
                      onChange={(e) => {
                        if (isAddModalOpen) {
                          setNovaLoja({ ...novaLoja, nome: e.target.value });
                        } else {
                          setEditLoja({ ...editLoja, nome: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="Ex.: Loja Centro"
                      aria-invalid={errors.nome ? 'true' : 'false'}
                      aria-describedby={errors.nome ? (isAddModalOpen ? 'add-nome-error' : 'edit-nome-error') : undefined}
                    />
                    {errors.nome && (
                      <p id={isAddModalOpen ? "add-nome-error" : "edit-nome-error"} className="text-[#AD343E] text-xs mt-1">{errors.nome}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={isAddModalOpen ? "add-tipo" : "edit-tipo"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Tipo *
                    </label>
                    <select
                      id={isAddModalOpen ? "add-tipo" : "edit-tipo"}
                      value={isAddModalOpen ? novaLoja.tipo : editLoja?.tipo}
                      onChange={(e) => {
                        if (isAddModalOpen) {
                          setNovaLoja({ ...novaLoja, tipo: e.target.value });
                        } else {
                          setEditLoja({ ...editLoja, tipo: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      aria-invalid={errors.tipo ? 'true' : 'false'}
                      aria-describedby={errors.tipo ? (isAddModalOpen ? 'add-tipo-error' : 'edit-tipo-error') : undefined}
                    >
                      <option value="filial">Filial</option>
                      <option value="matriz">Matriz</option>
                    </select>
                    {errors.tipo && (
                      <p id={isAddModalOpen ? "add-tipo-error" : "edit-tipo-error"} className="text-[#AD343E] text-xs mt-1">{errors.tipo}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={isAddModalOpen ? "add-cep" : "edit-cep"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                      CEP *
                    </label>
                    <input
                      id={isAddModalOpen ? "add-cep" : "edit-cep"}
                      type="text"
                      value={isAddModalOpen ? novaLoja.CEP : editLoja?.CEP}
                      onChange={(e) => {
                        const formattedCEP = formatCEP(e.target.value);
                        if (isAddModalOpen) {
                          setNovaLoja({ ...novaLoja, CEP: formattedCEP });
                        } else {
                          setEditLoja({ ...editLoja, CEP: formattedCEP });
                        }
                      }}
                      maxLength={9}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="00000-000"
                      aria-invalid={errors.CEP ? 'true' : 'false'}
                      aria-describedby={errors.CEP ? (isAddModalOpen ? 'add-cep-error' : 'edit-cep-error') : undefined}
                    />
                    {errors.CEP && (
                      <p id={isAddModalOpen ? "add-cep-error" : "edit-cep-error"} className="text-[#AD343E] text-xs mt-1">{errors.CEP}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={isAddModalOpen ? "add-numero" : "edit-numero"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Número *
                    </label>
                    <input
                      id={isAddModalOpen ? "add-numero" : "edit-numero"}
                      type="number"
                      value={isAddModalOpen ? novaLoja.numero : editLoja?.numero}
                      onChange={(e) => {
                        if (isAddModalOpen) {
                          setNovaLoja({ ...novaLoja, numero: e.target.value });
                        } else {
                          setEditLoja({ ...editLoja, numero: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="123"
                      min="1"
                      aria-invalid={errors.numero ? 'true' : 'false'}
                      aria-describedby={errors.numero ? (isAddModalOpen ? 'add-numero-error' : 'edit-numero-error') : undefined}
                    />
                    {errors.numero && (
                      <p id={isAddModalOpen ? "add-numero-error" : "edit-numero-error"} className="text-[#AD343E] text-xs mt-1">{errors.numero}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={isAddModalOpen ? "add-complemento" : "edit-complemento"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Complemento *
                    </label>
                    <input
                      id={isAddModalOpen ? "add-complemento" : "edit-complemento"}
                      type="text"
                      value={isAddModalOpen ? novaLoja.complemento : editLoja?.complemento}
                      onChange={(e) => {
                        if (isAddModalOpen) {
                          setNovaLoja({ ...novaLoja, complemento: e.target.value });
                        } else {
                          setEditLoja({ ...editLoja, complemento: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="Ex.: Sala 4 - Bloco B"
                      aria-invalid={errors.complemento ? 'true' : 'false'}
                      aria-describedby={errors.complemento ? (isAddModalOpen ? 'add-complemento-error' : 'edit-complemento-error') : undefined}
                    />
                    {errors.complemento && (
                      <p id={isAddModalOpen ? "add-complemento-error" : "edit-complemento-error"} className="text-[#AD343E] text-xs mt-1">{errors.complemento}</p>
                    )}
                  </div>

                  {isModalOpen && (
                    <div>
                      <label className="flex items-center text-sm font-medium text-[#2A4E73]">
                        <input
                          type="checkbox"
                          checked={editLoja?.ativo}
                          onChange={(e) => setEditLoja({ ...editLoja, ativo: e.target.checked })}
                          className="mr-2 h-4 w-4 text-[#2A4E73] focus:ring-[#CFE8F9]"
                          aria-label="Loja ativa"
                        />
                        Loja Ativa
                      </label>
                    </div>
                  )}

                  <div className="flex gap-3 pt-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-1.5 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      disabled={loading}
                      aria-label={isAddModalOpen ? "Adicionar loja" : "Salvar alterações"}
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
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
       <Footer />
    </main>
  );
}