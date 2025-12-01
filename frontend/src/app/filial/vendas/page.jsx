"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Headerfilial/page";
import Footer from '@/components/Footerfilial/page';
import { apiJson } from "@/lib/api";

export default function VendasFilial() {
  const router = useRouter();
  const [vendas, setVendas] = useState([]);
  const [filialId, setFilialId] = useState(null);
  const [periodoFiltro, setPeriodoFiltro] = useState("hoje");
  const [dataInicio, setDataInicio] = useState(new Date().toISOString().split("T")[0]);
  const [dataFim, setDataFim] = useState(new Date().toISOString().split("T")[0]);

  // Obter filial do usuário logado
  useEffect(() => {
    (async () => {
      try {
        const auth = await apiJson('/auth/check-auth');
        setFilialId(Number(auth?.user?.loja_id) || null);
      } catch {
        setFilialId(null);
      }
    })();
  }, []);

  // Carregar vendas da filial via API
  useEffect(() => {
    if (!filialId) return;
    (async () => {
      try {
        // Buscar vendas e detalhes
        const vendasData = await apiJson('/vendas');
        const [itensRes, pagamentosRes] = await Promise.all([
          apiJson('/venda-itens').catch(() => ({ vendaItens: [] })),
          apiJson('/venda-pagamentos').catch(() => ({ vendaPagamentos: [] })),
        ]);

        let vendasFiltradas = (vendasData.vendas || []).filter(v => v.loja_id === filialId);

        // Filtrar por período
        const now = new Date();
        if (periodoFiltro === 'hoje') {
          const hoje = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          vendasFiltradas = vendasFiltradas.filter(v => new Date(v.data) >= hoje);
        } else if (periodoFiltro === 'semana') {
          const semana = new Date(now);
          semana.setDate(semana.getDate() - 7);
          vendasFiltradas = vendasFiltradas.filter(v => new Date(v.data) >= semana);
        } else if (periodoFiltro === 'mes') {
          const mes = new Date(now.getFullYear(), now.getMonth(), 1);
          vendasFiltradas = vendasFiltradas.filter(v => new Date(v.data) >= mes);
        } else if (periodoFiltro === 'personalizado') {
          const ini = new Date(dataInicio);
          const fim = new Date(dataFim);
          fim.setHours(23,59,59,999);
          vendasFiltradas = vendasFiltradas.filter(v => {
            const d = new Date(v.data);
            return d >= ini && d <= fim;
          });
        }

        const todosItens = itensRes.vendaItens || itensRes.venda_itens || [];
        const todosPagamentos = pagamentosRes.vendaPagamentos || pagamentosRes.venda_pagamentos || [];

        const comDetalhes = vendasFiltradas.map((v) => {
          const itens = todosItens.filter(i => i.venda_id === v.id);
          const pagamentos = todosPagamentos.filter(p => p.venda_id === v.id);
          return {
            id: v.id,
            data: v.data,
            cliente: v.comprador_cpf || 'Cliente Final',
            vendedor: v.usuario?.funcionario?.nome || 'N/A',
            itens: itens.map(i => ({
              produto: i.produto?.nome || 'Produto',
              quantidade: parseFloat(i.quantidade || 0),
              valorUnitario: parseFloat(i.preco_unitario || 0),
              valorTotal: parseFloat(i.subtotal || 0),
            })),
            formaPagamento: pagamentos[0]?.metodo || 'N/A',
            valorTotal: parseFloat(v.valor_total || 0),
            status: 'concluida',
          };
        });

        setVendas(comDetalhes);
      } catch (e) {
        console.error('Erro ao carregar vendas da filial:', e);
        setVendas([]);
      }
    })();
  }, [filialId, periodoFiltro, dataInicio, dataFim]);

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
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      <Footer />
      </main>
      
    </>
  );
}