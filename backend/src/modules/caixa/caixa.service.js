import * as model from '../../shared/config/database.js';

export async function listarCaixas() {
  try {
    return await model.getAll('caixa');
  } catch (err) {
    console.log('Error: ', err);
    throw new Error(err.message);
  }
}

export async function getCaixasById(id) {
  try {
    return await model.getById('caixa', id);
  } catch (err) {
    console.log('Error: ', err);
    throw new Error(err.message);
  }
}

export async function createCaixas(data) {
  try {
    return await model.create('caixa', data);
  } catch (err) {
    console.log('Error: ', err);
    throw new Error(err.message);
  }
}

export async function updateCaixas(id, data) {
  try {
    return await model.update('caixa', id, data);
  } catch (err) {
    console.log('Error: ', err);
    throw new Error(err.message);
  }
}

export async function removeCaixas(id) {
  try {
    return await model.remove('caixa', id);
  } catch (err) {
    console.log('Error: ', err);
    throw new Error(err.message);
  }
}

// ---------------------------------------------------------------------------------------

// services/caixa.service.js
import { getAll, getById, create, update } from '../../shared/config/database.js';
import { tabelas } from '../../shared/config/database.js'; // se tiver exportado

// 3. Abrir caixa (não pode haver outro aberto na mesma loja)
export async function abrirCaixa({ loja_id, aberto_por, valor_inicial }) {
  const caixaAberto = await tabelas.caixa.findFirst({
    where: { loja_id, status: 'aberto' },
  });

  if (caixaAberto) {
    throw new Error('Já existe um caixa aberto nesta loja.');
  }

  return await model.create('caixa', {
    loja_id,
    aberto_por,
    valor_inicial,
    status: 'aberto',
  });
}

// 4. Fechar caixa (atualiza valores e status)
export async function fecharCaixa(id, { fechado_por, valor_final }) {
  const caixa = await model.getById('caixa', id);

  if (!caixa) {
    throw new Error('Caixa não encontrado.');
  }

  if (caixa.status === 'fechado') {
    throw new Error('Caixa já está fechado.');
  }

  return await model.update('caixa', id, {
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
