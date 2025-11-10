
"use client";

import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';
import { apiJson } from '@/lib/api';



export default function Funcionarios() {
  const [lojas, setLojas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [selectedLojaId, setSelectedLojaId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [lojaSearchTerm, setLojaSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const allowedCargos = ['admin', 'gerente', 'caixa'];

  // Fetch lojas and funcionários on mount
  useEffect(() => {
    fetchLojas();
    fetchFuncionarios();
  }, []);

  const fetchLojas = async () => {
    try {
      const data = await apiJson('/lojas');
      console.log('Lojas fetched:', data);
      setLojas(data.lojas || []);
    } catch (error) {
      console.error('Error fetching lojas:', error);
      showAlert('error', `Erro ao carregar lojas: ${error.message}`);
    }
  };

  const fetchFuncionarios = async () => {
    try {
      const data = await apiJson('/funcionarios');
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
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000);
  };

  const validateForm = (funcionario, isEdit = false) => {
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
    } else if (!/^\d{10,11}$/.test(funcionario.telefone)) {
      newErrors.telefone = 'Telefone deve conter DDD + número (10 ou 11 dígitos, ex.: 11987654321)';
    }

    if (!funcionario.idade || funcionario.idade <= 0) {
      newErrors.idade = 'A idade deve ser um número positivo';
    }

    if (!funcionario.cargo?.trim()) {
      newErrors.cargo = 'O cargo é obrigatório';
    } else if (!allowedCargos.includes(funcionario.cargo.toLowerCase())) {
      newErrors.cargo = 'Cargo inválido. Use: admin, gerente ou caixa';
    }

    if (!funcionario.salario || funcionario.salario <= 0) {
      newErrors.salario = 'O salário deve ser um número positivo';
    }

    if (!funcionario.loja_id) {
      newErrors.loja_id = 'Selecione uma loja';
    } else if (!lojas.some((loja) => loja.id === parseInt(funcionario.loja_id))) {
      newErrors.loja_id = 'A loja selecionada não existe';
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

  const handleAddFuncionario = async (e) => {
    e.preventDefault();

    if (!validateForm(novoFuncionario)) return;

    try {
      const funcionarioData = {
        ...novoFuncionario,
        idade: parseInt(novoFuncionario.idade),
        salario: parseFloat(novoFuncionario.salario),
        loja_id: parseInt(novoFuncionario.loja_id),
        telefone: novoFuncionario.telefone.replace(/\D/g, ''),
      };

      console.log('Sending funcionarioData:', funcionarioData);

      const data = await apiJson('/funcionarios', {
        method: 'POST',
        body: JSON.stringify(funcionarioData),
      });
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
        loja_id: '',
        ativo: true,
      });
      setErrors({});
      setIsAddModalOpen(false);
      setSelectedLojaId(novoFuncionario.loja_id); // Show added funcionario in selected loja
      await fetchFuncionarios();
    } catch (error) {
      console.error('Error adding funcionario:', error);
      if (error.message.includes('Foreign key constraint violated')) {
        showAlert('error', 'Erro: A loja selecionada não existe no banco de dados.');
      } else {
        showAlert('error', `Erro ao cadastrar funcionário: ${error.message}`);
      }
    }
  };

  const handleEditFuncionario = async (e) => {
    e.preventDefault();

    if (!validateForm(editFuncionario, true)) return;

    try {
      const funcionarioData = {
        ...editFuncionario,
        idade: parseInt(editFuncionario.idade),
        salario: parseFloat(editFuncionario.salario),
        loja_id: parseInt(editFuncionario.loja_id),
        telefone: editFuncionario.telefone.replace(/\D/g, ''),
      };

      console.log('Updating funcionarioData:', funcionarioData);

      const data = await apiJson(`/funcionarios/${editFuncionario.id}`, {
        method: 'PUT',
        body: JSON.stringify(funcionarioData),
      });
      console.log('PUT success:', data);

      showAlert('success', `Funcionário "${editFuncionario.nome}" editado com sucesso!`);
      setIsModalOpen(false);
      setEditFuncionario(null);
      setErrors({});
      setSelectedLojaId(editFuncionario.loja_id); // Show edited funcionario in selected loja
      await fetchFuncionarios();
    } catch (error) {
      console.error('Error editing funcionario:', error);
      if (error.message.includes('Foreign key constraint violated')) {
        showAlert('error', 'Erro: A loja selecionada não existe no banco de dados.');
      } else {
        showAlert('error', `Erro ao editar funcionário: ${error.message}`);
      }
    }
  };

  const openEditFuncionario = (funcionario) => {
    setEditFuncionario({ ...funcionario, loja_id: funcionario.loja_id.toString() });
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
      loja_id: '',
      ativo: true,
    });
    setErrors({});
  };

  const handleDeleteFuncionario = async (id) => {
    const funcionarioToDelete = funcionarios.find((func) => func.id === id);

    if (!window.confirm(`Tem certeza que deseja excluir o funcionário "${funcionarioToDelete.nome}"?`)) {
      return;
    }

    try {
      const data = await apiJson(`/funcionarios/${id}`, {
        method: 'DELETE',
      });
      console.log('DELETE success:', data);

      showAlert('success', `Funcionário "${funcionarioToDelete.nome}" excluído com sucesso!`);
      if (editFuncionario && editFuncionario.id === id) {
        closeModal();
      }
      await fetchFuncionarios();
    } catch (error) {
      console.error('Error deleting funcionario:', error);
      showAlert('error', `Erro ao excluir funcionário: ${error.message}`);
    }
  };

  const filteredLojas = lojas.filter(
    (loja) =>
      loja.nome.toLowerCase().includes(lojaSearchTerm.toLowerCase()) ||
      loja.tipo.toLowerCase().includes(lojaSearchTerm.toLowerCase()) ||
      (loja.CEP || '').toLowerCase().includes(lojaSearchTerm.toLowerCase())
  );

  const filteredFuncionarios = selectedLojaId
    ? funcionarios
        .filter((func) => func.loja_id === parseInt(selectedLojaId))
        .filter(
          (func) =>
            func.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            func.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            func.telefone.includes(searchTerm) ||
            (func.email && func.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (func.cpf || '').includes(searchTerm)
        )
    : [];

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

        <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-4 text-center">
          Gerenciamento de Funcionários
        </h1>
        <p className="text-sm text-[#2A4E73] mb-6 text-center max-w-2xl mx-auto">
          Aqui você pode gerenciar todos os funcionários da sua rede. Adicione novos funcionários, edite informações existentes ou remova funcionários inativos com facilidade.
        </p>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setIsAddModalOpen(true);
              setNovoFuncionario({ ...novoFuncionario, loja_id: selectedLojaId });
            }}
            className="px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
            aria-label="Abrir formulário para adicionar novo funcionário"
          >
            Adicionar Novo Funcionário
          </button>
        </div>

        <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-2 text-center">
            Lista de Funcionários
          </h2>
          <p className="text-sm text-[#2A4E73] mb-4 text-center">
            Visualize todos os funcionários cadastrados, incluindo seus detalhes e status.
          </p>

          <div className="mb-6">
            <label htmlFor="search-loja" className="block text-sm font-medium text-[#2A4E73] mb-2">
              Buscar Loja
            </label>
            <input
              type="text"
              id="search-loja"
              value={lojaSearchTerm}
              onChange={(e) => setLojaSearchTerm(e.target.value)}
              className="w-full sm:w-80 px-4 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
              placeholder="Digite o nome, tipo ou CEP da loja..."
            />
          </div>

          {lojaSearchTerm && filteredLojas.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-medium text-[#2A4E73] mb-3">Lojas Encontradas:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLojas.map((loja) => (
                  <div
                    key={loja.id}
                    onClick={() => {
                      setSelectedLojaId(loja.id.toString());
                      setLojaSearchTerm('');
                    }}
                    className="p-4 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-[#CFE8F9] hover:border-[#2A4E73] transition-colors"
                  >
                    <h4 className="font-semibold text-[#2A4E73]">{loja.nome}</h4>
                    <p className="text-sm text-gray-600">{loja.tipo}</p>
                    <p className="text-sm text-gray-500">{loja.CEP || 'N/A'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="select-loja" className="block text-sm font-medium text-[#2A4E73] mb-2">
              Loja Selecionada
            </label>
            <select
              id="select-loja"
              value={selectedLojaId}
              onChange={(e) => setSelectedLojaId(e.target.value)}
              className="w-full sm:w-80 px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
            >
              <option value="">Selecione uma loja</option>
              {lojas.map((loja) => (
                <option key={loja.id} value={loja.id}>
                  {loja.nome} ({loja.tipo}) - {loja.CEP || 'N/A'}
                </option>
              ))}
            </select>
          </div>

          {selectedLojaId && (
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
          )}

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#2A4E73]" />
            </div>
          ) : selectedLojaId ? (
            filteredFuncionarios.length === 0 ? (
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
            )
          ) : (
            <p className="text-[#2A4E73] text-center py-8">Selecione uma loja para ver os funcionários.</p>
          )}
        </section>

        {(isAddModalOpen || isModalOpen) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-labelledby={isAddModalOpen ? 'add-modal-title' : 'edit-modal-title'}
            aria-modal="true"
          >
            <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2
                    id={isAddModalOpen ? 'add-modal-title' : 'edit-modal-title'}
                    className="text-lg font-semibold text-[#2A4E73]"
                  >
                    {isAddModalOpen ? 'Adicionar Novo Funcionário' : 'Editar Funcionário'}
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
                    <label
                      htmlFor={isAddModalOpen ? 'add-nome' : 'edit-nome'}
                      className="block text-sm font-medium text-[#2A4E73] mb-1"
                    >
                      Nome do Funcionário *
                    </label>
                    <input
                      id={isAddModalOpen ? 'add-nome' : 'edit-nome'}
                      type="text"
                      value={isAddModalOpen ? novoFuncionario.nome : editFuncionario?.nome || ''}
                      onChange={(e) => {
                        if (isAddModalOpen) {
                          setNovoFuncionario({ ...novoFuncionario, nome: e.target.value });
                        } else {
                          setEditFuncionario({ ...editFuncionario, nome: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="Ex.: Robert Lox"
                      aria-invalid={!!errors.nome}
                      aria-describedby={errors.nome ? (isAddModalOpen ? 'add-nome-error' : 'edit-nome-error') : undefined}
                    />
                    {errors.nome && (
                      <p
                        id={isAddModalOpen ? 'add-nome-error' : 'edit-nome-error'}
                        className="text-[#AD343E] text-xs mt-1"
                      >
                        {errors.nome}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={isAddModalOpen ? 'add-cpf' : 'edit-cpf'}
                      className="block text-sm font-medium text-[#2A4E73] mb-1"
                    >
                      CPF *
                    </label>
                    <input
                      id={isAddModalOpen ? 'add-cpf' : 'edit-cpf'}
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
                      aria-invalid={!!errors.cpf}
                      aria-describedby={errors.cpf ? (isAddModalOpen ? 'add-cpf-error' : 'edit-cpf-error') : undefined}
                    />
                    {errors.cpf && (
                      <p
                        id={isAddModalOpen ? 'add-cpf-error' : 'edit-cpf-error'}
                        className="text-[#AD343E] text-xs mt-1"
                      >
                        {errors.cpf}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={isAddModalOpen ? 'add-email' : 'edit-email'}
                      className="block text-sm font-medium text-[#2A4E73] mb-1"
                    >
                      Email (opcional)
                    </label>
                    <input
                      id={isAddModalOpen ? 'add-email' : 'edit-email'}
                      type="email"
                      value={isAddModalOpen ? novoFuncionario.email : editFuncionario?.email || ''}
                      onChange={(e) => {
                        if (isAddModalOpen) {
                          setNovoFuncionario({ ...novoFuncionario, email: e.target.value });
                        } else {
                          setEditFuncionario({ ...editFuncionario, email: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="Ex.: rob.lox@game.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? (isAddModalOpen ? 'add-email-error' : 'edit-email-error') : undefined}
                    />
                    {errors.email && (
                      <p
                        id={isAddModalOpen ? 'add-email-error' : 'edit-email-error'}
                        className="text-[#AD343E] text-xs mt-1"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={isAddModalOpen ? 'add-telefone' : 'edit-telefone'}
                      className="block text-sm font-medium text-[#2A4E73] mb-1"
                    >
                      Telefone *
                    </label>
                    <input
                      id={isAddModalOpen ? 'add-telefone' : 'edit-telefone'}
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
                      aria-invalid={!!errors.telefone}
                      aria-describedby={errors.telefone ? (isAddModalOpen ? 'add-telefone-error' : 'edit-telefone-error') : undefined}
                    />
                    {errors.telefone && (
                      <p
                        id={isAddModalOpen ? 'add-telefone-error' : 'edit-telefone-error'}
                        className="text-[#AD343E] text-xs mt-1"
                      >
                        {errors.telefone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={isAddModalOpen ? 'add-idade' : 'edit-idade'}
                      className="block text-sm font-medium text-[#2A4E73] mb-1"
                    >
                      Idade *
                    </label>
                    <input
                      id={isAddModalOpen ? 'add-idade' : 'edit-idade'}
                      type="number"
                      value={isAddModalOpen ? novoFuncionario.idade : editFuncionario?.idade || ''}
                      onChange={(e) => {
                        if (isAddModalOpen) {
                          setNovoFuncionario({ ...novoFuncionario, idade: e.target.value });
                        } else {
                          setEditFuncionario({ ...editFuncionario, idade: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="Ex.: 67"
                      min="1"
                      aria-invalid={!!errors.idade}
                      aria-describedby={errors.idade ? (isAddModalOpen ? 'add-idade-error' : 'edit-idade-error') : undefined}
                    />
                    {errors.idade && (
                      <p
                        id={isAddModalOpen ? 'add-idade-error' : 'edit-idade-error'}
                        className="text-[#AD343E] text-xs mt-1"
                      >
                        {errors.idade}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={isAddModalOpen ? 'add-cargo' : 'edit-cargo'}
                      className="block text-sm font-medium text-[#2A4E73] mb-1"
                    >
                      Cargo *
                    </label>
                    <select
                      id={isAddModalOpen ? 'add-cargo' : 'edit-cargo'}
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
                      aria-invalid={!!errors.cargo}
                      aria-describedby={errors.cargo ? (isAddModalOpen ? 'add-cargo-error' : 'edit-cargo-error') : undefined}
                    >
                      <option value="">Selecione</option>
                      <option value="admin">admin</option>
                      <option value="gerente">gerente</option>
                      <option value="caixa">caixa</option>
                    </select>
                    {errors.cargo && (
                      <p
                        id={isAddModalOpen ? 'add-cargo-error' : 'edit-cargo-error'}
                        className="text-[#AD343E] text-xs mt-1"
                      >
                        {errors.cargo}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={isAddModalOpen ? 'add-salario' : 'edit-salario'}
                      className="block text-sm font-medium text-[#2A4E73] mb-1"
                    >
                      Salário (R$) *
                    </label>
                    <input
                      id={isAddModalOpen ? 'add-salario' : 'edit-salario'}
                      type="number"
                      step="0.01"
                      value={isAddModalOpen ? novoFuncionario.salario : editFuncionario?.salario || ''}
                      onChange={(e) => {
                        if (isAddModalOpen) {
                          setNovoFuncionario({ ...novoFuncionario, salario: e.target.value });
                        } else {
                          setEditFuncionario({ ...editFuncionario, salario: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="Ex.: 6900.67"
                      min="0"
                      aria-invalid={!!errors.salario}
                      aria-describedby={errors.salario ? (isAddModalOpen ? 'add-salario-error' : 'edit-salario-error') : undefined}
                    />
                    {errors.salario && (
                      <p
                        id={isAddModalOpen ? 'add-salario-error' : 'edit-salario-error'}
                        className="text-[#AD343E] text-xs mt-1"
                      >
                        {errors.salario}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={isAddModalOpen ? 'add-loja_id' : 'edit-loja_id'}
                      className="block text-sm font-medium text-[#2A4E73] mb-1"
                    >
                      Loja *
                    </label>
                    <select
                      id={isAddModalOpen ? 'add-loja_id' : 'edit-loja_id'}
                      value={isAddModalOpen ? novoFuncionario.loja_id : editFuncionario?.loja_id || ''}
                      onChange={(e) => {
                        if (isAddModalOpen) {
                          setNovoFuncionario({ ...novoFuncionario, loja_id: e.target.value });
                        } else {
                          setEditFuncionario({ ...editFuncionario, loja_id: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-1.5 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      aria-invalid={!!errors.loja_id}
                      aria-describedby={errors.loja_id ? (isAddModalOpen ? 'add-loja_id-error' : 'edit-loja_id-error') : undefined}
                    >
                      <option value="">Selecione uma loja</option>
                      {lojas.map((loja) => (
                        <option key={loja.id} value={loja.id}>
                          {loja.nome} ({loja.tipo})
                        </option>
                      ))}
                    </select>
                    {errors.loja_id && (
                      <p
                        id={isAddModalOpen ? 'add-loja_id-error' : 'edit-loja_id-error'}
                        className="text-[#AD343E] text-xs mt-1"
                      >
                        {errors.loja_id}
                      </p>
                    )}
                  </div>

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
                      disabled={loading}
                      aria-label={isAddModalOpen ? 'Adicionar funcionário' : 'Salvar alterações'}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin inline-block" />
                      ) : isAddModalOpen ? (
                        'Adicionar'
                      ) : (
                        'Salvar'
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
      <Footer />
    </main>
  );
}
