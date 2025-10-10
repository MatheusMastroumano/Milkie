"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header/page";

export default function VendasFilial() {
  const router = useRouter();
  const [vendas, setVendas] = useState([]);
  const [filialId, setFilialId] = useState(null); // ID da filial atual (deve ser obtido do contexto de autenticação)
  const [periodoFiltro, setPeriodoFiltro] = useState("hoje");
  const [lojas, setLojas] = useState([
    { id: 1, nome: "Loja Centro", tipo: "Matriz", endereco: "Rua Principal, 123" },
    { id: 2, nome: "Loja Sul", tipo: "Filial", endereco: "Av. Sul, 456" },
    { id: 3, nome: "Loja Norte", tipo: "Filial", endereco: "Rua Norte, 789" },
    { id: 4, nome: "Loja Oeste", tipo: "Filial", endereco: "Av. Oeste, 321" },
  ]);
  const [lojaSearchTerm, setLojaSearchTerm] = useState("");

  // Função para carregar vendas da filial
  useEffect(() => {
    carregarVendas();
  }, [filialId, periodoFiltro]);

  const carregarVendas = () => {
    // Simulação de dados - em produção, substituir por chamada à API
    const vendasSimuladas = [
      {
        id: 1,
        data: "2025-10-09T14:30:00",
        cliente: "Cliente Final",
        vendedor: "João Silva",
        itens: [
          { produto: "Leite Integral", quantidade: 2, valorUnitario: 5.99, valorTotal: 11.98 },
          { produto: "Queijo Minas", quantidade: 0.5, valorUnitario: 39.90, valorTotal: 19.95 },
        ],
        formaPagamento: "Cartão de Crédito",
        valorTotal: 31.93,
        status: "concluida",
        loja_id: 1,
      },
      {
        id: 2,
        data: "2025-10-09T16:45:00",
        cliente: "Maria Souza",
        vendedor: "Maria Oliveira",
        itens: [
          { produto: "Iogurte Natural", quantidade: 3, valorUnitario: 7.50, valorTotal: 22.50 },
          { produto: "Manteiga", quantidade: 1, valorUnitario: 12.90, valorTotal: 12.90 },
        ],
        formaPagamento: "Dinheiro",
        valorTotal: 35.40,
        status: "concluida",
        loja_id: 2,
      },
      {
        id: 3,
        data: "2025-10-08T10:15:00",
        cliente: "José Pereira",
        vendedor: "João Silva",
        itens: [
          { produto: "Queijo Prato", quantidade: 0.7, valorUnitario: 45.90, valorTotal: 32.13 },
          { produto: "Requeijão", quantidade: 2, valorUnitario: 8.99, valorTotal: 17.98 },
        ],
        formaPagamento: "Pix",
        valorTotal: 50.11,
        status: "concluida",
        loja_id: 3,
      },
    ];
    if (filialId) {
      setVendas(vendasSimuladas.filter(venda => venda.loja_id === filialId));
    } else {
      setVendas([]);
    }
  };

  // Função para iniciar nova venda (redirecionamento para PDV)
  const iniciarNovaVenda = () => {
    if (filialId) {
      router.push(`/filial/${filialId}/pdv`);
      alert(`Redirecionando: Abrindo o PDV para a filial ${filialId}`);
    } else {
      alert("Por favor, selecione uma filial antes de iniciar uma nova venda.");
    }
  };

  // Função para visualizar detalhes da venda
  const visualizarVenda = (venda) => {
    router.push(`/filial/${filialId}/vendas/${venda.id}`);
    alert(`Redirecionando: Visualizando detalhes da venda #${venda.id}`);
  };

  // Função para calcular o total de vendas
  const calcularTotalVendas = () => {
    return vendas.reduce((total, venda) => total + venda.valorTotal, 0).toFixed(2);
  };

  // Função para formatar data
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString() + " " + data.toLocaleTimeString().substring(0, 5);
  };

  // Filtrar lojas pelo termo de busca
  const filteredLojas = lojas.filter(
    (loja) =>
      loja.nome.toLowerCase().includes(lojaSearchTerm.toLowerCase()) ||
      loja.tipo.toLowerCase().includes(lojaSearchTerm.toLowerCase()) ||
      loja.endereco.toLowerCase().includes(lojaSearchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFFFF] pt-14 sm:pt-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6">
          {/* Título */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-6 text-center">
            Gestão de Vendas - Filial
          </h1>

          {/* Seleção de Loja e Filtros */}
          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6 mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Análise de Vendas
            </h2>

            {/* Busca de Loja */}
            <div className="mb-6">
              <label
                htmlFor="search-loja"
                className="block text-sm font-medium text-[#2A4E73] mb-2"
              >
                Buscar Loja
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search-loja"
                  value={lojaSearchTerm}
                  onChange={(e) => setLojaSearchTerm(e.target.value)}
                  className="w-full sm:w-80 px-4 py-2 pl-10 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                  placeholder="Digite o nome, tipo ou endereço da loja..."
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2A4E73]">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Lista de Lojas Filtradas */}
            {lojaSearchTerm && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-[#2A4E73] mb-3">
                  Lojas Encontradas:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredLojas.map((loja) => (
                    <div
                      key={loja.id}
                      onClick={() => {
                        setFilialId(loja.id);
                        setLojaSearchTerm("");
                      }}
                      className="p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-[#CFE8F9] hover:border-[#2A4E73] transition-colors"
                    >
                      <h4 className="font-semibold text-[#2A4E73]">
                        {loja.nome}
                      </h4>
                      <p className="text-sm text-gray-600">{loja.tipo}</p>
                      <p className="text-sm text-gray-500">{loja.endereco}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seleção de Loja */}
            <div className="mb-6">
              <label
                htmlFor="select-loja"
                className="block text-sm font-medium text-[#2A4E73] mb-2"
              >
                Filial Selecionada
              </label>
              <select
                id="select-loja"
                value={filialId || ""}
                onChange={(e) => setFilialId(parseInt(e.target.value))}
                className="w-full sm:w-80 px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
              >
                <option value="">Selecione uma filial</option>
                {lojas.map((loja) => (
                  <option key={loja.id} value={loja.id}>
                    {loja.nome} ({loja.tipo}) - {loja.endereco}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtros de Período */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#2A4E73] mb-2">
                Período
              </label>
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      periodoFiltro === "hoje"
                        ? "border-[#2A4E73] text-[#2A4E73]"
                        : "border-transparent text-[#2A4E73] hover:text-[#AD343E] hover:border-[#AD343E]"
                    }`}
                    onClick={() => setPeriodoFiltro("hoje")}
                  >
                    Hoje
                  </button>
                  <button
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      periodoFiltro === "semana"
                        ? "border-[#2A4E73] text-[#2A4E73]"
                        : "border-transparent text-[#2A4E73] hover:text-[#AD343E] hover:border-[#AD343E]"
                    }`}
                    onClick={() => setPeriodoFiltro("semana")}
                  >
                    Esta Semana
                  </button>
                </nav>
              </div>
            </div>

            {/* Botão Nova Venda */}
            <div className="mb-6">
              <button
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                onClick={iniciarNovaVenda}
              >
                Nova Venda
              </button>
            </div>

            {/* Cards de Resumo */}
            {filialId && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#F7FAFC] p-4 rounded-lg shadow-md">
                  <div className="pb-2 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-[#2A4E73]">Total de Vendas</h3>
                  </div>
                  <div className="pt-2">
                    <div className="text-2xl font-bold text-[#2A4E73]">
                      R$ {calcularTotalVendas()}
                    </div>
                  </div>
                </div>
                <div className="bg-[#F7FAFC] p-4 rounded-lg shadow-md">
                  <div className="pb-2 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-[#2A4E73]">
                      Quantidade de Vendas
                    </h3>
                  </div>
                  <div className="pt-2">
                    <div className="text-2xl font-bold text-[#2A4E73]">
                      {vendas.length}
                    </div>
                  </div>
                </div>
                <div className="bg-[#F7FAFC] p-4 rounded-lg shadow-md">
                  <div className="pb-2 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-[#2A4E73]">Ticket Médio</h3>
                  </div>
                  <div className="pt-2">
                    <div className="text-2xl font-bold text-[#2A4E73]">
                      R${" "}
                      {vendas.length > 0
                        ? (calcularTotalVendas() / vendas.length).toFixed(2)
                        : "0.00"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tabela de Histórico de Vendas */}
            {filialId && (
              <section className="bg-[#F7FAFC] rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
                    Histórico de Vendas
                  </h2>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm sm:text-base text-[#2A4E73] border-collapse">
                      <thead>
                        <tr className="bg-[#2A4E73] text-[#FFFFFF]">
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left rounded-tl-md">
                            ID
                          </th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">
                            Data/Hora
                          </th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">
                            Cliente
                          </th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">
                            Vendedor
                          </th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">
                            Forma de Pagamento
                          </th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">
                            Valor Total
                          </th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-center rounded-tr-md">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {vendas.length > 0 ? (
                          vendas.map((venda) => (
                            <tr
                              key={venda.id}
                              className="border-b border-gray-200 hover:bg-[#CFE8F9] cursor-pointer"
                              onClick={() => visualizarVenda(venda)}
                            >
                              <td className="px-3 sm:px-4 py-2 sm:py-3">#{venda.id}</td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3">
                                {formatarData(venda.data)}
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 truncate max-w-[150px] sm:max-w-[200px]">
                                {venda.cliente}
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3">{venda.vendedor}</td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3">
                                {venda.formaPagamento}
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3">
                                R$ {venda.valorTotal.toFixed(2)}
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    visualizarVenda(venda);
                                  }}
                                  className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                                >
                                  Detalhes
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="px-3 sm:px-4 py-2 sm:py-3 text-center text-[#2A4E73]">
                              Nenhuma venda encontrada para esta filial no período selecionado.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}
          </section>
        </div>
      </main>
    </>
  );
}