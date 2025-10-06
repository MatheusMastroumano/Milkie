"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RelatoriosFilial() {
  const router = useRouter();
  const [tipoRelatorio, setTipoRelatorio] = useState("vendas");
  const [periodoFiltro, setPeriodoFiltro] = useState("mes");
  const [dataInicio, setDataInicio] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]
  );
  const [dataFim, setDataFim] = useState(new Date().toISOString().split("T")[0]);
  const [dadosRelatorio, setDadosRelatorio] = useState([]);
  const [filialId, setFilialId] = useState(1); // ID da filial atual (deve ser obtido do contexto de autenticação)
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarDadosRelatorio();
  }, [tipoRelatorio, periodoFiltro, dataInicio, dataFim]);

  const carregarDadosRelatorio = () => {
    setCarregando(true);
    
    // Simulação de dados - em produção, substituir por chamada à API
    setTimeout(() => {
      let dados = [];
      
      if (tipoRelatorio === "vendas") {
        dados = [
          { nome: "Segunda", valor: 1200 },
          { nome: "Terça", valor: 1500 },
          { nome: "Quarta", valor: 1800 },
          { nome: "Quinta", valor: 1300 },
          { nome: "Sexta", valor: 2100 },
          { nome: "Sábado", valor: 2500 },
          { nome: "Domingo", valor: 1100 },
        ];
      } else if (tipoRelatorio === "produtos") {
        dados = [
          { nome: "Sorvete de Chocolate", valor: 350 },
          { nome: "Sorvete de Morango", valor: 310 },
          { nome: "Sorvete de Baunilha", valor: 280 },
          { nome: "Milkshake", valor: 200 },
          { nome: "Açaí", valor: 150 },
        ];
      } else if (tipoRelatorio === "financeiro") {
        dados = [
          { nome: "Receitas", valor: 12500 },
          { nome: "Despesas", valor: 8700 },
          { nome: "Lucro", valor: 3800 },
        ];
      } else if (tipoRelatorio === "estoque") {
        dados = [
          { nome: "Chocolate", valor: 45 },
          { nome: "Morango", valor: 38 },
          { nome: "Baunilha", valor: 52 },
          { nome: "Açaí", valor: 30 },
          { nome: "Pistache", valor: 25 },
        ];
      }
      
      setDadosRelatorio(dados);
      setCarregando(false);
    }, 500);
  };

  const gerarRelatorio = () => {
    alert("Relatório gerado com sucesso e está pronto para download.");
  };

  const renderizarTabela = () => {
    if (carregando) {
      return <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dadosRelatorio.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.nome}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {tipoRelatorio === "vendas" || tipoRelatorio === "financeiro" 
                    ? `R$ ${item.valor.toFixed(2)}` 
                    : item.valor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios - Filial</h1>
        <div className="text-sm text-gray-500">
          Acesso restrito à sua filial
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Tipo de Relatório</h2>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={tipoRelatorio} 
            onChange={(e) => setTipoRelatorio(e.target.value)}
          >
            <option value="vendas">Vendas</option>
            <option value="produtos">Produtos</option>
            <option value="financeiro">Financeiro</option>
            <option value="estoque">Estoque</option>
          </select>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4 md:col-span-3">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Período</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                periodoFiltro === 'hoje' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setPeriodoFiltro('hoje')}
            >
              Hoje
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                periodoFiltro === 'semana' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setPeriodoFiltro('semana')}
            >
              Esta Semana
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                periodoFiltro === 'mes' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setPeriodoFiltro('mes')}
            >
              Este Mês
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                periodoFiltro === 'personalizado' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setPeriodoFiltro('personalizado')}
            >
              Personalizado
            </button>
          </div>
          
          {periodoFiltro === 'personalizado' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700 mb-1">
                  Data Inicial
                </label>
                <input
                  id="dataInicio"
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700 mb-1">
                  Data Final
                </label>
                <input
                  id="dataFim"
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <button 
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={carregarDadosRelatorio}
                >
                  Aplicar Filtro
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {tipoRelatorio === "vendas" && "Relatório de Vendas"}
            {tipoRelatorio === "produtos" && "Relatório de Produtos"}
            {tipoRelatorio === "financeiro" && "Relatório Financeiro"}
            {tipoRelatorio === "estoque" && "Relatório de Estoque"}
          </h2>
        </div>
        <div className="px-6 py-4">
          {renderizarTabela()}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={gerarRelatorio}
        >
          Exportar Relatório
        </button>
      </div>
    </div>
  );
}