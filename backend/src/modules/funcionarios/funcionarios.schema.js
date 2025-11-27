import { z } from 'zod';
import * as utils from '../../shared/utils/verify.js';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

import pkg from '@prisma/client';
const { Decimal } = pkg;

const FuncionariosSchema = z.object({
    loja_id: utils.id,
    nome: utils.nome,
    cpf: z.string().refine((val) => {
        // Remove caracteres não numéricos
        const cpfLimpo = val.replace(/\D/g, '');
        // Valida se tem 11 dígitos e se é um CPF válido
        return cpfLimpo.length === 11 && cpfValidator.isValid(cpfLimpo);
    }, {
        message: 'CPF inválido. Deve conter 11 dígitos numéricos e ser um CPF válido.',
    }),
    email: z.string().email(),
    telefone: z.string(),
    idade: z.number().int().positive().min(18, 'a idade mínima é de 18 anos').max(70, 'a idade máxima é de 70 anos'),
    cargo: utils.string,
    salario: z.union([z.string(), z.number()]).transform((val) => new Decimal(val)),
    imagem: z.string().optional().nullable(),
    ativo: z.boolean().default(true),
    criado_em: utils.criadoEm,
});

export default FuncionariosSchema;