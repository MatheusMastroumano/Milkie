"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header/page";

export default function Home() {
  // Dados de exemplo
  const lojas = [
    { id: 1, nome: 'Loja Centro', tipo: 'Matriz', endereco: 'Rua Principal, 123' },
    { id: 2, nome: 'Loja Sul', tipo: 'Filial', endereco: 'Av. Sul, 456' },
    { id: 3, nome: 'Loja Norte', tipo: 'Filial', endereco: 'Rua Norte, 789' },
    { id: 4, nome: 'Loja Oeste', tipo: 'Filial', endereco: 'Av. Oeste, 321' },
  ];

  const vendas = [
    {
      id: 1,
      loja_id: 1,
      data: '2025-09-30',
      itens: [
        { produto: 'Camiseta Básica', categoria: 'Roupas', quantidade: 5, preco: 29.99, total: 149.95 },
        { produto: 'Calça Jeans', categoria: 'Roupas', quantidade: 2, preco: 79.99, total: 300.98 },
      ],
      total_geral: 309.93,
    },
    {
      id: 2,
      loja_id: 2,
      data: '2025-09-30',
      itens: [
        { produto: 'Camiseta Básica', categoria: 'Roupas', quantidade: 3, preco: 29.99, total: 89.97 },
        { produto: 'Calça Jeans', categoria: 'Roupas', quantidade: 4, preco: 79.99, total: 319.96 },
      ],
      total_geral: 409.93,
    },
    {
      id: 3,
      loja_id: 3,
      data: '2025-09-30',
      itens: [
        { produto: 'Camiseta Básica', categoria: 'Roupas', quantidade: 1, preco: 29.99, total: 29.99 },
      ],
      total_geral: 200.99,
    },
    {
      id: 4,
      loja_id: 4,
      data: '2025-09-30',
      itens: [
        { produto: 'Calça Jeans', categoria: 'Roupas', quantidade: 3, preco: 79.99, total: 239.97 },
      ],
      total_geral: 239.97,
    },
    {
      id: 5,
      loja_id: 1,
      data: '2025-09-29',
      itens: [
        { produto: 'Camiseta Básica', categoria: 'Roupas', quantidade: 4, preco: 29.99, total: 119.96 },
      ],
      total_geral: 119.96,
    },
    {
      id: 6,
      loja_id: 1,
      data: '2025-09-28',
      itens: [
        { produto: 'Camiseta Básica', categoria: 'Roupas', quantidade: 2, preco: 29.99, total: 59.98 },
        { produto: 'Calça Jeans', categoria: 'Roupas', quantidade: 1, preco: 79.99, total: 79.99 },
      ],
      total_geral: 139.97,
    },
    {
      id: 7,
      loja_id: 2,
      data: '2025-09-28',
      itens: [
        { produto: 'Camiseta Básica', categoria: 'Roupas', quantidade: 3, preco: 29.99, total: 89.97 },
      ],
      total_geral: 89.97,
    },
  ];

  // Calcular métricas
  const totalLojas = lojas.length;
  const totalFuncionarios = 32; // Placeholder
  const totalProdutos = [...new Set(vendas.flatMap(venda => venda.itens.map(item => item.produto)))].length;
  const totalVendasHoje = vendas
    .filter(venda => venda.data === '2025-09-30')
    .reduce((sum, venda) => sum + venda.total_geral, 0)
    .toFixed(2);

  // Dados para gráficos SVG
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(2025, 8, 30 - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };
  const last7Days = getLast7Days();
  const salesByDay = last7Days.map(date => ({
    date,
    total: vendas
      .filter(venda => venda.data === date)
      .reduce((sum, venda) => sum + venda.total_geral, 0),
  }));
  const maxSales = Math.max(...salesByDay.map(d => d.total), 100);
  const salesByStore = lojas.map(loja => ({
    nome: loja.nome,
    total: vendas
      .filter(venda => venda.loja_id === loja.id && venda.data === '2025-09-30')
      .reduce((sum, venda) => sum + venda.total_geral, 0),
  }));
  const maxStoreSales = Math.max(...salesByStore.map(s => s.total), 100);
  const categories = ['Roupas'];
  const salesByCategory = categories.map(category => ({
    category,
    total: vendas
      .filter(venda => venda.data === '2025-09-30')
      .flatMap(venda => venda.itens)
      .filter(item => item.categoria === category)
      .reduce((sum, item) => sum + item.total, 0),
  }));
  const totalCategorySales = salesByCategory.reduce((sum, cat) => sum + cat.total, 0) || 1;

  // Gráfico de Linha SVG
  const renderLineChart = () => {
    const width = 300;
    const height = 200;
    const padding = 40;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;
    const points = salesByDay.map((d, i) => {
      const x = padding + (i / (last7Days.length - 1)) * plotWidth;
      const y = height - padding - (d.total / maxSales) * plotHeight;
      return `${x},${y}`;
    }).join(' ');
    return (
      <svg width="100%" height="200px" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#2A4E73" strokeWidth="2" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#2A4E73" strokeWidth="2" />
        {[0, maxSales / 2, maxSales].map((value, i) => (
          <text key={i} x={padding - 10} y={height - padding - (value / maxSales) * plotHeight} fill="#2A4E73" textAnchor="end" fontSize="10">
            R$ {value.toFixed(0)}
          </text>
        ))}
        {last7Days.map((date, i) => (
          <text key={i} x={padding + (i / (last7Days.length - 1)) * plotWidth} y={height - padding + 20} fill="#2A4E73" textAnchor="middle" fontSize="10">
            {date.slice(5)}
          </text>
        ))}
        <polyline points={points} fill="none" stroke="#2A4E73" strokeWidth="3" />
        {salesByDay.map((d, i) => (
          <circle
            key={i}
            cx={padding + (i / (last7Days.length - 1)) * plotWidth}
            cy={height - padding - (d.total / maxSales) * plotHeight}
            r="4"
            fill="#AD343E"
          />
        ))}
      </svg>
    );
  };

  // Gráfico de Barras SVG
  const renderBarChart = () => {
    const width = 300;
    const height = 200;
    const padding = 40;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;
    const barWidth = plotWidth / salesByStore.length * 0.8;
    return (
      <svg width="100%" height="200px" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#2A4E73" strokeWidth="2" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#2A4E73" strokeWidth="2" />
        {[0, maxStoreSales / 2, maxStoreSales].map((value, i) => (
          <text key={i} x={padding - 10} y={height - padding - (value / maxStoreSales) * plotHeight} fill="#2A4E73" textAnchor="end" fontSize="10">
            R$ {value.toFixed(0)}
          </text>
        ))}
        {salesByStore.map((store, i) => (
          <text key={i} x={padding + i * (plotWidth / salesByStore.length) + barWidth / 2} y={height - padding + 20} fill="#2A4E73" textAnchor="middle" fontSize="10">
            {store.nome.split(' ')[1]}
          </text>
        ))}
        {salesByStore.map((store, i) => (
          <rect
            key={i}
            x={padding + i * (plotWidth / salesByStore.length) + barWidth * 0.1}
            y={height - padding - (store.total / maxStoreSales) * plotHeight}
            width={barWidth}
            height={(store.total / maxStoreSales) * plotHeight}
            fill={['#2A4E73', '#AD343E', '#CFE8F9', '#F7FAFC'][i % 4]}
          />
        ))}
      </svg>
    );
  };

  // Gráfico de Pizza SVG
  const renderPieChart = () => {
    const width = 300;
    const height = 200;
    const radius = 80;
    let startAngle = 0;
    return (
      <svg width="100%" height="200px" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {salesByCategory.map((cat, i) => {
          const percentage = cat.total / totalCategorySales;
          const angle = percentage * 360;
          const endAngle = startAngle + angle;
          const largeArc = angle > 180 ? 1 : 0;
          const startX = width / 2 + radius * Math.cos((startAngle * Math.PI) / 180);
          const startY = height / 2 + radius * Math.sin((startAngle * Math.PI) / 180);
          const endX = width / 2 + radius * Math.cos((endAngle * Math.PI) / 180);
          const endY = height / 2 + radius * Math.sin((endAngle * Math.PI) / 180);
          const path = `M ${width / 2} ${height / 2} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`;
          startAngle = endAngle;
          return (
            <path
              key={i}
              d={path}
              fill={['#2A4E73', '#AD343E', '#CFE8F9', '#F7FAFC'][i % 4]}
              stroke="#FFFFFF"
              strokeWidth="1"
            />
          );
        })}
        {salesByCategory.map((cat, i) => (
          <g key={i} transform={`translate(${width - 100}, ${20 + i * 20})`}>
            <rect x="0" y="0" width="12" height="12" fill={['#2A4E73', '#AD343E', '#CFE8F9', '#F7FAFC'][i % 4]} />
            <text x="20" y="12" fill="#2A4E73" fontSize="10">{cat.category}</text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <Header />
      <main className="p-4 sm:p-8 max-w-7xl mx-auto space-y-10">
        {/* Título */}
        <section>
          <br></br>
          <br></br>
      

          <h1 className="text-3xl font-bold text-[#2A4E73] text-center">Painel Administrativo</h1>
          <p className="mt-2 text-[#2A4E73] opacity-70 text-center">
            Bem-vindo ao painel administrativo. Aqui você encontra um resumo das funções, acessos e métricas do sistema.
          </p>
        </section>

        {/* Cartões de Resumo */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#FFFFFF] rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold text-[#2A4E73] text-center">Lojas</h2>
            <p className="text-[#2A4E73] text-2xl font-bold text-center">{totalLojas} Ativas</p>
          </div>
          <div className="bg-[#FFFFFF] rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold text-[#2A4E73] text-center">Funcionários</h2>
            <p className="text-[#2A4E73] text-2xl font-bold text-center">{totalFuncionarios}</p>
          </div>
          <div className="bg-[#FFFFFF] rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold text-[#2A4E73] text-center">Produtos</h2>
            <p className="text-[#2A4E73] text-2xl font-bold text-center">{totalProdutos} Itens</p>
          </div>
          <div className="bg-[#FFFFFF] rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold text-[#2A4E73] text-center">Vendas Hoje</h2>
            <p className="text-[#2A4E73] text-2xl font-bold text-center">R$ {totalVendasHoje}</p>
          </div>
        </section>

        {/* Análise de Vendas */}
        <section>
          <h2 className="text-2xl font-semibold text-[#2A4E73] mb-4 text-center">Análise de Vendas</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[#FFFFFF] rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-[#2A4E73] mb-4 text-center">Tendência de Vendas (7 Dias)</h3>
              <div className="h-[200px]">{renderLineChart()}</div>
            </div>
            <div className="bg-[#FFFFFF] rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-[#2A4E73] mb-4 text-center">Vendas por Loja (Hoje)</h3>
              <div className="h-[200px]">{renderBarChart()}</div>
            </div>
          </div>
        </section>

        {/* Atalhos Rápidos */}
        <section>
          <h2 className="text-2xl font-semibold text-[#2A4E73] mb-4 text-center">⚡ Atalhos Rápidos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Link href="/matriz/lojas" title="Gerenciar lojas">
              <button className="bg-[#FFFFFF] shadow rounded-lg p-4 hover:bg-[#CFE8F9] text-[#2A4E73] transition-colors flex flex-col items-center justify-center h-24 w-full">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="#2A4E73" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm font-medium text-center">Lojas</span>
              </button>
            </Link>
            <Link href="/matriz/funcionarios" title="Gerenciar funcionários">
              <button className="bg-[#FFFFFF] shadow rounded-lg p-4 hover:bg-[#CFE8F9] text-[#2A4E73] transition-colors flex flex-col items-center justify-center h-24 w-full">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="#2A4E73" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-sm font-medium text-center">Funcionários</span>
              </button>
            </Link>
            <Link href="/matriz/produtos" title="Gerenciar produtos e categorias">
              <button className="bg-[#FFFFFF] shadow rounded-lg p-4 hover:bg-[#CFE8F9] text-[#2A4E73] transition-colors flex flex-col items-center justify-center h-24 w-full">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="#2A4E73" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0L12 3l-8 4" />
                </svg>
                <span className="text-sm font-medium text-center">Produtos</span>
              </button>
            </Link>
            <Link href="/matriz/fornecedores" title="Gerenciar fornecedores">
              <button className="bg-[#FFFFFF] shadow rounded-lg p-4 hover:bg-[#CFE8F9] text-[#2A4E73] transition-colors flex flex-col items-center justify-center h-24 w-full">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="#2A4E73" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium text-center">Fornecedores</span>
              </button>
            </Link>
            <Link href="/matriz/estoque" title="Consultar ou ajustar estoque">
              <button className="bg-[#FFFFFF] shadow rounded-lg p-4 hover:bg-[#CFE8F9] text-[#2A4E73] transition-colors flex flex-col items-center justify-center h-24 w-full">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="#2A4E73" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <span className="text-sm font-medium text-center">Estoque</span>
              </button>
            </Link>
            <Link href="/sales/view" title="Visualizar vendas">
              <button className="bg-[#FFFFFF] shadow rounded-lg p-4 hover:bg-[#CFE8F9] text-[#2A4E73] transition-colors flex flex-col items-center justify-center h-24 w-full">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="#2A4E73" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm font-medium text-center">Vendas</span>
              </button>
            </Link>
            <Link href="/finance/manage" title="Gerenciar financeiro">
              <button className="bg-[#FFFFFF] shadow rounded-lg p-4 hover:bg-[#CFE8F9] text-[#2A4E73] transition-colors flex flex-col items-center justify-center h-24 w-full">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="#2A4E73" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-center">Financeiro</span>
              </button>
            </Link>
            <Link href="/finance/relatorios" title="Gerar relatórios">
              <button className="bg-[#FFFFFF] shadow rounded-lg p-4 hover:bg-[#CFE8F9] text-[#2A4E73] transition-colors flex flex-col items-center justify-center h-24 w-full">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="#2A4E73" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium text-center">Relatórios</span>
              </button>
            </Link>
            <Link href="/settings" title="Configurações do sistema">
              <button className="bg-[#FFFFFF] shadow rounded-lg p-4 hover:bg-[#CFE8F9] text-[#2A4E73] transition-colors flex flex-col items-center justify-center h-24 w-full">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="#2A4E73" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium text-center">Configurações</span>
              </button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}