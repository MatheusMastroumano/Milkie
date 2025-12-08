"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header/page";
import { apiJson } from "@/lib/api";
import { Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function ProductDetails() {
  const router = useRouter();
  const params = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        setLoading(true);
        // Primeiro tenta buscar do localStorage (fallback)
        const productData = localStorage.getItem("productDetails");
        if (productData) {
          const produtoLocal = JSON.parse(productData);
          setProduto(produtoLocal);
        }
        
        // Busca da API usando o ID da URL
        if (params?.id) {
          const { produto: produtoApi } = await apiJson(`/produtos/${params.id}`);
          setProduto(produtoApi);
        }
      } catch (err) {
        console.error('Erro ao carregar produto:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [params?.id]);

  const handleGoBack = () => {
    router.back();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Não informado";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // Função para construir a URL completa da imagem
  const getImagemUrl = (imagemUrl) => {
    if (!imagemUrl) return null;
    // Se já é uma URL completa, retorna como está
    if (imagemUrl.startsWith('http://') || imagemUrl.startsWith('https://')) {
      return imagemUrl;
    }
    // Se é uma URL relativa, adiciona a URL da API
    return `${API_URL}${imagemUrl}`;
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-[#FFFFFF] pt-16">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#2A4E73]" />
            <div className="text-[#2A4E73] text-lg">Carregando produto...</div>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-[#FFFFFF] pt-16">
          <div className="text-center max-w-md p-6 bg-[#F7FAFC] rounded-lg shadow">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#AD343E] mb-4">
              Erro ao carregar produto
            </h1>
            <p className="text-[#2A4E73] mb-6">{error}</p>
            <button
              onClick={() => router.push("/matriz/produtos")}
              className="px-6 py-3 text-sm font-medium text-white bg-[#2A4E73] rounded-md hover:bg-[#AD343E] transition-colors"
            >
              Voltar à Lista
            </button>
          </div>
        </main>
      </>
    );
  }

  if (!produto) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-[#FFFFFF]">
          <div className="text-center max-w-md p-6 bg-[#F7FAFC] rounded-lg shadow">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#AD343E] mb-4">
              Produto não encontrado
            </h1>
            <p className="text-[#2A4E73] mb-6">
              Não foi possível carregar as informações do produto.
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
              Detalhes do Produto
            </h1>
            <div></div>
          </div>

          {/* Card principal */}
          <div className="bg-[#F7FAFC] rounded-lg shadow-lg overflow-hidden">
            {/* Cabeçalho com nome e preço */}
            <div className="bg-gradient-to-r from-[#2A4E73] to-[#1e3a5f] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">
                  {produto.nome}
                </h2>
                <p className="text-[#CFE8F9] text-sm">SKU: {produto.sku}</p>
              </div>
              <div className="text-right">
                <div
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    produto.ativo
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {produto.ativo ? "Ativo" : "Inativo"}
                </div>
                {produto.estoque?.[0]?.preco && (
                  <div className="text-2xl font-bold mt-1">
                    {formatPrice(produto.estoque[0].preco)}
                  </div>
                )}
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Imagem */}
              <div className="flex justify-center">
                <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg w-full min-h-[500px] flex items-center justify-center overflow-hidden">
                  {getImagemUrl(produto.imagem_url) ? (
                    <>
                      <img
                        key={produto.imagem_url}
                        src={getImagemUrl(produto.imagem_url)}
                        alt={`Imagem do produto ${produto.nome}`}
                        className="object-contain w-full h-full max-h-[500px] p-6"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const placeholder = e.target.parentElement.querySelector('.img-placeholder');
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                      <div className="hidden img-placeholder text-center text-[#2A4E73] opacity-60 w-full h-full flex-col items-center justify-center">
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
                            d="M4 16l4.586-4.586a2 0 012.828 0L16 16m-2-2l1.586-1.586a2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 0 002-2V6a2 0 00-2-2H6a2 0 00-2 2v12a2 0 002 2z"
                          />
                        </svg>
                        <p className="text-sm">Erro ao carregar imagem</p>
                      </div>
                    </>
                  ) : (
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
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm">Sem imagem disponível</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Infos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informações Básicas */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[#2A4E73] border-b border-[#CFE8F9] pb-1">
                    Informações Básicas
                  </h3>
                  <p><b>ID:</b> {produto.id}</p>
                  <p><b>Nome:</b> {produto.nome}</p>
                  <p><b>SKU:</b> {produto.sku}</p>
                  {produto.estoque?.[0]?.preco && (
                    <p>
                      <b>Preço:</b>{" "}
                      <span className="font-semibold text-green-600">
                        {formatPrice(produto.estoque[0].preco)}
                      </span>
                    </p>
                  )}
                  {produto.estoque?.[0]?.quantidade !== undefined && (
                    <p>
                      <b>Quantidade em estoque:</b>{" "}
                      <span className="font-semibold">
                        {produto.estoque[0].quantidade}
                      </span>
                    </p>
                  )}
                </div>

                {/* Categorização */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[#2A4E73] border-b border-[#CFE8F9] pb-1">
                    Categorização
                  </h3>
                  <p><b>Marca:</b> {produto.marca || "Não informada"}</p>
                  <p><b>Categoria:</b> {produto.categoria || "Não informada"}</p>
                  {produto.descricao && (
                    <p><b>Descrição:</b> {produto.descricao}</p>
                  )}
                </div>

                {/* Datas */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[#2A4E73] border-b border-[#CFE8F9] pb-1">
                    Datas
                  </h3>
                  <p><b>Fabricação:</b> {formatDate(produto.fabricacao)}</p>
                  <p><b>Validade:</b> {formatDate(produto.validade)}</p>
                  {produto.validade && (
                    <p>
                      <b>Status Validade:</b>{" "}
                      {(() => {
                        const today = new Date();
                        const validadeDate = new Date(produto.validade);
                        const diffDays = Math.ceil(
                          (validadeDate - today) / (1000 * 60 * 60 * 24)
                        );

                        if (diffDays < 0)
                          return (
                            <span className="text-red-600">
                              Vencido há {Math.abs(diffDays)} dias
                            </span>
                          );
                        if (diffDays <= 30)
                          return (
                            <span className="text-yellow-600">
                              Vence em {diffDays} dias
                            </span>
                          );
                        return (
                          <span className="text-green-600">Válido</span>
                        );
                      })()}
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Card técnico */}
          <div className="bg-[#F7FAFC] rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-[#2A4E73] mb-4">
              Informações Técnicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p>
                <b>ID Produto:</b>{" "}
                <span className="font-mono">{produto.id}</span>
              </p>
              <p>
                <b>Código SKU:</b>{" "}
                <span className="font-mono">{produto.sku}</span>
              </p>
              <p>
                <b>Status do Sistema:</b> {produto.ativo ? "Ativado" : "Desativado"}
              </p>
           
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
              onClick={() => {
                localStorage.setItem('productDetails', JSON.stringify(produto));
                router.push("/matriz/produtos");
              }}
              className="px-6 py-3 text-sm font-medium text-[#2A4E73] bg-white border border-[#2A4E73] rounded-md hover:bg-[#F7FAFC] transition-colors"
            >
              Voltar e Editar
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
