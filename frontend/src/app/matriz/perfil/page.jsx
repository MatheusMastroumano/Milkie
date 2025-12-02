"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header/page';
import Footer from '@/components/Footer/page';
import { apiJson } from '@/lib/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, Eye, EyeOff } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function PerfilMatriz() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [funcionario, setFuncionario] = useState(null);
  const [lojaNome, setLojaNome] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  
  // Estados para mudança de senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [senhaDelete, setSenhaDelete] = useState('');
  const [showSenhaDelete, setShowSenhaDelete] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const auth = await apiJson('/auth/check-auth');
      if (!auth?.authenticated) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }
      const user = auth.user || {};
      setUsuario(user);

      // Buscar dados completos do usuário e funcionário
      if (user?.id) {
        const { usuario: usuarioCompleto } = await apiJson(`/usuarios/${user.id}`);
        setUsuario(usuarioCompleto);
        
        if (usuarioCompleto?.funcionario) {
          setFuncionario(usuarioCompleto.funcionario);
        }
      }

      // Buscar nome da loja
      if (user?.loja_id) {
        try {
          const lojasResp = await apiJson('/lojas');
          const lojas = lojasResp?.lojas || lojasResp || [];
          const loja = lojas.find((l) => Number(l.id) === Number(user.loja_id));
          if (loja) setLojaNome(loja.nome);
        } catch {
          // ignore
        }
      }
    } catch (e) {
      setErro(e?.message || 'Falha ao carregar perfil');
      try {
        router.replace('/');
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const getImagemUrl = (imagemUrl) => {
    if (!imagemUrl) return null;
    if (imagemUrl.startsWith('http://') || imagemUrl.startsWith('https://')) {
      return imagemUrl;
    }
    return `${API_URL}${imagemUrl}`;
  };

  const validatePasswordChange = () => {
    const newErrors = {};
    
    if (!senhaAtual.trim()) {
      newErrors.senhaAtual = 'Senha atual é obrigatória';
    }
    
    if (!novaSenha.trim()) {
      newErrors.novaSenha = 'Nova senha é obrigatória';
    } else if (novaSenha.length < 6) {
      newErrors.novaSenha = 'A senha deve ter pelo menos 6 caracteres';
    }
    
    if (!confirmarSenha.trim()) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (novaSenha !== confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordChange()) return;

    try {
      setSaving(true);
      
      await apiJson('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          senhaAtual: senhaAtual,
          novaSenha: novaSenha,
        }),
      });

      showAlert('success', 'Senha alterada com sucesso!');
      setIsChangePasswordOpen(false);
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      setErrors({});
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      showAlert('error', `Erro ao alterar senha: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    
    if (!senhaDelete.trim()) {
      setErrors({ senhaDelete: 'Digite sua senha para confirmar' });
      return;
    }

    if (!window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita!')) {
      return;
    }

    try {
      setSaving(true);
      
      // Excluir a conta
      await apiJson(`/usuarios/${usuario.id}`, {
        method: 'DELETE',
      });

      showAlert('success', 'Conta excluída com sucesso!');
      
      // Fazer logout e redirecionar
      try {
        await apiJson('/auth/logout', { method: 'POST' });
      } catch {}
      
      setTimeout(() => {
        router.replace('/');
      }, 2000);
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      showAlert('error', `Erro ao excluir conta: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#FFFFFF] pt-14 sm:pt-16 transition-all duration-300 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#2A4E73]" />
            <div className="text-[#2A4E73] text-lg">Carregando perfil...</div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFFFF] pt-14 sm:pt-16 transition-all duration-300">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6">
          {alert.show && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <Alert variant={alert.type === 'success' ? 'default' : 'destructive'} className={alert.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                {alert.type === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertTitle className={alert.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {alert.type === 'success' ? 'Sucesso!' : 'Erro!'}
                </AlertTitle>
                <AlertDescription className={alert.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                  {alert.message}
                </AlertDescription>
              </Alert>
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-6 text-center">
            Meu Perfil
          </h1>

          {erro && (
            <div className="mb-6">
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">Erro</AlertTitle>
                <AlertDescription className="text-red-700">{erro}</AlertDescription>
              </Alert>
            </div>
          )}

          {usuario && (
            <div className="space-y-8">
              {/* Foto do Perfil - Grande e Centralizada */}
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-white border-4 border-[#2A4E73] overflow-hidden shadow-lg mb-4">
                  {getImagemUrl(funcionario?.imagem || usuario.funcionario_imagem) ? (
                    <img
                      src={getImagemUrl(funcionario?.imagem || usuario.funcionario_imagem)}
                      alt="Foto de Perfil"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-full h-full ${getImagemUrl(funcionario?.imagem || usuario.funcionario_imagem) ? 'hidden' : 'flex'} items-center justify-center bg-[#AD343E] text-white text-6xl sm:text-7xl font-bold`}
                  >
                    {(funcionario?.nome || usuario.funcionario_nome || usuario.username || 'U').charAt(0).toUpperCase()}
                  </div>
                </div>
                
                {/* Nome */}
                <h2 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] text-center">
                  {funcionario?.nome || usuario.funcionario_nome || usuario.username}
                </h2>
              </div>

              {/* Informações - Sem Card */}
              <div className="space-y-6 flex flex-col items-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full">
                  <div className="text-center sm:text-left">
                    <span className="block text-sm text-gray-500 mb-2">Usuário</span>
                    <span className="text-lg text-[#2A4E73] font-semibold">
                      {usuario.username || '-'}
                    </span>
                  </div>
                  <div className="text-center sm:text-left">
                    <span className="block text-sm text-gray-500 mb-2">Função</span>
                    <span className="text-lg text-[#2A4E73] font-semibold capitalize">
                      {usuario.funcao || '-'}
                    </span>
                  </div>
                  <div className="text-center sm:text-left">
                    <span className="block text-sm text-gray-500 mb-2">Loja</span>
                    <span className="text-lg text-[#2A4E73] font-semibold">
                      {lojaNome || (usuario.loja_id ? `Loja ${usuario.loja_id}` : '-')}
                    </span>
                  </div>
                  {funcionario && (
                    <>
                      {funcionario.cpf && (
                        <div className="text-center sm:text-left">
                          <span className="block text-sm text-gray-500 mb-2">CPF</span>
                          <span className="text-lg text-[#2A4E73] font-semibold">
                            {funcionario.cpf}
                          </span>
                        </div>
                      )}
                      {funcionario.email && (
                        <div className="text-center sm:text-left">
                          <span className="block text-sm text-gray-500 mb-2">Email</span>
                          <span className="text-lg text-[#2A4E73] font-semibold">
                            {funcionario.email}
                          </span>
                        </div>
                      )}
                      {funcionario.telefone && (
                        <div className="text-center sm:text-left">
                          <span className="block text-sm text-gray-500 mb-2">Telefone</span>
                          <span className="text-lg text-[#2A4E73] font-semibold">
                            {funcionario.telefone}
                          </span>
                        </div>
                      )}
                      {funcionario.cargo && (
                        <div className="text-center sm:text-left">
                          <span className="block text-sm text-gray-500 mb-2">Cargo</span>
                          <span className="text-lg text-[#2A4E73] font-semibold capitalize">
                            {funcionario.cargo}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Ações - Sem Card */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="px-8 py-3 text-base font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                  >
                    Alterar Senha
                  </button>
               
                </div>
              </div>
            </div>
          )}

          {/* Modal Alterar Senha */}
          {isChangePasswordOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-[#2A4E73]">Alterar Senha</h2>
                    <button
                      onClick={() => {
                        setIsChangePasswordOpen(false);
                        setSenhaAtual('');
                        setNovaSenha('');
                        setConfirmarSenha('');
                        setErrors({});
                      }}
                      className="text-[#2A4E73] hover:text-[#AD343E] text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label htmlFor="senha-atual" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Senha Atual *
                      </label>
                      <div className="relative">
                        <input
                          id="senha-atual"
                          type={showSenhaAtual ? "text" : "password"}
                          value={senhaAtual}
                          onChange={(e) => setSenhaAtual(e.target.value)}
                          className="w-full px-3 py-2 pr-10 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#2A4E73]"
                        >
                          {showSenhaAtual ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.senhaAtual && (
                        <p className="text-[#AD343E] text-xs mt-1">{errors.senhaAtual}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="nova-senha" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Nova Senha *
                      </label>
                      <div className="relative">
                        <input
                          id="nova-senha"
                          type={showNovaSenha ? "text" : "password"}
                          value={novaSenha}
                          onChange={(e) => setNovaSenha(e.target.value)}
                          className="w-full px-3 py-2 pr-10 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNovaSenha(!showNovaSenha)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#2A4E73]"
                        >
                          {showNovaSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.novaSenha && (
                        <p className="text-[#AD343E] text-xs mt-1">{errors.novaSenha}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="confirmar-senha" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Confirmar Nova Senha *
                      </label>
                      <div className="relative">
                        <input
                          id="confirmar-senha"
                          type={showConfirmarSenha ? "text" : "password"}
                          value={confirmarSenha}
                          onChange={(e) => setConfirmarSenha(e.target.value)}
                          className="w-full px-3 py-2 pr-10 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#2A4E73]"
                        >
                          {showConfirmarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.confirmarSenha && (
                        <p className="text-[#AD343E] text-xs mt-1">{errors.confirmarSenha}</p>
                      )}
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin inline-block" /> : 'Alterar Senha'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsChangePasswordOpen(false);
                          setSenhaAtual('');
                          setNovaSenha('');
                          setConfirmarSenha('');
                          setErrors({});
                        }}
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

          {/* Modal Excluir Conta */}
          {isDeleteAccountOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-[#AD343E]">Excluir Conta</h2>
                    <button
                      onClick={() => {
                        setIsDeleteAccountOpen(false);
                        setSenhaDelete('');
                        setErrors({});
                      }}
                      className="text-[#2A4E73] hover:text-[#AD343E] text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-[#2A4E73] mb-4">
                      Esta ação não pode ser desfeita. Ao excluir sua conta, todos os seus dados serão permanentemente removidos.
                    </p>
                    <div>
                      <label htmlFor="senha-delete" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Digite sua senha para confirmar *
                      </label>
                      <div className="relative">
                        <input
                          id="senha-delete"
                          type={showSenhaDelete ? "text" : "password"}
                          value={senhaDelete}
                          onChange={(e) => setSenhaDelete(e.target.value)}
                          className="w-full px-3 py-2 pr-10 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                          placeholder="Digite sua senha"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSenhaDelete(!showSenhaDelete)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#2A4E73]"
                        >
                          {showSenhaDelete ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.senhaDelete && (
                        <p className="text-[#AD343E] text-xs mt-1">{errors.senhaDelete}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={saving || !senhaDelete.trim()}
                      className="flex-1 px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin inline-block" /> : 'Excluir Conta'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsDeleteAccountOpen(false);
                        setSenhaDelete('');
                        setErrors({});
                      }}
                      className="flex-1 px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <br /><br /><br /><br /><br /><br /><br />
        <Footer />
      </main>
    </>
  );
}
