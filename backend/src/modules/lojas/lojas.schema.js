import { z } from 'zod';
import { id, nome, criadoEm } from '../../shared/config/verify.js';

export const LojaSchema = z.object({
    id: id,
    nome: nome,
    tipo: TipoLojaEnum.default('filial'),
    endereco: z.string().optional(),
    ativo: z.boolean().default(true),
    criado_em: criadoEm,
});

const TipoLojaEnum = z.enum(['matriz', 'filial']);
