"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header/page";

export default function FuncionarioDetails() {
  const router = useRouter();
  const params = useParams();
  const [funcionario, setFuncionario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recuperar os dados do funcionário do localStorage
    const funcionarioData = localStorage.getItem("funcionarioDetails");
    if (funcionarioData) {
      setFuncionario(JSON.parse(funcionarioData));
    }
    setLoading(false);
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-[#FFFFFF]">
          <div className="text-[#2A4E73] text-lg">Carregando...</div>
        </main>
      </>
    );
  }

  if (!funcionario) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-[#FFFFFF]">
          <div className="text-center max-w-md p-6 bg-[#F7FAFC] rounded-lg shadow">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#AD343E] mb-4">
              Funcionário não encontrado
            </h1>
            <p className="text-[#2A4E73] mb-6">
              Não foi possível carregar as informações do funcionário.
            </p>
            <button
              onClick={handleGoBack}
              className="px-6 py-3 text-sm font-medium text-white bg-[#2A4E73] rounded-md hover:bg-[#AD343E] transition-colors"
            >
              Voltar
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFFFF] pt-16 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          {/* Header da página */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleGoBack}
              className="flex items-center px-4 py-2 text-sm font-medium text-[#2A4E73] bg-[#F7FAFC] rounded-md hover:bg-[#CFE8F9] transition-colors"
            >
              ← Voltar
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73]">
              Detalhes do Funcionário
            </h1>
            <div></div>
          </div>

          {/* Card principal */}
          <div className="bg-[#F7FAFC] rounded-lg shadow-lg overflow-hidden">
            {/* Cabeçalho com nome e cargo */}
            <div className="bg-gradient-to-r from-[#2A4E73] to-[#1e3a5f] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">
                  {funcionario.nome}
                </h2>
                <p className="text-[#CFE8F9] text-sm">Cargo: {funcionario.cargo}</p>
              </div>
              <div className="text-right">
                <div className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Ativo
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Imagem/Avatar */}
              <div className="flex justify-center">
                <div className="bg-white border rounded-lg shadow-sm w-full h-64 flex items-center justify-center overflow-hidden">
                  <div className="text-center text-[#2A4E73] opacity-60">
                    <svg
                      className="mx-auto h-16 w-16 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <p className="text-sm">Sem imagem disponível</p>
                  </div>
                </div>
              </div>

              {/* Infos */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informações Básicas */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[#2A4E73] border-b border-[#CFE8F9] pb-1">
                    Informações Básicas
                  </h3>
                  <p><b>ID:</b> {funcionario.id}</p>
                  <p><b>Nome:</b> {funcionario.nome}</p>
                  <p><b>Cargo:</b> {funcionario.cargo}</p>
                </div>

                {/* Informações de Contato */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[#2A4E73] border-b border-[#CFE8F9] pb-1">
                    Informações de Contato
                  </h3>
                  <p><b>Telefone:</b> {funcionario.telefone}</p>
                  <p><b>Email:</b> {funcionario.email || "Não informado"}</p>
                </div>

                {/* Informações da Loja */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[#2A4E73] border-b border-[#CFE8F9] pb-1">
                    Loja
                  </h3>
                  <p><b>Nome da Loja:</b> {funcionario.loja}</p>
                  <p><b>ID da Loja:</b> {funcionario.loja_id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoBack}
              className="px-6 py-3 text-sm font-medium text-white bg-[#2A4E73] rounded-md hover:bg-[#AD343E] transition-colors"
            >
              Voltar à Lista
            </button>
            <button
              onClick={() => router.push("/matriz/funcionarios")}
              className="px-6 py-3 text-sm font-medium text-[#2A4E73] bg-white border border-[#2A4E73] rounded-md hover:bg-[#F7FAFC] transition-colors"
            >
              Editar Funcionário
            </button>
          </div>
        </div>
      </main>
    </>
  );
}