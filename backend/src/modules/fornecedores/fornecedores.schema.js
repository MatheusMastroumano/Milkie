import { z } from 'zod'
import * as utils from '../../shared/utils/verify.js';

const Fornecedores = z.object({
    nome: utils.nome,
    cnpj_cpf: z.string(),

    ativo: z.boolean().default(true),
    criado_em: utils.criadoEm,
});

export default Fornecedores;