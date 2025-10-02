"use client";

import { useState, useEffect } from "react";
import React from "react";

export default function Perfil() {
  const [usuario, setUsuario] = useState({
    nome: "João Silva",
    email: "joao.silva@empresa.com",
    cargo: "Gerente Financeiro",
    loja: "Loja Centro",
    dataAdmissao: "2023-01-15",
    telefone: "(11) 98765-4321",
    endereco: "Rua Exemplo, 123",
    idade: 30,
  });
  const [loading, setLoading] = useState(false);
  const [altSenha, setAltSenha] = useState(null);
  const [senha, setSenha] = useState("");
  const [newSenha, setNewSenha] = useState("");
  
  // Sistema de notificações
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const showConfirm = (message, onConfirm, onCancel = null) => {
    setConfirmDialog({
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog(null);
      },
      onCancel: () => {
        if (onCancel) onCancel();
        setConfirmDialog(null);
      },
    });
  };

  const deletarConta = () => {
    showConfirm(
      "Tem certeza que deseja deletar sua conta? Todos os seus dados serão permanentemente removidos.",
      () => {
        showNotification("Conta deletada com sucesso!", "success");
        setTimeout(() => {
          window.location = "/";
        }, 1500);
      }
    );
  };

  const atualizarSenha = () => {
    if (newSenha.length < 6) {
      showNotification("A senha deve ter pelo menos 6 caracteres", "error");
      return;
    }
    showNotification("Senha alterada com sucesso!", "success");
    setAltSenha(null);
    setSenha("");
    setNewSenha("");
  };

  useEffect(() => {
    // Simulação de carregamento inicial
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4B5EAA]"></div>
      </div>
    );
  }

  return (
    <>
      {/* Sistema de Notificações */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-slide-in">
          <div className={`p-4 rounded-lg shadow-lg border-l-4 ${
            notification.type === "success"
              ? "bg-[#E6EFFD] border-[#4B5EAA] text-[#4B5EAA]"
              : notification.type === "error"
              ? "bg-[#FDE7E7] border-[#A83B3B] text-[#A83B3B]"
              : "bg-[#E6F0FA] border-[#4B5EAA] text-[#4B5EAA]"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`flex-shrink-0 w-5 h-5 mr-3 ${
                  notification.type === "success"
                    ? "text-[#4B5EAA]"
                    : notification.type === "error"
                    ? "text-[#A83B3B]"
                    : "text-[#4B5EAA]"
                }`}>
                  {notification.type === "success" && (
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {notification.type === "error" && (
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {notification.type === "info" && (
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className={`ml-4 text-lg font-bold leading-none ${
                  notification.type === "success"
                    ? "text-[#4B5EAA] hover:text-[#3B4A8A]"
                    : notification.type === "error"
                    ? "text-[#A83B3B] hover:text-[#822727]"
                    : "text-[#4B5EAA] hover:text-[#3B4A8A]"
                } cursor-pointer`}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de Confirmação */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-[#000000]/60 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-[#E6EFFD] rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-6 h-6 text-[#4B5EAA]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1F2937]">Confirmação</h3>
            </div>
            <p className="text-gray-600 mb-6">{confirmDialog.message}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={confirmDialog.onCancel}
                className="px-4 py-2 text-[#4B5EAA] bg-[#E6EFFD] rounded hover:bg-[#D1E0F7] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 bg-[#A83B3B] text-white rounded hover:bg-[#822727] transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="space-y-12">
            <div className="text-center">
              <div className="inline-block relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#E6EFFD] to-[#D1E0F7] flex items-center justify-center transition-all duration-300 hover:scale-105">
                  <span className="text-4xl text-[#4B5EAA] font-light">
                    {usuario.nome.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#4B5EAA] rounded-full border-4 border-[#FFFFFF]"></div>
              </div>
              <h1 className="mt-6 text-4xl font-light text-[#1F2937]">
                {usuario.nome}
              </h1>
            </div>

            <div className="grid md:grid-cols-2 gap-8 ">
              <div className="space-y-8">
                <div>
                  <h2 className="text-xs text-[#4B5EAA] font-bold uppercase tracking-wider">
                    Informações Pessoais
                  </h2>
                  <div className="mt-4 space-y-4">
                    {usuario.idade && (
                      <div className="pb-4 border-b border-[#E5E7EB]">
                        <p className="text-sm text-[#6B7280]">Idade</p>
                        <p className="mt-1 text-lg font-light text-[#1F2937]">
                          {usuario.idade} anos
                        </p>
                      </div>
                    )}
                    {usuario.telefone && (
                      <div className="pb-4 border-b border-[#E5E7EB]">
                        <p className="text-sm text-[#6B7280]">Telefone</p>
                        <p className="mt-1 text-lg font-light text-[#1F2937]">
                          {usuario.telefone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-xs text-[#4B5EAA] font-bold uppercase tracking-wider">
                    Contato
                  </h2>
                  <div className="mt-4 space-y-4">
                    <div className="pb-4 border-b border-[#E5E7EB]">
                      <p className="text-sm text-[#6B7280]">E-mail</p>
                      <p className="mt-1 text-lg font-light text-[#1F2937]">
                        {usuario.email}
                      </p>
                    </div>
                    {usuario.endereco && (
                      <div className="pb-4 border-b border-[#E5E7EB]">
                        <p className="text-sm text-[#6B7280]">Endereço</p>
                        <p className="mt-1 text-lg font-light text-[#1F2937]">
                          {usuario.endereco}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-center pt-4">
                  <button
                    className="m-2 px-4 py-2 rounded-lg bg-[#FCEFD5] text-[#D97706] hover:bg-[#FCD9B0] transition-colors"
                    onClick={() => setAltSenha(usuario)}
                  >
                    Alterar senha
                  </button>
                  <button
                    className="m-2 px-4 py-2 rounded-lg bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FECACA] transition-colors"
                    onClick={deletarConta}
                  >
                    Excluir conta
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {altSenha && (
            <div className="fixed inset-0 bg-[#000000]/60 bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-[#FFFFFF] rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-in">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  atualizarSenha();
                }}>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-[#4B5EAA]">Alterar Senha</h2>
                    <button
                      type="button"
                      onClick={() => setAltSenha(null)}
                      className="text-[#6B7280] hover:text-[#4B5EAA] text-xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#4B5EAA] mb-1">
                        Senha atual
                      </label>
                      <input
                        required
                        type="password"
                        value={senha}
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded focus:outline-none focus:ring-2 focus:ring-[#D1E0F7] text-[#1F2937]"
                        onChange={(e) => setSenha(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4B5EAA] mb-1">
                        Nova senha
                      </label>
                      <input
                        required
                        type="password"
                        value={newSenha}
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded focus:outline-none focus:ring-2 focus:ring-[#D1E0F7] text-[#1F2937]"
                        onChange={(e) => setNewSenha(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setAltSenha(null)}
                      className="px-4 py-2 text-[#4B5EAA] bg-[#E6EFFD] rounded hover:bg-[#D1E0F7] transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#4B5EAA] text-white rounded hover:bg-[#3B4A8A] transition-colors"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}