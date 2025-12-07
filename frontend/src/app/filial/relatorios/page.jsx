"use client";

import { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
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
} from 'chart.js';
import { format } from 'date-fns';
import Header from "@/components/Headerfilial/page";

// Registrar componentes do Chart.js
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

// Simulação de contexto do usuário logado (substituir por autenticação real)
const getLoggedInFilialId = () => {
  // Em um ambiente real, isso viria do contexto de autenticação
  // Exemplo: retorna o ID da filial do gerente logado
  return 2; // Exemplo: Gerente da Loja Sul (ID 2)
};

export default function RelatoriosParaFiliais() {
  const [lojas, setLojas] = useState([
    { id: 1, nome: 'Loja Centro', tipo: 'Matriz' },
    { id: 2, nome: 'Loja Sul', tipo: 'Filial' },
    { id: 3, nome: 'Loja Norte', tipo: 'Filial' },
    { id: 4, nome: 'Loja Oeste', tipo: 'Filial' },
  ]);
  const [entradas, setEntradas] = useState([
    { id: 1, loja_id: 1, valor: 5000, data: '2025-10-02', tipo: 'Venda PDV' },
    { id: 2, loja_id: 2, valor: 3000, data: '2025-10-02', tipo: 'Venda PDV' },
    { id: 3, loja_id: 1, valor: 4500, data: '2025-10-01', tipo: 'Venda PDV' },
    { id: 4, loja_id: 3, valor: 2000, data: '2025-09-30', tipo: 'Venda PDV' },
    { id: 5, loja_id: 4, valor: 3500, data: '2025-09-29', tipo: 'Venda PDV' },
  ]);
  const [saidas, setSaidas] = useState([
    { id: 1, loja_id: 1, descricao: 'Aluguel', valor: 5000, data: '2025-10-02', tipo: 'Despesa' },
    { id: 2, loja_id: 1, descricao: 'Energia', valor: 1200, data: '2025-10-02', tipo: 'Despesa' },
    { id: 3, loja_id: 1, fornecedor: 'Fornecedor A', valor: 3000, data: '2025-10-02', tipo: 'Fornecedor', status: 'Pendente' },
    { id: 4, loja_id: 1, funcionario: 'Ana Silva', valor: 2000, data: '2025-10-02', tipo: 'Salário' },
    { id: 5, loja_id: 2, descricao: 'Manutenção', valor: 800, data: '2025-09-30', tipo: 'Despesa' },
  ]);
  const [startDate, setStartDate] = useState(format(new Date('2025-09-29'), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedLojaId, setSelectedLojaId] = useState(getLoggedInFilialId()); // Fixado para a filial do gerente
  const [notification, setNotification] = useState(null);

  // Função para mostrar notificação
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Filtrar dados apenas para a filial do gerente
  const filterDataForFilial = (items) => {
    return items.filter(item => {
      const itemDate = new Date(item.data);
      const start = new Date(startDate);
      const end = new Date(endDate);
      const inDateRange = itemDate >= start && itemDate <= end;
      const isOwnFilial = item.loja_id === selectedLojaId;
      return inDateRange && isOwnFilial;
    });
  };

  // Preparar dados para gráficos e relatórios
  const prepareTrendData = () => {
    const dates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    while (currentDate <= end) {
      dates.push(format(currentDate, 'yyyy-MM-dd'));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const data = dates.map(date => {
      const entradasDia = entradas.filter(e => e.data === date && e.loja_id === selectedLojaId).reduce((sum, e) => sum + parseFloat(e.valor), 0);
      const saidasDia = saidas.filter(s => s.data === date && s.loja_id === selectedLojaId).reduce((sum, s) => sum + parseFloat(s.valor), 0);
      return { date: format(new Date(date), 'dd/MM'), saldo: entradasDia - saidasDia };
    });
    return data;
  };

  // Calcular relatórios
  const calculateRelatorio = () => {
    const entradasFiltradas = filterDataForFilial(entradas);
    const saidasFiltradas = filterDataForFilial(saidas);
    
    const totalEntradas = entradasFiltradas.reduce((sum, e) => sum + parseFloat(e.valor), 0);
    const totalSaidas = saidasFiltradas.reduce((sum, s) => sum + parseFloat(s.valor), 0);
    const saldo = totalEntradas - totalSaidas;

    const relatorioPorFilial = lojas
      .filter(loja => loja.id === selectedLojaId)
      .map(loja => ({
        loja: loja.nome,
        entradas: totalEntradas,
        saidas: totalSaidas,
        saldo: saldo,
      }));

    const categoriasSaidas = [...new Set(saidasFiltradas.map(s => s.tipo))].map(tipo => ({
      tipo,
      total: saidasFiltradas.filter(s => s.tipo === tipo).reduce((sum, s) => sum + parseFloat(s.valor), 0)
    }));

    return { relatorioPorFilial, totalEntradas, totalSaidas, saldo, categoriasSaidas };
  };

  const { relatorioPorFilial, totalEntradas, totalSaidas, saldo, categoriasSaidas } = calculateRelatorio();
  const trendData = prepareTrendData();

  // Configurações dos gráficos
  const lineChartData = {
    labels: trendData.map(d => d.date),
    datasets: [{
      label: 'Saldo (R$)',
      data: trendData.map(d => d.saldo),
      borderColor: 'rgba(75, 94, 170, 0.8)',
      backgroundColor: 'rgba(75, 94, 170, 0.2)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#4B5EAA',
      pointBorderColor: '#FFFFFF',
      pointHoverBackgroundColor: '#A83B3B',
      pointHoverBorderColor: '#FFFFFF',
    }],
  };

  const barChartData = {
    labels: ['Entradas', 'Saídas'],
    datasets: [{
      label: 'Valor (R$)',
      data: [totalEntradas, totalSaidas],
      backgroundColor: ['rgba(75, 94, 170, 0.8)', 'rgba(168, 59, 59, 0.8)'],
      borderColor: ['rgba(75, 94, 170, 1)', 'rgba(168, 59, 59, 1)'],
      borderWidth: 1,
      barThickness: 30,
    }],
  };

  const pieChartData = {
    labels: categoriasSaidas.map(c => c.tipo),
    datasets: [{
      data: categoriasSaidas.map(c => c.total),
      backgroundColor: ['#4B5EAA', '#A83B3B', '#6B7280'],
      borderColor: '#FFFFFF',
      borderWidth: 2,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#1F2937' } },
      tooltip: { mode: 'index', intersect: false, backgroundColor: '#FFFFFF', titleColor: '#1F2937', bodyColor: '#1F2937', borderColor: '#E5E7EB', borderWidth: 1 },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: '#6B7280' }, grid: { color: 'rgba(229, 231, 235, 0.5)' } },
      x: { ticks: { color: '#6B7280' }, grid: { color: 'rgba(229, 231, 235, 0.5)' } },
    },
    animation: { duration: 1000, easing: 'easeInOutQuad' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-[#E5E7EB] to-[#F9FAFB]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center pt-4">
          <div className="text-center w-full">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4B5EAA] to-[#4B5EAA] bg-clip-text text-transparent">
              Relatórios para Filiais
            </h1>
            <p className="text-[#6B7280] text-sm mt-1">Visão geral financeira de {format(new Date(startDate), 'dd/MM/yyyy')} a {format(new Date(endDate), 'dd/MM/yyyy')}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-auto min-w-[180px]"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-auto min-w-[180px]"
            />
            <select
              value={selectedLojaId}
              onChange={(e) => setSelectedLojaId(parseInt(e.target.value))} // Restrito à própria filial
              className="w-auto min-w-[180px]"
              disabled // Gerente só vê sua filial
            >
              {lojas
                .filter(loja => loja.id === selectedLojaId)
                .map(loja => (
                  <option key={loja.id} value={loja.id}>{loja.nome}</option>
                ))}
            </select>
            <button
              onClick={() => showNotification('Exportação para PDF em progresso...')}
              className="px-4 py-2 bg-[#4B5EAA] hover:bg-[#3B4A8A] text-white rounded-md transition-colors"
            >
              Exportar PDF
            </button>
          </div>
        </div>

        {/* Resumo Geral */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#4B5EAA] to-[#6B7280] rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <h3 className="text-white text-opacity-90 text-sm font-medium mb-2">Total Entradas</h3>
              <p className="text-white text-2xl font-bold">R$ {totalEntradas.toFixed(2)}</p>
            </div>
          </div>
          <div className="relative overflow-hidden bg-gradient-to-br from-[#A83B3B] to-[#DC2626] rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <h3 className="text-white text-opacity-90 text-sm font-medium mb-2">Total Saídas</h3>
              <p className="text-white text-2xl font-bold">R$ {totalSaidas.toFixed(2)}</p>
            </div>
          </div>
          <div className="relative overflow-hidden bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <h3 className="text-white text-opacity-90 text-sm font-medium mb-2">Saldo</h3>
              <p className="text-white text-2xl font-bold">R$ {saldo.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Relatório por Filial */}
        <div className="bg-[#FFFFFF] bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#E5E7EB]">
          <h3 className="text-xl font-semibold text-[#1F2937] mb-6 text-center">Relatório da Filial</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-[#1F2937] border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#4B5EAA] to-[#6B7280] text-white">
                  <th className="px-4 py-3 text-left rounded-tl-md">Filial</th>
                  <th className="px-4 py-3 text-left">Entradas (R$)</th>
                  <th className="px-4 py-3 text-left">Saídas (R$)</th>
                  <th className="px-4 py-3 text-left rounded-tr-md">Saldo (R$)</th>
                </tr>
              </thead>
              <tbody>
                {relatorioPorFilial.map((rel, i) => (
                  <tr key={i} className="border-b border-gray-200 hover:bg-[#F9FAFB]">
                    <td className="px-4 py-3">{rel.loja}</td>
                    <td className="px-4 py-3 text-[#4B5EAA]">{rel.entradas.toFixed(2)}</td>
                    <td className="px-4 py-3 text-[#A83B3B]">{rel.saidas.toFixed(2)}</td>
                    <td className="px-4 py-3" style={{ color: rel.saldo >= 0 ? '#4B5EAA' : '#A83B3B' }}>{rel.saldo.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#FFFFFF] bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#E5E7EB] text-center">
            <h3 className="text-xl font-semibold text-[#1F2937] mb-6 flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-[#4B5EAA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Tendência de Saldo
            </h3>
            <div className="h-64">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-[#FFFFFF] bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#E5E7EB] text-center">
            <h3 className="text-xl font-semibold text-[#1F2937] mb-6 flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-[#A83B3B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0l-8 4m-8-4l8 4" />
              </svg>
              Entradas vs Saídas
            </h3>
            <div className="h-64">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-[#FFFFFF] bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#E5E7EB] text-center">
            <h3 className="text-xl font-semibold text-[#1F2937] mb-6 flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              Categorias de Saídas
            </h3>
            <div className="h-64 flex justify-center">
              <Pie data={pieChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Notificação */}
        {notification && (
          <div className="fixed bottom-4 right-4 bg-[#4B5EAA] text-white px-4 py-2 rounded-md shadow-lg animate-pulse">
            {notification}
          </div>
        )}
      </main>
    </div>
  );
}