import { z } from 'zod'
import * as utils from '../../shared/utils/verify.js';

const Despesas = z.object({
    loja_id: z.number().int().positive(),
    descricao: z.string().min(1, 'Descrição é obrigatória'),
    valor: z.coerce.number().positive('Valor deve ser positivo'),
    data: z.coerce.date(),
    categoria: z.string().min(1, 'Categoria é obrigatória'),
    status: z.enum(['pendente', 'pago']).default('pendente').optional(),
    criado_em: utils.criadoEm.optional(),
});

export default Despesas;

