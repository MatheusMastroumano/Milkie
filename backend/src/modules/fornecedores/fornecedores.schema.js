import { z } from 'zod'
import * as utils from '../../shared/utils/verify.js';

const Fornecedores = z.object({
    id: utils.id,
    nome: utils.nome,
    cnpj_cpf: z.string(),
    
    // campos de endereço vindos do cep-promise
    cepUsuario: z.string(),
    numero: z.string().min(1, "Número do endereço é obrigatório"),
    complemento: z.string().optional(),

    // esses virão preenchidos automaticamente pelo cep-promise
    cep: z.string().optional(),
    estado: z.string().optional(),
    cidade: z.string().optional(),
    bairro: z.string().optional(),
    rua: z.string().optional(),

    ativo: z.boolean().default(true),
    criado_em: utils.criadoEm,
});

export default Fornecedores;