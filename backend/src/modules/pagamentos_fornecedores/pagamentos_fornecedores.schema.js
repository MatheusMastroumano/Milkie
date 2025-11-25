import { z } from 'zod'
import * as utils from '../../shared/utils/verify.js';

const PagamentosFornecedores = z.object({
    fornecedor_id: z.number().int().positive(),
    loja_id: z.number().int().positive(),
    valor: z.number().positive('Valor deve ser positivo'),
    vencimento: z.coerce.date(),
    data_pagamento: z.coerce.date().optional().nullable(),
    status: z.enum(['pendente', 'pago']).default('pendente'),
    criado_em: utils.criadoEm,
});

export default PagamentosFornecedores;

