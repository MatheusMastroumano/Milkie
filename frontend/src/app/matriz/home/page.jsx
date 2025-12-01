"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";
import { apiJson } from "@/lib/api";

export default function Home() {
  const [timeFilter, setTimeFilter] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [animatedValues, setAnimatedValues] = useState({
    lojas: 0,
    funcionarios: 0,
    produtos: 0,
    vendas: 0,
    receitaTotal: 0
  });

  // Dados do backend
  const [lojas, setLojas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [vendaItens, setVendaItens] = useState([]);
  const [vendaPagamentos, setVendaPagamentos] = useState([]);
  const [estoque, setEstoque] = useState([]);

  // Carregar dados do backend
  useEffect(() => {
    carregarDados();
  }, [timeFilter]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [lojasRes, funcionariosRes, produtosRes, vendasRes, itensRes, pagamentosRes, estoqueRes] = await Promise.all([
        apiJson('/lojas').catch(() => ({ lojas: [] })),
        apiJson('/funcionarios').catch(() => ({ funcionarios: [] })),
        apiJson('/produtos').catch(() => ({ produtos: [] })),
        apiJson('/vendas').catch(() => ({ vendas: [] })),
        apiJson('/venda-itens').catch(() => ({ vendaItens: [] })),
        apiJson('/venda-pagamentos').catch(() => ({ vendaPagamentos: [] })),
        apiJson('/estoque').catch(() => ({ estoque: [] }))
      ]);

      setLojas(lojasRes.lojas || []);
      setFuncionarios(funcionariosRes.funcionarios || []);
      setProdutos(produtosRes.produtos || []);
      setVendas(vendasRes.vendas || []);
      setVendaItens(itensRes.vendaItens || itensRes.venda_itens || []);
      setVendaPagamentos(pagamentosRes.vendaPagamentos || pagamentosRes.venda_pagamentos || []);
      setEstoque(estoqueRes.estoque || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar vendas por período
  const getFilteredVendas = () => {
    const now = new Date();
    let startDate = new Date();
    
    if (timeFilter === "24h") {
      startDate.setHours(now.getHours() - 24);
    } else if (timeFilter === "7d") {
      startDate.setDate(now.getDate() - 7);
    } else if (timeFilter === "30d") {
      startDate.setDate(now.getDate() - 30);
    }
    
    return vendas.filter(v => {
      const vendaDate = new Date(v.data);
      return vendaDate >= startDate;
    });
  };

  const vendasFiltradas = getFilteredVendas();

  // Calcular métricas
  const totalLojas = lojas.filter(l => l.ativo).length;
  const totalFuncionarios = funcionarios.filter(f => f.ativo).length;
  const totalProdutos = produtos.filter(p => p.ativo).length;
  const receitaTotal = vendasFiltradas.reduce((sum, v) => sum + Number(v.valor_total || 0), 0);
  const totalVendas = vendasFiltradas.length;

  // Calcular comparação com período anterior
  const getPreviousPeriodVendas = () => {
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    if (timeFilter === "24h") {
      startDate.setHours(now.getHours() - 48);
      endDate.setHours(now.getHours() - 24);
    } else if (timeFilter === "7d") {
      startDate.setDate(now.getDate() - 14);
      endDate.setDate(now.getDate() - 7);
    } else if (timeFilter === "30d") {
      startDate.setDate(now.getDate() - 60);
      endDate.setDate(now.getDate() - 30);
    }
    
    return vendas.filter(v => {
      const vendaDate = new Date(v.data);
      return vendaDate >= startDate && vendaDate < endDate;
    });
  };

  const vendasPeriodoAnterior = getPreviousPeriodVendas();
  const receitaAnterior = vendasPeriodoAnterior.reduce((sum, v) => sum + Number(v.valor_total || 0), 0);
  const variacaoReceita = receitaAnterior > 0 ? ((receitaTotal - receitaAnterior) / receitaAnterior * 100) : 0;

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
        vendas: Math.floor(totalVendas * progress),
        receitaTotal: receitaTotal * progress
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [totalLojas, totalFuncionarios, totalProdutos, totalVendas, receitaTotal]);

  // Dados para gráficos
  const getDaysArray = () => {
    const days = [];
    const now = new Date();
    const daysCount = timeFilter === "24h" ? 24 : timeFilter === "7d" ? 7 : 30;
    
    for (let i = daysCount - 1; i >= 0; i--) {
      const date = new Date(now);
      if (timeFilter === "24h") {
        date.setHours(now.getHours() - i);
        days.push({ date: date.toISOString(), label: `${date.getHours()}h` });
      } else {
        date.setDate(now.getDate() - i);
        days.push({ date: date.toISOString().split('T')[0], label: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) });
      }
    }
    return days;
  };

  const daysArray = getDaysArray();
  const salesByDay = daysArray.map(day => {
    const total = vendasFiltradas
      .filter(v => {
        const vendaDate = new Date(v.data);
        if (timeFilter === "24h") {
          return vendaDate.getHours() === new Date(day.date).getHours() && 
                 vendaDate.toDateString() === new Date(day.date).toDateString();
        }
        return vendaDate.toISOString().split('T')[0] === day.date;
      })
      .reduce((sum, v) => sum + Number(v.valor_total || 0), 0);
    return { ...day, total };
  });

  // Vendas por loja
  const salesByStore = lojas
    .filter(l => l.ativo)
    .map(loja => {
      const lojaVendas = vendasFiltradas.filter(v => v.loja_id === loja.id);
      const total = lojaVendas.reduce((sum, v) => sum + Number(v.valor_total || 0), 0);
      return { nome: loja.nome, total, quantidade: lojaVendas.length };
    })
    .sort((a, b) => b.total - a.total);

  // Top produtos
  const produtosMap = {};
  vendaItens.forEach(item => {
    const venda = vendasFiltradas.find(v => v.id === item.venda_id);
    if (venda) {
      const produto = produtos.find(p => p.id === item.produto_id);
      if (produto) {
        if (!produtosMap[produto.id]) {
          produtosMap[produto.id] = {
            id: produto.id,
            nome: produto.nome,
            categoria: produto.categoria,
            quantidade: 0,
            receita: 0
          };
        }
        produtosMap[produto.id].quantidade += Number(item.quantidade || 0);
        produtosMap[produto.id].receita += Number(item.subtotal || 0);
      }
    }
  });

  const topProdutos = Object.values(produtosMap)
    .sort((a, b) => b.receita - a.receita)
    .slice(0, 5);

  // Vendas por categoria
  const categoriasMap = {};
  vendaItens.forEach(item => {
    const venda = vendasFiltradas.find(v => v.id === item.venda_id);
    if (venda) {
      const produto = produtos.find(p => p.id === item.produto_id);
      if (produto && produto.categoria) {
        if (!categoriasMap[produto.categoria]) {
          categoriasMap[produto.categoria] = { receita: 0, quantidade: 0 };
        }
        categoriasMap[produto.categoria].receita += Number(item.subtotal || 0);
        categoriasMap[produto.categoria].quantidade += Number(item.quantidade || 0);
      }
    }
  });

  const vendasPorCategoria = Object.entries(categoriasMap)
    .map(([categoria, dados]) => ({ categoria, receita: dados.receita, quantidade: dados.quantidade }))
    .sort((a, b) => b.receita - a.receita);

  // Ticket médio ao longo do tempo
  const ticketMedioPorDia = daysArray.map(day => {
    const vendasDoDia = vendasFiltradas.filter(v => {
      const vendaDate = new Date(v.data);
      if (timeFilter === "24h") {
        return vendaDate.getHours() === new Date(day.date).getHours() && 
               vendaDate.toDateString() === new Date(day.date).toDateString();
      }
      return vendaDate.toISOString().split('T')[0] === day.date;
    });
    
    if (vendasDoDia.length === 0) {
      return { ...day, ticketMedio: 0, quantidade: 0 };
    }
    
    const receitaTotal = vendasDoDia.reduce((sum, v) => sum + Number(v.valor_total || 0), 0);
    const ticketMedio = receitaTotal / vendasDoDia.length;
    
    return { ...day, ticketMedio, quantidade: vendasDoDia.length };
  });

  // Vendas por dia da semana
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const vendasPorDiaSemana = diasSemana.map((dia, idx) => {
    const total = vendasFiltradas
      .filter(v => {
        const vendaDate = new Date(v.data);
        return vendaDate.getDay() === idx;
      })
      .reduce((sum, v) => sum + Number(v.valor_total || 0), 0);
    return { dia, total };
  });


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

  const StatCard = ({ icon, title, value, change, isPositive }) => (
    <div className="bg-[#F7FAFC] rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-[#2A4E73] rounded-lg">
          <Icon name={icon} className="w-6 h-6 text-white" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <Icon name={isPositive ? 'arrowUp' : 'trendDown'} className="w-3 h-3" />
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <h3 className="text-[#2A4E73] text-sm font-medium mb-2">{title}</h3>
      <p className="text-[#2A4E73] text-3xl font-bold">{value}</p>
    </div>
  );

  // Renderizar gráfico de linha temporal
  const renderLineChart = () => {
    const w = 800, h = 300, p = 50;
    const plotW = w - 2 * p, plotH = h - 2 * p;
    const max = Math.max(...salesByDay.map(d => d.total), 100);
    
    const points = salesByDay.map((d, i) => {
      const x = p + (i / Math.max(salesByDay.length - 1, 1)) * plotW;
      const y = h - p - (d.total / max) * plotH;
      return { x, y, value: d.total, label: d.label };
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
        {salesByDay.map((d, i) => {
          if (salesByDay.length > 10 && i % Math.ceil(salesByDay.length / 8) !== 0) return null;
          const x = p + (i / Math.max(salesByDay.length - 1, 1)) * plotW;
          return (
            <text key={i} x={x} y={h - p + 25} fill="#9CA3AF" textAnchor="middle" fontSize="10">
              {d.label}
            </text>
          );
        })}
        
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

  // Renderizar gráfico de barras (vendas por loja)
  const renderBarChart = () => {
    const w = 500, h = 300, p = 50;
    const plotW = w - 2 * p, plotH = h - 2 * p;
    const max = Math.max(...salesByStore.map(s => s.total), 100);
    const barW = salesByStore.length > 0 ? (plotW / salesByStore.length) * 0.7 : 50;
    
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
          const x = p + i * (plotW / Math.max(salesByStore.length, 1)) + (plotW / Math.max(salesByStore.length, 1) - barW) / 2;
          const barH = (store.total / max) * plotH;
          const y = h - p - barH;
          
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH} fill="url(#barGrad1)" rx="8" className="hover:opacity-80 transition-opacity cursor-pointer"/>
              <text x={x + barW / 2} y={h - p + 20} fill="#9CA3AF" textAnchor="middle" fontSize="10">{store.nome.length > 8 ? store.nome.substring(0, 8) + '...' : store.nome}</text>
              <text x={x + barW / 2} y={y - 10} fill="#FFF" textAnchor="middle" fontSize="11" fontWeight="bold">
                R$ {store.total.toFixed(0)}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // Renderizar gráfico de barras (vendas por categoria)
  const renderCategoryBarChart = () => {
    const w = 500, h = 300, p = 50;
    const plotW = w - 2 * p, plotH = h - 2 * p;
    const max = Math.max(...vendasPorCategoria.map(c => c.receita), 100);
    const barW = vendasPorCategoria.length > 0 ? (plotW / vendasPorCategoria.length) * 0.7 : 50;
    
    if (vendasPorCategoria.length === 0) {
      return (
        <div className="flex items-center justify-center h-[300px] text-[#6B7280]">
          Sem dados disponíveis
        </div>
      );
    }
    
    return (
      <svg width="100%" height="300px" viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <linearGradient id="categoryBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4B5EAA"/>
            <stop offset="100%" stopColor="#2A4E73"/>
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
        {vendasPorCategoria.map((cat, i) => {
          const x = p + i * (plotW / Math.max(vendasPorCategoria.length, 1)) + (plotW / Math.max(vendasPorCategoria.length, 1) - barW) / 2;
          const barH = (cat.receita / max) * plotH;
          const y = h - p - barH;
          
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH} fill="url(#categoryBarGrad)" rx="8" className="hover:opacity-80 transition-opacity cursor-pointer"/>
              <text x={x + barW / 2} y={h - p + 20} fill="#9CA3AF" textAnchor="middle" fontSize="10">{cat.categoria.length > 10 ? cat.categoria.substring(0, 10) + '...' : cat.categoria}</text>
              <text x={x + barW / 2} y={y - 10} fill="#FFF" textAnchor="middle" fontSize="11" fontWeight="bold">
                R$ {cat.receita.toFixed(0)}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // Renderizar gráfico de ticket médio
  const renderTicketMedioChart = () => {
    const w = 800, h = 300, p = 50;
    const plotW = w - 2 * p, plotH = h - 2 * p;
    const max = Math.max(...ticketMedioPorDia.map(d => d.ticketMedio), 100);
    
    const points = ticketMedioPorDia.map((d, i) => {
      const x = p + (i / Math.max(ticketMedioPorDia.length - 1, 1)) * plotW;
      const y = h - p - (d.ticketMedio / max) * plotH;
      return { x, y, value: d.ticketMedio, label: d.label };
    });

    const pathData = points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`).join(' ');
    const areaData = `${pathData} L ${w - p},${h - p} L ${p},${h - p} Z`;

    return (
      <svg width="100%" height="300px" viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
        <defs>
          <linearGradient id="ticketAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.05"/>
          </linearGradient>
          <filter id="ticketGlow">
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
        {ticketMedioPorDia.map((d, i) => {
          if (ticketMedioPorDia.length > 10 && i % Math.ceil(ticketMedioPorDia.length / 8) !== 0) return null;
          const x = p + (i / Math.max(ticketMedioPorDia.length - 1, 1)) * plotW;
          return (
            <text key={i} x={x} y={h - p + 25} fill="#9CA3AF" textAnchor="middle" fontSize="10">
              {d.label}
            </text>
          );
        })}
        
        {/* Área preenchida */}
        <path d={areaData} fill="url(#ticketAreaGrad)"/>
        
        {/* Linha principal */}
        <path d={pathData} fill="none" stroke="#10B981" strokeWidth="3" filter="url(#ticketGlow)"/>
        
        {/* Pontos */}
        {points.map((pt, i) => (
          <g key={i}>
            <circle cx={pt.x} cy={pt.y} r="6" fill="#1F2937" stroke="#10B981" strokeWidth="3"/>
            <circle cx={pt.x} cy={pt.y} r="3" fill="#10B981"/>
          </g>
        ))}
      </svg>
    );
  };

  // Renderizar gráfico de barras horizontais (vendas por dia da semana)
  const renderHorizontalBarChart = () => {
    const w = 500, h = 250, p = 50;
    const plotW = w - 2 * p, plotH = h - 2 * p;
    const max = Math.max(...vendasPorDiaSemana.map(v => v.total), 100);
    const barH = (plotH / vendasPorDiaSemana.length) * 0.7;
    
    return (
      <svg width="100%" height="250px" viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <linearGradient id="barGrad2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10B981"/>
            <stop offset="100%" stopColor="#34D399"/>
          </linearGradient>
        </defs>
        
        {vendasPorDiaSemana.map((item, i) => {
          const y = p + i * (plotH / vendasPorDiaSemana.length) + (plotH / vendasPorDiaSemana.length - barH) / 2;
          const barW = (item.total / max) * plotW;
          
          return (
            <g key={i}>
              <rect x={p} y={y} width={barW} height={barH} fill="url(#barGrad2)" rx="4" className="hover:opacity-80 transition-opacity cursor-pointer"/>
              <text x={p - 10} y={y + barH / 2 + 4} fill="#6B7280" textAnchor="end" fontSize="12" fontWeight="500">
                {item.dia}
              </text>
              <text x={p + barW + 10} y={y + barH / 2 + 4} fill="#1F2937" textAnchor="start" fontSize="11" fontWeight="bold">
                R$ {item.total.toFixed(2)}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-[#E5E7EB] to-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B5EAA] mx-auto"></div>
          <p className="mt-4 text-[#6B7280]">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-[#E5E7EB] to-[#F9FAFB]">
      <br></br>
      <br></br>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-4">
          <div className="text-center sm:text-left w-full">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-2">
              Dashboard - Matriz
            </h1>
            <p className="text-[#4B5EAA] text-sm">Visão geral do desempenho do negócio</p>
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

        {/* Cards de Métricas - Visão Geral da Rede */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon="store"
            title="Lojas Ativas"
            value={animatedValues.lojas}
            change={undefined}
            isPositive={true}
          />
          <StatCard 
            icon="users"
            title="Funcionários (Rede)"
            value={animatedValues.funcionarios}
            change={undefined}
            isPositive={true}
          />
          <StatCard 
            icon="package"
            title="Produtos Cadastrados"
            value={`${animatedValues.produtos} itens`}
            change={undefined}
            isPositive={true}
          />
          <StatCard 
            icon="dollar"
            title="Receita Total (Rede)"
            value={`R$ ${animatedValues.receitaTotal.toFixed(2)}`}
            change={variacaoReceita}
            isPositive={variacaoReceita >= 0}
          />
        </div>

        {/* Gráficos Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#FFFFFF] bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#E5E7EB]">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#1F2937] flex items-center gap-2">
                <Icon name="activity" className="w-5 h-5 text-[#4B5EAA]" />
                Tendência de Vendas
              </h3>
              <p className="text-[#6B7280] text-sm mt-1">
                {timeFilter === "24h" ? "Últimas 24 horas" : timeFilter === "7d" ? "Últimos 7 dias" : "Últimos 30 dias"}
              </p>
            </div>
            {renderLineChart()}
          </div>

          <div className="bg-[#FFFFFF] bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#E5E7EB]">
            <h3 className="text-xl font-semibold text-[#1F2937] mb-6 flex items-center gap-2">
              <Icon name="chart" className="w-5 h-5 text-[#A83B3B]" />
              Comparativo de Vendas por Loja
            </h3>
            {salesByStore.length > 0 ? (
              <>
                {renderBarChart()}
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-[#6B7280] font-semibold mb-2">Ranking de Lojas:</p>
                  {salesByStore.slice(0, 5).map((store, i) => {
                    const totalGeral = salesByStore.reduce((sum, s) => sum + s.total, 0);
                    const percentage = (store.total / totalGeral) * 100;
                    return (
                      <div key={i} className="flex items-center justify-between text-sm bg-[#F9FAFB] rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[#2A4E73] font-bold w-6">#{i + 1}</span>
                          <span className="text-[#1F2937]">{store.nome}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[#6B7280] text-xs">{store.quantidade} vendas</span>
                          <span className="text-[#1F2937] font-semibold">R$ {store.total.toFixed(2)}</span>
                          <span className="text-[#6B7280] font-semibold text-xs">({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-[#6B7280]">
                Sem vendas no período
              </div>
            )}
          </div>
        </div>

        {/* Segunda Linha de Gráficos - Análise da Rede */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#FFFFFF] bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#E5E7EB]">
            <h3 className="text-xl font-semibold text-[#1F2937] mb-6 flex items-center gap-2">
              <Icon name="package" className="w-5 h-5 text-[#4B5EAA]" />
              Vendas por Categoria (Rede)
            </h3>
            {renderCategoryBarChart()}
            {vendasPorCategoria.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-[#6B7280] font-semibold mb-2">Top Categorias da Rede:</p>
                {vendasPorCategoria.slice(0, 5).map((cat, i) => {
                  const total = vendasPorCategoria.reduce((sum, c) => sum + c.receita, 0);
                  const percentage = (cat.receita / total) * 100;
                  return (
                    <div key={i} className="flex items-center justify-between text-sm bg-[#F9FAFB] rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[#2A4E73] font-bold w-6">#{i + 1}</span>
                        <div className="w-3 h-3 rounded-full bg-[#4B5EAA]"></div>
                        <span className="text-[#1F2937]">{cat.categoria}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#6B7280] text-xs">{cat.quantidade.toFixed(0)} un.</span>
                        <span className="text-[#1F2937] font-semibold">R$ {cat.receita.toFixed(2)}</span>
                        <span className="text-[#6B7280] font-semibold text-xs">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-[#FFFFFF] bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#E5E7EB]">
            <h3 className="text-xl font-semibold text-[#1F2937] mb-6 flex items-center gap-2">
              <Icon name="activity" className="w-5 h-5 text-[#F59E0B]" />
              Vendas por Dia da Semana (Rede)
            </h3>
            {renderHorizontalBarChart()}
            <div className="mt-4 p-3 bg-[#F9FAFB] rounded-lg">
              <p className="text-sm text-[#6B7280] mb-2">Melhor dia da semana:</p>
              <p className="text-lg font-bold text-[#2A4E73]">
                {vendasPorDiaSemana.length > 0 ? vendasPorDiaSemana.reduce((max, d) => d.total > max.total ? d : max, vendasPorDiaSemana[0])?.dia || 'N/A' : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Ticket Médio da Rede */}
        <div className="bg-[#FFFFFF] bg-opacity-50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#E5E7EB]">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-[#1F2937] flex items-center gap-2">
              <Icon name="dollar" className="w-5 h-5 text-[#10B981]" />
              Ticket Médio da Rede
            </h3>
            <p className="text-[#6B7280] text-sm mt-1">
              Valor médio por venda em todas as lojas no período selecionado
            </p>
          </div>
          {ticketMedioPorDia.some(d => d.ticketMedio > 0) ? (
            <>
              {renderTicketMedioChart()}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-[#F9FAFB] rounded-lg">
                  <p className="text-[#6B7280]">Ticket Médio da Rede</p>
                  <p className="text-[#1F2937] font-bold text-lg">
                    R$ {(() => {
                      const vendasComTicket = ticketMedioPorDia.filter(d => d.ticketMedio > 0);
                      return vendasComTicket.length > 0 
                        ? (ticketMedioPorDia.reduce((sum, d) => sum + d.ticketMedio, 0) / vendasComTicket.length).toFixed(2)
                        : '0.00';
                    })()}
                  </p>
                </div>
                <div className="text-center p-3 bg-[#F9FAFB] rounded-lg">
                  <p className="text-[#6B7280]">Total de Vendas (Rede)</p>
                  <p className="text-[#1F2937] font-bold text-lg">
                    {ticketMedioPorDia.reduce((sum, d) => sum + d.quantidade, 0)}
                  </p>
                </div>
                <div className="text-center p-3 bg-[#F9FAFB] rounded-lg">
                  <p className="text-[#6B7280]">Média por Loja</p>
                  <p className="text-[#1F2937] font-bold text-lg">
                    {totalLojas > 0 ? Math.round(ticketMedioPorDia.reduce((sum, d) => sum + d.quantidade, 0) / totalLojas) : 0}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-[#6B7280] py-8">
              Sem vendas no período selecionado
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
