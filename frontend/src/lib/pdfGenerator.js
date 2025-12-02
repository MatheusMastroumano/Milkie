import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

// Função auxiliar para formatar valores monetários
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Função auxiliar para formatar datas
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Função para gerar PDF de Despesas
export const gerarPDFDespesas = (despesas, filtroData = {}) => {
  const doc = new jsPDF();
  
  // Cabeçalho
  doc.setFontSize(18);
  doc.setTextColor(42, 78, 115); // #2A4E73
  doc.text('Relatório de Despesas', 14, 20);
  
  // Período
  if (filtroData.inicio || filtroData.fim) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const periodo = `Período: ${filtroData.inicio ? formatDate(filtroData.inicio) : 'Início'} até ${filtroData.fim ? formatDate(filtroData.fim) : 'Fim'}`;
    doc.text(periodo, 14, 28);
  }
  
  // Data de geração
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 34);
  
  // Filtrar despesas se houver filtro de data
  let despesasFiltradas = despesas;
  if (filtroData.inicio || filtroData.fim) {
    despesasFiltradas = despesas.filter(d => {
      const dataDespesa = new Date(d.data);
      if (filtroData.inicio && dataDespesa < new Date(filtroData.inicio)) return false;
      if (filtroData.fim && dataDespesa > new Date(filtroData.fim)) return false;
      return true;
    });
  }
  
  // Preparar dados da tabela
  const tableData = despesasFiltradas.map(d => [
    d.descricao || '-',
    d.categoria || '-',
    formatDate(d.data),
    formatCurrency(Math.abs(d.valor || 0)),
    d.status || 'Pendente'
  ]);
  
  // Adicionar tabela
  autoTable(doc, {
    startY: 40,
    head: [['Descrição', 'Categoria', 'Data', 'Valor', 'Status']],
    body: tableData,
    theme: 'striped',
    headStyles: { 
      fillColor: [42, 78, 115], 
      textColor: [255, 255, 255],
      halign: 'center'
    },
    styles: { 
      fontSize: 9,
      cellPadding: 3
    },
    columnStyles: {
      3: { halign: 'right', cellWidth: 'auto' },
      4: { halign: 'center' }
    }
  });
  
  // Totais
  const totalDespesas = despesasFiltradas.reduce((sum, d) => sum + Math.abs(d.valor || 0), 0);
  const totalPendentes = despesasFiltradas.filter(d => d.status === 'Pendente').reduce((sum, d) => sum + Math.abs(d.valor || 0), 0);
  const totalPagos = despesasFiltradas.filter(d => d.status === 'Pago').reduce((sum, d) => sum + Math.abs(d.valor || 0), 0);
  
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total de Despesas: ${formatCurrency(totalDespesas)}`, 14, finalY);
  doc.text(`Total Pendente: ${formatCurrency(totalPendentes)}`, 14, finalY + 7);
  doc.text(`Total Pago: ${formatCurrency(totalPagos)}`, 14, finalY + 14);
  
  // Salvar PDF
  doc.save(`relatorio-despesas-${new Date().toISOString().split('T')[0]}.pdf`);
};

// Função para gerar PDF de Fornecedores
export const gerarPDFFornecedores = (pagamentosFornecedores, filtroData = {}) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.setTextColor(42, 78, 115);
  doc.text('Relatório de Pagamentos - Fornecedores', 14, 20);
  
  if (filtroData.inicio || filtroData.fim) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const periodo = `Período: ${filtroData.inicio ? formatDate(filtroData.inicio) : 'Início'} até ${filtroData.fim ? formatDate(filtroData.fim) : 'Fim'}`;
    doc.text(periodo, 14, 28);
  }
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 34);
  
  let pagamentosFiltrados = pagamentosFornecedores;
  if (filtroData.inicio || filtroData.fim) {
    pagamentosFiltrados = pagamentosFornecedores.filter(p => {
      const dataVencimento = new Date(p.vencimento);
      if (filtroData.inicio && dataVencimento < new Date(filtroData.inicio)) return false;
      if (filtroData.fim && dataVencimento > new Date(filtroData.fim)) return false;
      return true;
    });
  }
  
  const tableData = pagamentosFiltrados.map(p => [
    p.fornecedor_nome || '-',
    formatDate(p.vencimento),
    formatCurrency(p.valor || 0),
    p.status || 'Pendente'
  ]);
  
  autoTable(doc, {
    startY: 40,
    head: [['Fornecedor', 'Vencimento', 'Valor', 'Status']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [42, 78, 115], textColor: [255, 255, 255] },
    styles: { fontSize: 9 },
    columnStyles: {
      2: { halign: 'right', cellWidth: 'auto' },
      3: { halign: 'center' }
    },
    styles: { 
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: { 
      fillColor: [42, 78, 115], 
      textColor: [255, 255, 255],
      halign: 'center'
    }
  });
  
  const totalFornecedores = pagamentosFiltrados.reduce((sum, p) => sum + (p.valor || 0), 0);
  const totalPendentes = pagamentosFiltrados.filter(p => p.status === 'Pendente').reduce((sum, p) => sum + (p.valor || 0), 0);
  const totalPagos = pagamentosFiltrados.filter(p => p.status === 'Pago').reduce((sum, p) => sum + (p.valor || 0), 0);
  
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total: ${formatCurrency(totalFornecedores)}`, 14, finalY);
  doc.text(`Total Pendente: ${formatCurrency(totalPendentes)}`, 14, finalY + 7);
  doc.text(`Total Pago: ${formatCurrency(totalPagos)}`, 14, finalY + 14);
  
  doc.save(`relatorio-fornecedores-${new Date().toISOString().split('T')[0]}.pdf`);
};

