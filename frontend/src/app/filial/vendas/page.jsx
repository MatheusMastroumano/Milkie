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
    <div className="container mx-auto py-6">
        <Header />
      <h1 className="text-3xl font-bold mb-6">Gestão de Vendas - Filial</h1>

      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-[400px]">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    periodoFiltro === 'hoje'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setPeriodoFiltro('hoje')}
                >
                  Hoje
                </button>
                <button
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    periodoFiltro === 'semana'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setPeriodoFiltro('semana')}
                >
                  Esta Semana
                </button>
                <button
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    periodoFiltro === 'mes'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setPeriodoFiltro('mes')}
                >
                  Este Mês
                </button>
                <button
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    periodoFiltro === 'personalizado'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setPeriodoFiltro('personalizado')}
                >
                  Personalizado
                </button>
              </nav>
            </div>
            
            {periodoFiltro === 'personalizado' && (
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
        
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={iniciarNovaVenda}
        >
          Nova Venda
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="pb-2 border-b">
            <h3 className="text-sm font-medium text-gray-500">Total de Vendas</h3>
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">R$ {calcularTotalVendas()}</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="pb-2 border-b">
            <h3 className="text-sm font-medium text-gray-500">Quantidade de Vendas</h3>
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">{vendas.length}</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="pb-2 border-b">
            <h3 className="text-sm font-medium text-gray-500">Ticket Médio</h3>
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">
              R$ {vendas.length > 0 ? (calcularTotalVendas() / vendas.length).toFixed(2) : "0.00"}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Histórico de Vendas</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forma de Pagamento</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendas.map((venda) => (
                  <tr key={venda.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{venda.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatarData(venda.data)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venda.cliente}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venda.vendedor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venda.formaPagamento}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {venda.valorTotal.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 focus:outline-none border border-blue-600 px-2 py-1 rounded text-xs"
                        onClick={() => visualizarVenda(venda)}
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
      </div>
    </div>
  );
}