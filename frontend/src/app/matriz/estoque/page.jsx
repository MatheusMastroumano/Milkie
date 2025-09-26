"use client";

import { useState } from "react";
import Header from "@/components/Header/page";

export default function Estoque() {
  const [lojas] = useState([
    { id: 1, nome: "Loja Centro", tipo: "Matriz" },
    { id: 2, nome: "Loja Sul", tipo: "Filial" },
  ]);

  const [estoque] = useState([
    { produto_id: 1, loja_id: 1, nomeProduto: "Camiseta Azul", quantidade: 50 },
    { produto_id: 2, loja_id: 1, nomeProduto: "Calça Jeans", quantidade: 20 },
    { produto_id: 3, loja_id: 2, nomeProduto: "Tênis Branco", quantidade: 15 },
    { produto_id: 4, loja_id: 1, nomeProduto: "Boné Preto", quantidade: 8 },
  ]);

  const [selectedLojaId, setSelectedLojaId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Filtra estoque da loja selecionada
  const filteredEstoque = selectedLojaId
    ? estoque
        .filter((item) => item.loja_id === parseInt(selectedLojaId))
        .filter((item) =>
          item.nomeProduto.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFFFF] pt-14 sm:pt-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6">
          {/* Título */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-8 text-center">
            Consulta de Estoque
          </h1>

          {/* Seleção de Loja */}
          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Selecione uma Loja
            </h2>
            <select
              value={selectedLojaId}
              onChange={(e) => setSelectedLojaId(e.target.value)}
              className="w-full sm:w-72 mx-auto block px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A4E73] transition-colors"
            >
              <option value="">Escolha uma loja</option>
              {lojas.map((loja) => (
                <option key={loja.id} value={loja.id}>
                  {loja.nome} ({loja.tipo})
                </option>
              ))}
            </select>
          </section>

          {/* Pesquisa de Produto */}
          {selectedLojaId && (
            <div className="mb-6 flex justify-center">
              <input
                type="text"
                placeholder="Pesquisar produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base text-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#2A4E73] transition-colors"
              />
            </div>
          )}

          {/* Estoque da Loja Selecionada */}
          {selectedLojaId ? (
            filteredEstoque.length === 0 ? (
              <p className="text-[#2A4E73] text-center font-medium">
                Nenhum produto encontrado no estoque desta loja.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base text-[#2A4E73] border-collapse rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-[#2A4E73] text-[#FFFFFF]">
                      <th className="px-3 sm:px-4 py-3 text-left rounded-tl-lg">
                        Código
                      </th>
                      <th className="px-3 sm:px-4 py-3 text-left">Produto</th>
                      <th className="px-3 sm:px-4 py-3 text-center rounded-tr-lg">
                        Quantidade
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEstoque.map((item) => (
                      <tr
                        key={`${item.produto_id}-${item.loja_id}`}
                        className="border-b border-gray-200 hover:bg-[#CFE8F9]"
                      >
                        <td className="px-3 sm:px-4 py-3">{item.produto_id}</td>
                        <td className="px-3 sm:px-4 py-3 truncate max-w-[200px]">
                          {item.nomeProduto}
                        </td>
                        <td
                          className={`px-3 sm:px-4 py-3 text-center font-semibold ${
                            item.quantidade < 10
                              ? "text-[#AD343E]"
                              : "text-[#2A4E73]"
                          }`}
                        >
                          {item.quantidade}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <p className="text-[#2A4E73] text-center font-medium">
              Selecione uma loja para visualizar o estoque.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
