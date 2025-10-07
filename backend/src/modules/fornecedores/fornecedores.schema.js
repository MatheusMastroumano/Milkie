import { z } from 'zod'
import * as utils from '../../shared/utils/verify.js';

const Fornecedores = z.object({
    id: utils.id,
    nome: utils.nome,
    cnpj_cpf: z.string(),
    produtos_fornecidos: z.string(),

    ativo: z.boolean().default(true),
    criado_em: utils.criadoEm,
});

export default Fornecedores;