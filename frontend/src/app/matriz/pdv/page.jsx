"use client";

import { useState } from 'react';
import Header from "@/components/Header/page";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Vendas() {
  const [lojas, setLojas] = useState([
    { id: 1, nome: 'Loja Centro', tipo: 'Matriz', endereco: 'Rua Principal, 123' },
    { id: 2, nome: 'Loja Sul', tipo: 'Filial', endereco: 'Av. Sul, 456' },
    { id: 3, nome: 'Loja Norte', tipo: 'Filial', endereco: 'Rua Norte, 789' },
    { id: 4, nome: 'Loja Oeste', tipo: 'Filial', endereco: 'Av. Oeste, 321' },
  ]);
  const [vendas, setVendas] = useState([
    {
      id: 1,
      loja_id: 1,
      data: '2025-09-30',
      itens: [
        { produto: 'Camiseta Básica', quantidade: 5, preco: 29.99, total: 149.95 },
        { produto: 'Calça Jeans', quantidade: 2, preco: 79.99, total: 159.98 },
      ],
      total_geral: 309.93,
    },
    {
      id: 2,
      loja_id: 2,
      data: '2025-09-30',
      itens: [
        { produto: 'Camiseta Básica', quantidade: 3, preco: 29.99, total: 89.97 },
        { produto: 'Calça Jeans', quantidade: 4, preco: 79.99, total: 319.96 },
      ],
      total_geral: 409.93,
    },
    {
      id: 3,
      loja_id: 3,
      data: '2025-09-30',
      itens: [
        { produto: 'Camiseta Básica', quantidade: 1, preco: 29.99, total: 29.99 },
      ],
      total_geral: 29.99,
    },
    {
      id: 4,
      loja_id: 4,
      data: '2025-09-30',
      itens: [
        { produto: 'Calça Jeans', quantidade: 3, preco: 79.99, total: 239.97 },
      ],
      total_geral: 239.97,
    },
    {
      id: 5,
      loja_id: 1,
      data: '2025-09-29',
      itens: [
        { produto: 'Camiseta Básica', quantidade: 4, preco: 29.99, total: 119.96 },
      ],
      total_geral: 119.96,
    },
    {
      id: 6,
      loja_id: 1,
      data: '2025-09-28',
      itens: [
        { produto: 'Camiseta Básica', quantidade: 2, preco: 29.99, total: 59.98 },
        { produto: 'Calça Jeans', quantidade: 1, preco: 79.99, total: 79.99 },
      ],
      total_geral: 139.97,
    },
  ]);
  const [selectedLojaId, setSelectedLojaId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [lojaSearchTerm, setLojaSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);

  // Função para mostrar notificação
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Data atual
  const today = '2025-09-30';

  // Gerar datas dos últimos 7 dias
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(2025, 8, 30 - i); // September is month 8 (0-based)
      dates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    }
    return dates;
  };

  // Dados para os gráficos
  const last7Days = getLast7Days();

  // Line Chart: Vendas dos últimos 7 dias para a loja selecionada
  const salesTrendData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Vendas (R$)',
        data: last7Days.map(date => {
          if (!selectedLojaId) return 0;
          const dailySales = vendas
            .filter(venda => venda.loja_id === parseInt(selectedLojaId) && venda.data === date)
            .reduce((sum, venda) => sum + venda.total_geral, 0);
          return dailySales;
        }),
        borderColor: '#2A4E73',
        backgroundColor: '#CFE8F9',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Bar Chart: Produtos mais vendidos (quantidade) na loja selecionada no dia atual
  const topProductsData = {
    labels: [...new Set(
      vendas
        .filter(venda => venda.loja_id === parseInt(selectedLojaId) && venda.data === today)
        .flatMap(venda => venda.itens.map(item => item.produto))
    )],
    datasets: [
      {
        label: 'Quantidade Vendida',
        data: [...new Set(
          vendas
            .filter(venda => venda.loja_id === parseInt(selectedLojaId) && venda.data === today)
            .flatMap(venda => venda.itens.map(item => item.produto))
        )].map(produto => {
          return vendas
            .filter(venda => venda.loja_id === parseInt(selectedLojaId) && venda.data === today)
            .flatMap(venda => venda.itens)
            .filter(item => item.produto === produto)
            .reduce((sum, item) => sum + item.quantidade, 0);
        }),
        backgroundColor: ['#2A4E73', '#AD343E', '#CFE8F9', '#F7FAFC'],
        borderColor: '#FFFFFF',
        borderWidth: 1,
      },
    ],
  };

  // Pie Chart: Distribuição de vendas por loja no dia atual
  const salesDistributionData = {
    labels: lojas.map(loja => loja.nome),
    datasets: [
      {
        label: 'Vendas por Loja (R$)',
        data: lojas.map(loja => {
          return vendas
            .filter(venda => venda.loja_id === loja.id && venda.data === today)
            .reduce((sum, venda) => sum + venda.total_geral, 0);
        }),
        backgroundColor: ['#2A4E73', '#AD343E', '#CFE8F9', '#F7FAFC'],
        borderColor: '#FFFFFF',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#2A4E73',
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        color: '#2A4E73',
        font: { size: 16, weight: 'bold' },
      },
    },
    scales: {
      x: {
        ticks: { color: '#2A4E73' },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#2A4E73' },
        grid: { color: '#CFE8F9' },
      },
    },
  };

  // Filtrar lojas pelo termo de busca
  const filteredLojas = lojas.filter(loja => 
    loja.nome.toLowerCase().includes(lojaSearchTerm.toLowerCase()) ||
    loja.tipo.toLowerCase().includes(lojaSearchTerm.toLowerCase()) ||
    loja.endereco.toLowerCase().includes(lojaSearchTerm.toLowerCase())
  );

  // Filtrar vendas pela loja selecionada, data atual e pelo termo de busca
  const filteredVendas = selectedLojaId
    ? vendas
        .filter((venda) => venda.loja_id === parseInt(selectedLojaId) && venda.data === today)
        .flatMap(venda => 
          venda.itens.map(item => ({
            ...item,
            data: venda.data
          }))
        )
        .filter((item) =>
          item.produto.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : [];

  // Calcular total geral das vendas filtradas
  const totalGeral = filteredVendas.reduce((sum, item) => sum + item.total, 0);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFFFF] pt-14 sm:pt-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6">
          {/* Título */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-6 text-center">
            Dashboard de Vendas
          </h1>

          {/* Seleção de Loja e Vendas */}
          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6 mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Análise de Vendas
            </h2>

            {/* Busca de Loja */}
            <div className="mb-6">
              <label htmlFor="search-loja" className="block text-sm font-medium text-[#2A4E73] mb-2">
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Lista de Lojas Filtradas */}
            {lojaSearchTerm && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-[#2A4E73] mb-3">Lojas Encontradas:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredLojas.map((loja) => (
                    <div
                      key={loja.id}
                      onClick={() => {
                        setSelectedLojaId(loja.id.toString());
                        setLojaSearchTerm('');
                      }}
                      className="p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-[#CFE8F9] hover:border-[#2A4E73] transition-colors"
                    >
                      <h4 className="font-semibold text-[#2A4E73]">{loja.nome}</h4>
                      <p className="text-sm text-gray-600">{loja.tipo}</p>
                      <p className="text-sm text-gray-500">{loja.endereco}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seleção de Loja */}
            <div className="mb-6">
              <label htmlFor="select-loja" className="block text-sm font-medium text-[#2A4E73] mb-2">
                Loja Selecionada
              </label>
              <select
                id="select-loja"
                value={selectedLojaId}
                onChange={(e) => setSelectedLojaId(e.target.value)}
                className="w-full sm:w-80 px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
              >
                <option value="">Selecione uma loja</option>
                {lojas.map((loja) => (
                  <option key={loja.id} value={loja.id}>
                    {loja.nome} ({loja.tipo}) - {loja.endereco}
                  </option>
                ))}
              </select>
            </div>

            {/* Gráficos */}
            {selectedLojaId && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#2A4E73] mb-4">Análise Visual</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Line Chart: Tendência de Vendas */}
                  <div className="bg-[#FFFFFF] rounded-lg shadow-md p-4">
                    <h4 className="text-md font-medium text-[#2A4E73] mb-3">Tendência de Vendas (7 Dias)</h4>
                    <div className="h-64">
                      <Line
                        data={salesTrendData}
                        options={{
                          ...chartOptions,
                          plugins: {
                            ...chartOptions.plugins,
                            title: { ...chartOptions.plugins.title, text: 'Vendas Diárias (R$)' },
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* Bar Chart: Produtos Mais Vendidos */}
                  <div className="bg-[#FFFFFF] rounded-lg shadow-md p-4">
                    <h4 className="text-md font-medium text-[#2A4E73] mb-3">Produtos Mais Vendidos (Hoje)</h4>
                    <div className="h-64">
                      <Bar
                        data={topProductsData}
                        options={{
                          ...chartOptions,
                          plugins: {
                            ...chartOptions.plugins,
                            title: { ...chartOptions.plugins.title, text: 'Quantidade Vendida por Produto' },
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* Pie Chart: Distribuição de Vendas por Loja */}
                  <div className="bg-[#FFFFFF] rounded-lg shadow-md p-4">
                    <h4 className="text-md font-medium text-[#2A4E73] mb-3">Distribuição de Vendas (Hoje)</h4>
                    <div className="h-64">
                      <Pie
                        data={salesDistributionData}
                        options={{
                          ...chartOptions,
                          plugins: {
                            ...chartOptions.plugins,
                            title: { ...chartOptions.plugins.title, text: 'Vendas por Loja (R$)' },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pesquisa de Item Vendido */}
            {selectedLojaId && (
              <div className="mb-6">
                <label htmlFor="search-item" className="block text-sm font-medium text-[#2A4E73] mb-2">
                  Pesquisar Item Vendido
                </label>
                <input
                  type="text"
                  id="search-item"
                  placeholder="Digite o nome do produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base text-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                />
              </div>
            )}

            {/* Notificação */}
            {notification && (
              <div className="w-full max-w-md mx-auto mb-4 p-4 px-4 py-2 bg-[#CFE8F9] text-[#2A4E73] rounded-md shadow-md text-sm sm:text-base font-medium text-center animate-fadeIn">
                {notification}
              </div>
            )}

            {/* Tabela de Vendas */}
            {selectedLojaId ? (
              filteredVendas.length === 0 ? (
                <p className="text-[#2A4E73] text-center">Nenhuma venda encontrada para esta loja no dia de hoje.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm sm:text-base text-[#2A4E73] border-collapse">
                    <thead>
                      <tr className="bg-[#2A4E73] text-[#FFFFFF]">
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left rounded-tl-md">Data</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Produto</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Quantidade</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Preço (R$)</th>
                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left rounded-tr-md">Total (R$)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVendas.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-[#CFE8F9]">
                          <td className="px-3 sm:px-4 py-2 sm:py-3">{item.data}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 truncate max-w-[150px] sm:max-w-[200px]">
                            {item.produto}
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3">{item.quantidade}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3">{item.preco.toFixed(2)}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3">{item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="bg-[#CFE8F9] font-bold">
                        <td colSpan="4" className="px-3 sm:px-4 py-2 sm:py-3 text-right">Total Geral:</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{totalGeral.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <p className="text-[#2A4E73] text-center">Selecione uma loja para ver as vendas.</p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}