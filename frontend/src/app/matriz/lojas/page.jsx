"use client";

import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';
import { apiJson } from '@/lib/api';

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

  // Estados específicos para validação do CEP
  const [cepLoading, setCepLoading] = useState(false);
  const [cepValido, setCepValido] = useState(null); // null = não verificado, true = válido, false = inválido
  const [enderecoEncontrado, setEnderecoEncontrado] = useState(null);

  useEffect(() => {
    fetchLojas();
  }, []);

  const fetchLojas = async () => {
    try {
      setLoading(true);
      const data = await apiJson('/lojas');
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

  // Função para verificar se o CEP é real usando ViaCEP
  const verificarCEP = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
      setCepValido(null);
      setEnderecoEncontrado(null);
      return;
    }

    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro || !data.cep) {
        setCepValido(false);
        setEnderecoEncontrado(null);
        setErrors(prev => ({ ...prev, CEP: 'CEP não encontrado. Verifique o número digitado.' }));
      } else {
        setCepValido(true);
        setEnderecoEncontrado(data);
        setErrors(prev => {
          const { CEP, ...resto } = prev;
          return resto;
        });
      }
    } catch (error) {
      setCepValido(false);
      setErrors(prev => ({ ...prev, CEP: 'Erro ao verificar o CEP. Tente novamente.' }));
    } finally {
      setCepLoading(false);
    }
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
    } else if (loja.CEP.length === 9 && cepValido === false) {
      newErrors.CEP = 'Este CEP não existe. Por favor, insira um CEP válido.';
    } else if (loja.CEP.length === 9 && cepValido === null) {
      newErrors.CEP = 'Aguarde a verificação do CEP...';
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

      await apiJson('/lojas', {
        method: 'POST',
        body: JSON.stringify(lojaData),
      });

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
      setCepValido(null);
      setEnderecoEncontrado(null);
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

      await apiJson(`/lojas/${editLoja.id}`, {
        method: 'PUT',
        body: JSON.stringify(lojaData),
      });

      showAlert('success', `Loja "${editLoja.nome}" editada com sucesso!`);
      setIsModalOpen(false);
      setEditLoja(null);
      setErrors({});
      setCepValido(null);
      setEnderecoEncontrado(null);
      await fetchLojas();
    } catch (error) {
      showAlert('error', `Erro ao editar loja: ${error.message}`);
    }
  };

  const openEditLoja = (loja) => {
    setEditLoja({ ...loja });
    setIsModalOpen(true);
    setErrors({});
    setCepValido(null);
    setEnderecoEncontrado(null);
    // Se já tiver CEP salvo, verifica automaticamente ao abrir o modal de edição
    if (loja.CEP && loja.CEP.length === 9) {
      verificarCEP(loja.CEP);
    }
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
    setCepValido(null);
    setEnderecoEncontrado(null);
  };

  const handleDeleteLoja = async (id) => {
    const lojaToDelete = lojas.find((loja) => loja.id === id);
    
    if (!window.confirm(`Tem certeza que deseja excluir a loja "${lojaToDelete.nome}"?`)) {
      return;
    }

    try {
      await apiJson(`/lojas/${id}`, { method: 'DELETE' });
      showAlert('success', `Loja "${lojaToDelete.nome}" excluída com sucesso!`);
      if (editLoja && editLoja.id === id) closeModal();
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
          >
            Adicionar Nova Loja
          </button>
        </div>

        {/* Lista de Lojas */}
        <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-2 text-center">
            Lista de Lojas
          </h2>
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
                      <td className="px-3 sm:px-4 py-2 sm:py-3 truncate max-w-[150px] sm:max-w-[200px]">{loja.nome}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 capitalize">{loja.tipo}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3">{loja.CEP}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3">{loja.numero}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${loja.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {loja.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-center space-x-2">
                        <button onClick={() => openEditLoja(loja)} className="px-3 py-1 text-sm bg-[#2A4E73] text-white rounded hover:bg-[#AD343E]">
                          Editar
                        </button>
                        <button onClick={() => handleDeleteLoja(loja.id)} className="px-3 py-1 text-sm bg-[#AD343E] text-white rounded hover:bg-[#2A4E73]">
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

        {/* Modal de Adicionar ou Editar */}
        {(isAddModalOpen || isModalOpen) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-[#2A4E73]">
                    {isAddModalOpen ? 'Adicionar Nova Loja' : 'Editar Loja'}
                  </h2>
                  <button onClick={closeModal} className="text-3xl text-[#2A4E73] hover:text-[#AD343E]">×</button>
                </div>

                <form onSubmit={isAddModalOpen ? handleAddLoja : handleEditLoja} className="space-y-4">
                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Nome da Loja *</label>
                    <input
                      type="text"
                      value={isAddModalOpen ? novaLoja.nome : editLoja?.nome || ''}
                      onChange={(e) => isAddModalOpen 
                        ? setNovaLoja({ ...novaLoja, nome: e.target.value })
                        : setEditLoja({ ...editLoja, nome: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#CFE8F9] focus:outline-none"
                      placeholder="Ex.: Loja Centro"
                    />
                    {errors.nome && <p className="text-red-600 text-xs mt-1">{errors.nome}</p>}
                  </div>

                  {/* Tipo */}
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">Tipo *</label>
                    <select
                      value={isAddModalOpen ? novaLoja.tipo : editLoja?.tipo || 'filial'}
                      onChange={(e) => isAddModalOpen 
                        ? setNovaLoja({ ...novaLoja, tipo: e.target.value })
                        : setEditLoja({ ...editLoja, tipo: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#CFE8F9]"
                    >
                      <option value="filial">Filial</option>
                      <option value="matriz">Matriz</option>
                    </select>
                    {errors.tipo && <p className="text-red-600 text-xs mt-1">{errors.tipo}</p>}
                  </div>

                  {/* CEP com validação em tempo real */}
                  <div>
                    <label className="block text-sm font-medium text-[#2A4E73] mb-1">
                      CEP * <span className="text-xs text-gray-500">(verificado automaticamente)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={9}
                        value={isAddModalOpen ? novaLoja.CEP : editLoja?.CEP || ''}
                        onChange={(e) => {
                          const formatted = formatCEP(e.target.value);
                          if (isAddModalOpen) {
                            setNovaLoja({ ...novaLoja, CEP: formatted });
                          } else {
                            setEditLoja({ ...editLoja, CEP: formatted });
                          }
                          setErrors(prev => ({ ...prev, CEP: undefined }));
                          setCepValido(null);
                          setEnderecoEncontrado(null);

                          if (formatted.length === 9) {
                            verificarCEP(formatted);
                          }
                        }}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#CFE8F9] focus:outline-none pr-10 ${
                          cepValido === true ? 'border-green-500' : 
                          cepValido === false ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="00000-000"
                      />
                      {cepLoading && <Loader2 className="absolute right-3 top-2.5 h-5 w-5 animate-spin text-[#2A4E73]" />}
                      {cepValido === true && !cepLoading && <CheckCircle className="absolute right-3 top-2.5 h-5 w-5 text-green-600" />}
                      {cepValido === false && !cepLoading && <XCircle className="absolute right-3 top-2.5 h-5 w-5 text-red-600" />}
                    </div>
                    {errors.CEP && <p className="text-red-600 text-xs mt-1 flex items-center gap-1"><XCircle className="h-4 w-4" /> {errors.CEP}</p>}
                    {cepValido === true && enderecoEncontrado && (
                      <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        CEP válido: {enderecoEncontrado.localidade && `${enderecoEncontrado.localidade}/${enderecoEncontrado.uf}`}
                      </p>
                    )}
                  </div>

                  {/* Número e Complemento */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2A4E73] mb-1">Número *</label>
                      <input
                        type="number"
                        min="1"
                        value={isAddModalOpen ? novaLoja.numero : editLoja?.numero || ''}
                        onChange={(e) => isAddModalOpen 
                          ? setNovaLoja({ ...novaLoja, numero: e.target.value })
                          : setEditLoja({ ...editLoja, numero: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#CFE8F9]"
                      />
                      {errors.numero && <p className="text-red-600 text-xs mt-1">{errors.numero}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2A4E73] mb-1">Complemento *</label>
                      <input
                        type="text"
                        value={isAddModalOpen ? novaLoja.complemento : editLoja?.complemento || ''}
                        onChange={(e) => isAddModalOpen 
                          ? setNovaLoja({ ...novaLoja, complemento: e.target.value })
                          : setEditLoja({ ...editLoja, complemento: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#CFE8F9]"
                        placeholder="Sala, bloco, etc."
                      />
                      {errors.complemento && <p className="text-red-600 text-xs mt-1">{errors.complemento}</p>}
                    </div>
                  </div>

                  {/* Status (apenas edição) */}
                  {isModalOpen && (
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={editLoja?.ativo ?? true}
                        onChange={(e) => setEditLoja({ ...editLoja, ativo: e.target.checked })}
                        className="h-4 w-4 text-[#2A4E73]"
                      />
                      <span>Loja Ativa</span>
                    </label>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading || cepLoading || cepValido === false}
                      className="flex-1 py-2 bg-[#2A4E73] text-white rounded-md hover:bg-[#1e3a5f] disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {loading || cepLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : (isAddModalOpen ? 'Adicionar' : 'Salvar')}
                    </button>
                    <button type="button" onClick={closeModal} className="flex-1 py-2 bg-[#AD343E] text-white rounded-md hover:bg-[#8f2a34] transition">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <Footer />
    </main>
  );
}