"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Header from '@/components/Headerfilial/page';
import Footer from '@/components/Footer/page';
import { apiJson, apiFormData } from '@/lib/api';

export default function Funcionarios() {
  const router = useRouter();
  const [funcionarios, setFuncionarios] = useState([]);
  const [currentFilialId, setCurrentFilialId] = useState(null);
  const [lojaNome, setLojaNome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    idade: '',
    cargo: '',
    salario: '',
    loja_id: '',
    ativo: true,
  });
  const [editFuncionario, setEditFuncionario] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [previewImagem, setPreviewImagem] = useState(null);
  const [uploadingImagem, setUploadingImagem] = useState(false);
  const allowedCargos = ['admin', 'gerente', 'caixa'];

  useEffect(() => {
    const initializeLoja = async () => {
      try {
        const auth = await apiJson('/auth/check-auth');
        const lojaId = Number(auth?.user?.loja_id);
        if (!lojaId) {
          throw new Error('Loja do usuário não encontrada');
        }
        setCurrentFilialId(lojaId);
        setNovoFuncionario(prev => ({ ...prev, loja_id: lojaId }));
        await fetchFuncionarios();
        await fetchLojaNome(lojaId);
      } catch (error) {
        console.error('Error initializing loja:', error);
        showAlert('error', `Erro ao validar loja: ${error.message}`);
        setLoading(false);
      }
    };
    initializeLoja();
  }, []);

  const fetchLojaNome = async (lojaId) => {
    try {
      const data = await apiJson('/lojas');
      const loja = (data.lojas || data || []).find((l) => l.id === lojaId);
      if (loja) {
        setLojaNome(loja.nome);
      }
    } catch (error) {
      console.error('Error fetching loja nome:', error);
    }
  };

  const fetchFuncionarios = async () => {
    try {
      setLoading(true);
      const data = await apiJson('/funcionarios');
      setFuncionarios(data.funcionarios || []);
    } catch (error) {
      console.error('Error fetching funcionarios:', error);
      showAlert('error', `Erro ao carregar funcionários: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const validateForm = (funcionario) => {
    const newErrors = {};

    if (!funcionario.nome?.trim()) {
      newErrors.nome = 'O nome do funcionário é obrigatório';
    }

    if (!funcionario.cpf?.trim()) {
      newErrors.cpf = 'O CPF é obrigatório';
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(funcionario.cpf)) {
      newErrors.cpf = 'CPF inválido. Use o formato 000.000.000-00';
    }

    if (funcionario.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(funcionario.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if (!funcionario.telefone?.trim()) {
      newErrors.telefone = 'O telefone é obrigatório';
    } else if (!/^\d{10,11}$/.test(funcionario.telefone.replace(/\D/g, ''))) {
      newErrors.telefone = 'Telefone deve conter DDD + número (10 ou 11 dígitos)';
    }

    if (!funcionario.idade || parseInt(funcionario.idade) <= 0) {
      newErrors.idade = 'A idade deve ser um número positivo';
    }

    if (!funcionario.cargo?.trim()) {
      newErrors.cargo = 'O cargo é obrigatório';
    } else if (!allowedCargos.includes(funcionario.cargo.toLowerCase())) {
      newErrors.cargo = 'Cargo inválido. Use: admin, gerente ou caixa';
    }

    if (!funcionario.salario || parseFloat(funcionario.salario) <= 0) {
      newErrors.salario = 'O salário deve ser um número positivo';
    }

    if (!funcionario.loja_id || parseInt(funcionario.loja_id) !== currentFilialId) {
      newErrors.loja_id = `Funcionário deve pertencer à ${lojaNome || `loja ID ${currentFilialId}`}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagemSelecionada(file);
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

      const response = await apiFormData('/funcionarios/upload-imagem', formData);
      return response.imagem_url;
    } catch (error) {
      showAlert('error', `Erro ao fazer upload da imagem: ${error.message}`);
      return null;
    } finally {
      setUploadingImagem(false);
    }
  };

  const handleAddFuncionario = async (e) => {
    e.preventDefault();

    if (!currentFilialId) {
      showAlert('error', 'Loja não validada. Não é possível adicionar funcionários.');
      return;
    }

    if (!validateForm(novoFuncionario)) return;

    try {
      let imagemUrl = null;
      if (imagemSelecionada) {
        imagemUrl = await handleUploadImagem();
        if (!imagemUrl) return;
      }

      const funcionarioData = {
        ...novoFuncionario,
        idade: parseInt(novoFuncionario.idade),
        salario: parseFloat(novoFuncionario.salario),
        loja_id: parseInt(novoFuncionario.loja_id),
        telefone: novoFuncionario.telefone.replace(/\D/g, ''),
        imagem: imagemUrl || null,
      };

      await apiJson('/funcionarios', {
        method: 'POST',
        body: JSON.stringify(funcionarioData),
      });

      showAlert('success', `Funcionário "${novoFuncionario.nome}" cadastrado com sucesso!`);
      closeModal();
      await fetchFuncionarios();
    } catch (error) {
      console.error('Error adding funcionario:', error);
      showAlert('error', `Erro ao cadastrar funcionário: ${error.message}`);
    }
  };

  const handleEditFuncionario = async (e) => {
    e.preventDefault();

    if (!validateForm(editFuncionario)) return;

    try {
      const funcionarioData = {
        ...editFuncionario,
        idade: parseInt(editFuncionario.idade),
        salario: parseFloat(editFuncionario.salario),
        loja_id: parseInt(editFuncionario.loja_id),
        telefone: editFuncionario.telefone.replace(/\D/g, ''),
      };

      await apiJson(`/funcionarios/${editFuncionario.id}`, {
        method: 'PUT',
        body: JSON.stringify(funcionarioData),
      });

      showAlert('success', `Funcionário "${editFuncionario.nome}" atualizado com sucesso!`);
      closeModal();
      await fetchFuncionarios();
    } catch (error) {
      console.error('Error editing funcionario:', error);
      showAlert('error', `Erro ao editar funcionário: ${error.message}`);
    }
  };

  const openEditFuncionario = (funcionario) => {
    setEditFuncionario({
      ...funcionario,
      loja_id: funcionario.loja_id.toString(),
      telefone: funcionario.telefone || '',
    });
    setIsModalOpen(true);
    setErrors({});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsAddModalOpen(false);
    setEditFuncionario(null);
    setNovoFuncionario({
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
      idade: '',
      cargo: '',
      salario: '',
      loja_id: currentFilialId || '',
      ativo: true,
    });
    setImagemSelecionada(null);
    setPreviewImagem(null);
    setErrors({});
  };

  const handleDeleteFuncionario = async (id) => {
    const funcionarioToDelete = funcionarios.find((func) => func.id === id);

    if (!window.confirm(`Tem certeza que deseja excluir o funcionário "${funcionarioToDelete.nome}"?`)) {
      return;
    }

    try {
      await apiJson(`/funcionarios/${id}`, {
        method: 'DELETE',
      });

      showAlert('success', `Funcionário "${funcionarioToDelete.nome}" removido com sucesso!`);
      if (editFuncionario && editFuncionario.id === id) {
        closeModal();
      }
      await fetchFuncionarios();
    } catch (error) {
      console.error('Error deleting funcionario:', error);
      showAlert('error', `Erro ao excluir funcionário: ${error.message}`);
    }
  };

  const handleViewFuncionario = (funcionario) => {
    localStorage.setItem('funcionarioDetails', JSON.stringify(funcionario));
    router.push(`/filial/funcionarios/${funcionario.id}`);
  };

  const filteredFuncionarios = funcionarios
    .filter((func) => func.loja_id === currentFilialId)
    .filter((func) =>
      func.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (func.cpf || '').includes(searchTerm) ||
      (func.telefone || '').includes(searchTerm) ||
      (func.email && func.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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
          Gerenciamento de Funcionários
        </h1>
        <p className="text-sm text-[#2A4E73] mb-6 text-center max-w-2xl mx-auto">
          Gerencie os funcionários da sua filial. Adicione novos funcionários, edite informações existentes ou remova funcionários inativos.
        </p>

        {currentFilialId && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
              aria-label="Abrir formulário para adicionar novo funcionário"
            >
              Adicionar Funcionário
            </button>
          </div>
        )}

        <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-2 text-center">
            Lista de Funcionários - {lojaNome || `Loja ${currentFilialId || ''}`}
          </h2>

          <div className="mb-6">
            <label htmlFor="search-funcionario" className="block text-sm font-medium text-[#2A4E73] mb-2">
              Pesquisar Funcionário
            </label>
            <input
              type="text"
              id="search-funcionario"
              placeholder="Digite o nome, cargo, CPF, telefone ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base text-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#2A4E73]" />
            </div>
          ) : !currentFilialId ? (
            <p className="text-[#2A4E73] text-center py-8">Carregando informações da loja...</p>
          ) : filteredFuncionarios.length === 0 ? (
            <p className="text-[#2A4E73] text-center py-8">
              {searchTerm ? 'Nenhum funcionário encontrado com o termo de busca.' : 'Nenhum funcionário encontrado para esta loja.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base text-[#2A4E73] border-collapse">
                <thead>
                  <tr className="bg-[#2A4E73] text-[#FFFFFF]">
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left rounded-tl-md">ID</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Nome</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">CPF</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Cargo</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Telefone</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Email</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Status</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-center rounded-tr-md">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFuncionarios.map((func) => (
                    <tr
                      key={func.id}
                      className="border-b border-gray-200 hover:bg-[#CFE8F9] cursor-pointer"
                      onClick={() => handleViewFuncionario(func)}
                    >
                      <td className="px-3 sm:px-4 py-2 sm:py-3">{func.id}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 truncate max-w-[150px] sm:max-w-[200px]">
                        {func.nome}
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3">{func.cpf || 'N/A'}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3">{func.cargo}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3">{func.telefone || 'N/A'}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 truncate max-w-[150px] sm:max-w-[200px]">
                        {func.email || '-'}
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            func.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {func.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-center space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openEditFuncionario(func)}
                          className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                          aria-label={`Editar funcionário ${func.nome}`}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteFuncionario(func.id)}
                          className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                          aria-label={`Excluir funcionário ${func.nome}`}
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

        {/* Modal Adicionar/Editar Funcionário */}
        {(isAddModalOpen || isModalOpen) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-labelledby={isAddModalOpen ? "add-funcionario-title" : "edit-funcionario-title"} aria-modal="true">
            <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 id={isAddModalOpen ? "add-funcionario-title" : "edit-funcionario-title"} className="text-lg font-semibold text-[#2A4E73]">
                    {isAddModalOpen ? 'Adicionar Funcionário' : 'Editar Funcionário'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-[#2A4E73] hover:text-[#AD343E] text-2xl font-bold"
                    aria-label="Fechar modal"
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={isAddModalOpen ? handleAddFuncionario : handleEditFuncionario} className="space-y-3">
                  <div>
                    <label htmlFor={isAddModalOpen ? "add-nome" : "edit-nome"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Nome do Funcionário *
                    </label>
                    <input
                      id={isAddModalOpen ? "add-nome" : "edit-nome"}
                      type="text"
                      value={isAddModalOpen ? novoFuncionario.nome : editFuncionario?.nome || ''}
                      onChange={(e) => isAddModalOpen
                        ? setNovoFuncionario({ ...novoFuncionario, nome: e.target.value })
                        : setEditFuncionario({ ...editFuncionario, nome: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="Ex.: Robert Lox"
                    />
                    {errors.nome && (
                      <p className="text-[#AD343E] text-xs mt-1">{errors.nome}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={isAddModalOpen ? "add-cpf" : "edit-cpf"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                      CPF *
                    </label>
                    <input
                      id={isAddModalOpen ? "add-cpf" : "edit-cpf"}
                      type="text"
                      value={isAddModalOpen ? novoFuncionario.cpf : editFuncionario?.cpf || ''}
                      onChange={(e) => {
                        const formattedCPF = formatCPF(e.target.value);
                        if (isAddModalOpen) {
                          setNovoFuncionario({ ...novoFuncionario, cpf: formattedCPF });
                        } else {
                          setEditFuncionario({ ...editFuncionario, cpf: formattedCPF });
                        }
                      }}
                      maxLength={14}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="000.000.000-00"
                    />
                    {errors.cpf && (
                      <p className="text-[#AD343E] text-xs mt-1">{errors.cpf}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={isAddModalOpen ? "add-email" : "edit-email"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Email (opcional)
                    </label>
                    <input
                      id={isAddModalOpen ? "add-email" : "edit-email"}
                      type="email"
                      value={isAddModalOpen ? novoFuncionario.email : editFuncionario?.email || ''}
                      onChange={(e) => isAddModalOpen
                        ? setNovoFuncionario({ ...novoFuncionario, email: e.target.value })
                        : setEditFuncionario({ ...editFuncionario, email: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="Ex.: rob.lox@game.com"
                    />
                    {errors.email && (
                      <p className="text-[#AD343E] text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={isAddModalOpen ? "add-telefone" : "edit-telefone"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Telefone *
                    </label>
                    <input
                      id={isAddModalOpen ? "add-telefone" : "edit-telefone"}
                      type="text"
                      value={isAddModalOpen ? novoFuncionario.telefone : editFuncionario?.telefone || ''}
                      onChange={(e) => {
                        const numbers = e.target.value.replace(/\D/g, '');
                        if (isAddModalOpen) {
                          setNovoFuncionario({ ...novoFuncionario, telefone: numbers });
                        } else {
                          setEditFuncionario({ ...editFuncionario, telefone: numbers });
                        }
                      }}
                      maxLength={11}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="11987654321"
                    />
                    {errors.telefone && (
                      <p className="text-[#AD343E] text-xs mt-1">{errors.telefone}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={isAddModalOpen ? "add-idade" : "edit-idade"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Idade *
                    </label>
                    <input
                      id={isAddModalOpen ? "add-idade" : "edit-idade"}
                      type="number"
                      value={isAddModalOpen ? novoFuncionario.idade : editFuncionario?.idade || ''}
                      onChange={(e) => isAddModalOpen
                        ? setNovoFuncionario({ ...novoFuncionario, idade: e.target.value })
                        : setEditFuncionario({ ...editFuncionario, idade: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="Ex.: 67"
                      min="1"
                    />
                    {errors.idade && (
                      <p className="text-[#AD343E] text-xs mt-1">{errors.idade}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={isAddModalOpen ? "add-cargo" : "edit-cargo"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Cargo *
                    </label>
                    <select
                      id={isAddModalOpen ? "add-cargo" : "edit-cargo"}
                      value={(isAddModalOpen ? novoFuncionario.cargo : editFuncionario?.cargo || '').toLowerCase()}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (isAddModalOpen) {
                          setNovoFuncionario({ ...novoFuncionario, cargo: val });
                        } else {
                          setEditFuncionario({ ...editFuncionario, cargo: val });
                        }
                      }}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                    >
                      <option value="">Selecione</option>
                      <option value="admin">admin</option>
                      <option value="gerente">gerente</option>
                      <option value="caixa">caixa</option>
                    </select>
                    {errors.cargo && (
                      <p className="text-[#AD343E] text-xs mt-1">{errors.cargo}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={isAddModalOpen ? "add-salario" : "edit-salario"} className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Salário (R$) *
                    </label>
                    <input
                      id={isAddModalOpen ? "add-salario" : "edit-salario"}
                      type="number"
                      step="0.01"
                      value={isAddModalOpen ? novoFuncionario.salario : editFuncionario?.salario || ''}
                      onChange={(e) => isAddModalOpen
                        ? setNovoFuncionario({ ...novoFuncionario, salario: e.target.value })
                        : setEditFuncionario({ ...editFuncionario, salario: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="Ex.: 6900.67"
                      min="0"
                    />
                    {errors.salario && (
                      <p className="text-[#AD343E] text-xs mt-1">{errors.salario}</p>
                    )}
                  </div>

                  {isAddModalOpen && (
                    <div>
                      <label htmlFor="add-imagem" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Foto do Funcionário
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
                    <div>
                      <label className="flex items-center text-sm font-medium text-[#2A4E73]">
                        <input
                          type="checkbox"
                          checked={editFuncionario?.ativo || false}
                          onChange={(e) => setEditFuncionario({ ...editFuncionario, ativo: e.target.checked })}
                          className="mr-2 h-4 w-4 text-[#2A4E73] focus:ring-[#CFE8F9]"
                          aria-label="Funcionário ativo"
                        />
                        Funcionário Ativo
                      </label>
                    </div>
                  )}

                  <div className="flex gap-3 pt-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-1.5 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      disabled={loading || uploadingImagem}
                    >
                      {loading || uploadingImagem ? (
                        <Loader2 className="h-4 w-4 animate-spin inline-block" />
                      ) : (
                        isAddModalOpen ? 'Adicionar' : 'Salvar'
                      )}
                    </button>
                    <button
                      type="button"
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
