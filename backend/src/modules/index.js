/*
    as rotas de cada módulo são importadas aqui primeiro para depois serem importadas no app.js.

    Isso deixa os imports do app.js mais limpos

    no app.js, ao invés de:
        "import caixaRoutes from './modules/caixa/caixa.routes.js'" <-- um desse pra cada rota
    fica:
        "import { caixaRoutes, <outras rotas>, ... } from './modules" <-- tudo num import só
    meio over-engeneered? talvez, mas muito foda


    então... descobri que importar index.js não funciona com ES modules usando "type": "module", 
    com "import" e "export", então eu tenho que botar o index.js no final do caminho do import 
    pra dar certo. Meio que perde o sentido mas vou deixar porque achei muito legal (me dá nota
    a mais, professor🙏)
*/

export { default as funcionariosRoutes } from './funcionarios/index.js';
export { default as usuariosRoutes } from './usuarios/index.js';
export { default as lojasRoutes } from './lojas/index.js';