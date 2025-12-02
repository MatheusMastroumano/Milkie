
"use client";

import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, Plus } from 'lucide-react';
import { apiJson } from '@/lib/api';
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';



export default function UsuariosMatriz() {
  const [lojas, setLojas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedLojaId, setSelectedLojaId] = useState('');
  const [lojaSearchTerm, setLojaSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({
    funcionario_id: '',
    loja_id: '',
    funcao: '',
    username: '',
    senha_hash: '',
    ativo: true,
  });
  const [editUsuario, setEditUsuario] = useState(null);
  const [editSenha, setEditSenha] = useState('');
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Fetch all data on mount
  useEffect(() => {
    fetchLojas();
    fetchFuncionarios();
    fetchUsuarios();
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
    }
  };

  const fetchUsuarios = async () => {
    try {
      const data = await apiJson('/usuarios');
      console.log('Usuarios fetched:', data);
      setUsuarios(data.usuarios || []);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      showAlert('error', `Erro ao carregar usuários: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const validateForm = (usuario, isEdit = false) => {
    const newErrors = {};

    if (!usuario.funcionario_id) {
      newErrors.funcionario_id = 'O funcionário é obrigatório';
    } else if (!funcionarios.find((f) => f.id === parseInt(usuario.funcionario_id))) {
      newErrors.funcionario_id = 'Funcionário inválido';
    }

    if (!usuario.loja_id) {
      newErrors.loja_id = 'A loja é obrigatória';
    } else if (!lojas.find((loja) => loja.id === parseInt(usuario.loja_id))) {
      newErrors.loja_id = 'Loja inválida';
    }

    if (!usuario.funcao?.trim()) {
      newErrors.funcao = 'A função é obrigatória';
    }

    // Username e senha obrigatórios na criação
    if (!usuario.username?.trim()) {
      newErrors.username = 'O nome de usuário é obrigatório';
    } else if (usuarios.some((u) => u.username === usuario.username && (!isEdit || u.id !== usuario.id))) {
      newErrors.username = 'Nome de usuário já existe';
    }

    if (!isEdit) {
      if (!usuario.senha_hash?.trim()) {
        newErrors.senha_hash = 'A senha é obrigatória';
      } else if (usuario.senha_hash.length < 6) {
        newErrors.senha_hash = 'A senha deve ter pelo menos 6 caracteres';
      }
    } else if (usuario.senha_hash?.trim() && usuario.senha_hash.length < 6) {
      newErrors.senha_hash = 'A nova senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    console.log('Validation errors:', newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFuncionarioChange = (e) => {
    const funcionarioId = e.target.value;
    const funcionario = funcionarios.find((f) => f.id === parseInt(funcionarioId));
    if (funcionario) {
      setNovoUsuario({
        ...novoUsuario,
        funcionario_id: funcionarioId,
        funcao: funcionario.cargo || '',
        loja_id: funcionario.loja_id.toString(),
      });
    } else {
      setNovoUsuario({ ...novoUsuario, funcionario_id: '', funcao: '', loja_id: '' });
    }
  };

  const handleEditFuncionarioChange = (e) => {
    const funcionarioId = e.target.value;
    const funcionario = funcionarios.find((f) => f.id === parseInt(funcionarioId));
    if (funcionario) {
      setEditUsuario({
        ...editUsuario,
        funcionario_id: funcionarioId,
        funcao: funcionario.cargo || '',
        loja_id: funcionario.loja_id.toString(),
      });
    } else {
      setEditUsuario({ ...editUsuario, funcionario_id: '', funcao: '', loja_id: '' });
    }
  };

  const handleAddUsuario = async (e) => {
    e.preventDefault();

    if (!validateForm(novoUsuario)) {
      console.log('Validation failed:', errors);
      return;
    }

    try {
      const usuarioData = {
        ...novoUsuario,
        funcionario_id: parseInt(novoUsuario.funcionario_id),
        loja_id: parseInt(novoUsuario.loja_id),
      };

      console.log('Sending usuarioData:', JSON.stringify(usuarioData, null, 2));

      const data = await apiJson('/usuarios', {
        method: 'POST',
        body: JSON.stringify({
          ...usuarioData,
          username: novoUsuario.username,
          senha_hash: novoUsuario.senha_hash,
        }),
      });
      console.log('POST success:', data);

      showAlert('success', `Usuário "${novoUsuario.username}" cadastrado com sucesso!`);
      setNovoUsuario({
        funcionario_id: '',
        loja_id: '',
        funcao: '',
        username: '',
        senha_hash: '',
        ativo: true,
      });
      setErrors({});
      setIsAddModalOpen(false);
      setSelectedLojaId(novoUsuario.loja_id); // Atualizar loja selecionada para mostrar o novo usuário
      await fetchUsuarios(); // Refetch all, since backend might not support ?loja_id
    } catch (error) {
      console.error('Error adding usuario:', error);
      showAlert('error', `Erro ao cadastrar usuário: ${error.message}`);
    }
  };

  const handleEditUsuario = async (e) => {
    e.preventDefault();

    const usuarioToValidate = { ...editUsuario, senha_hash: editSenha };
    if (!validateForm(usuarioToValidate, true)) {
      console.log('Validation failed:', errors);
      return;
    }

    try {
      const usuarioData = {
        funcionario_id: parseInt(editUsuario.funcionario_id),
        loja_id: parseInt(editUsuario.loja_id),
        funcao: editUsuario.funcao,
        username: editUsuario.username,
        ativo: editUsuario.ativo,
      };
      if (editSenha.trim()) {
        usuarioData.senha_hash = editSenha;
      }

      console.log('Updating usuarioData:', JSON.stringify(usuarioData, null, 2));

      const data = await apiJson(`/usuarios/${editUsuario.id}`, {
        method: 'PUT',
        body: JSON.stringify(usuarioData),
      });
      console.log('PUT success:', data);

      showAlert('success', `Usuário "${editUsuario.username}" atualizado com sucesso!`);
      setIsEditModalOpen(false);
      setEditUsuario(null);
      setEditSenha('');
      setErrors({});
      setSelectedLojaId(editUsuario.loja_id); // Atualizar loja selecionada para mostrar o usuário editado
      await fetchUsuarios(); // Refetch all
    } catch (error) {
      console.error('Error editing usuario:', error);
      showAlert('error', `Erro ao editar usuário: ${error.message}`);
    }
  };

  const openEditUsuario = (usuario) => {
    setEditUsuario({
      ...usuario,
      funcionario_id: usuario.funcionario_id.toString(),
      loja_id: usuario.loja_id.toString(),
    });
    setEditSenha('');
    setIsEditModalOpen(true);
    setErrors({});
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNovoUsuario({
      funcionario_id: '',
      loja_id: '',
      funcao: '',
      username: '',
      senha_hash: '',
      ativo: true,
    });
    setErrors({});
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditUsuario(null);
    setEditSenha('');
    setErrors({});
  };

  const handleDeleteUsuario = async (id) => {
    const usuarioToDelete = usuarios.find((u) => u.id === id);

    if (!window.confirm(`Tem certeza que deseja excluir o usuário "${usuarioToDelete.username}"?`)) {
      return;
    }

    try {
      const data = await apiJson(`/usuarios/${id}`, {
        method: 'DELETE',
      });
      console.log('DELETE success:', data);

      showAlert('success', `Usuário "${usuarioToDelete.username}" removido com sucesso!`);
      if (editUsuario && editUsuario.id === id) {
        closeEditModal();
      }
      await fetchUsuarios();
    } catch (error) {
      console.error('Error deleting usuario:', error);
      showAlert('error', `Erro ao excluir usuário: ${error.message}`);
    }
  };

  const filteredLojas = lojas.filter(
    (loja) =>
      loja.nome.toLowerCase().includes(lojaSearchTerm.toLowerCase()) ||
      loja.tipo.toLowerCase().includes(lojaSearchTerm.toLowerCase()) ||
      (loja.CEP || '').toLowerCase().includes(lojaSearchTerm.toLowerCase())
  );

  const filteredFuncionarios = funcionarios.filter((f) => f.ativo && f.loja_id === parseInt(selectedLojaId));

  const filteredUsuarios = usuarios
    .filter((u) => u.loja_id === parseInt(selectedLojaId))
    .filter(
      (u) =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.funcao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (funcionarios.find((f) => f.id === u.funcionario_id)?.nome || '').toLowerCase().includes(searchTerm.toLowerCase())
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

        <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-4 text-center">
          Gerenciamento de Usuários
        </h1>
        <p className="text-sm text-[#2A4E73] mb-6 text-center max-w-2xl mx-auto">
          Aqui você pode gerenciar todos os usuários da sua rede. Selecione uma loja para visualizar, adicionar, editar ou remover usuários.
        </p>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="fixed bottom-6 right-6 sm:static sm:bottom-auto sm:right-auto p-4 sm:p-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-full sm:rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors flex items-center gap-2"
            aria-label="Adicionar novo usuário"
          >
            <Plus className="h-5 w-5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Adicionar Usuário</span>
          </button>
        </div>

        <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6 ">
          <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-2 text-center">
            Lista de Usuários
          </h2>
          <p className="text-sm text-[#2A4E73] mb-4 text-center">
            Visualize todos os usuários cadastrados, incluindo seus detalhes e status.
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
              <label htmlFor="search-usuario" className="block text-sm font-medium text-[#2A4E73] mb-2">
                Pesquisar Usuário
              </label>
              <input
                type="text"
                id="search-usuario"
                placeholder="Digite o username, função ou nome do funcionário..."
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
            filteredUsuarios.length === 0 ? (
              <p className="text-[#2A4E73] text-center py-8">
                {searchTerm ? 'Nenhum usuário encontrado com o termo de busca.' : 'Nenhum usuário encontrado para esta loja.'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base text-[#2A4E73] border-collapse">
                  <thead>
                    <tr className="bg-[#2A4E73] text-[#FFFFFF]">
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left rounded-tl-md">ID</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Funcionário</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Username</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Função</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Status</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-center rounded-tr-md">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsuarios.map((usuario) => {
                      const funcionario = funcionarios.find((f) => f.id === usuario.funcionario_id);
                      return (
                        <tr key={usuario.id} className="border-b border-gray-200 hover:bg-[#CFE8F9]">
                          <td className="px-3 sm:px-4 py-2 sm:py-3">{usuario.id}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 truncate max-w-[150px] sm:max-w-[200px]">
                            {funcionario ? funcionario.nome : 'N/A'}
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3">{usuario.username}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3">{usuario.funcao}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                usuario.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {usuario.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 text-center space-x-2">
                            <button
                              onClick={() => openEditUsuario(usuario)}
                              className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                              aria-label={`Editar usuário ${usuario.username}`}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteUsuario(usuario.id)}
                              className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                              aria-label={`Excluir usuário ${usuario.username}`}
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
            )
          ) : (
            <p className="text-[#2A4E73] text-center py-8">Selecione uma loja para ver os usuários.</p>
          )}
        </section>

        {/* Modal para Adicionar Usuário */}
        {isAddModalOpen && (
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
                    Adicionar Usuário
                  </h2>
                  <button
                    onClick={closeAddModal}
                    className="text-[#2A4E73] hover:text-[#AD343E] text-2xl font-bold"
                    aria-label="Fechar modal"
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleAddUsuario} className="space-y-4">
                  <div>
                    <label htmlFor="loja_id" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Loja *
                    </label>
                    <select
                      id="loja_id"
                      value={novoUsuario.loja_id}
                      onChange={(e) => {
                        const lojaId = e.target.value;
                        setNovoUsuario({ ...novoUsuario, loja_id: lojaId, funcionario_id: '', funcao: '' });
                      }}
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      aria-invalid={!!errors.loja_id}
                      aria-describedby={errors.loja_id ? 'loja_id-error' : undefined}
                    >
                      <option value="">Selecione uma loja</option>
                      {lojas.map((loja) => (
                        <option key={loja.id} value={loja.id}>
                          {loja.nome} ({loja.tipo})
                        </option>
                      ))}
                    </select>
                    {errors.loja_id && (
                      <p id="loja_id-error" className="text-[#AD343E] text-sm mt-1">{errors.loja_id}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="funcionario_id" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Funcionário *
                    </label>
                    <select
                      id="funcionario_id"
                      value={novoUsuario.funcionario_id}
                      onChange={handleFuncionarioChange}
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      aria-invalid={!!errors.funcionario_id}
                      aria-describedby={errors.funcionario_id ? 'funcionario_id-error' : undefined}
                      disabled={!novoUsuario.loja_id}
                    >
                      <option value="">Selecione um funcionário</option>
                      {funcionarios
                        .filter((f) => f.loja_id === parseInt(novoUsuario.loja_id) && f.ativo)
                        .map((funcionario) => (
                          <option key={funcionario.id} value={funcionario.id}>
                            {funcionario.nome} ({funcionario.cargo})
                          </option>
                        ))}
                    </select>
                    {errors.funcionario_id && (
                      <p id="funcionario_id-error" className="text-[#AD343E] text-sm mt-1">{errors.funcionario_id}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="funcao" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Função *
                    </label>
                    <input
                      type="text"
                      id="funcao"
                      value={novoUsuario.funcao}
                      disabled
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] bg-gray-100 border border-gray-300 rounded-md"
                      aria-invalid={!!errors.funcao}
                      aria-describedby={errors.funcao ? 'funcao-error' : undefined}
                    />
                    {errors.funcao && (
                      <p id="funcao-error" className="text-[#AD343E] text-sm mt-1">{errors.funcao}</p>
                    )}
                  </div>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-[#2A4E73] mb-1">
                    Nome de Usuário *
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={novoUsuario.username}
                    onChange={(e) => setNovoUsuario({ ...novoUsuario, username: e.target.value })}
                    className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                    placeholder="Ex.: usuario123"
                    aria-invalid={!!errors.username}
                    aria-describedby={errors.username ? 'username-error' : undefined}
                  />
                  {errors.username && (
                    <p id="username-error" className="text-[#AD343E] text-sm mt-1">{errors.username}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="senha_hash" className="block text-sm font-medium text-[#2A4E73] mb-1">
                    Senha *
                  </label>
                  <input
                    type="password"
                    id="senha_hash"
                    value={novoUsuario.senha_hash}
                    onChange={(e) => setNovoUsuario({ ...novoUsuario, senha_hash: e.target.value })}
                    className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                    placeholder="Digite a senha"
                    aria-invalid={!!errors.senha_hash}
                    aria-describedby={errors.senha_hash ? 'senha_hash-error' : undefined}
                  />
                  {errors.senha_hash && (
                    <p id="senha_hash-error" className="text-[#AD343E] text-sm mt-1">{errors.senha_hash}</p>
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

        {/* Modal para Editar Usuário */}
        {isEditModalOpen && editUsuario && selectedLojaId && (
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
                    Editar Usuário
                  </h2>
                  <button
                    onClick={closeEditModal}
                    className="text-[#2A4E73] hover:text-[#AD343E] text-2xl font-bold"
                    aria-label="Fechar modal"
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleEditUsuario} className="space-y-4">
                  <div>
                    <label htmlFor="edit-id" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      ID
                    </label>
                    <input
                      type="text"
                      id="edit-id"
                      value={editUsuario.id}
                      disabled
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] bg-gray-100 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-funcionario_id" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Funcionário *
                    </label>
                    <select
                      id="edit-funcionario_id"
                      value={editUsuario.funcionario_id}
                      onChange={handleEditFuncionarioChange}
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      aria-invalid={!!errors.funcionario_id}
                      aria-describedby={errors.funcionario_id ? 'edit-funcionario_id-error' : undefined}
                    >
                      <option value="">Selecione um funcionário</option>
                      {funcionarios
                        .filter((f) => f.ativo)
                        .map((funcionario) => (
                          <option key={funcionario.id} value={funcionario.id}>
                            {funcionario.nome} ({funcionario.cargo})
                          </option>
                        ))}
                    </select>
                    {errors.funcionario_id && (
                      <p id="edit-funcionario_id-error" className="text-[#AD343E] text-sm mt-1">{errors.funcionario_id}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="edit-loja_id" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Loja *
                    </label>
                    <select
                      id="edit-loja_id"
                      value={editUsuario.loja_id}
                      disabled
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      aria-invalid={!!errors.loja_id}
                      aria-describedby={errors.loja_id ? 'edit-loja_id-error' : undefined}
                    >
                      <option value={editUsuario.loja_id}>
                        {lojas.find((loja) => loja.id === parseInt(editUsuario.loja_id))?.nome || 'Loja Selecionada'} (
                        {lojas.find((loja) => loja.id === parseInt(editUsuario.loja_id))?.tipo || 'N/A'})
                      </option>
                    </select>
                    {errors.loja_id && (
                      <p id="edit-loja_id-error" className="text-[#AD343E] text-sm mt-1">{errors.loja_id}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="edit-funcao" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Função *
                    </label>
                    <input
                      type="text"
                      id="edit-funcao"
                      value={editUsuario.funcao}
                      disabled
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] bg-gray-100 border border-gray-300 rounded-md"
                      aria-invalid={!!errors.funcao}
                      aria-describedby={errors.funcao ? 'edit-funcao-error' : undefined}
                    />
                    {errors.funcao && (
                      <p id="edit-funcao-error" className="text-[#AD343E] text-sm mt-1">{errors.funcao}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="edit-username" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Nome de Usuário *
                    </label>
                    <input
                      type="text"
                      id="edit-username"
                      value={editUsuario.username}
                      onChange={(e) => setEditUsuario({ ...editUsuario, username: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="Ex.: usuario123"
                      aria-invalid={!!errors.username}
                      aria-describedby={errors.username ? 'edit-username-error' : undefined}
                    />
                    {errors.username && (
                      <p id="edit-username-error" className="text-[#AD343E] text-sm mt-1">{errors.username}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="edit-senha_hash" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Nova Senha (opcional)
                    </label>
                    <input
                      type="password"
                      id="edit-senha_hash"
                      value={editSenha}
                      onChange={(e) => setEditSenha(e.target.value)}
                      className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      placeholder="Digite a nova senha"
                      aria-invalid={!!errors.senha_hash}
                      aria-describedby={errors.senha_hash ? 'edit-senha_hash-error' : undefined}
                    />
                    {errors.senha_hash && (
                      <p id="edit-senha_hash-error" className="text-[#AD343E] text-sm mt-1">{errors.senha_hash}</p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-medium text-[#2A4E73]">
                      <input
                        type="checkbox"
                        checked={editUsuario.ativo}
                        onChange={(e) => setEditUsuario({ ...editUsuario, ativo: e.target.checked })}
                        className="mr-2 h-4 w-4 text-[#2A4E73] focus:ring-[#CFE8F9]"
                        aria-label="Usuário ativo"
                      />
                      Usuário Ativo
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
