"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Headerfilial/page";

export default function VendasFilial() {
  const router = useRouter();
  const [vendas, setVendas] = useState([]);
  const [filialId, setFilialId] = useState(1); // ID da filial atual (deve ser obtido do contexto de autenticação)
  const [periodoFiltro, setPeriodoFiltro] = useState("hoje");
  const [dataInicio, setDataInicio] = useState(new Date().toISOString().split("T")[0]);
  const [dataFim, setDataFim] = useState(new Date().toISOString().split("T")[0]);

  // Função para carregar vendas da filial
  useEffect(() => {
    carregarVendas();
  }, [periodoFiltro, dataInicio, dataFim]);

  const carregarVendas = () => {
    // Simulação de dados - em produção, substituir por chamada à API
    const vendasSimuladas = [
      {
        id: 1,
        data: "2024-06-05T14:30:00",
        cliente: "Cliente Final",
        vendedor: "João Silva",
        itens: [
          { produto: "Leite Integral", quantidade: 2, valorUnitario: 5.99, valorTotal: 11.98 },
          { produto: "Queijo Minas", quantidade: 0.5, valorUnitario: 39.90, valorTotal: 19.95 },
        ],
        formaPagamento: "Cartão de Crédito",
        valorTotal: 31.93,
        status: "concluida",
      },
      {
        id: 2,
        data: "2024-06-05T16:45:00",
        cliente: "Maria Souza",
        vendedor: "Maria Oliveira",
        itens: [
          { produto: "Iogurte Natural", quantidade: 3, valorUnitario: 7.50, valorTotal: 22.50 },
          { produto: "Manteiga", quantidade: 1, valorUnitario: 12.90, valorTotal: 12.90 },
        ],
        formaPagamento: "Dinheiro",
        valorTotal: 35.40,
        status: "concluida",
      },
      {
        id: 3,
        data: "2024-06-04T10:15:00",
        cliente: "José Pereira",
        vendedor: "João Silva",
        itens: [
          { produto: "Queijo Prato", quantidade: 0.7, valorUnitario: 45.90, valorTotal: 32.13 },
          { produto: "Requeijão", quantidade: 2, valorUnitario: 8.99, valorTotal: 17.98 },
        ],
        formaPagamento: "Pix",
        valorTotal: 50.11,
        status: "concluida",
      },
    ];
    
    setVendas(vendasSimuladas);
  };

  // Função para iniciar nova venda (redirecionamento para PDV)
  const iniciarNovaVenda = () => {
    // Em produção, redirecionar para a página do PDV
    router.push("/filial/pdv");
    
    alert("Redirecionando: Abrindo o PDV para nova venda");
  };

  // Função para visualizar detalhes da venda
  const visualizarVenda = (venda) => {
    // Em produção, redirecionar para a página de detalhes da venda
    router.push(`/filial/vendas/${venda.id}`);
    
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

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFFFF] pt-14 sm:pt-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6">
          {/* Título */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-6 text-center">
            Gestão de Vendas - Filial
          </h1>

          {/* Filtros e Botão Nova Venda */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-[400px]">
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
                    <button
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        periodoFiltro === "mes"
                          ? "border-[#2A4E73] text-[#2A4E73]"
                          : "border-transparent text-[#2A4E73] hover:text-[#AD343E] hover:border-[#AD343E]"
                      }`}
                      onClick={() => setPeriodoFiltro("mes")}
                    >
                      Este Mês
                    </button>
                    <button
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        periodoFiltro === "personalizado"
                          ? "border-[#2A4E73] text-[#2A4E73]"
                          : "border-transparent text-[#2A4E73] hover:text-[#AD343E] hover:border-[#AD343E]"
                      }`}
                      onClick={() => setPeriodoFiltro("personalizado")}
                    >
                      Personalizado
                    </button>
                  </nav>
                </div>

                {periodoFiltro === "personalizado" && (
                  <div className="mt-2">
                    <div className="flex space-x-2">
                      <div>
                        <label
                          htmlFor="dataInicio"
                          className="block text-sm font-medium text-[#2A4E73] mb-1"
                        >
                          De
                        </label>
                        <input
                          id="dataInicio"
                          type="date"
                          className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                          value={dataInicio}
                          onChange={(e) => setDataInicio(e.target.value)}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="dataFim"
                          className="block text-sm font-medium text-[#2A4E73] mb-1"
                        >
                          Até
                        </label>
                        <input
                          id="dataFim"
                          type="date"
                          className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                          value={dataFim}
                          onChange={(e) => setDataFim(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
              onClick={iniciarNovaVenda}
            >
              Nova Venda
            </button>
          </div>

          {/* Cards de Resumo */}
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

          {/* Tabela de Histórico de Vendas */}
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
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Data/Hora</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Cliente</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Vendedor</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">
                        Forma de Pagamento
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Valor Total</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-center rounded-tr-md">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendas.map((venda) => (
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}