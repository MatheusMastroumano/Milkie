import { z } from 'zod'
import * as utils from '../../shared/utils/verify.js';

const PagamentosFuncionarios = z.object({
    funcionario_id: z.number().int().positive(),
    loja_id: z.number().int().positive(),
    salario: z.number().positive('Salário deve ser positivo'),
    comissao: z.number().nonnegative('Comissão não pode ser negativa').default(0),
    data_pagamento: z.coerce.date().optional().nullable(),
    status: z.enum(['pendente', 'pago']).default('pendente'),
    criado_em: utils.criadoEm,
});

export default PagamentosFuncionarios;

