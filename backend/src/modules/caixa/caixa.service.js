import { getAll, getById, create, update, remove } from '../../shared/config/database.js';
import { tabelas } from '../../shared/config/database.js';

export async function getCaixas() {
    return await getAll('caixa');
}

export async function getCaixasById(id) {
    return await getById('caixa', id);
}

export async function createCaixas(data) {
    return await create('caixa', data);
}

export async function updateCaixas(id, data) {
    return await update('caixa', id, data);
}

export async function removeCaixas(id) {
    return await remove('caixa', id);
}

/*
    // services/caixa.service.js
import { getAll, getById, create, update } from '../../shared/config/database.js';
import { tabelas } from '../../shared/config/database.js'; // se tiver exportado

// 1. Listar todos os caixas com detalhes da loja e usuários
export async function listarCaixas() {
  return await tabelas.caixa.findMany({
    include: {
      loja: true,
      abertoPor: true,
      fechadoPor: true,
    },
  });
}

// 2. Buscar caixa específico (com detalhes)
export async function buscarCaixaPorId(id) {
  return await tabelas.caixa.findUnique({
    where: { id: Number(id) },
    include: {
      loja: true,
      abertoPor: true,
      fechadoPor: true,
    },
  });
}

// 3. Abrir caixa (não pode haver outro aberto na mesma loja)
export async function abrirCaixa({ loja_id, aberto_por, valor_inicial }) {
  const caixaAberto = await tabelas.caixa.findFirst({
    where: { loja_id, status: 'aberto' },
  });

  if (caixaAberto) {
    throw new Error('Já existe um caixa aberto nesta loja.');
  }

  return await create('caixa', {
    loja_id,
    aberto_por,
    valor_inicial,
    status: 'aberto',
  });
}

// 4. Fechar caixa (atualiza valores e status)
export async function fecharCaixa(id, { fechado_por, valor_final }) {
  const caixa = await getById('caixa', id);

  if (!caixa) {
    throw new Error('Caixa não encontrado.');
  }
  if (caixa.status === 'fechado') {
    throw new Error('Caixa já está fechado.');
  }

  return await update('caixa', id, {
    fechado_por,
    fechado_em: new Date(),
    valor_final,
    status: 'fechado',
  });
}

// 5. Listar caixas de uma loja
export async function listarCaixasPorLoja(lojaId) {
  return await tabelas.caixa.findMany({
    where: { loja_id: Number(lojaId) },
    include: {
      abertoPor: true,
      fechadoPor: true,
    },
  });
}

*/