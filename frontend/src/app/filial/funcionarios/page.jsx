
"use client";

import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, Plus } from 'lucide-react';
import Header from '@/components/Headerfilial/page';
import Footer from '@/components/Footer/page';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function Funcionarios() {
  const [lojas, setLojas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [currentFilialId, setCurrentFilialId] = useState(null);
  const [lojaNome, setLojaNome] = useState(null); // Nome da loja logada
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
    loja_id: 2,
    ativo: true,
  });
  const [editFuncionario, setEditFuncionario] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const allowedCargos = ['admin', 'gerente', 'caixa'];
  const [lojaError, setLojaError] = useState(null);

  // Simula login e valida loja ID 2
  useEffect(() => {
    const initializeLoja = async () => {
      try {
        const storedFilialId = localStorage.getItem('currentFilialId');
        if (storedFilialId === '2') {
          setCurrentFilialId(2);
          await fetchLojas();
          await fetchFuncionarios();
        } else {
          // Simula login forçando Loja ID 2
          const response = await fetch(`${API_URL}/lojas`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          const lojaSul = (data.lojas || []).find((loja) => loja.id === 2);
          if (!lojaSul) {
            throw new Error('Loja com ID 2 não encontrada no banco de dados');
          }
          setCurrentFilialId(2);
          setLojaNome(lojaSul.nome);
          localStorage.setItem('currentFilialId', '2');
          console.log(`Loja ID 2 validada: ${lojaSul.nome}`);
          await fetchLojas();
          await fetchFuncionarios();
        }
      } catch (error) {
        console.error('Error initializing loja:', error);
        setLojaError(`Erro ao validar loja: ${error.message}. Não é possível gerenciar funcionários.`);
        setLoading(false);
      }
    };
    initializeLoja();
  }, []);

  const fetchLojas = async () => {
    try {
      const response = await fetch(`${API_URL}/lojas`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log('Lojas fetched:', data);
      setLojas(data.lojas || []);
      const lojaSul = (data.lojas || []).find((loja) => loja.id === 2);
      if (lojaSul) {
        setLojaNome(lojaSul.nome);
        console.log('Nome da loja ID 2:', lojaSul.nome);
      } else {
        setLojaError('Loja com ID 2 não encontrada no banco de dados');
      }
    } catch (error) {
      console.error('Error fetching lojas:', error);
      setLojaError(`Erro ao carregar lojas: ${error.message}. Usando nome padrão.`);
    }
  };

  const fetchFuncionarios = async () => {
    try {
      const response = await fetch(`${API_URL}/funcionarios`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log('Funcionarios fetched:', data);
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
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
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
      newErrors.telefone = 'Telefone deve conter DDD + número (10 ou 11 dígitos, ex.: (11) 98765-4321)';
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

    if (!funcionario.loja_id || parseInt(funcionario.loja_id) !== 2) {
      newErrors.loja_id = `Funcionário deve pertencer à ${lojaNome || 'loja ID 2'}`;
    }

    setErrors(newErrors);
    console.log('Validation errors:', newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const formatTelefone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleTelefoneChange = (e, setFuncionario) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    setFuncionario((prev) => ({ ...prev, telefone: formatTelefone(value) }));
  };

  const handleAddFuncionario = async (e) => {
    e.preventDefault();

    if (!currentFilialId || !lojaNome) {
      showAlert('error', `Loja ${lojaNome || 'ID 2'} não validada. Não é possível adicionar funcionários.`);
      return;
    }

    if (!validateForm(novoFuncionario)) {
      console.log('Validation failed:', errors);
      return;
    }

    try {
      const funcionarioData = {
        ...novoFuncionario,
        idade: parseInt(novoFuncionario.idade),
        salario: parseFloat(novoFuncionario.salario),
        loja_id: 2,
        telefone: novoFuncionario.telefone.replace(/\D/g, ''),
      };

      console.log('Sending funcionarioData:', JSON.stringify(funcionarioData, null, 2));

      const response = await fetch(`${API_URL}/funcionarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(funcionarioData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('POST response error:', errorText);
        const errorData = JSON.parse(errorText || '{}');
        throw new Error(errorData.mensagem || `Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('POST success:', data);

      showAlert('success', `Funcionário "${novoFuncionario.nome}" cadastrado com sucesso!`);
      setNovoFuncionario({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        idade: '',
        cargo: '',
        salario: '',
        loja_id: 2,
        ativo: true,
      });
      setErrors({});
      setIsAddModalOpen(false);
      await fetchFuncionarios();
    } catch (error) {
      console.error('Error adding funcionario:', error);
      showAlert('error', `Erro ao cadastrar funcionário: ${error.message}`);
    }
  };

  const handleEditFuncionario = async (e) => {
    e.preventDefault();

    if (!currentFilialId || !lojaNome) {
      showAlert('error', `Loja ${lojaNome || 'ID 2'} não validada. Não é possível editar funcionários.`);
      return;
    }

    if (!validateForm(editFuncionario)) {
      console.log('Validation failed:', errors);
      return;
    }

    try {
      const funcionarioData = {
        ...editFuncionario,
        idade: parseInt(editFuncionario.idade),
        salario: parseFloat(editFuncionario.salario),
        loja_id: 2,
        telefone: editFuncionario.telefone.replace(/\D/g, ''),
      };

      console.log('Updating funcionarioData:', JSON.stringify(funcionarioData, null, 2));

      const response = await fetch(`${API_URL}/funcionarios/${editFuncionario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(funcionarioData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('PUT response error:', errorText);
        const errorData = JSON.parse(errorText || '{}');
        throw new Error(errorData.mensagem || `Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('PUT success:', data);

      showAlert('success', `Funcionário "${editFuncionario.nome}" atualizado com sucesso!`);
      setIsEditModalOpen(false);
      setEditFuncionario(null);
      setErrors({});
      await fetchFuncionarios();
    } catch (error) {
      console.error('Error editing funcionario:', error);
      showAlert('error', `Erro ao editar funcionário: ${error.message}`);
    }
  };

  const openEditFuncionario = (funcionario) => {
    if (!currentFilialId || !lojaNome) {
      showAlert('error', `Loja ${lojaNome || 'ID 2'} não validada. Não é possível editar funcionários.`);
      return;
    }
    setEditFuncionario({
      ...funcionario,
      loja_id: '2',
      telefone: funcionario.telefone ? formatTelefone(funcionario.telefone) : '',
    });
    setIsEditModalOpen(true);
    setErrors({});
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNovoFuncionario({
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
      idade: '',
      cargo: '',
      salario: '',
      loja_id: 2,
      ativo: true,
    });
    setErrors({});
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditFuncionario(null);
    setErrors({});
  };

  const handleDeleteFuncionario = async (id) => {
    if (!currentFilialId || !lojaNome) {
      showAlert('error', `Loja ${lojaNome || 'ID 2'} não validada. Não é possível excluir funcionários.`);
      return;
    }

    const funcionarioToDelete = funcionarios.find((func) => func.id === id);

    if (!window.confirm(`Tem certeza que deseja excluir o funcionário "${funcionarioToDelete.nome}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/funcionarios/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DELETE response error:', errorText);
        const errorData = JSON.parse(errorText || '{}');
        throw new Error(errorData.mensagem || `Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('DELETE success:', data);

      showAlert('success', `Funcionário "${funcionarioToDelete.nome}" removido com sucesso!`);
      if (editFuncionario && editFuncionario.id === id) {
        closeEditModal();
      }
      await fetchFuncionarios();
    } catch (error) {
      console.error('Error deleting funcionario:', error);
      showAlert('error', `Erro ao excluir funcionário: ${error.message}`);
    }
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
    <main className="min-h-screen bg-[#FFFFFF] flex flex-col">
      <br></br>
      <br></br>
      <br></br>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 flex-grow">
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

        {lojaError && (
          <div className="mb-6">
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{lojaError}</AlertDescription>
            </Alert>
          </div>
        )}

       <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-4 text-center">
          Gerenciamento de Funcionários
        </h1>
        <p className="text-sm text-[#2A4E73] mb-6 text-center max-w-2xl mx-auto">
          Aqui você pode gerenciar todos os funcionários da sua rede. Adicione novos funcionários, edite informações existentes ou remova funcionários inativos com facilidade.
        </p>

        {currentFilialId && lojaNome && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="fixed bottom-6 right-6 sm:static sm:bottom-auto sm:right-auto p-4 sm:p-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-full sm:rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors flex items-center gap-2"
              aria-label="Adicionar novo funcionário"
              disabled={lojaError}
            >
              <Plus className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Adicionar Funcionário</span>
            </button>
          </div>
        )}

        <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
            Funcionários - {lojaNome || 'Loja Sul'}
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
              disabled={lojaError}
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#2A4E73]" />
            </div>
          ) : lojaError ? (
            <p className="text-[#2A4E73] text-center py-8">
              Não é possível exibir funcionários devido a erro na validação da loja.
            </p>
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
                    <tr key={func.id} className="border-b border-gray-200 hover:bg-[#CFE8F9]">
                      <td className="px-3 sm:px-4 py-2 sm:py-3">{func.id}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 truncate max-w-[150px] sm:max-w-[200px]">
                        {func.nome}
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3">{func.cpf || 'N/A'}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3">{func.cargo}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3">
                        {func.telefone ? formatTelefone(func.telefone) : 'N/A'}
                      </td>
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
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-center space-x-2">
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

        {/* Modal para Adicionar Funcionário */}
        {isAddModalOpen && currentFilialId && lojaNome && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-labelledby="add-modal-title"
            aria-modal="true"
          >
            <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-lg w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 id="add-modal-title" className="text-xl font-semibold text-[#2A4E73]">
                    Adicionar Funcionário
                  </h2>
                  <button
                    onClick={closeAddModal}
                    className="text-[#2A4E73] hover:text-[#AD343E] text-2xl font-bold"
                    aria-label="Fechar modal"
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleAddFuncionario} className="space-y-4">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Nome do Funcionário *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      value={novoFuncionario.nome}
                      onChange={(e) => setNovoFuncionario({ ...novoFuncionario, nome: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="Ex.: Robert Lox"
                      aria-invalid={!!errors.nome}
                      aria-describedby={errors.nome ? 'nome-error' : undefined}
                    />
                    {errors.nome && (
                      <p id="nome-error" className="text-[#AD343E] text-sm mt-1">{errors.nome}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="cpf" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      CPF *
                    </label>
                    <input
                      type="text"
                      id="cpf"
                      value={novoFuncionario.cpf}
                      onChange={(e) => setNovoFuncionario({ ...novoFuncionario, cpf: formatCPF(e.target.value) })}
                      maxLength={14}
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="000.000.000-00"
                      aria-invalid={!!errors.cpf}
                      aria-describedby={errors.cpf ? 'cpf-error' : undefined}
                    />
                    {errors.cpf && (
                      <p id="cpf-error" className="text-[#AD343E] text-sm mt-1">{errors.cpf}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Email (opcional)
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={novoFuncionario.email}
                      onChange={(e) => setNovoFuncionario({ ...novoFuncionario, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="Ex.: rob.lox@game.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="text-[#AD343E] text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Telefone *
                    </label>
                    <input
                      type="text"
                      id="telefone"
                      value={novoFuncionario.telefone}
                      onChange={(e) => handleTelefoneChange(e, setNovoFuncionario)}
                      maxLength={15}
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="(11) 98765-4321"
                      aria-invalid={!!errors.telefone}
                      aria-describedby={errors.telefone ? 'telefone-error' : undefined}
                    />
                    {errors.telefone && (
                      <p id="telefone-error" className="text-[#AD343E] text-sm mt-1">{errors.telefone}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="idade" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Idade *
                    </label>
                    <input
                      type="number"
                      id="idade"
                      value={novoFuncionario.idade}
                      onChange={(e) => setNovoFuncionario({ ...novoFuncionario, idade: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="Ex.: 67"
                      min="1"
                      aria-invalid={!!errors.idade}
                      aria-describedby={errors.idade ? 'idade-error' : undefined}
                    />
                    {errors.idade && (
                      <p id="idade-error" className="text-[#AD343E] text-sm mt-1">{errors.idade}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="cargo" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Cargo *
                    </label>
                    <select
                      id="cargo"
                      value={(novoFuncionario.cargo || '').toLowerCase()}
                      onChange={(e) => setNovoFuncionario({ ...novoFuncionario, cargo: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      aria-invalid={!!errors.cargo}
                      aria-describedby={errors.cargo ? 'cargo-error' : undefined}
                    >
                      <option value="">Selecione</option>
                      <option value="admin">admin</option>
                      <option value="gerente">gerente</option>
                      <option value="caixa">caixa</option>
                    </select>
                    {errors.cargo && (
                      <p id="cargo-error" className="text-[#AD343E] text-sm mt-1">{errors.cargo}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="salario" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Salário (R$) *
                    </label>
                    <input
                      type="number"
                      id="salario"
                      step="0.01"
                      value={novoFuncionario.salario}
                      onChange={(e) => setNovoFuncionario({ ...novoFuncionario, salario: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="Ex.: 6900.67"
                      min="0"
                      aria-invalid={!!errors.salario}
                      aria-describedby={errors.salario ? 'salario-error' : undefined}
                    />
                    {errors.salario && (
                      <p id="salario-error" className="text-[#AD343E] text-sm mt-1">{errors.salario}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="loja_id" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Loja *
                    </label>
                    <select
                      id="loja_id"
                      value={novoFuncionario.loja_id}
                      disabled
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      aria-invalid={!!errors.loja_id}
                      aria-describedby={errors.loja_id ? 'loja_id-error' : undefined}
                    >
                      <option value="2">{lojaNome || 'Loja Sul'} (Filial)</option>
                    </select>
                    {errors.loja_id && (
                      <p id="loja_id-error" className="text-[#AD343E] text-sm mt-1">{errors.loja_id}</p>
                    )}
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin inline-block" /> : 'Adicionar'}
                    </button>
                    <button
                      type="button"
                      onClick={closeAddModal}
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

        {/* Modal para Editar Funcionário */}
        {isEditModalOpen && editFuncionario && currentFilialId && lojaNome && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-labelledby="edit-modal-title"
            aria-modal="true"
          >
            <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-lg w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 id="edit-modal-title" className="text-xl font-semibold text-[#2A4E73]">
                    Editar Funcionário
                  </h2>
                  <button
                    onClick={closeEditModal}
                    className="text-[#2A4E73] hover:text-[#AD343E] text-2xl font-bold"
                    aria-label="Fechar modal"
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
                      Nome do Funcionário *
                    </label>
                    <input
                      type="text"
                      id="edit-nome"
                      value={editFuncionario.nome}
                      onChange={(e) => setEditFuncionario({ ...editFuncionario, nome: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="Ex.: Robert Lox"
                      aria-invalid={!!errors.nome}
                      aria-describedby={errors.nome ? 'edit-nome-error' : undefined}
                    />
                    {errors.nome && (
                      <p id="edit-nome-error" className="text-[#AD343E] text-sm mt-1">{errors.nome}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="edit-cpf" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      CPF *
                    </label>
                    <input
                      type="text"
                      id="edit-cpf"
                      value={editFuncionario.cpf}
                      onChange={(e) => setEditFuncionario({ ...editFuncionario, cpf: formatCPF(e.target.value) })}
                      maxLength={14}
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="000.000.000-00"
                      aria-invalid={!!errors.cpf}
                      aria-describedby={errors.cpf ? 'edit-cpf-error' : undefined}
                    />
                    {errors.cpf && (
                      <p id="edit-cpf-error" className="text-[#AD343E] text-sm mt-1">{errors.cpf}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="edit-email" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Email (opcional)
                    </label>
                    <input
                      type="email"
                      id="edit-email"
                      value={editFuncionario.email || ''}
                      onChange={(e) => setEditFuncionario({ ...editFuncionario, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="Ex.: rob.lox@game.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'edit-email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="edit-email-error" className="text-[#AD343E] text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="edit-telefone" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Telefone *
                    </label>
                    <input
                      type="text"
                      id="edit-telefone"
                      value={editFuncionario.telefone}
                      onChange={(e) => handleTelefoneChange(e, setEditFuncionario)}
                      maxLength={15}
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="(11) 98765-4321"
                      aria-invalid={!!errors.telefone}
                      aria-describedby={errors.telefone ? 'edit-telefone-error' : undefined}
                    />
                    {errors.telefone && (
                      <p id="edit-telefone-error" className="text-[#AD343E] text-sm mt-1">{errors.telefone}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="edit-idade" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Idade *
                    </label>
                    <input
                      type="number"
                      id="edit-idade"
                      value={editFuncionario.idade}
                      onChange={(e) => setEditFuncionario({ ...editFuncionario, idade: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="Ex.: 67"
                      min="1"
                      aria-invalid={!!errors.idade}
                      aria-describedby={errors.idade ? 'edit-idade-error' : undefined}
                    />
                    {errors.idade && (
                      <p id="edit-idade-error" className="text-[#AD343E] text-sm mt-1">{errors.idade}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="edit-cargo" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Cargo *
                    </label>
                    <select
                      id="edit-cargo"
                      value={(editFuncionario.cargo || '').toLowerCase()}
                      onChange={(e) => setEditFuncionario({ ...editFuncionario, cargo: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      aria-invalid={!!errors.cargo}
                      aria-describedby={errors.cargo ? 'edit-cargo-error' : undefined}
                    >
                      <option value="">Selecione</option>
                      <option value="admin">admin</option>
                      <option value="gerente">gerente</option>
                      <option value="caixa">caixa</option>
                    </select>
                    {errors.cargo && (
                      <p id="edit-cargo-error" className="text-[#AD343E] text-sm mt-1">{errors.cargo}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="edit-salario" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Salário (R$) *
                    </label>
                    <input
                      type="number"
                      id="edit-salario"
                      step="0.01"
                      value={editFuncionario.salario}
                      onChange={(e) => setEditFuncionario({ ...editFuncionario, salario: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="Ex.: 6900.67"
                      min="0"
                      aria-invalid={!!errors.salario}
                      aria-describedby={errors.salario ? 'edit-salario-error' : undefined}
                    />
                    {errors.salario && (
                      <p id="edit-salario-error" className="text-[#AD343E] text-sm mt-1">{errors.salario}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="edit-loja_id" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Loja *
                    </label>
                    <select
                      id="edit-loja_id"
                      value={editFuncionario.loja_id}
                      disabled
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      aria-invalid={!!errors.loja_id}
                      aria-describedby={errors.loja_id ? 'edit-loja_id-error' : undefined}
                    >
                      <option value="2">{lojaNome || 'Loja Sul'} (Filial)</option>
                    </select>
                    {errors.loja_id && (
                      <p id="edit-loja_id-error" className="text-[#AD343E] text-sm mt-1">{errors.loja_id}</p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-medium text-[#2A4E73]">
                      <input
                        type="checkbox"
                        checked={editFuncionario.ativo}
                        onChange={(e) => setEditFuncionario({ ...editFuncionario, ativo: e.target.checked })}
                        className="mr-2 h-4 w-4 text-[#2A4E73] focus:ring-[#CFE8F9]"
                        aria-label="Funcionário ativo"
                      />
                      Funcionário Ativo
                    </label>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin inline-block" /> : 'Salvar'}
                    </button>
                    <button
                      type="button"
                      onClick={closeEditModal}
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
      <Footer />
    </main>
  );
}
