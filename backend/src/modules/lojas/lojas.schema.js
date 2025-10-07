import { z } from 'zod';
import * as utils from '../../shared/utils/verify.js';

const TipoLojaEnum = z.enum(['matriz', 'filial']);

const LojasSchema = z.object({
    id: utils.id,
    nome: utils.nome,
    tipo: TipoLojaEnum.default('filial'),
    CEP: z.string() // aceita CEP com ou sem hífen:
        .regex(/^\d{5}-?\d{3}$/, "CEP inválido. Use o formato 00000-000 ou 00000000."),
    numero: z.string().min(1, "Número do endereço é obrigatório"),
    complemento: z.string(),
    ativo: z.boolean().default(true),
    criado_em: utils.criadoEm,
});

export default LojasSchema;