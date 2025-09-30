// pra eu lembrar como se faz isso: 

import { prisma } from "../src/shared/config/database.js";



console.log(await prisma.caixa.findMany());
// retorno esperado sem nenhum insert: "[]"

/* ----------------------------------- xx ----------------------------------- */
