"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Headerfilial/page";

export default function FinanceiroFilial() {
  const router = useRouter();
  const [transacoes, setTransacoes] = useState([]);
  const [filialId, setFilialId] = useState(1); // ID da filial atual (deve ser obtido do contexto de autenticação)
  const [periodoFiltro, setPeriodoFiltro] = useState("mes");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [dataInicio, setDataInicio] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]
  );
  const [dataFim, setDataFim] = useState(new Date().toISOString().split("T")[0]);

  // Função para carregar transações da filial
  useEffect(() => {
    carregarTransacoes();
  }, [periodoFiltro, tipoFiltro, dataInicio, dataFim]);

  const carregarTransacoes = () => {
    // Simulação de dados - em produção, substituir por chamada à API
    const transacoesSimuladas = [
      {
        id: 1,
        data: "2024-06-05T14:30:00",
        descricao: "Venda #1",
        tipo: "receita",
        categoria: "Vendas",
        valor: 31.93,
        formaPagamento: "Cartão de Crédito",
        status: "confirmado",
      },
      {
        id: 2,
        data: "2024-06-05T16:45:00",
        descricao: "Venda #2",
        tipo: "receita",
        categoria: "Vendas",
        valor: 35.40,
        formaPagamento: "Dinheiro",
        status: "confirmado",
      },
      {
        id: 3,
        data: "2024-06-04T10:15:00",
        descricao: "Venda #3",
        tipo: "receita",
        categoria: "Vendas",
        valor: 50.11,
        formaPagamento: "Pix",
        status: "confirmado",
      },
      {
        id: 4,
        data: "2024-06-03T09:30:00",
        descricao: "Compra de material de limpeza",
        tipo: "despesa",
        categoria: "Manutenção",
        valor: 45.90,
        formaPagamento: "Dinheiro",
        status: "confirmado",
      },
      {
        id: 5,
        data: "2024-06-02T11:20:00",
        descricao: "Pagamento de energia",
        tipo: "despesa",
        categoria: "Utilidades",
        valor: 320.75,
        formaPagamento: "Transferência",
        status: "confirmado",
      },
    ];
    
    // Filtrar por tipo
    let transacoesFiltradas = transacoesSimuladas;
    if (tipoFiltro !== "todos") {
      transacoesFiltradas = transacoesFiltradas.filter(t => t.tipo === tipoFiltro);
    }
    
    setTransacoes(transacoesFiltradas);
  };

  // Função para calcular o total de receitas
  const calcularTotalReceitas = () => {
    return transacoes
      .filter(t => t.tipo === "receita")
      .reduce((total, t) => total + t.valor, 0)
      .toFixed(2);
  };

  // Função para calcular o total de despesas
  const calcularTotalDespesas = () => {
    return transacoes
      .filter(t => t.tipo === "despesa")
      .reduce((total, t) => total + t.valor, 0)
      .toFixed(2);
  };

  // Função para calcular o saldo
  const calcularSaldo = () => {
    return (parseFloat(calcularTotalReceitas()) - parseFloat(calcularTotalDespesas())).toFixed(2);
  };

  // Função para formatar data
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString();
  };

  const [activeTab, setActiveTab] = useState(periodoFiltro);

  return (
    <div className="container mx-auto py-6">
      <Header />
      <h1 className="text-3xl font-bold mb-6">Gestão Financeira - Filial</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-[400px]">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'hoje'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setActiveTab('hoje');
                    setPeriodoFiltro('hoje');
                  }}
                >
                  Hoje
                </button>
                <button
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'semana'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setActiveTab('semana');
                    setPeriodoFiltro('semana');
                  }}
                >
                  Esta Semana
                </button>
                <button
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'mes'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setActiveTab('mes');
                    setPeriodoFiltro('mes');
                  }}
                >
                  Este Mês
                </button>
                <button
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'personalizado'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setActiveTab('personalizado');
                    setPeriodoFiltro('personalizado');
                  }}
                >
                  Personalizado
                </button>
              </nav>
            </div>
            
            {activeTab === 'personalizado' && (
              <div className="mt-2">
                <div className="flex space-x-2">
                  <div>
                    <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700">De</label>
                    <input
                      id="dataInicio"
                      type="date"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700">Até</label>
                    <input
                      id="dataFim"
                      type="date"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              tipoFiltro === "todos" 
                ? "bg-blue-600 text-white" 
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setTipoFiltro("todos")}
          >
            Todos
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              tipoFiltro === "receita" 
                ? "bg-blue-600 text-white" 
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setTipoFiltro("receita")}
          >
            Receitas
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              tipoFiltro === "despesa" 
                ? "bg-blue-600 text-white" 
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setTipoFiltro("despesa")}
          >
            Despesas
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="pb-2 border-b">
            <h3 className="text-sm font-medium text-gray-500">Total de Receitas</h3>
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold text-green-600">R$ {calcularTotalReceitas()}</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="pb-2 border-b">
            <h3 className="text-sm font-medium text-gray-500">Total de Despesas</h3>
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold text-red-600">R$ {calcularTotalDespesas()}</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="pb-2 border-b">
            <h3 className="text-sm font-medium text-gray-500">Saldo</h3>
          </div>
          <div className="pt-2">
            <div className={`text-2xl font-bold ${parseFloat(calcularSaldo()) >= 0 ? "text-green-600" : "text-red-600"}`}>
              R$ {calcularSaldo()}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Histórico de Transações</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forma de Pagamento</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transacoes.map((transacao) => (
                  <tr key={transacao.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatarData(transacao.data)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transacao.descricao}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transacao.categoria}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transacao.formaPagamento}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${transacao.tipo === "receita" ? "text-green-600" : "text-red-600"}`}>
                      {transacao.tipo === "receita" ? "+" : "-"}R$ {transacao.valor.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transacao.tipo === "receita" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {transacao.tipo === "receita" ? "Receita" : "Despesa"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}