import { getAll, getById, create, update, remove } from '../../shared/config/database.js';
import { tabelas } from '../../shared/config/database.js';

export async function listarCaixas() {
    return await tabelas.caixa.findMany({
        include: {
            loja: true,
            abertoPor: true,
            fechadoPor: true,
        }
    });
}

export async function getCaixaById(id) {
    return await getById('caixa', id);
}

export async function createCaixa(data) {
    return await create('caixa', data);
}

export async function updateCaixa(id, data) {
    return await update('caixa', id, data);
}

export async function removeCaixa(id) {
    return await remove('caixa', id);
}
