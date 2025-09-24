import { z } from 'zod';

export const id = z.number().int().positive();
export const nome = z.string().min(1, 'nome é obrigatório');
export const criadoEm = z.date().default(() => new Date());