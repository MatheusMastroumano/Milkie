/*
    as rotas de cada módulo são importadas aqui primeiro para depois serem importadas no app.js.

    Isso deixa os imports do app.js mais limpos

    no app.js, ao invés de:
        "import caixaRoutes from './modules/caixa/caixa.routes.js'" <-- um desse pra cada rota
    fica:
        "import { caixaRoutes, <outras rotas>, ... } from '/modules" <-- tudo num import só

    meio over-engeneered? talvez, mas muito foda
*/

export { default as funcionariosRoutes } from './funcionarios';