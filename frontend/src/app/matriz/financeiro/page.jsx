"use client";

import { useState, useEffect } from 'react';

import Header from "@/components/Header/page";

// Simulação de contexto de autenticação (substituir por sistema real)
const getCurrentUser = () => ({
  id: 1,
  funcao: 'admin', // Ou 'gerente' para teste
  loja_id: null,   // null para Admin, ID da loja para Gerente
});

const prisma = new PrismaClient();

export default function GestaoFinanceira() {
  const [lojas, setLojas] = useState([]);
  const [entradas, setEntradas] = useState([]);
  const [saidas, setSaidas] = useState([]);
  const [novaEntrada, setNovaEntrada] = useState({ loja_id: '', valor: '', data: new Date().toISOString().split('T')[0] });
  const [novaSaida, setNovaSaida] = useState({ loja_id: '', tipo: 'Despesa', descricao: '', valor: '', data: new Date().toISOString().split('T')[0] });
  const [editEntrada, setEditEntrada] = useState(null);
  const [editSaida, setEditSaida] = useState(null);
  const [errors, setErrors] = useState({});
  const [isModalEntradaOpen, setIsModalEntradaOpen] = useState(false);
  const [isModalSaidaOpen, setIsModalSaidaOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [relatorioPeriodo, setRelatorioPeriodo] = useState('diario');
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedLojas = await prisma.lojas.findMany({ where: { ativo: true } });
        setLojas(fetchedLojas);

        // Simula entradas a partir de vendas
        const fetchedVendas = await prisma.vendas.findMany({
          include: { itens: true },
          where: user.funcao === 'gerente' ? { loja_id: user.loja_id } : {},
        });
        const mappedEntradas = fetchedVendas.map(venda => ({
          id: venda.id,
          loja_id: venda.loja_id,
          valor: venda.valor_total,
          data: venda.data.toISOString().split('T')[0],
          tipo: 'Venda PDV',
        }));
        setEntradas(mappedEntradas);

        // Simula saídas (pode ser expandido com uma tabela de despesas futura)
        const fetchedSaidas = await prisma.saidas.findMany({
          where: user.funcao === 'gerente' ? { loja_id: user.loja_id } : {},
        }); // Adicione uma tabela 'saidas' se necessário
        setSaidas(fetchedSaidas || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setNotification('Erro ao carregar dados. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.funcao, user.loja_id]);

  // Função para mostrar notificação
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Função para validar formulários
  const validateForm = (data, fields) => {
    const newErrors = {};
    fields.forEach(field => {
      if (!data[field]?.trim() && field !== 'descricao' && field !== 'fornecedor' && field !== 'funcionario') {
        newErrors[field] = `O campo ${field} é obrigatório`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funções para Entradas
  const handleAddEntrada = async (e) => {
    e.preventDefault();
    if (!validateForm(novaEntrada, ['loja_id', 'valor'])) return;
    try {
      const newEntrada = await prisma.vendas.create({
        data: {
          loja_id: parseInt(novaEntrada.loja_id),
          usuario_id: user.id,
          valor_total: parseFloat(novaEntrada.valor),
          data: new Date(novaEntrada.data),
          itens: { create: { produto_id: 1, quantidade: 1, preco_unitario: parseFloat(novaEntrada.valor), subtotal: parseFloat(novaEntrada.valor) } },
        },
      });
      setEntradas([...entradas, { id: newEntrada.id, ...novaEntrada, tipo: 'Venda PDV' }]);
      setNovaEntrada({ loja_id: '', valor: '', data: new Date().toISOString().split('T')[0] });
      setErrors({});
      showNotification('Entrada registrada com sucesso! 🎉');
    } catch (error) {
      showNotification('Erro ao registrar entrada.');
    }
  };

  const handleEditEntrada = async (e) => {
    e.preventDefault();
    if (!validateForm(editEntrada, ['loja_id', 'valor'])) return;
    try {
      await prisma.vendas.update({
        where: { id: editEntrada.id },
        data: { valor_total: parseFloat(editEntrada.valor), data: new Date(editEntrada.data) },
      });
      setEntradas(entradas.map(e => e.id === editEntrada.id ? editEntrada : e));
      setIsModalEntradaOpen(false);
      setEditEntrada(null);
      setErrors({});
      showNotification('Entrada atualizada com sucesso! ✅');
    } catch (error) {
      showNotification('Erro ao atualizar entrada.');
    }
  };

  const openEditEntrada = (entrada) => {
    setEditEntrada(entrada);
    setIsModalEntradaOpen(true);
    setErrors({});
  };

  const handleDeleteEntrada = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta entrada?')) return;
    try {
      await prisma.vendas.delete({ where: { id } });
      setEntradas(entradas.filter(e => e.id !== id));
      showNotification('Entrada removida com sucesso! 🗑️');
    } catch (error) {
      showNotification('Erro ao remover entrada.');
    }
  };

  // Funções para Saídas (simulação, adicione tabela 'saidas' para real uso)
  const handleAddSaida = async (e) => {
    e.preventDefault();
    const dataToValidate = { ...novaSaida, descricao: novaSaida.tipo === 'Despesa' ? novaSaida.descricao : novaSaida.fornecedor || novaSaida.funcionario };
    const fields = ['loja_id', 'valor', novaSaida.tipo === 'Despesa' ? 'descricao' : novaSaida.tipo === 'Fornecedor' ? 'fornecedor' : 'funcionario'];
    if (!validateForm(dataToValidate, fields)) return;
    try {
      const newSaida = await prisma.saidas.create({
        data: { loja_id: parseInt(novaSaida.loja_id), ...novaSaida, valor: parseFloat(novaSaida.valor), data: new Date(novaSaida.data) },
      });
      setSaidas([...saidas, newSaida]);
      setNovaSaida({ loja_id: '', tipo: 'Despesa', descricao: '', valor: '', data: new Date().toISOString().split('T')[0] });
      setErrors({});
      showNotification('Saída registrada com sucesso! 🎉');
    } catch (error) {
      showNotification('Erro ao registrar saída.');
    }
  };

  const handleEditSaida = async (e) => {
    e.preventDefault();
    const dataToValidate = { ...editSaida, descricao: editSaida.tipo === 'Despesa' ? editSaida.descricao : editSaida.fornecedor || editSaida.funcionario };
    const fields = ['loja_id', 'valor', editSaida.tipo === 'Despesa' ? 'descricao' : editSaida.tipo === 'Fornecedor' ? 'fornecedor' : 'funcionario'];
    if (!validateForm(dataToValidate, fields)) return;
    try {
      await prisma.saidas.update({
        where: { id: editSaida.id },
        data: { ...editSaida, valor: parseFloat(editSaida.valor), data: new Date(editSaida.data) },
      });
      setSaidas(saidas.map(s => s.id === editSaida.id ? editSaida : s));
      setIsModalSaidaOpen(false);
      setEditSaida(null);
      setErrors({});
      showNotification('Saída atualizada com sucesso! ✅');
    } catch (error) {
      showNotification('Erro ao atualizar saída.');
    }
  };

  const openEditSaida = (saida) => {
    setEditSaida(saida);
    setIsModalSaidaOpen(true);
    setErrors({});
  };

  const handleDeleteSaida = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta saída?')) return;
    try {
      await prisma.saidas.delete({ where: { id } });
      setSaidas(saidas.filter(s => s.id !== id));
      showNotification('Saída removida com sucesso! 🗑️');
    } catch (error) {
      showNotification('Erro ao remover saída.');
    }
  };

  // Função para fechar modal
  const closeModal = () => {
    setIsModalEntradaOpen(false);
    setIsModalSaidaOpen(false);
    setEditEntrada(null);
    setEditSaida(null);
    setErrors({});
  };

  // Relatório de Fluxo de Caixa
  const getRelatorio = () => {
    const today = new Date().toISOString().split('T')[0];
    const startOfWeek = new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).toISOString().split('T')[0];
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    const filterByPeriod = (item) => {
      const itemDate = new Date(item.data);
      const now = new Date();
      if (relatorioPeriodo === 'diario') return itemDate.toISOString().split('T')[0] === today;
      if (relatorioPeriodo === 'semanal') return itemDate >= new Date(startOfWeek) && itemDate <= now;
      if (relatorioPeriodo === 'mensal') return itemDate >= new Date(startOfMonth) && itemDate <= now;
      return true;
    };

    const entradasFiltradas = entradas.filter(filterByPeriod);
    const saidasFiltradas = saidas.filter(filterByPeriod);

    const relatorioPorLoja = lojas
      .filter(loja => user.funcao === 'admin' || loja.id === user.loja_id)
      .map(loja => ({
        loja: loja.nome,
        entradas: entradasFiltradas.filter(e => e.loja_id === loja.id).reduce((sum, e) => sum + parseFloat(e.valor), 0),
        saidas: saidasFiltradas.filter(s => s.loja_id === loja.id).reduce((sum, s) => sum + parseFloat(s.valor), 0),
        saldo: entradasFiltradas.filter(e => e.loja_id === loja.id).reduce((sum, e) => sum + parseFloat(e.valor), 0) -
               saidasFiltradas.filter(s => s.loja_id === loja.id).reduce((sum, s) => sum + parseFloat(s.valor), 0),
      }));

    return relatorioPorLoja;
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Carregando...</div>;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F7FAFC] pt-14 sm:pt-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-6 text-center">
            Gestão Financeira
          </h1>

          {notification && (
            <div className="w-full max-w-md mx-auto mb-4 p-4 bg-[#CFE8F9] text-[#2A4E73] rounded-md shadow-md text-center animate-fadeIn">
              {notification}
            </div>
          )}

          <section className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Registro de Entradas (Vendas PDV)
            </h2>
            <form onSubmit={handleAddEntrada} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="loja_id_entrada" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Loja
                </label>
                <select
                  id="loja_id_entrada"
                  value={novaEntrada.loja_id}
                  onChange={(e) => setNovaEntrada({ ...novaEntrada, loja_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                  disabled={user.funcao !== 'admin'}
                >
                  <option value="">Selecione uma loja</option>
                  {lojas.map((loja) => (
                    <option key={loja.id} value={loja.id}>{loja.nome}</option>
                  ))}
                </select>
                {errors.loja_id && <p className="text-[#AD343E] text-sm mt-1">{errors.loja_id}</p>}
              </div>
              <div>
                <label htmlFor="valor_entrada" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  id="valor_entrada"
                  value={novaEntrada.valor}
                  onChange={(e) => setNovaEntrada({ ...novaEntrada, valor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                  step="0.01"
                  min="0"
                />
                {errors.valor && <p className="text-[#AD343E] text-sm mt-1">{errors.valor}</p>}
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-[#2A4E73] rounded-md hover:bg-[#AD343E] disabled:bg-gray-400"
                  disabled={user.funcao !== 'admin'}
                >
                  Adicionar
                </button>
              </div>
            </form>
            <h3 className="text-md font-medium text-[#2A4E73] mt-6 mb-3">Entradas Registradas</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-[#2A4E73]">
                <thead>
                  <tr className="bg-[#2A4E73] text-white">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Loja</th>
                    <th className="px-4 py-3">Valor (R$)</th>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {entradas.map((entrada) => (
                    <tr key={entrada.id} className="border-b border-gray-200 hover:bg-[#CFE8F9]">
                      <td className="px-4 py-3">{entrada.id}</td>
                      <td className="px-4 py-3">{lojas.find(l => l.id === entrada.loja_id)?.nome || 'Desconhecida'}</td>
                      <td className="px-4 py-3">{entrada.valor.toFixed(2)}</td>
                      <td className="px-4 py-3">{entrada.data}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => openEditEntrada(entrada)} className="px-2 py-1 bg-[#2A4E73] text-white rounded hover:bg-[#AD343E] disabled:bg-gray-400" disabled={user.funcao !== 'admin'}>Editar</button>
                        <button onClick={() => handleDeleteEntrada(entrada.id)} className="px-2 py-1 bg-[#AD343E] text-white rounded hover:bg-[#2A4E73] ml-2 disabled:bg-gray-400" disabled={user.funcao !== 'admin'}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Registro de Saídas (Contas a Pagar)
            </h2>
            <form onSubmit={handleAddSaida} className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div>
                <label htmlFor="loja_id_saida" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Loja
                </label>
                <select
                  id="loja_id_saida"
                  value={novaSaida.loja_id}
                  onChange={(e) => setNovaSaida({ ...novaSaida, loja_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                  disabled={user.funcao !== 'admin'}
                >
                  <option value="">Selecione uma loja</option>
                  {lojas.map((loja) => (
                    <option key={loja.id} value={loja.id}>{loja.nome}</option>
                  ))}
                </select>
                {errors.loja_id && <p className="text-[#AD343E] text-sm mt-1">{errors.loja_id}</p>}
              </div>
              <div>
                <label htmlFor="tipo_saida" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Tipo
                </label>
                <select
                  id="tipo_saida"
                  value={novaSaida.tipo}
                  onChange={(e) => setNovaSaida({ ...novaSaida, tipo: e.target.value, descricao: '', fornecedor: '', funcionario: '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                >
                  <option value="Despesa">Despesa</option>
                  <option value="Fornecedor">Fornecedor</option>
                  <option value="Salário">Salário</option>
                </select>
              </div>
              {novaSaida.tipo === 'Despesa' && (
                <div>
                  <label htmlFor="descricao_saida" className="block text-sm font-medium text-[#2A4E73] mb-1">
                    Descrição
                  </label>
                  <input
                    type="text"
                    id="descricao_saida"
                    value={novaSaida.descricao}
                    onChange={(e) => setNovaSaida({ ...novaSaida, descricao: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                    placeholder="Ex.: Aluguel"
                  />
                  {errors.descricao && <p className="text-[#AD343E] text-sm mt-1">{errors.descricao}</p>}
                </div>
              )}
              {novaSaida.tipo === 'Fornecedor' && (
                <div>
                  <label htmlFor="fornecedor_saida" className="block text-sm font-medium text-[#2A4E73] mb-1">
                    Fornecedor
                  </label>
                  <input
                    type="text"
                    id="fornecedor_saida"
                    value={novaSaida.fornecedor}
                    onChange={(e) => setNovaSaida({ ...novaSaida, fornecedor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                    placeholder="Ex.: Fornecedor A"
                  />
                  {errors.fornecedor && <p className="text-[#AD343E] text-sm mt-1">{errors.fornecedor}</p>}
                </div>
              )}
              {novaSaida.tipo === 'Salário' && (
                <div>
                  <label htmlFor="funcionario_saida" className="block text-sm font-medium text-[#2A4E73] mb-1">
                    Funcionário
                  </label>
                  <input
                    type="text"
                    id="funcionario_saida"
                    value={novaSaida.funcionario}
                    onChange={(e) => setNovaSaida({ ...novaSaida, funcionario: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                    placeholder="Ex.: Ana Silva"
                  />
                  {errors.funcionario && <p className="text-[#AD343E] text-sm mt-1">{errors.funcionario}</p>}
                </div>
              )}
              <div>
                <label htmlFor="valor_saida" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  id="valor_saida"
                  value={novaSaida.valor}
                  onChange={(e) => setNovaSaida({ ...novaSaida, valor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                  step="0.01"
                  min="0"
                />
                {errors.valor && <p className="text-[#AD343E] text-sm mt-1">{errors.valor}</p>}
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-[#2A4E73] rounded-md hover:bg-[#AD343E] disabled:bg-gray-400"
                  disabled={user.funcao !== 'admin'}
                >
                  Adicionar
                </button>
              </div>
            </form>
            <h3 className="text-md font-medium text-[#2A4E73] mt-6 mb-3">Saídas Registradas</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-[#2A4E73]">
                <thead>
                  <tr className="bg-[#2A4E73] text-white">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Loja</th>
                    <th className="px-4 py-3">Descrição/Fornecedor/Funcionário</th>
                    <th className="px-4 py-3">Valor (R$)</th>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {saidas.map((saida) => (
                    <tr key={saida.id} className="border-b border-gray-200 hover:bg-[#CFE8F9]">
                      <td className="px-4 py-3">{saida.id}</td>
                      <td className="px-4 py-3">{lojas.find(l => l.id === saida.loja_id)?.nome || 'Desconhecida'}</td>
                      <td className="px-4 py-3">{saida.descricao || saida.fornecedor || saida.funcionario}</td>
                      <td className="px-4 py-3">{saida.valor.toFixed(2)}</td>
                      <td className="px-4 py-3">{saida.data}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => openEditSaida(saida)} className="px-2 py-1 bg-[#2A4E73] text-white rounded hover:bg-[#AD343E] disabled:bg-gray-400" disabled={user.funcao !== 'admin'}>Editar</button>
                        <button onClick={() => handleDeleteSaida(saida.id)} className="px-2 py-1 bg-[#AD343E] text-white rounded hover:bg-[#2A4E73] ml-2 disabled:bg-gray-400" disabled={user.funcao !== 'admin'}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Relatório de Fluxo de Caixa
            </h2>
            <div className="mb-4 flex justify-center">
              <label htmlFor="periodo" className="block text-sm font-medium text-[#2A4E73] mb-1 mr-2">
                Período
              </label>
              <select
                id="periodo"
                value={relatorioPeriodo}
                onChange={(e) => setRelatorioPeriodo(e.target.value)}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
              >
                <option value="diario">Diário</option>
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-[#2A4E73]">
                <thead>
                  <tr className="bg-[#2A4E73] text-white">
                    <th className="px-4 py-3">Loja</th>
                    <th className="px-4 py-3">Entradas (R$)</th>
                    <th className="px-4 py-3">Saídas (R$)</th>
                    <th className="px-4 py-3">Saldo (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {getRelatorio().map((relatorio) => (
                    <tr key={relatorio.loja} className="border-b border-gray-200 hover:bg-[#CFE8F9]">
                      <td className="px-4 py-3">{relatorio.loja}</td>
                      <td className="px-4 py-3">{relatorio.entradas.toFixed(2)}</td>
                      <td className="px-4 py-3">{relatorio.saidas.toFixed(2)}</td>
                      <td className="px-4 py-3">{relatorio.saldo.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {isModalEntradaOpen && editEntrada && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-semibold text-[#2A4E73] mb-4">Editar Entrada</h2>
                <form onSubmit={handleEditEntrada} className="space-y-4">
                  <div>
                    <label htmlFor="edit_loja_id" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Loja
                    </label>
                    <select
                      id="edit_loja_id"
                      value={editEntrada.loja_id}
                      onChange={(e) => setEditEntrada({ ...editEntrada, loja_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                      disabled={user.funcao !== 'admin'}
                    >
                      {lojas.map((loja) => (
                        <option key={loja.id} value={loja.id}>{loja.nome}</option>
                      ))}
                    </select>
                    {errors.loja_id && <p className="text-[#AD343E] text-sm mt-1">{errors.loja_id}</p>}
                  </div>
                  <div>
                    <label htmlFor="edit_valor" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Valor (R$)
                    </label>
                    <input
                      type="number"
                      id="edit_valor"
                      value={editEntrada.valor}
                      onChange={(e) => setEditEntrada({ ...editEntrada, valor: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                      step="0.01"
                      min="0"
                    />
                    {errors.valor && <p className="text-[#AD343E] text-sm mt-1">{errors.valor}</p>}
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 px-4 py-2 text-sm text-white bg-[#2A4E73] rounded-md hover:bg-[#AD343E] disabled:bg-gray-400" disabled={user.funcao !== 'admin'}>Salvar</button>
                    <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 text-sm text-white bg-[#AD343E] rounded-md hover:bg-[#2A4E73]">Cancelar</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {isModalSaidaOpen && editSaida && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-semibold text-[#2A4E73] mb-4">Editar Saída</h2>
                <form onSubmit={handleEditSaida} className="space-y-4">
                  <div>
                    <label htmlFor="edit_loja_id" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Loja
                    </label>
                    <select
                      id="edit_loja_id"
                      value={editSaida.loja_id}
                      onChange={(e) => setEditSaida({ ...editSaida, loja_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                      disabled={user.funcao !== 'admin'}
                    >
                      {lojas.map((loja) => (
                        <option key={loja.id} value={loja.id}>{loja.nome}</option>
                      ))}
                    </select>
                    {errors.loja_id && <p className="text-[#AD343E] text-sm mt-1">{errors.loja_id}</p>}
                  </div>
                  <div>
                    <label htmlFor="edit_tipo" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Tipo
                    </label>
                    <select
                      id="edit_tipo"
                      value={editSaida.tipo}
                      onChange={(e) => setEditSaida({ ...editSaida, tipo: e.target.value, descricao: '', fornecedor: '', funcionario: '' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                    >
                      <option value="Despesa">Despesa</option>
                      <option value="Fornecedor">Fornecedor</option>
                      <option value="Salário">Salário</option>
                    </select>
                  </div>
                  {editSaida.tipo === 'Despesa' && (
                    <div>
                      <label htmlFor="edit_descricao" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Descrição
                      </label>
                      <input
                        type="text"
                        id="edit_descricao"
                        value={editSaida.descricao}
                        onChange={(e) => setEditSaida({ ...editSaida, descricao: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                      />
                      {errors.descricao && <p className="text-[#AD343E] text-sm mt-1">{errors.descricao}</p>}
                    </div>
                  )}
                  {editSaida.tipo === 'Fornecedor' && (
                    <div>
                      <label htmlFor="edit_fornecedor" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Fornecedor
                      </label>
                      <input
                        type="text"
                        id="edit_fornecedor"
                        value={editSaida.fornecedor}
                        onChange={(e) => setEditSaida({ ...editSaida, fornecedor: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                      />
                      {errors.fornecedor && <p className="text-[#AD343E] text-sm mt-1">{errors.fornecedor}</p>}
                    </div>
                  )}
                  {editSaida.tipo === 'Salário' && (
                    <div>
                      <label htmlFor="edit_funcionario" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Funcionário
                      </label>
                      <input
                        type="text"
                        id="edit_funcionario"
                        value={editSaida.funcionario}
                        onChange={(e) => setEditSaida({ ...editSaida, funcionario: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                      />
                      {errors.funcionario && <p className="text-[#AD343E] text-sm mt-1">{errors.funcionario}</p>}
                    </div>
                  )}
                  <div>
                    <label htmlFor="edit_valor" className="block text-sm font-medium text-[#2A4E73] mb-1">
                      Valor (R$)
                    </label>
                    <input
                      type="number"
                      id="edit_valor"
                      value={editSaida.valor}
                      onChange={(e) => setEditSaida({ ...editSaida, valor: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                      step="0.01"
                      min="0"
                    />
                    {errors.valor && <p className="text-[#AD343E] text-sm mt-1">{errors.valor}</p>}
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 px-4 py-2 text-sm text-white bg-[#2A4E73] rounded-md hover:bg-[#AD343E] disabled:bg-gray-400" disabled={user.funcao !== 'admin'}>Salvar</button>
                    <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 text-sm text-white bg-[#AD343E] rounded-md hover:bg-[#2A4E73]">Cancelar</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}