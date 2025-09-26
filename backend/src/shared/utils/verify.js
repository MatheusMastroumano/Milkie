/*
    esse arquivo serve pra modularizar o zod,
    evitando ter que escrever a mesma coisa
    repetidamente. Se eu quiser fazer alguma
    alteração geral depois, tabém fica mais fácil
*/

import { z } from 'zod';

export const id = z.number().int().positive();
export const nome = z.string().min(3, 'nome é obrigatório').max(50, 'número máximo de caracteres atingido');
export const criadoEm = z.coerce.date().default(() => new Date());
export const string = z.string();
