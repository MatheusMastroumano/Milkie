"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from "@/components/Headerfilial/page";

export default function Produtos() {
  const router = useRouter();
  const [fornecedores] = useState([
    { id: 1, nome: 'Fornecedor A' },
    { id: 2, nome: 'Fornecedor B' },
  ]);
  const [produtos] = useState([
    {
      id: 1,
      sku: 'ABC123',
      nome: 'Camiseta Básica',
      marca: 'Marca X',
      categoria: 'Roupas',
      descricao: 'Camiseta de algodão',
      fabricacao: '2023-01-01',
      validade: '2025-01-01',
      ativo: true,
      preco: 29.99,
      fornecedor_id: 1,
    },
    {
      id: 2,
      sku: 'XYZ789',
      nome: 'Calça Jeans',
      marca: 'Marca Y',
      categoria: 'Roupas',
      descricao: 'Calça jeans azul',
      fabricacao: '2023-06-01',
      validade: null,
      ativo: true,
      preco: 79.99,
      fornecedor_id: 2,
    },
  ]);

  // Função para navegar para a página de detalhes do produto
  const handleViewProduct = (produto) => {
    // Salvar os dados do produto no localStorage temporariamente
    localStorage.setItem('productDetails', JSON.stringify({
      ...produto,
      fornecedor: fornecedores.find(f => f.id === produto.fornecedor_id)?.nome || 'Sem fornecedor'
    }));
    router.push(`/matriz/produtos/${produto.id}`);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFFFF] pt-14 sm:pt-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6">
          {/* Título */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-6 text-center">
            Gerenciamento de Produtos
          </h1>

          {/* Notificação */}
          {/* (Removido pois não há ações que gerem notificações) */}

          {/* Tabela de Produtos */}
          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Lista de Produtos
            </h2>
            {produtos.length === 0 ? (
              <p className="text-[#2A4E73] text-center">Nenhum produto cadastrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base text-[#2A4E73] border-collapse">
                  <thead>
                    <tr className="bg-[#2A4E73] text-[#FFFFFF]">
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left rounded-tl-md">SKU</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Nome</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Marca</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Categoria</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Preço (R$)</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Fornecedor</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-center rounded-tr-md">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map((produto) => (
                      <tr 
                        key={produto.id} 
                        className="border-b border-gray-200 hover:bg-[#CFE8F9] cursor-pointer"
                        onClick={() => handleViewProduct(produto)}
                      >
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{produto.sku}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 truncate max-w-[150px] sm:max-w-[200px]">
                          {produto.nome}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{produto.marca || '-'}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{produto.categoria || '-'}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{produto.preco.toFixed(2)}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          {fornecedores.find((f) => f.id === produto.fornecedor_id)?.nome || 'Sem fornecedor'}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProduct(produto);
                            }}
                            className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                          >
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}