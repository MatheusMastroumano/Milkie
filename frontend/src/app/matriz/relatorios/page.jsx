"use client";

import { useState, useEffect } from 'react';
import Header from "@/components/Header/page";

export default function RelatoriosFinanceiros() {
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
  const [relatorioPeriodo, setRelatorioPeriodo] = useState('diario');
  const [selectedLojaId, setSelectedLojaId] = useState('');
  const [notification, setNotification] = useState(null);

  // Função para mostrar notificação
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Gerar datas para relatórios
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const getLast30Days = () => {
    const dates = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  // Filtrar dados por período e loja
  const filterData = (items) => {
    const today = new Date().toISOString().split('T')[0];
    const last7Days = getLast7Days();
    const last30Days = getLast30Days();
    return items.filter(item => {
      let inPeriod = false;
      if (relatorioPeriodo === 'diario') inPeriod = item.data === today;
      if (relatorioPeriodo === 'semanal') inPeriod = last7Days.includes(item.data);
      if (relatorioPeriodo === 'mensal') inPeriod = last30Days.includes(item.data);
      const inLoja = selectedLojaId ? item.loja_id === parseInt(selectedLojaId) : true;
      return inPeriod && inLoja;
    });
  };

  // Calcular relatórios
  const calculateRelatorio = () => {
    const entradasFiltradas = filterData(entradas);
    const saidasFiltradas = filterData(saidas);
    
    const totalEntradas = entradasFiltradas.reduce((sum, e) => sum + parseFloat(e.valor), 0);
    const totalSaidas = saidasFiltradas.reduce((sum, s) => sum + parseFloat(s.valor), 0);
    const saldo = totalEntradas - totalSaidas;

    const relatorioPorLoja = lojas.map(loja => {
      if (selectedLojaId && loja.id !== parseInt(selectedLojaId)) return null;
      return {
        loja: loja.nome,
        entradas: entradasFiltradas.filter(e => e.loja_id === loja.id).reduce((sum, e) => sum + parseFloat(e.valor), 0),
        saidas: saidasFiltradas.filter(s => s.loja_id === loja.id).reduce((sum, s) => sum + parseFloat(s.valor), 0),
        saldo: entradasFiltradas.filter(e => e.loja_id === loja.id).reduce((sum, e) => sum + parseFloat(e.valor), 0) -
               saidasFiltradas.filter(s => s.loja_id === loja.id).reduce((sum, s) => sum + parseFloat(s.valor), 0),
      };
    }).filter(Boolean);

    const categoriasSaidas = [...new Set(saidasFiltradas.map(s => s.tipo))].map(tipo => ({
      tipo,
      total: saidasFiltradas.filter(s => s.tipo === tipo).reduce((sum, s) => sum + parseFloat(s.valor), 0)
    }));

    return { relatorioPorLoja, totalEntradas, totalSaidas, saldo, categoriasSaidas };
  };

  const { relatorioPorLoja, totalEntradas, totalSaidas, saldo, categoriasSaidas } = calculateRelatorio();

  // Renderizar gráfico de linha SVG (Tendência de Saldo)
  const renderLineChart = (data) => {
    const w = 300, h = 200, p = 40;
    const plotW = w - 2*p, plotH = h - 2*p;
    const max = Math.max(...data.map(d => d.saldo), 100);
    const min = Math.min(...data.map(d => d.saldo), 0);
    const range = max - min;
    const points = data.map((d, i) => {
      const x = p + (i / (data.length - 1)) * plotW;
      const y = h - p - ((d.saldo - min) / range) * plotH;
      return `${x},${y}`;
    }).join(' ');
    return (
      <svg width="100%" height="200px" viewBox={`0 0 ${w} ${h}`}>
        <polyline points={points} fill="none" stroke="#2A4E73" strokeWidth="2" />
      </svg>
    );
  };

  // Renderizar gráfico de barras SVG (Entradas vs Saídas)
  const renderBarChart = (entradas, saidas) => {
    const w = 300, h = 200, p = 40;
    const barW = 40;
    const max = Math.max(entradas, saidas, 100);
    return (
      <svg width="100%" height="200px" viewBox={`0 0 ${w} ${h}`}>
        <rect x={p} y={h - p - (entradas / max) * (h - 2*p)} width={barW} height={(entradas / max) * (h - 2*p)} fill="#2A4E73" />
        <rect x={p + 100} y={h - p - (saidas / max) * (h - 2*p)} width={barW} height={(saidas / max) * (h - 2*p)} fill="#AD343E" />
      </svg>
    );
  };

  // Renderizar gráfico de pizza SVG (Categorias de Saídas)
  const renderPieChart = (categorias) => {
    const w = 300, h = 200, r = 80;
    let startAngle = 0;
    const total = categorias.reduce((sum, c) => sum + c.total, 0) || 1;
    return (
      <svg width="100%" height="200px" viewBox={`0 0 ${w} ${h}`}>
        {categorias.map((cat, i) => {
          const angle = (cat.total / total) * 360;
          const endAngle = startAngle + angle;
          const largeArc = angle > 180 ? 1 : 0;
          const startX = w/2 + r * Math.cos((startAngle * Math.PI)/180);
          const startY = h/2 + r * Math.sin((startAngle * Math.PI)/180);
          const endX = w/2 + r * Math.cos((endAngle * Math.PI)/180);
          const endY = h/2 + r * Math.sin((endAngle * Math.PI)/180);
          const path = `M ${w/2} ${h/2} L ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY} Z`;
          startAngle = endAngle;
          return <path key={i} d={path} fill={['#2A4E73', '#AD343E', '#CFE8F9'][i % 3]} stroke="#FFFFFF" strokeWidth="1" />;
        })}
      </svg>
    );
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFFFF] pt-14 sm:pt-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6">
          {/* Título */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-6 text-center">
            Relatórios Financeiros
          </h1>

          {/* Filtros */}
          <div className="flex flex-wrap gap-4 mb-6">
            <select
              value={relatorioPeriodo}
              onChange={(e) => setRelatorioPeriodo(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#CFE8F9]"
            >
              <option value="diario">Diário</option>
              <option value="semanal">Semanal</option>
              <option value="mensal">Mensal</option>
            </select>
            <select
              value={selectedLojaId}
              onChange={(e) => setSelectedLojaId(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#CFE8F9]"
            >
              <option value="">Todas as Lojas</option>
              {lojas.map(loja => (
                <option key={loja.id} value={loja.id}>{loja.nome}</option>
              ))}
            </select>
          </div>

          {/* Resumo Geral */}
          <div className="bg-[#F7FAFC] rounded-lg shadow-md p-4 mb-8">
            <h2 className="text-xl font-semibold text-[#2A4E73] mb-4 text-center">Resumo Geral</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-md shadow">
                <p className="text-[#2A4E73] font-medium">Total Entradas</p>
                <p className="text-2xl font-bold text-[#2A4E73]">R$ {totalEntradas.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-white rounded-md shadow">
                <p className="text-[#2A4E73] font-medium">Total Saídas</p>
                <p className="text-2xl font-bold text-[#AD343E]">R$ {totalSaidas.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-white rounded-md shadow">
                <p className="text-[#2A4E73] font-medium">Saldo</p>
                <p className="text-2xl font-bold" style={{ color: saldo >= 0 ? '#2A4E73' : '#AD343E' }}>R$ {saldo.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Relatório por Loja */}
          <div className="bg-[#F7FAFC] rounded-lg shadow-md p-4 mb-8">
            <h2 className="text-xl font-semibold text-[#2A4E73] mb-4 text-center">Relatório por Loja</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-[#2A4E73] border-collapse">
                <thead>
                  <tr className="bg-[#2A4E73] text-[#FFFFFF]">
                    <th className="px-4 py-3 text-left rounded-tl-md">Loja</th>
                    <th className="px-4 py-3 text-left">Entradas (R$)</th>
                    <th className="px-4 py-3 text-left">Saídas (R$)</th>
                    <th className="px-4 py-3 text-left rounded-tr-md">Saldo (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorioPorLoja.map((rel, i) => (
                    <tr key={i} className="border-b border-gray-200 hover:bg-[#CFE8F9]">
                      <td className="px-4 py-3">{rel.loja}</td>
                      <td className="px-4 py-3">{rel.entradas.toFixed(2)}</td>
                      <td className="px-4 py-3">{rel.saidas.toFixed(2)}</td>
                      <td className="px-4 py-3" style={{ color: rel.saldo >= 0 ? '#2A4E73' : '#AD343E' }}>{rel.saldo.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#F7FAFC] rounded-lg shadow-md p-4">
              <h3 className="text-md font-medium text-[#2A4E73] mb-3 text-center">Tendência de Saldo</h3>
              <div className="h-48">{renderLineChart(salesByDay)}</div>
            </div>
            <div className="bg-[#F7FAFC] rounded-lg shadow-md p-4">
              <h3 className="text-md font-medium text-[#2A4E73] mb-3 text-center">Entradas vs Saídas</h3>
              <div className="h-48">{renderBarChart(totalEntradas, totalSaidas)}</div>
            </div>
            <div className="bg-[#F7FAFC] rounded-lg shadow-md p-4">
              <h3 className="text-md font-medium text-[#2A4E73] mb-3 text-center">Categorias de Saídas</h3>
              <div className="h-48 flex justify-center">{renderPieChart(categoriasSaidas)}</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}