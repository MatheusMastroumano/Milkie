"use client";

import { useState, useEffect } from 'react';
import Header from "@/components/Header/page";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, X, Download, Filter, Plus, Users, FileText, TrendingUp, Building } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function Financeiro() {
  const [activeTab, setActiveTab] = useState('despesas');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [filtroData, setFiltroData] = useState({ inicio: '', fim: '' });
  const [loading, setLoading] = useState(true);

  // Estados para Despesas (usando vendas como base)
  const [despesas, setDespesas] = useState([]);
  const [novaDespesa, setNovaDespesa] = useState({ descricao: '', valor: '', data: '', categoria: 'Fixas' });

  // Estados para Fornecedores
  const [fornecedores, setFornecedores] = useState([]);
  const [novoFornecedor, setNovoFornecedor] = useState({ nome: '', valor: '', vencimento: '' });

  // Estados para Folha de Pagamento
  const [funcionarios, setFuncionarios] = useState([]);
  const [novoFuncionario, setNovoFuncionario] = useState({ nome: '', cargo: '', salario: '', comissao: '' });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [fornecedoresRes, funcionariosRes, vendasRes] = await Promise.all([
        fetch(`${API_URL}/fornecedores`).then(r => r.ok ? r.json() : { fornecedores: [] }).catch(() => ({ fornecedores: [] })),
        fetch(`${API_URL}/funcionarios`).then(r => r.ok ? r.json() : { funcionarios: [] }).catch(() => ({ funcionarios: [] })),
        fetch(`${API_URL}/vendas`).then(r => r.ok ? r.json() : { vendas: [] }).catch(() => ({ vendas: [] }))
      ]);

      setFornecedores((fornecedoresRes.fornecedores || []).map(f => ({
        id: f.id,
        nome: f.nome,
        valor: 0, // Valor seria calculado baseado em compras/contratos
        vencimento: new Date().toISOString().split('T')[0],
        status: f.ativo ? 'Pendente' : 'Pago'
      })));

      setFuncionarios((funcionariosRes.funcionarios || []).map(f => ({
        id: f.id,
        nome: f.nome,
        cargo: f.cargo,
        salario: parseFloat(f.salario || 0),
        comissao: 0, // Comissão seria calculada baseada em vendas
        status: f.ativo ? 'Pendente' : 'Pago'
      })));

      // Usar vendas como base para despesas (receitas negativas)
      const vendas = vendasRes.vendas || [];
      setDespesas(vendas.map((v) => {
        const dataVenda = v.data ? (typeof v.data === 'string' ? v.data.split('T')[0] : new Date(v.data).toISOString().split('T')[0]) : new Date().toISOString().split('T')[0];
        return {
          id: `venda-${v.id}`,
          descricao: `Venda #${v.id}`,
          valor: -parseFloat(v.valor_total || 0), // Negativo para representar saída
          data: dataVenda,
          categoria: 'Variáveis',
          status: 'Pago'
        };
      }));
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
      showAlert('error', 'Erro ao carregar dados financeiros');
    } finally {
      setLoading(false);
    }
  };

  // Fechar alerta
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && alert.show) {
        setAlert({ show: false, type: '', message: '' });
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [alert.show]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000);
  };

  const closeAlert = () => {
    setAlert({ show: false, type: '', message: '' });
  };

  // Funções para Despesas
  const adicionarDespesa = (e) => {
    e.preventDefault();
    if (!novaDespesa.descricao || !novaDespesa.valor || !novaDespesa.data) {
      showAlert('error', 'Preencha todos os campos obrigatórios');
      return;
    }

    const nova = {
      id: `despesa-${Date.now()}`,
      ...novaDespesa,
      valor: parseFloat(novaDespesa.valor),
      status: 'Pendente'
    };

    setDespesas([...despesas, nova]);
    showAlert('success', 'Despesa cadastrada com sucesso!');
    setNovaDespesa({ descricao: '', valor: '', data: '', categoria: 'Fixas' });
  };

  const pagarDespesa = (id) => {
    setDespesas(despesas.map(d => 
      d.id === id ? { ...d, status: 'Pago' } : d
    ));
    showAlert('success', 'Despesa marcada como paga!');
  };

  // Funções para Fornecedores
  const adicionarFornecedor = async (e) => {
    e.preventDefault();
    if (!novoFornecedor.nome || !novoFornecedor.valor || !novoFornecedor.vencimento) {
      showAlert('error', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/fornecedores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: novoFornecedor.nome,
          cnpj_cpf: '',
          ativo: true
        })
      });

      if (!response.ok) throw new Error('Erro ao adicionar fornecedor');

      await carregarDados();
      showAlert('success', 'Fornecedor cadastrado com sucesso!');
      setNovoFornecedor({ nome: '', valor: '', vencimento: '' });
    } catch (error) {
      showAlert('error', `Erro ao adicionar fornecedor: ${error.message}`);
    }
  };

  const pagarFornecedor = (id) => {
    setFornecedores(fornecedores.map(f => 
      f.id === id ? { ...f, status: 'Pago' } : f
    ));
    showAlert('success', 'Pagamento ao fornecedor realizado!');
  };

  // Funções para Folha de Pagamento
  const adicionarFuncionario = (e) => {
    e.preventDefault();
    showAlert('error', 'Para adicionar funcionário, use a página de Funcionários');
    // Funcionários devem ser adicionados na página específica
  };

  const pagarFuncionario = (id) => {
    setFuncionarios(funcionarios.map(f => 
      f.id === id ? { ...f, status: 'Pago' } : f
    ));
    showAlert('success', 'Pagamento realizado com sucesso!');
  };

  // Funções para Relatórios
  const gerarRelatorio = (tipo) => {
    showAlert('success', `Relatório ${tipo} gerado com sucesso!`);
    // Aqui iria a lógica para gerar o relatório
  };

  // Cálculos para os cards
  const totalDespesas = Math.abs(despesas.reduce((sum, d) => sum + Math.abs(d.valor), 0));
  const totalFornecedores = fornecedores.reduce((sum, f) => sum + f.valor, 0);
  const totalFolha = funcionarios.reduce((sum, f) => sum + f.salario + f.comissao, 0);
  const totalPendentes = 
    despesas.filter(d => d.status === 'Pendente').reduce((sum, d) => sum + Math.abs(d.valor), 0) +
    fornecedores.filter(f => f.status === 'Pendente').reduce((sum, f) => sum + f.valor, 0) +
    funcionarios.filter(f => f.status === 'Pendente').reduce((sum, f) => sum + f.salario + f.comissao, 0);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFFFF] pt-14 sm:pt-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6">
          
          {/* Alert de Feedback */}
          {alert.show && (
            <div className="fixed top-20 right-4 z-50 max-w-sm w-full animate-in fade-in slide-in-from-right-2 duration-300">
              <Alert 
                variant={alert.type === 'success' ? 'default' : 'destructive'}
                className="relative shadow-lg border-l-4"
              >
                <button
                  onClick={closeAlert}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex items-start gap-3 pr-6">
                  {alert.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <AlertTitle className="text-sm font-semibold truncate">
                      {alert.type === 'success' ? 'Sucesso!' : 'Erro!'}
                    </AlertTitle>
                    <AlertDescription className="text-sm mt-1 line-clamp-2">
                      {alert.message}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            </div>
          )}

          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2A4E73] mb-2">
              Gestão Financeira
            </h1>
            <p className="text-[#666] text-sm sm:text-base max-w-2xl mx-auto">
              Controle completo das finanças da sua empresa em um só lugar
            </p>
            {loading && (
              <div className="mt-4">
                <p className="text-[#2A4E73]">Carregando dados...</p>
              </div>
            )}
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#F7FAFC] rounded-xl p-6 border border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#666] text-sm">Total Despesas</p>
                  <p className="text-2xl font-bold text-[#2A4E73]">R$ {totalDespesas.toLocaleString()}</p>
                </div>
                <FileText className="h-8 w-8 text-[#2A4E73]" />
              </div>
            </div>

            <div className="bg-[#F7FAFC] rounded-xl p-6 border border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#666] text-sm">Fornecedores</p>
                  <p className="text-2xl font-bold text-[#2A4E73]">R$ {totalFornecedores.toLocaleString()}</p>
                </div>
                <Building className="h-8 w-8 text-[#2A4E73]" />
              </div>
            </div>

            <div className="bg-[#F7FAFC] rounded-xl p-6 border border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#666] text-sm">Folha de Pagamento</p>
                  <p className="text-2xl font-bold text-[#2A4E73]">R$ {totalFolha.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-[#2A4E73]" />
              </div>
            </div>

            <div className="bg-[#F7FAFC] rounded-xl p-6 border border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#666] text-sm">Pendentes</p>
                  <p className="text-2xl font-bold text-[#AD343E]">R$ {totalPendentes.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-[#AD343E]" />
              </div>
            </div>
          </div>

          {/* Abas de Navegação */}
          <div className="bg-[#F7FAFC] rounded-xl p-2 mb-8">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'despesas', label: 'Despesas', icon: FileText },
                { id: 'fornecedores', label: 'Fornecedores', icon: Building },
                { id: 'folha', label: 'Folha de Pagamento', icon: Users },
                { id: 'relatorios', label: 'Relatórios', icon: TrendingUp },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-[#2A4E73] text-white'
                        : 'text-[#2A4E73] hover:bg-[#CFE8F9]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conteúdo das Abas */}
          <div className="bg-[#F7FAFC] rounded-xl shadow-sm border border-[#E2E8F0] p-6">
            
            {/* Aba: Despesas */}
            {activeTab === 'despesas' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-bold text-[#2A4E73] mb-4 sm:mb-0">Controle de Despesas</h2>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-[#2A4E73] border border-[#2A4E73] rounded-lg hover:bg-[#2A4E73] hover:text-white transition-all">
                      <Filter className="h-4 w-4" />
                      Filtrar
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#2A4E73] rounded-lg hover:bg-[#1E3A5C] transition-all">
                      <Download className="h-4 w-4" />
                      Exportar
                    </button>
                  </div>
                </div>

                {/* Formulário de Nova Despesa */}
                <form onSubmit={adicionarDespesa} className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 bg-white rounded-lg border">
                  <div className="lg:col-span-4">
                    <label className="block text-sm font-medium text-[#2A4E73] mb-2">Descrição *</label>
                    <input
                      type="text"
                      value={novaDespesa.descricao}
                      onChange={(e) => setNovaDespesa({ ...novaDespesa, descricao: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A4E73] focus:border-transparent"
                      placeholder="Descrição da despesa"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-[#2A4E73] mb-2">Valor *</label>
                    <input
                      type="number"
                      value={novaDespesa.valor}
                      onChange={(e) => setNovaDespesa({ ...novaDespesa, valor: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A4E73] focus:border-transparent"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-[#2A4E73] mb-2">Data *</label>
                    <input
                      type="date"
                      value={novaDespesa.data}
                      onChange={(e) => setNovaDespesa({ ...novaDespesa, data: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A4E73] focus:border-transparent"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-[#2A4E73] mb-2">Categoria</label>
                    <select
                      value={novaDespesa.categoria}
                      onChange={(e) => setNovaDespesa({ ...novaDespesa, categoria: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A4E73] focus:border-transparent"
                    >
                      <option value="Fixas">Fixas</option>
                      <option value="Variáveis">Variáveis</option>
                      <option value="Operacionais">Operacionais</option>
                    </select>
                  </div>
                  <div className="lg:col-span-2 flex items-end">
                    <button type="submit" className="w-full px-4 py-2 bg-[#2A4E73] text-white rounded-lg hover:bg-[#1E3A5C] transition-all">
                      <Plus className="h-4 w-4 inline mr-2" />
                      Adicionar
                    </button>
                  </div>
                </form>

                {/* Lista de Despesas */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#2A4E73] text-white">
                        <th className="px-4 py-3 text-left">Descrição</th>
                        <th className="px-4 py-3 text-left">Categoria</th>
                        <th className="px-4 py-3 text-left">Data</th>
                        <th className="px-4 py-3 text-right">Valor</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {despesas.map((despesa) => (
                        <tr key={despesa.id} className="hover:bg-[#E6F2FF]">
                          <td className="px-4 py-3">{despesa.descricao}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 text-xs bg-[#CFE8F9] text-[#2A4E73] rounded-full">
                              {despesa.categoria}
                            </span>
                          </td>
                          <td className="px-4 py-3">{new Date(despesa.data).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-right font-medium">R$ {Math.abs(despesa.valor).toLocaleString()}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              despesa.status === 'Pago' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {despesa.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {despesa.status === 'Pendente' && (
                              <button
                                onClick={() => pagarDespesa(despesa.id)}
                                className="px-3 py-1 text-xs bg-[#2A4E73] text-white rounded hover:bg-[#1E3A5C] transition-all"
                              >
                                Marcar como Pago
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Aba: Fornecedores */}
            {activeTab === 'fornecedores' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#2A4E73]">Controle de Fornecedores</h2>
                
                <form onSubmit={adicionarFornecedor} className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 bg-white rounded-lg border">
                  <div className="lg:col-span-4">
                    <label className="block text-sm font-medium text-[#2A4E73] mb-2">Fornecedor *</label>
                    <input
                      type="text"
                      value={novoFornecedor.nome}
                      onChange={(e) => setNovoFornecedor({ ...novoFornecedor, nome: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A4E73] focus:border-transparent"
                      placeholder="Nome do fornecedor"
                    />
                  </div>
                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-[#2A4E73] mb-2">Valor *</label>
                    <input
                      type="number"
                      value={novoFornecedor.valor}
                      onChange={(e) => setNovoFornecedor({ ...novoFornecedor, valor: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A4E73] focus:border-transparent"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-[#2A4E73] mb-2">Vencimento *</label>
                    <input
                      type="date"
                      value={novoFornecedor.vencimento}
                      onChange={(e) => setNovoFornecedor({ ...novoFornecedor, vencimento: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A4E73] focus:border-transparent"
                    />
                  </div>
                  <div className="lg:col-span-2 flex items-end">
                    <button type="submit" className="w-full px-4 py-2 bg-[#2A4E73] text-white rounded-lg hover:bg-[#1E3A5C] transition-all">
                      <Plus className="h-4 w-4 inline mr-2" />
                      Adicionar
                    </button>
                  </div>
                </form>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#2A4E73] text-white">
                        <th className="px-4 py-3 text-left">Fornecedor</th>
                        <th className="px-4 py-3 text-left">Vencimento</th>
                        <th className="px-4 py-3 text-right">Valor</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {fornecedores.map((fornecedor) => (
                        <tr key={fornecedor.id} className="hover:bg-[#E6F2FF]">
                          <td className="px-4 py-3 font-medium">{fornecedor.nome}</td>
                          <td className="px-4 py-3">{new Date(fornecedor.vencimento).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-right">R$ {fornecedor.valor.toLocaleString()}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              fornecedor.status === 'Pago' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {fornecedor.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {fornecedor.status === 'Pendente' && (
                              <button
                                onClick={() => pagarFornecedor(fornecedor.id)}
                                className="px-3 py-1 text-xs bg-[#2A4E73] text-white rounded hover:bg-[#1E3A5C] transition-all"
                              >
                                Registrar Pagamento
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Aba: Folha de Pagamento */}
            {activeTab === 'folha' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#2A4E73]">Folha de Pagamento</h2>
                
                <form onSubmit={adicionarFuncionario} className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 bg-white rounded-lg border">
                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-[#2A4E73] mb-2">Nome *</label>
                    <input
                      type="text"
                      value={novoFuncionario.nome}
                      onChange={(e) => setNovoFuncionario({ ...novoFuncionario, nome: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A4E73] focus:border-transparent"
                      placeholder="Nome do funcionário"
                    />
                  </div>
                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-[#2A4E73] mb-2">Cargo *</label>
                    <input
                      type="text"
                      value={novoFuncionario.cargo}
                      onChange={(e) => setNovoFuncionario({ ...novoFuncionario, cargo: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A4E73] focus:border-transparent"
                      placeholder="Cargo"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-[#2A4E73] mb-2">Salário *</label>
                    <input
                      type="number"
                      value={novoFuncionario.salario}
                      onChange={(e) => setNovoFuncionario({ ...novoFuncionario, salario: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A4E73] focus:border-transparent"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-[#2A4E73] mb-2">Comissão</label>
                    <input
                      type="number"
                      value={novoFuncionario.comissao}
                      onChange={(e) => setNovoFuncionario({ ...novoFuncionario, comissao: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A4E73] focus:border-transparent"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  <div className="lg:col-span-2 flex items-end">
                    <button type="submit" className="w-full px-4 py-2 bg-[#2A4E73] text-white rounded-lg hover:bg-[#1E3A5C] transition-all">
                      <Plus className="h-4 w-4 inline mr-2" />
                      Adicionar
                    </button>
                  </div>
                </form>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#2A4E73] text-white">
                        <th className="px-4 py-3 text-left">Funcionário</th>
                        <th className="px-4 py-3 text-left">Cargo</th>
                        <th className="px-4 py-3 text-right">Salário</th>
                        <th className="px-4 py-3 text-right">Comissão</th>
                        <th className="px-4 py-3 text-right">Total</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {funcionarios.map((func) => (
                        <tr key={func.id} className="hover:bg-[#E6F2FF]">
                          <td className="px-4 py-3 font-medium">{func.nome}</td>
                          <td className="px-4 py-3">{func.cargo}</td>
                          <td className="px-4 py-3 text-right">R$ {func.salario.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">R$ {func.comissao.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-bold">R$ {(func.salario + func.comissao).toLocaleString()}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              func.status === 'Pago' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {func.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {func.status === 'Pendente' && (
                              <button
                                onClick={() => pagarFuncionario(func.id)}
                                className="px-3 py-1 text-xs bg-[#2A4E73] text-white rounded hover:bg-[#1E3A5C] transition-all"
                              >
                                Efetuar Pagamento
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Aba: Relatórios */}
            {activeTab === 'relatorios' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#2A4E73]">Relatórios Financeiros</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: 'Relatório de Despesas', description: 'Análise detalhada de todas as despesas', type: 'despesas' },
                    { title: 'Fluxo de Caixa', description: 'Entradas e saídas do período', type: 'fluxo-caixa' },
                    { title: 'Folha de Pagamento', description: 'Relatório completo da folha', type: 'folha' },
                    { title: 'Fornecedores', description: 'Pagamentos e pendências', type: 'fornecedores' },
                    { title: 'Demonstrativo Resultado', description: 'DRE do período', type: 'dre' },
                    { title: 'Personalizado', description: 'Relatório com filtros customizados', type: 'personalizado' },
                  ].map((relatorio) => (
                    <div key={relatorio.type} className="bg-white rounded-lg border p-6 hover:shadow-md transition-all">
                      <h3 className="font-bold text-[#2A4E73] mb-2">{relatorio.title}</h3>
                      <p className="text-sm text-[#666] mb-4">{relatorio.description}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => gerarRelatorio(relatorio.title)}
                          className="flex-1 px-3 py-2 bg-[#2A4E73] text-white text-sm rounded hover:bg-[#1E3A5C] transition-all"
                        >
                          Gerar PDF
                        </button>
                        <button className="px-3 py-2 border border-[#2A4E73] text-[#2A4E73] text-sm rounded hover:bg-[#CFE8F9] transition-all">
                          <Filter className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Filtros de Período */}
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="font-bold text-[#2A4E73] mb-4">Filtros por Período</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2A4E73] mb-2">Data Início</label>
                      <input
                        type="date"
                        value={filtroData.inicio}
                        onChange={(e) => setFiltroData({ ...filtroData, inicio: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A4E73]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2A4E73] mb-2">Data Fim</label>
                      <input
                        type="date"
                        value={filtroData.fim}
                        onChange={(e) => setFiltroData({ ...filtroData, fim: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A4E73]"
                      />
                    </div>
                    <div className="flex items-end">
                      <button className="w-full px-4 py-2 bg-[#2A4E73] text-white rounded-lg hover:bg-[#1E3A5C] transition-all">
                        Aplicar Filtros
                      </button>
                    </div>
                    <div className="flex items-end">
                      <button className="w-full px-4 py-2 border border-[#2A4E73] text-[#2A4E73] rounded-lg hover:bg-[#CFE8F9] transition-all">
                        Limpar Filtros
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}