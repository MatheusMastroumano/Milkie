import prisma from '../../shared/config/database.js';

/* ----------------------------- FUNÇÕES BÁSICAS ---------------------------- */
export async function getCaixas() {
  try {
    return await prisma.caixa.findMany();
  } catch (err) {
    console.log('Error: ', err);
    throw new Error(err.message);
  }
}

export async function getCaixasById(id) {
  try {
    return await prisma.caixa.findUnique({
      where: { id: id },
    });
  } catch (err) {
    console.log('Error: ', err);
    throw new Error(err.message);
  }
}

export async function createCaixas(data) {
  try {
    return await prisma.caixa.create({
      data: data
    });
  } catch (err) {
    console.log('Error: ', err);
    throw new Error(err.message);
  }
}

export async function updateCaixas(id, data) {
  try {
    return await prisma.caixa.update({
      where: { id: id },
      data: data,
    });
  } catch (err) {
    console.log('Error: ', err);
    throw new Error(err.message);
  }
}

export async function removeCaixas(id) {
  try {
    return await prisma.caixa.delete({
      where: { id: id },
    });
  } catch (err) {
    console.log('Error: ', err);
    throw new Error(err.message);
  }
}

/* -------------------------- ABERTURA E FECHAMENTO ------------------------- */

// 3. Abrir caixa (não pode haver outro aberto na mesma loja)
export async function abrirCaixa({ loja_id, aberto_por, valor_inicial }) {
  const caixaAberto = await prisma.caixa.findMany({
    where: { loja_id, status: 'aberto' },
  });

  if (caixaAberto.length > 0) {
    throw new Error('Já existe um caixa aberto nesta loja.');
  }

  return await prisma.caixa.create({
    data: {
      loja_id,
      aberto_por,
      valor_inicial,
      status: 'aberto',
    },
  });
}

// 4. Fechar caixa (atualiza valores e status)
export async function fecharCaixa(id, fechado_por, valor_final) {
  const caixa = await prisma.caixa.findUnique({
    where: { id: id },
  });

  if (!caixa) {
    throw new Error('Caixa não encontrado.');
  }

  if (caixa.status === 'fechado') {
    throw new Error('Caixa já está fechado.');
  }

  return await prisma.caixa.update({
    where: { id: id },
    data: {
      fechado_por,
      fechado_em: new Date(),
      valor_final,
      status: 'fechado',
    },
  });
}



// // 5. Listar caixas de uma loja
// export async function listarCaixasPorLoja(lojaId) {
//   return await tabelas.caixa.findMany({
//     where: { loja_id: Number(lojaId) },
//     include: {
//       abertoPor: true,
//       fechadoPor: true,
//     },
//   });
// }
