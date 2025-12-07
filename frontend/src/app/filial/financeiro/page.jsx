"use client";

import { useState, useEffect } from 'react';
import Header from "@/components/Headerfilial/page";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, X, Download, Filter, Plus, Users, FileText, TrendingUp, Building, Trash2 } from 'lucide-react';
import { apiJson } from '@/lib/api';
import { 
  gerarPDFDespesas, 
  gerarPDFFornecedores, 
  gerarPDFFolha, 
  gerarPDFFluxoCaixa,
  gerarPDFPersonalizado 
} from '@/lib/pdfGenerator';

import Footer from "@/components/footerfilial/page";


export default function Financeiro() {
  const [activeTab, setActiveTab] = useState('despesas');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [filtroData, setFiltroData] = useState({ inicio: '', fim: '' });
  const [loading, setLoading] = useState(true);
  const [lojaId, setLojaId] = useState(null);

  // Estados para Despesas
  const [despesas, setDespesas] = useState([]);
  const [novaDespesa, setNovaDespesa] = useState({ descricao: '', valor: '', data: '', categoria: 'Fixas' });

  // Estados para Fornecedores
  const [fornecedoresLista, setFornecedoresLista] = useState([]);
  const [pagamentosFornecedores, setPagamentosFornecedores] = useState([]);
  const [novoPagamentoFornecedor, setNovoPagamentoFornecedor] = useState({ fornecedor_id: '', valor: '', vencimento: '' });

  // Estados para Folha de Pagamento
  const [funcionariosLista, setFuncionariosLista] = useState([]);
  const [pagamentosFuncionarios, setPagamentosFuncionarios] = useState([]);
  const [novoPagamentoFuncionario, setNovoPagamentoFuncionario] = useState({ funcionario_id: '', salario: '', comissao: '' });

  // Estados para Vendas e Caixa (para relatório de fluxo de caixa)
  const [vendas, setVendas] = useState([]);
  const [caixas, setCaixas] = useState([]);
  const [vendaPagamentos, setVendaPagamentos] = useState([]);

  // Obter loja_id do usuário autenticado
  useEffect(() => {
    (async () => {
      try {
        const auth = await apiJson('/auth/check-auth');
        setLojaId(auth?.user?.loja_id || null);
      } catch {
        setLojaId(null);
      }
    })();
  }, []);

  useEffect(() => {
    if (lojaId !== null) {
      carregarDados();
    }
  }, [lojaId]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [despesasRes, pagamentosFornecedoresRes, pagamentosFuncionariosRes, fornecedoresRes, funcionariosRes, vendasRes, caixasRes, vendaPagamentosRes] = await Promise.all([
        apiJson('/despesas').catch(() => ({ despesas: [] })),
        apiJson('/pagamentos-fornecedores').catch(() => ({ pagamentos_fornecedores: [] })),
        apiJson('/pagamentos-funcionarios').catch(() => ({ pagamentos_funcionarios: [] })),
        apiJson('/fornecedores').catch(() => ({ fornecedores: [] })),
        apiJson('/funcionarios').catch(() => ({ funcionarios: [] })),
        apiJson('/vendas').catch(() => ({ vendas: [] })),
        apiJson('/caixa').catch(() => ({ caixa: [] })),
        apiJson('/venda-pagamentos').catch(() => ({ venda_pagamentos: [] }))
      ]);

      // Filtrar apenas dados da loja atual
      const despesasFiltradas = (despesasRes.despesas || []).filter(d => d.loja_id === lojaId);
      setDespesas(despesasFiltradas.map(d => ({
        id: d.id,
        descricao: d.descricao,
        valor: parseFloat(d.valor || 0),
        data: d.data ? (typeof d.data === 'string' ? d.data.split('T')[0] : new Date(d.data).toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
        categoria: d.categoria,
        status: d.status === 'pago' ? 'Pago' : 'Pendente'
      })));

      const pagamentosFornecedoresFiltrados = (pagamentosFornecedoresRes.pagamentos_fornecedores || []).filter(p => p.loja_id === lojaId);
      setPagamentosFornecedores(pagamentosFornecedoresFiltrados.map(p => ({
        id: p.id,
        fornecedor_id: p.fornecedor_id,
        fornecedor_nome: p.fornecedor?.nome || '',
        valor: parseFloat(p.valor || 0),
        vencimento: p.vencimento ? (typeof p.vencimento === 'string' ? p.vencimento.split('T')[0] : new Date(p.vencimento).toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
        status: p.status === 'pago' ? 'Pago' : 'Pendente'
      })));

      const pagamentosFuncionariosFiltrados = (pagamentosFuncionariosRes.pagamentos_funcionarios || []).filter(p => p.loja_id === lojaId);
      setPagamentosFuncionarios(pagamentosFuncionariosFiltrados.map(p => ({
        id: p.id,
        funcionario_id: p.funcionario_id,
        funcionario_nome: p.funcionario?.nome || '',
        funcionario_cargo: p.funcionario?.cargo || '',
        salario: parseFloat(p.salario || 0),
        comissao: parseFloat(p.comissao || 0),
        status: p.status === 'pago' ? 'Pago' : 'Pendente'
      })));

      setFornecedoresLista(fornecedoresRes.fornecedores || []);
      setFuncionariosLista((funcionariosRes.funcionarios || []).filter(f => f.loja_id === lojaId));
      
      // Filtrar vendas, caixas e pagamentos da loja
      const vendasFiltradas = (vendasRes.vendas || []).filter(v => v.loja_id === lojaId);
      setVendas(vendasFiltradas);
      
      const caixasFiltrados = (caixasRes.caixa || caixasRes.caixas || []).filter(c => c.loja_id === lojaId);
      setCaixas(caixasFiltrados);
      
      const vendaPagamentosFiltrados = (vendaPagamentosRes.venda_pagamentos || vendaPagamentosRes.vendaPagamentos || []).filter(p => {
        return vendasFiltradas.some(v => v.id === p.venda_id);
      });
      setVendaPagamentos(vendaPagamentosFiltrados);
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
  const adicionarDespesa = async (e) => {
    e.preventDefault();
    if (!novaDespesa.descricao || !novaDespesa.valor || !novaDespesa.data || !lojaId) {
      showAlert('error', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const valorNumerico = parseFloat(novaDespesa.valor);
      if (isNaN(valorNumerico) || valorNumerico <= 0) {
        showAlert('error', 'Valor deve ser um número positivo');
        return;
      }

      await apiJson('/despesas', {
        method: 'POST',
        body: JSON.stringify({
          loja_id: Number(lojaId),
          descricao: novaDespesa.descricao.trim(),
          valor: valorNumerico,
          data: novaDespesa.data,
          categoria: novaDespesa.categoria,
          status: 'pendente'
        })
      });

      showAlert('success', 'Despesa cadastrada com sucesso!');
      setNovaDespesa({ descricao: '', valor: '', data: '', categoria: 'Fixas' });
      await carregarDados();
    } catch (error) {
      console.error('Erro ao cadastrar despesa:', error);
      const errorMessage = error.message || 'Erro desconhecido ao cadastrar despesa';
      showAlert('error', `Erro ao cadastrar despesa: ${errorMessage}`);
    }
  };

  const pagarDespesa = async (id) => {
    try {
      await apiJson(`/despesas/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'pago' })
      });
      showAlert('success', 'Despesa marcada como paga!');
      await carregarDados();
    } catch (error) {
      showAlert('error', `Erro ao atualizar despesa: ${error.message}`);
    }
  };

  const excluirDespesa = async (id) => {
    const despesa = despesas.find(d => d.id === id);
    if (!window.confirm(`Tem certeza que deseja excluir a despesa "${despesa?.descricao || 'esta despesa'}"?`)) {
      return;
    }

    try {
      await apiJson(`/despesas/${id}`, {
        method: 'DELETE'
      });
      showAlert('success', 'Despesa excluída com sucesso!');
      await carregarDados();
    } catch (error) {
      showAlert('error', `Erro ao excluir despesa: ${error.message}`);
    }
  };

  // Funções para Fornecedores
  const adicionarPagamentoFornecedor = async (e) => {
    e.preventDefault();
    if (!novoPagamentoFornecedor.fornecedor_id || !novoPagamentoFornecedor.valor || !novoPagamentoFornecedor.vencimento || !lojaId) {
      showAlert('error', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      await apiJson('/pagamentos-fornecedores', {
        method: 'POST',
        body: JSON.stringify({
          fornecedor_id: parseInt(novoPagamentoFornecedor.fornecedor_id),
          loja_id: lojaId,
          valor: parseFloat(novoPagamentoFornecedor.valor),
          vencimento: novoPagamentoFornecedor.vencimento,
          status: 'pendente'
        })
      });

      showAlert('success', 'Pagamento de fornecedor cadastrado com sucesso!');
      setNovoPagamentoFornecedor({ fornecedor_id: '', valor: '', vencimento: '' });
      await carregarDados();
    } catch (error) {
      showAlert('error', `Erro ao cadastrar pagamento: ${error.message}`);
    }
  };

  const pagarFornecedor = async (id) => {
    try {
      await apiJson(`/pagamentos-fornecedores/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ 
          status: 'pago',
          data_pagamento: new Date().toISOString()
        })
      });
      showAlert('success', 'Pagamento ao fornecedor realizado!');
      await carregarDados();
    } catch (error) {
      showAlert('error', `Erro ao atualizar pagamento: ${error.message}`);
    }
  };

  const excluirPagamentoFornecedor = async (id) => {
    const pagamento = pagamentosFornecedores.find(p => p.id === id);
    if (!window.confirm(`Tem certeza que deseja excluir o pagamento do fornecedor "${pagamento?.fornecedor_nome || 'este fornecedor'}"?`)) {
      return;
    }

    try {
      await apiJson(`/pagamentos-fornecedores/${id}`, {
        method: 'DELETE'
      });
      showAlert('success', 'Pagamento de fornecedor excluído com sucesso!');
      await carregarDados();
    } catch (error) {
      showAlert('error', `Erro ao excluir pagamento: ${error.message}`);
    }
  };

  // Funções para Folha de Pagamento
  const adicionarPagamentoFuncionario = async (e) => {
    e.preventDefault();
    if (!novoPagamentoFuncionario.funcionario_id || !novoPagamentoFuncionario.salario || !lojaId) {
      showAlert('error', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const funcionario = funcionariosLista.find(f => f.id === parseInt(novoPagamentoFuncionario.funcionario_id));
      if (!funcionario) {
        showAlert('error', 'Funcionário não encontrado');
        return;
      }

      await apiJson('/pagamentos-funcionarios', {
        method: 'POST',
        body: JSON.stringify({
          funcionario_id: parseInt(novoPagamentoFuncionario.funcionario_id),
          loja_id: lojaId,
          salario: parseFloat(novoPagamentoFuncionario.salario),
          comissao: parseFloat(novoPagamentoFuncionario.comissao || 0),
          status: 'pendente'
        })
      });

      showAlert('success', 'Pagamento de funcionário cadastrado com sucesso!');
      setNovoPagamentoFuncionario({ funcionario_id: '', salario: '', comissao: '' });
      await carregarDados();
    } catch (error) {
      showAlert('error', `Erro ao cadastrar pagamento: ${error.message}`);
    }
  };

  const pagarFuncionario = async (id) => {
    try {
      await apiJson(`/pagamentos-funcionarios/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ 
          status: 'pago',
          data_pagamento: new Date().toISOString()
        })
      });
      showAlert('success', 'Pagamento realizado com sucesso!');
      await carregarDados();
    } catch (error) {
      showAlert('error', `Erro ao atualizar pagamento: ${error.message}`);
    }
  };

  const excluirPagamentoFuncionario = async (id) => {
    const pagamento = pagamentosFuncionarios.find(p => p.id === id);
    if (!window.confirm(`Tem certeza que deseja excluir o pagamento do funcionário "${pagamento?.funcionario_nome || 'este funcionário'}"?`)) {
      return;
    }

    try {
      await apiJson(`/pagamentos-funcionarios/${id}`, {
        method: 'DELETE'
      });
      showAlert('success', 'Pagamento de funcionário excluído com sucesso!');
      await carregarDados();
    } catch (error) {
      showAlert('error', `Erro ao excluir pagamento: ${error.message}`);
    }
  };

  // Funções para Relatórios
  const gerarRelatorio = (tipo) => {
    try {
      switch (tipo) {
        case 'despesas':
          gerarPDFDespesas(despesas, filtroData);
          showAlert('success', 'Relatório de Despesas gerado com sucesso!');
          break;
        case 'fornecedores':
          gerarPDFFornecedores(pagamentosFornecedores, filtroData);
          showAlert('success', 'Relatório de Fornecedores gerado com sucesso!');
          break;
        case 'folha':
          gerarPDFFolha(pagamentosFuncionarios, filtroData);
          showAlert('success', 'Relatório de Folha de Pagamento gerado com sucesso!');
          break;
        case 'fluxo-caixa':
          gerarPDFFluxoCaixa(despesas, pagamentosFornecedores, pagamentosFuncionarios, filtroData, vendas, caixas, vendaPagamentos);
          showAlert('success', 'Relatório de Fluxo de Caixa gerado com sucesso!');
          break;
        case 'personalizado':
          gerarPDFPersonalizado(despesas, pagamentosFornecedores, pagamentosFuncionarios, filtroData);
          showAlert('success', 'Relatório Personalizado gerado com sucesso!');
          break;
        default:
          showAlert('error', 'Tipo de relatório não reconhecido');
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      showAlert('error', `Erro ao gerar relatório: ${error.message}`);
    }
  };

  // Cálculos para os cards
  const totalDespesas = Math.abs(despesas.reduce((sum, d) => sum + Math.abs(d.valor), 0));
  const totalFornecedores = pagamentosFornecedores.reduce((sum, f) => sum + f.valor, 0);
  const totalFolha = pagamentosFuncionarios.reduce((sum, f) => sum + f.salario + f.comissao, 0);
  const totalPendentes = 
    despesas.filter(d => d.status === 'Pendente').reduce((sum, d) => sum + Math.abs(d.valor), 0) +
    pagamentosFornecedores.filter(f => f.status === 'Pendente').reduce((sum, f) => sum + f.valor, 0) +
    pagamentosFuncionarios.filter(f => f.status === 'Pendente').reduce((sum, f) => sum + f.salario + f.comissao, 0);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFFFF] pt-14 sm:pt-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6">
          
          {/* Alert de Feedback */}
          {alert.show && (
  <div className="fixed top-4 right-4 z-50 w-[90%] max-w-sm animate-in fade-in-50 slide-in-from-right-5 duration-300">
    <Alert 
      variant={alert.type === "success" ? "default" : "destructive"}
      className="relative shadow-xl border"
    >
      <button
        onClick={closeAlert}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        {alert.type === "success" ? (
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
        ) : (
          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
        )}

        <div className="flex-1">
          <AlertTitle className="text-sm font-semibold">
            {alert.type === "success" ? "Sucesso!" : "Erro!"}
          </AlertTitle>

          <AlertDescription className="text-sm mt-1">
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
                      className="w-full"
                      placeholder="Descrição da despesa"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-[#2A4E73] mb-2">Valor *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={novaDespesa.valor}
                      onChange={(e) => setNovaDespesa({ ...novaDespesa, valor: e.target.value })}
                      className="w-full"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-[#2A4E73] mb-2">Data *</label>
                    <input
                      type="date"
                      value={novaDespesa.data}
                      onChange={(e) => setNovaDespesa({ ...novaDespesa, data: e.target.value })}
                      className="w-full"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-[#2A4E73] mb-2">Categoria</label>
                    <select
                      value={novaDespesa.categoria}
                      onChange={(e) => setNovaDespesa({ ...novaDespesa, categoria: e.target.value })}
                      className="w-full"
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
                      {despesas.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                            Nenhuma despesa cadastrada
                          </td>
                        </tr>
                      ) : (
                        despesas.map((despesa) => (
                          <tr key={despesa.id} className="hover:bg-[#E6F2FF]">
                            <td className="px-4 py-3">{despesa.descricao}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 text-xs bg-[#CFE8F9] text-[#2A4E73] rounded-full">
                                {despesa.categoria}
                              </span>
                            </td>
                            <td className="px-4 py-3">{new Date(despesa.data).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-right font-medium">R$ {Math.abs(despesa.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
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
                              <div className="flex items-center justify-center gap-2">
                                {despesa.status === 'Pendente' && (
                                  <button
                                    onClick={() => pagarDespesa(despesa.id)}
                                    className="px-3 py-1 text-xs bg-[#2A4E73] text-white rounded hover:bg-[#1E3A5C] transition-all"
                                  >
                                    Marcar como Pago
                                  </button>
                                )}
                                <button
                                  onClick={() => excluirDespesa(despesa.id)}
                                  className="px-3 py-1 text-xs bg-[#AD343E] text-white rounded hover:bg-[#8B2A32] transition-all flex items-center gap-1"
                                  title="Excluir despesa"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Aba: Fornecedores */}
            {activeTab === 'fornecedores' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#2A4E73]">Controle de Fornecedores</h2>
                
                <form onSubmit={adicionarPagamentoFornecedor} className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 bg-white rounded-lg border">
                  <div className="lg:col-span-4">
                    <label className="block text-sm font-medium text-[#2A4E73] mb-2">Fornecedor *</label>
                    <select
                      value={novoPagamentoFornecedor.fornecedor_id}
                      onChange={(e) => setNovoPagamentoFornecedor({ ...novoPagamentoFornecedor, fornecedor_id: e.target.value })}
                      className="w-full"
                    >
                      <option value="">Selecione um fornecedor</option>
                      {fornecedoresLista.filter(f => f.ativo).map(f => (
                        <option key={f.id} value={f.id}>{f.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-[#2A4E73] mb-2">Valor *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={novoPagamentoFornecedor.valor}
                      onChange={(e) => setNovoPagamentoFornecedor({ ...novoPagamentoFornecedor, valor: e.target.value })}
                      className="w-full"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-[#2A4E73] mb-2">Vencimento *</label>
                    <input
                      type="date"
                      value={novoPagamentoFornecedor.vencimento}
                      onChange={(e) => setNovoPagamentoFornecedor({ ...novoPagamentoFornecedor, vencimento: e.target.value })}
                      className="w-full"
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
                      {pagamentosFornecedores.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                            Nenhum pagamento de fornecedor cadastrado
                          </td>
                        </tr>
                      ) : (
                        pagamentosFornecedores.map((fornecedor) => (
                          <tr key={fornecedor.id} className="hover:bg-[#E6F2FF]">
                            <td className="px-4 py-3 font-medium">{fornecedor.fornecedor_nome}</td>
                            <td className="px-4 py-3">{new Date(fornecedor.vencimento).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-right">R$ {fornecedor.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
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
                              <div className="flex items-center justify-center gap-2">
                                {fornecedor.status === 'Pendente' && (
                                  <button
                                    onClick={() => pagarFornecedor(fornecedor.id)}
                                    className="px-3 py-1 text-xs bg-[#2A4E73] text-white rounded hover:bg-[#1E3A5C] transition-all"
                                  >
                                    Registrar Pagamento
                                  </button>
                                )}
                                <button
                                  onClick={() => excluirPagamentoFornecedor(fornecedor.id)}
                                  className="px-3 py-1 text-xs bg-[#AD343E] text-white rounded hover:bg-[#8B2A32] transition-all flex items-center gap-1"
                                  title="Excluir pagamento"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Aba: Folha de Pagamento */}
            {activeTab === 'folha' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#2A4E73]">Folha de Pagamento</h2>
                
                <form onSubmit={adicionarPagamentoFuncionario} className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 bg-white rounded-lg border">
                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-[#2A4E73] mb-2">Funcionário *</label>
                    <select
                      value={novoPagamentoFuncionario.funcionario_id}
                      onChange={(e) => {
                        const func = funcionariosLista.find(f => f.id === parseInt(e.target.value));
                        setNovoPagamentoFuncionario({ 
                          ...novoPagamentoFuncionario, 
                          funcionario_id: e.target.value,
                          salario: func ? func.salario.toString() : ''
                        });
                      }}
                      className="w-full"
                    >
                      <option value="">Selecione um funcionário</option>
                      {funcionariosLista.filter(f => f.ativo).map(f => (
                        <option key={f.id} value={f.id}>{f.nome} - {f.cargo}</option>
                      ))}
                    </select>
                  </div>
                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-[#2A4E73] mb-2">Salário *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={novoPagamentoFuncionario.salario}
                      onChange={(e) => setNovoPagamentoFuncionario({ ...novoPagamentoFuncionario, salario: e.target.value })}
                      className="w-full"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-[#2A4E73] mb-2">Comissão</label>
                    <input
                      type="number"
                      step="0.01"
                      value={novoPagamentoFuncionario.comissao}
                      onChange={(e) => setNovoPagamentoFuncionario({ ...novoPagamentoFuncionario, comissao: e.target.value })}
                      className="w-full"
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
                      {pagamentosFuncionarios.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                            Nenhum pagamento de funcionário cadastrado
                          </td>
                        </tr>
                      ) : (
                        pagamentosFuncionarios.map((func) => (
                          <tr key={func.id} className="hover:bg-[#E6F2FF]">
                            <td className="px-4 py-3 font-medium">{func.funcionario_nome}</td>
                            <td className="px-4 py-3">{func.funcionario_cargo}</td>
                            <td className="px-4 py-3 text-right">R$ {func.salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="px-4 py-3 text-right">R$ {func.comissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="px-4 py-3 text-right font-bold">R$ {(func.salario + func.comissao).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
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
                              <div className="flex items-center justify-center gap-2">
                                {func.status === 'Pendente' && (
                                  <button
                                    onClick={() => pagarFuncionario(func.id)}
                                    className="px-3 py-1 text-xs bg-[#2A4E73] text-white rounded hover:bg-[#1E3A5C] transition-all"
                                  >
                                    Efetuar Pagamento
                                  </button>
                                )}
                                <button
                                  onClick={() => excluirPagamentoFuncionario(func.id)}
                                  className="px-3 py-1 text-xs bg-[#AD343E] text-white rounded hover:bg-[#8B2A32] transition-all flex items-center gap-1"
                                  title="Excluir pagamento"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
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
                    { title: 'Relatório Completo', description: 'Todos os dados financeiros', type: 'personalizado' },
                  ].map((relatorio) => (
                    <div key={relatorio.type} className="bg-white rounded-lg border p-6 hover:shadow-md transition-all">
                      <h3 className="font-bold text-[#2A4E73] mb-2">{relatorio.title}</h3>
                      <p className="text-sm text-[#666] mb-4">{relatorio.description}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => gerarRelatorio(relatorio.type)}
                          className="flex-1 px-3 py-2 bg-[#2A4E73] text-white text-sm rounded hover:bg-[#1E3A5C] transition-all"
                        >
                          Gerar PDF
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
                      <button 
                        onClick={() => {
                          // Os filtros já são aplicados automaticamente quando os dados são carregados
                          showAlert('success', 'Filtros aplicados! Os relatórios usarão o período selecionado.');
                        }}
                        className="w-full px-4 py-2 bg-[#2A4E73] text-white rounded-lg hover:bg-[#1E3A5C] transition-all"
                      >
                        Aplicar Filtros
                      </button>
                    </div>
                    <div className="flex items-end">
                      <button 
                        onClick={() => {
                          setFiltroData({ inicio: '', fim: '' });
                          showAlert('success', 'Filtros limpos!');
                        }}
                        className="w-full px-4 py-2 border border-[#2A4E73] text-[#2A4E73] rounded-lg hover:bg-[#CFE8F9] transition-all"
                      >
                        Limpar Filtros
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
            <Footer />
      </main>
    </>
  );
}