// Função para gerar PDF de Folha de Pagamento
export const gerarPDFFolha = (pagamentosFuncionarios, filtroData = {}) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.setTextColor(42, 78, 115);
  doc.text('Relatório de Folha de Pagamento', 14, 20);
  
  if (filtroData.inicio || filtroData.fim) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const periodo = `Período: ${filtroData.inicio ? formatDate(filtroData.inicio) : 'Início'} até ${filtroData.fim ? formatDate(filtroData.fim) : 'Fim'}`;
    doc.text(periodo, 14, 28);
  }
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 34);
  
  const tableData = pagamentosFuncionarios.map(p => [
    p.funcionario_nome || '-',
    p.funcionario_cargo || '-',
    formatCurrency(p.salario || 0),
    formatCurrency(p.comissao || 0),
    formatCurrency((p.salario || 0) + (p.comissao || 0)),
    p.status || 'Pendente'
  ]);
  
  autoTable(doc, {
    startY: 40,
    head: [['Funcionário', 'Cargo', 'Salário', 'Comissão', 'Total', 'Status']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [42, 78, 115], textColor: [255, 255, 255] },
    styles: { fontSize: 9 },
    columnStyles: {
      2: { halign: 'right', cellWidth: 'auto' },
      3: { halign: 'right', cellWidth: 'auto' },
      4: { halign: 'right', cellWidth: 'auto' },
      5: { halign: 'center' }
    },
    styles: { 
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: { 
      fillColor: [42, 78, 115], 
      textColor: [255, 255, 255],
      halign: 'center'
    }
  });
  
  const totalFolha = pagamentosFuncionarios.reduce((sum, p) => sum + (p.salario || 0) + (p.comissao || 0), 0);
  const totalPendentes = pagamentosFuncionarios.filter(p => p.status === 'Pendente').reduce((sum, p) => sum + (p.salario || 0) + (p.comissao || 0), 0);
  const totalPagos = pagamentosFuncionarios.filter(p => p.status === 'Pago').reduce((sum, p) => sum + (p.salario || 0) + (p.comissao || 0), 0);
  
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total da Folha: ${formatCurrency(totalFolha)}`, 14, finalY);
  doc.text(`Total Pendente: ${formatCurrency(totalPendentes)}`, 14, finalY + 7);
  doc.text(`Total Pago: ${formatCurrency(totalPagos)}`, 14, finalY + 14);
  
  doc.save(`relatorio-folha-${new Date().toISOString().split('T')[0]}.pdf`);
};

// Função para gerar PDF de Fluxo de Caixa
export const gerarPDFFluxoCaixa = (despesas, pagamentosFornecedores, pagamentosFuncionarios, filtroData = {}, vendas = [], caixas = [], vendaPagamentos = []) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.setTextColor(42, 78, 115);
  doc.text('Relatório de Fluxo de Caixa', 14, 20);
  
  if (filtroData.inicio || filtroData.fim) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const periodo = `Período: ${filtroData.inicio ? formatDate(filtroData.inicio) : 'Início'} até ${filtroData.fim ? formatDate(filtroData.fim) : 'Fim'}`;
    doc.text(periodo, 14, 28);
  }
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 34);
  
  let yPos = 45;
  
  // Filtrar vendas e caixas por período
  let vendasFiltradas = vendas || [];
  let caixasFiltrados = caixas || [];
  
  if (filtroData.inicio || filtroData.fim) {
    vendasFiltradas = vendas.filter(v => {
      const dataVenda = new Date(v.data);
      if (filtroData.inicio && dataVenda < new Date(filtroData.inicio)) return false;
      if (filtroData.fim && dataVenda > new Date(filtroData.fim)) return false;
      return true;
    });
    
    caixasFiltrados = caixas.filter(c => {
      const dataAbertura = new Date(c.aberto_em);
      if (filtroData.inicio && dataAbertura < new Date(filtroData.inicio)) return false;
      if (filtroData.fim && dataAbertura > new Date(filtroData.fim)) return false;
      return true;
    });
  }
  
  // Calcular totais de ENTRADAS (Vendas)
  const totalVendas = vendasFiltradas.reduce((sum, v) => sum + parseFloat(v.valor_total || 0), 0);
  
  // Calcular dinheiro recebido (vendas pagas em dinheiro)
  const pagamentosDinheiro = (vendaPagamentos || []).filter(p => {
    const venda = vendasFiltradas.find(v => v.id === p.venda_id);
    return venda && p.metodo === 'dinheiro';
  });
  const totalDinheiroRecebido = pagamentosDinheiro.reduce((sum, p) => sum + parseFloat(p.valor || 0), 0);
  
  // Calcular outros métodos de pagamento
  const pagamentosCartao = (vendaPagamentos || []).filter(p => {
    const venda = vendasFiltradas.find(v => v.id === p.venda_id);
    return venda && (p.metodo === 'cartaocredito' || p.metodo === 'cartaodebito');
  });
  const totalCartao = pagamentosCartao.reduce((sum, p) => sum + parseFloat(p.valor || 0), 0);
  
  const pagamentosPix = (vendaPagamentos || []).filter(p => {
    const venda = vendasFiltradas.find(v => v.id === p.venda_id);
    return venda && p.metodo === 'pix';
  });
  const totalPix = pagamentosPix.reduce((sum, p) => sum + parseFloat(p.valor || 0), 0);
  
  // Calcular totais de caixa
  const totalValorInicial = caixasFiltrados.reduce((sum, c) => sum + parseFloat(c.valor_inicial || 0), 0);
  const totalValorFinal = caixasFiltrados.filter(c => c.valor_final).reduce((sum, c) => sum + parseFloat(c.valor_final || 0), 0);
  const totalCaixa = totalValorFinal - totalValorInicial;
  
  // Seção ENTRADAS
  doc.setFontSize(14);
  doc.setTextColor(42, 78, 115);
  doc.text('ENTRADAS', 14, yPos);
  yPos += 8;
  
  const entradasData = [
    ['Total de Vendas', formatCurrency(totalVendas)],
    ['Dinheiro Recebido', formatCurrency(totalDinheiroRecebido)],
    ['Cartão (Crédito/Débito)', formatCurrency(totalCartao)],
    ['PIX', formatCurrency(totalPix)],
    ['Movimentação de Caixa', formatCurrency(totalCaixa)],
    ['TOTAL DE ENTRADAS', formatCurrency(totalVendas + totalCaixa)]
  ];
  
  autoTable(doc, {
    startY: yPos,
    head: [['Categoria', 'Valor']],
    body: entradasData,
    theme: 'striped',
    headStyles: { fillColor: [42, 78, 115], textColor: [255, 255, 255], halign: 'center' },
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      1: { halign: 'right', fontStyle: 'bold', cellWidth: 'auto' }
    }
  });
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // Seção SAÍDAS
  doc.setFontSize(14);
  doc.setTextColor(42, 78, 115);
  doc.text('SAÍDAS', 14, yPos);
  yPos += 8;
  
  // Calcular totais de saídas
  const totalDespesas = despesas.reduce((sum, d) => {
    const dataDespesa = new Date(d.data);
    if (filtroData.inicio && dataDespesa < new Date(filtroData.inicio)) return sum;
    if (filtroData.fim && dataDespesa > new Date(filtroData.fim)) return sum;
    return sum + Math.abs(d.valor || 0);
  }, 0);
  
  const totalFornecedores = pagamentosFornecedores.reduce((sum, p) => {
    const dataVencimento = new Date(p.vencimento);
    if (filtroData.inicio && dataVencimento < new Date(filtroData.inicio)) return sum;
    if (filtroData.fim && dataVencimento > new Date(filtroData.fim)) return sum;
    return sum + (p.valor || 0);
  }, 0);
  
  const totalFolha = pagamentosFuncionarios.reduce((sum, p) => {
    const dataCriacao = new Date(p.criado_em || new Date());
    if (filtroData.inicio && dataCriacao < new Date(filtroData.inicio)) return sum;
    if (filtroData.fim && dataCriacao > new Date(filtroData.fim)) return sum;
    return sum + (p.salario || 0) + (p.comissao || 0);
  }, 0);
  
  const totalSaidas = totalDespesas + totalFornecedores + totalFolha;
  
  const saidasData = [
    ['Despesas', formatCurrency(totalDespesas)],
    ['Pagamentos Fornecedores', formatCurrency(totalFornecedores)],
    ['Folha de Pagamento', formatCurrency(totalFolha)],
    ['TOTAL DE SAÍDAS', formatCurrency(totalSaidas)]
  ];
  
  autoTable(doc, {
    startY: yPos,
    head: [['Categoria', 'Valor']],
    body: saidasData,
    theme: 'striped',
    headStyles: { fillColor: [42, 78, 115], textColor: [255, 255, 255], halign: 'center' },
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      1: { halign: 'right', fontStyle: 'bold', cellWidth: 'auto' }
    }
  });
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // Resumo Final
  const saldo = (totalVendas + totalCaixa) - totalSaidas;
  
  doc.setFontSize(14);
  doc.setTextColor(42, 78, 115);
  doc.text('RESUMO FINAL', 14, yPos);
  yPos += 8;
  
  const resumoFinalData = [
    ['Total de Entradas', formatCurrency(totalVendas + totalCaixa)],
    ['Total de Saídas', formatCurrency(totalSaidas)],
    ['SALDO FINAL', formatCurrency(saldo)]
  ];
  
  autoTable(doc, {
    startY: yPos,
    head: [['Item', 'Valor']],
    body: resumoFinalData,
    theme: 'grid',
    headStyles: { fillColor: [42, 78, 115], textColor: [255, 255, 255], halign: 'center' },
    styles: { fontSize: 11, cellPadding: 4, fontStyle: 'bold' },
    columnStyles: {
      1: { halign: 'right', cellWidth: 'auto' }
    }
  });
  
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  if (saldo >= 0) {
    doc.setTextColor(0, 128, 0); // Verde para saldo positivo
  } else {
    doc.setTextColor(173, 52, 62); // Vermelho para saldo negativo
  }
  doc.setFont(undefined, 'bold');
  doc.text(`Saldo Final: ${formatCurrency(saldo)}`, 14, finalY);
  
  doc.save(`relatorio-fluxo-caixa-${new Date().toISOString().split('T')[0]}.pdf`);
};

// Função para gerar PDF Personalizado (todos os dados)
export const gerarPDFPersonalizado = (despesas, pagamentosFornecedores, pagamentosFuncionarios, filtroData = {}) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.setTextColor(42, 78, 115);
  doc.text('Relatório Financeiro Completo', 14, 20);
  
  if (filtroData.inicio || filtroData.fim) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const periodo = `Período: ${filtroData.inicio ? formatDate(filtroData.inicio) : 'Início'} até ${filtroData.fim ? formatDate(filtroData.fim) : 'Fim'}`;
    doc.text(periodo, 14, 28);
  }
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 34);
  
  let yPos = 45;
  
  // Seção Despesas
  if (despesas.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(42, 78, 115);
    doc.text('Despesas', 14, yPos);
    yPos += 8;
    
    const despesasData = despesas.map(d => [
      d.descricao || '-',
      d.categoria || '-',
      formatDate(d.data),
      formatCurrency(Math.abs(d.valor || 0)),
      d.status || 'Pendente'
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Descrição', 'Categoria', 'Data', 'Valor', 'Status']],
      body: despesasData,
      theme: 'striped',
      headStyles: { fillColor: [42, 78, 115], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
    columnStyles: {
      3: { halign: 'right', cellWidth: 'auto' },
      4: { halign: 'center' }
    },
    styles: { 
      fontSize: 8,
      cellPadding: 3
    },
    headStyles: { 
      fillColor: [42, 78, 115], 
      textColor: [255, 255, 255],
      halign: 'center'
    }
    });
    
    yPos = doc.lastAutoTable.finalY + 15;
  }
  
  // Seção Fornecedores
  if (pagamentosFornecedores.length > 0) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(42, 78, 115);
    doc.text('Pagamentos - Fornecedores', 14, yPos);
    yPos += 8;
    
    const fornecedoresData = pagamentosFornecedores.map(p => [
      p.fornecedor_nome || '-',
      formatDate(p.vencimento),
      formatCurrency(p.valor || 0),
      p.status || 'Pendente'
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Fornecedor', 'Vencimento', 'Valor', 'Status']],
      body: fornecedoresData,
      theme: 'striped',
      headStyles: { fillColor: [42, 78, 115], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
    columnStyles: {
      2: { halign: 'right', cellWidth: 'auto' },
      3: { halign: 'center' }
    },
    styles: { 
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: { 
      fillColor: [42, 78, 115], 
      textColor: [255, 255, 255],
      halign: 'center'
    }
    });
    
    yPos = doc.lastAutoTable.finalY + 15;
  }
  
  // Seção Folha
  if (pagamentosFuncionarios.length > 0) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(42, 78, 115);
    doc.text('Folha de Pagamento', 14, yPos);
    yPos += 8;
    
    const folhaData = pagamentosFuncionarios.map(p => [
      p.funcionario_nome || '-',
      p.funcionario_cargo || '-',
      formatCurrency(p.salario || 0),
      formatCurrency(p.comissao || 0),
      formatCurrency((p.salario || 0) + (p.comissao || 0)),
      p.status || 'Pendente'
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Funcionário', 'Cargo', 'Salário', 'Comissão', 'Total', 'Status']],
      body: folhaData,
      theme: 'striped',
      headStyles: { fillColor: [42, 78, 115], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
      columnStyles: {
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'center' }
      }
    });
    
    yPos = doc.lastAutoTable.finalY + 15;
  }
  
  // Resumo Final
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(14);
  doc.setTextColor(42, 78, 115);
  doc.text('Resumo Financeiro', 14, yPos);
  yPos += 8;
  
  const totalDespesas = despesas.reduce((sum, d) => sum + Math.abs(d.valor || 0), 0);
  const totalFornecedores = pagamentosFornecedores.reduce((sum, p) => sum + (p.valor || 0), 0);
  const totalFolha = pagamentosFuncionarios.reduce((sum, p) => sum + (p.salario || 0) + (p.comissao || 0), 0);
  const totalGeral = totalDespesas + totalFornecedores + totalFolha;
  
  const resumoData = [
    ['Total Despesas', formatCurrency(totalDespesas)],
    ['Total Fornecedores', formatCurrency(totalFornecedores)],
    ['Total Folha de Pagamento', formatCurrency(totalFolha)],
    ['TOTAL GERAL', formatCurrency(totalGeral)]
  ];
  
  autoTable(doc, {
    startY: yPos,
    head: [['Categoria', 'Valor']],
    body: resumoData,
    theme: 'striped',
    headStyles: { fillColor: [42, 78, 115], textColor: [255, 255, 255] },
    styles: { fontSize: 10 },
    columnStyles: {
      1: { halign: 'right', fontStyle: 'bold', cellWidth: 'auto' }
    },
    styles: { 
      fontSize: 10,
      cellPadding: 3
    },
    headStyles: { 
      fillColor: [42, 78, 115], 
      textColor: [255, 255, 255],
      halign: 'center'
    }
  });
  
  doc.save(`relatorio-financeiro-completo-${new Date().toISOString().split('T')[0]}.pdf`);
};

