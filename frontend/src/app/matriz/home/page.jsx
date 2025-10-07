"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header/page";

export default function Home() {
  const [timeFilter, setTimeFilter] = useState("7d");
  const [animatedValues, setAnimatedValues] = useState({
    lojas: 0,
    funcionarios: 0,
    produtos: 0,
    vendas: 0
  });

  // Dados de exemplo
  const lojas = [
    { id: 1, nome: 'Loja Centro', tipo: 'Matriz', endereco: 'Rua Principal, 123' },
    { id: 2, nome: 'Loja Sul', tipo: 'Filial', endereco: 'Av. Sul, 456' },
    { id: 3, nome: 'Loja Norte', tipo: 'Filial', endereco: 'Rua Norte, 789' },
    { id: 4, nome: 'Loja Oeste', tipo: 'Filial', endereco: 'Av. Oeste, 321' },
  ];

  const vendas = [
    { id: 1, loja_id: 1, data: '2025-09-30', itens: [{ produto: 'Camiseta Básica', categoria: 'Roupas', quantidade: 5, preco: 29.99, total: 149.95 }, { produto: 'Calça Jeans', categoria: 'Roupas', quantidade: 2, preco: 79.99, total: 159.98 }], total_geral: 309.93 },
    { id: 2, loja_id: 2, data: '2025-09-30', itens: [{ produto: 'Camiseta Básica', categoria: 'Roupas', quantidade: 3, preco: 29.99, total: 89.97 }, { produto: 'Calça Jeans', categoria: 'Roupas', quantidade: 4, preco: 79.99, total: 319.96 }], total_geral: 409.93 },
    { id: 3, loja_id: 3, data: '2025-09-30', itens: [{ produto: 'Camiseta Básica', categoria: 'Roupas', quantidade: 1, preco: 29.99, total: 29.99 }], total_geral: 200.99 },
    { id: 4, loja_id: 4, data: '2025-09-30', itens: [{ produto: 'Calça Jeans', categoria: 'Roupas', quantidade: 3, preco: 79.99, total: 239.97 }], total_geral: 239.97 },
    { id: 5, loja_id: 1, data: '2025-09-29', itens: [{ produto: 'Camiseta Básica', categoria: 'Roupas', quantidade: 4, preco: 29.99, total: 119.96 }], total_geral: 119.96 },
    { id: 6, loja_id: 1, data: '2025-09-28', itens: [{ produto: 'Camiseta Básica', categoria: 'Roupas', quantidade: 2, preco: 29.99, total: 59.98 }, { produto: 'Calça Jeans', categoria: 'Roupas', quantidade: 1, preco: 79.99, total: 79.99 }], total_geral: 139.97 },
    { id: 7, loja_id: 2, data: '2025-09-28', itens: [{ produto: 'Camiseta Básica', categoria: 'Roupas', quantidade: 3, preco: 29.99, total: 89.97 }], total_geral: 89.97 },
    { id: 8, loja_id: 1, data: '2025-09-27', itens: [{ produto: 'Calça Jeans', categoria: 'Roupas', quantidade: 2, preco: 79.99, total: 159.98 }], total_geral: 159.98 },
    { id: 9, loja_id: 3, data: '2025-09-27', itens: [{ produto: 'Camiseta Básica', categoria: 'Roupas', quantidade: 5, preco: 29.99, total: 149.95 }], total_geral: 149.95 },
    { id: 10, loja_id: 2, data: '2025-09-26', itens: [{ produto: 'Calça Jeans', categoria: 'Roupas', quantidade: 3, preco: 79.99, total: 239.97 }], total_geral: 239.97 },
  ];

  // Métricas
  const totalLojas = lojas.length;
  const totalFuncionarios = 32;
  const totalProdutos = [...new Set(vendas.flatMap(v => v.itens.map(i => i.produto)))].length;
  const totalVendasHoje = vendas.filter(v => v.data === '2025-09-30').reduce((s, v) => s + v.total_geral, 0);

  // Animação dos números
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedValues({
        lojas: Math.floor(totalLojas * progress),
        funcionarios: Math.floor(totalFuncionarios * progress),
        produtos: Math.floor(totalProdutos * progress),
        vendas: totalVendasHoje * progress
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [totalLojas, totalFuncionarios, totalProdutos, totalVendasHoje]);

  // Dados para gráficos
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
    date: date.slice(5),
    total: vendas.filter(v => v.data === date).reduce((s, v) => s + v.total_geral, 0)
  }));

  const salesByStore = lojas.map(loja => ({
    nome: loja.nome.split(' ')[1],
    total: vendas.filter(v => v.loja_id === loja.id && v.data === '2025-09-30').reduce((s, v) => s + v.total_geral, 0)
  }));

  const productPerformance = [
    { produto: 'Camiseta Básica', vendas: 18, receita: 539.82 },
    { produto: 'Calça Jeans', receita: 959.88, vendas: 12 }
  ];

  const menuItems = [
    { icon: 'store', label: 'Lojas', href: '/matriz/lojas', color: 'from-blue-500 to-blue-600' },
    { icon: 'users', label: 'Funcionários', href: '/matriz/funcionarios', color: 'from-purple-500 to-purple-600' },
    { icon: 'package', label: 'Produtos', href: '/matriz/produtos', color: 'from-green-500 to-green-600' },
    { icon: 'truck', label: 'Fornecedores', href: '/matriz/fornecedores', color: 'from-orange-500 to-orange-600' },
    { icon: 'box', label: 'Estoque', href: '/matriz/estoque', color: 'from-teal-500 to-teal-600' },
    { icon: 'cart', label: 'Vendas', href: '/sales/view', color: 'from-pink-500 to-pink-600' },
    { icon: 'dollar', label: 'Financeiro', href: '/finance/manage', color: 'from-yellow-500 to-yellow-600' },
    { icon: 'file', label: 'Relatórios', href: '/finance/relatorios', color: 'from-red-500 to-red-600' },
    { icon: 'settings', label: 'Configurações', href: '/settings', color: 'from-gray-500 to-gray-600' }
  ];

  const Icon = ({ name, className = "w-6 h-6" }) => {
    const icons = {
      store: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
      users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
      package: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0L12 3l-8 4" />,
      truck: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
      box: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />,
      cart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />,
      dollar: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
      file: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
      settings: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>,
      trendUp: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
      trendDown: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />,
      arrowUp: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />,
      activity: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></>,
      chart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    };
    return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">{icons[name]}</svg>;
  };

  const StatCard = ({ icon, title, value, change, isPositive, gradient, delay }) => (
    <div 
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer group ease-in-out`}

    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
            <Icon name={icon} className="w-6 h-6" />
          </div>
          {change && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${isPositive ? 'bg-green-400 bg-opacity-30' : 'bg-red-400 bg-opacity-30'} text-white`}>
              <Icon name={isPositive ? 'arrowUp' : 'trendDown'} className="w-3 h-3" />
              {change}%
            </div>
          )}
        </div>
        <h3 className="text-white text-opacity-90 text-sm font-medium mb-2">{title}</h3>
        <p className="text-white text-3xl font-bold">{value}</p>
      </div>
    </div>
  );

  // Renderizar gráfico de linha avançado
  const renderAdvancedLineChart = () => {
    const w = 600, h = 300, p = 50;
    const plotW = w - 2 * p, plotH = h - 2 * p;
    const max = Math.max(...salesByDay.map(d => d.total), 100);
    
    const points = salesByDay.map((d, i) => {
      const x = p + (i / (salesByDay.length - 1)) * plotW;
      const y = h - p - (d.total / max) * plotH;
      return { x, y, value: d.total };
    });

    const pathData = points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`).join(' ');
    const areaData = `${pathData} L ${w - p},${h - p} L ${p},${h - p} Z`;

    return (
      <svg width="100%" height="300px" viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4B5EAA" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#4B5EAA" stopOpacity="0.05"/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Grid */}
        {[0, 1, 2, 3, 4].map(i => (
          <line key={i} x1={p} y1={p + (plotH / 4) * i} x2={w - p} y2={p + (plotH / 4) * i} stroke="#6B7280" strokeWidth="1" strokeDasharray="5,5" opacity="0.3"/>
        ))}
        
        {/* Eixos */}
        <line x1={p} y1={p} x2={p} y2={h - p} stroke="#6B7280" strokeWidth="2"/>
        <line x1={p} y1={h - p} x2={w - p} y2={h - p} stroke="#6B7280" strokeWidth="2"/>
        
        {/* Labels Y */}
        {[0, 1, 2, 3, 4].map(i => (
          <text key={i} x={p - 10} y={h - p - (plotH / 4) * i + 5} fill="#9CA3AF" textAnchor="end" fontSize="12">
            R$ {((max / 4) * i).toFixed(0)}
          </text>
        ))}
        
        {/* Labels X */}
        {salesByDay.map((d, i) => (
          <text key={i} x={p + (i / (salesByDay.length - 1)) * plotW} y={h - p + 25} fill="#9CA3AF" textAnchor="middle" fontSize="12">
            {d.date}
          </text>
        ))}
        
        {/* Área preenchida */}
        <path d={areaData} fill="url(#areaGrad)"/>
        
        {/* Linha principal */}
        <path d={pathData} fill="none" stroke="#4B5EAA" strokeWidth="3" filter="url(#glow)"/>
        
        {/* Pontos */}
        {points.map((pt, i) => (
          <g key={i}>
            <circle cx={pt.x} cy={pt.y} r="6" fill="#1F2937" stroke="#4B5EAA" strokeWidth="3"/>
            <circle cx={pt.x} cy={pt.y} r="3" fill="#4B5EAA"/>
          </g>
        ))}
      </svg>
    );
  };

  // Renderizar gráfico de barras avançado
  const renderAdvancedBarChart = () => {
    const w = 500, h = 300, p = 50;
    const plotW = w - 2 * p, plotH = h - 2 * p;
    const max = Math.max(...salesByStore.map(s => s.total), 100);
    const barW = (plotW / salesByStore.length) * 0.7;
    
    return (
      <svg width="100%" height="300px" viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A83B3B"/>
            <stop offset="100%" stopColor="#822727"/>
          </linearGradient>
        </defs>
        
        {/* Grid */}
        {[0, 1, 2, 3, 4].map(i => (
          <line key={i} x1={p} y1={p + (plotH / 4) * i} x2={w - p} y2={p + (plotH / 4) * i} stroke="#374151" strokeWidth="1" strokeDasharray="5,5" opacity="0.3"/>
        ))}
        
        {/* Eixos */}
        <line x1={p} y1={p} x2={p} y2={h - p} stroke="#6B7280" strokeWidth="2"/>
        <line x1={p} y1={h - p} x2={w - p} y2={h - p} stroke="#6B7280" strokeWidth="2"/>
        
        {/* Labels Y */}
        {[0, 1, 2, 3, 4].map(i => (
          <text key={i} x={p - 10} y={h - p - (plotH / 4) * i + 5} fill="#9CA3AF" textAnchor="end" fontSize="12">
            R$ {((max / 4) * i).toFixed(0)}
          </text>
        ))}
        
        {/* Barras */}
        {salesByStore.map((store, i) => {
          const x = p + i * (plotW / salesByStore.length) + (plotW / salesByStore.length - barW) / 2;
          const barH = (store.total / max) * plotH;
          const y = h - p - barH;
          
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH} fill="url(#barGrad1)" rx="8" className="hover:opacity-80 transition-opacity cursor-pointer"/>
              <text x={x + barW / 2} y={h - p + 20} fill="#9CA3AF" textAnchor="middle" fontSize="12">{store.nome}</text>
              <text x={x + barW / 2} y={y - 10} fill="#FFF" textAnchor="middle" fontSize="12" fontWeight="bold">
                R$ {store.total.toFixed(0)}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-[#E5E7EB] to-[#F9FAFB]">
      <br></br>
      <br></br>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center pt-4">
          <div className="text-center w-full">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-6 text-center">
            Gerenciamento de Funcionários
          </h1>
            <p className="text-[#4B5EAA] text-sm mt-1">Bem-vindo de volta! Aqui está seu resumo de hoje.</p>
          </div>
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-[#FFFFFF] text-[#1F2937] rounded-lg px-4 py-2 border border-[#E5E7EB] focus:border-[#4B5EAA] focus:outline-none transition-colors"
          >
            <option value="24h">Últimas 24h</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
          </select>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon="store"
            title="Lojas Ativas"
            value={animatedValues.lojas}
            change={8.2}
            isPositive={true}
            gradient="from-[#4B5EAA] to-[#6B7280]"
            delay={0}
          />
          <StatCard 
            icon="users"
            title="Funcionários"
            value={animatedValues.funcionarios}
            change={3.1}
            isPositive={true}
            gradient="from-[#A83B3B] to-[#DC2626]"
            delay={100}
          />
          <StatCard 
            icon="package"
            title="Produtos"
            value={`${animatedValues.produtos} itens`}
            change={12.5}
            isPositive={true}
            gradient="from-[#10B981] to-[#34D399]"
            delay={200}
          />
          <StatCard 
            icon="dollar"
            title="Vendas Hoje"
            value={`R$ ${animatedValues.vendas.toFixed(2)}`}
            change={15.3}
            isPositive={true}
            gradient="from-[#F59E0B] to-[#FBBF24]"
            delay={300}
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#FFFFFF] bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#E5E7EB] text-center">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#1F2937] flex items-center justify-center gap-2">
                <Icon name="activity" className="w-5 h-5 text-[#4B5EAA]" />
                Tendência de Vendas
              </h3>
              <p className="text-[#6B7280] text-sm mt-1">Últimos 7 dias</p>
            </div>
            {renderAdvancedLineChart()}
          </div>

          <div className="bg-[#FFFFFF] bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#E5E7EB] text-center">
            <h3 className="text-xl font-semibold text-[#1F2937] mb-6 flex items-center justify-center gap-2">
              <Icon name="chart" className="w-5 h-5 text-[#A83B3B]" />
              Vendas por Loja
            </h3>
            {renderAdvancedBarChart()}
          </div>
        </div>

        {/* Top Produtos */}
        <div className="bg-[#FFFFFF] bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#E5E7EB]">
          <h3 className="text-xl font-semibold text-[#1F2937] mb-6 text-center">Top Produtos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productPerformance.map((product, idx) => (
              <div key={idx} className="bg-[#F9FAFB] bg-opacity-50 rounded-xl p-4 hover:bg-opacity-70 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-[#1F2937] font-semibold">{product.produto}</h4>
                    <p className="text-[#6B7280] text-sm">{product.vendas} unidades vendidas</p>
                  </div>
                  <Icon name="trendUp" className="w-5 h-5 text-[#10B981] group-hover:scale-125 transition-transform" />
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold text-[#1F2937]">R$ {product.receita.toFixed(2)}</span>
                  <div className="w-20 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full" style={{ width: `${(product.receita / 1000) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu de Ações Rápidas */}
        <div className="bg-[#FFFFFF] bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#E5E7EB]">
          <h3 className="text-xl font-semibold text-[#1F2937] mb-6 text-center">⚡ Ações Rápidas</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {menuItems.map((item, idx) => (
              <Link key={idx} href={item.href}>
                <button className="group relative overflow-hidden bg-[#F9FAFB] bg-opacity-50 hover:bg-opacity-70 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl w-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className={`p-3 bg-gradient-to-br ${item.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                      <Icon name={item.icon} className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[#1F2937] text-sm font-medium text-center">{item.label}</span>
                  </div>
                </button>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 pb-8 text-center text-[#6B7280] text-sm">
        <p>© 2025 Sistema de Gestão. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}