import { z } from 'zod';
import * as utils from '../../shared/utils/verify.js';

import pkg from '@prisma/client';
const { Decimal } = pkg;

// Função para processar data corretamente, evitando problema de timezone
// Quando recebemos "YYYY-MM-DD", criamos como meia-noite no timezone local
// Isso garante que a data escolhida pelo usuário seja mantida quando salva no MySQL
const processDate = (val) => {
    if (!val) return null;
    if (val instanceof Date) {
        // Se já for uma Date, garantir que seja tratada corretamente
        return val;
    }
    if (typeof val === 'string') {
        // Se for uma string no formato YYYY-MM-DD, criar data como meia-noite no timezone local
        // Isso evita que seja interpretada como UTC e depois convertida, causando diferença de um dia
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
            const [year, month, day] = val.split('-').map(Number);
            // Criar data no timezone local (meia-noite local)
            // MySQL DATETIME não tem timezone, então salva exatamente como está
            return new Date(year, month - 1, day, 0, 0, 0, 0);
        }
        // Caso contrário, deixar o Zod processar normalmente
        return new Date(val);
    }
    return new Date(val);
};

const EstoqueSchema = z.object({
    produto_id: utils.id,
    loja_id: utils.id,
    preco: z.union([z.string(), z.number()]).transform((val) => new Decimal(val)),
    quantidade: z.number().int().positive(),
    valido_de: utils.criadoEm,
    valido_ate: z.union([z.string(), z.date(), z.null()])
        .optional()
        .nullable()
        .transform((val) => {
            if (val === null || val === undefined || val === '') return null;
            return processDate(val);
        }),
});

export default EstoqueSchema;