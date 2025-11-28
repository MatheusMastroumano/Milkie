# TUDO A REVISAR
# TEM MUITA COISA AQUI PRA ARRUMAR NA MÃO
# REMOVER ESSES COMENTÁRIOS NA VERSÃO FINAL
# LEMBRAR DE COLOCAR MAPA DA ESTRUTURA COMPLETA DO BACK E FRONT

# Documentação Completa - Sistema Milkiê

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Requisitos Funcionais](#requisitos-funcionais)
3. [Requisitos Não Funcionais](#requisitos-não-funcionais)
4. [Rotas da API](#rotas-da-api)
5. [Casos de Uso](#casos-de-uso)

---

## 🎯 Visão Geral

O **Milkiê** é um sistema completo de gestão para empresas de laticínios, desenvolvido para gerenciar operações de múltiplas lojas (matriz e filiais). O sistema oferece controle de estoque, vendas, funcionários, fornecedores, gestão financeira e controle de caixa, com diferentes níveis de acesso baseados em funções (admin, gerente, caixa).

### Arquitetura

- **Backend**: Node.js com Express
- **Frontend**: Next.js com React
- **Banco de Dados**: MySQL (via Prisma ORM)
- **Autenticação**: JWT (JSON Web Tokens)
- **Upload de Arquivos**: Multer

---

## 📝 Requisitos Funcionais

### RF01 - Autenticação e Autorização
- **RF01.1**: O sistema deve permitir login de usuários com username e senha
- **RF01.2**: O sistema deve validar credenciais e retornar token JWT
- **RF01.3**: O sistema deve verificar autenticação em todas as rotas protegidas
- **RF01.4**: O sistema deve permitir logout de usuários
- **RF01.5**: O sistema deve permitir alteração de senha para usuários autenticados
- **RF01.6**: O sistema deve controlar acesso a módulos baseado em função (admin, gerente, caixa)

### RF02 - Gestão de Lojas
- **RF02.1**: O sistema deve permitir cadastro de lojas (matriz e filiais)
- **RF02.2**: O sistema deve armazenar endereço completo (CEP, número, complemento)
- **RF02.3**: O sistema deve permitir ativar/desativar lojas
- **RF02.4**: O sistema deve listar todas as lojas cadastradas
- **RF02.5**: O sistema deve permitir edição e exclusão de lojas

### RF03 - Gestão de Funcionários
- **RF03.1**: O sistema deve permitir cadastro de funcionários com dados pessoais (nome, CPF, email, telefone, idade)
- **RF03.2**: O sistema deve validar CPF único por funcionário
- **RF03.3**: O sistema deve validar email único por funcionário
- **RF03.4**: O sistema deve associar funcionário a uma loja
- **RF03.5**: O sistema deve armazenar cargo e salário do funcionário
- **RF03.6**: O sistema deve permitir upload de imagem do funcionário
- **RF03.7**: O sistema deve permitir ativar/desativar funcionários
- **RF03.8**: O sistema deve permitir verificação de CPF antes do cadastro

### RF04 - Gestão de Usuários do Sistema
- **RF04.1**: O sistema deve permitir criação de usuários vinculados a funcionários
- **RF04.2**: O sistema deve definir função do usuário (admin, gerente, caixa)
- **RF04.3**: O sistema deve validar username único
- **RF04.4**: O sistema deve armazenar senha de forma criptografada (bcrypt)
- **RF04.5**: O sistema deve permitir associar usuário a uma loja específica
- **RF04.6**: O sistema deve permitir ativar/desativar usuários

### RF05 - Gestão de Produtos
- **RF05.1**: O sistema deve permitir cadastro de produtos com informações completas (nome, marca, categoria, descrição, SKU)
- **RF05.2**: O sistema deve validar SKU único por produto
- **RF05.3**: O sistema deve armazenar datas de fabricação e validade
- **RF05.4**: O sistema deve permitir upload de imagem do produto
- **RF05.5**: O sistema deve permitir associar múltiplos fornecedores a um produto
- **RF05.6**: O sistema deve permitir ativar/desativar produtos
- **RF05.7**: O sistema deve permitir edição e exclusão de produtos

### RF06 - Gestão de Estoque
- **RF06.1**: O sistema deve controlar estoque por loja e produto
- **RF06.2**: O sistema deve armazenar quantidade, preço e período de validade do estoque
- **RF06.3**: O sistema deve permitir atualização de quantidade e preço
- **RF06.4**: O sistema deve validar estoque antes de realizar vendas
- **RF06.5**: O sistema deve atualizar estoque automaticamente após vendas
- **RF06.6**: O sistema deve permitir consulta de estoque por loja e produto

### RF07 - Gestão de Fornecedores
- **RF07.1**: O sistema deve permitir cadastro de fornecedores (nome, CNPJ/CPF)
- **RF07.2**: O sistema deve validar CNPJ/CPF único por fornecedor
- **RF07.3**: O sistema deve permitir associar fornecedores a produtos
- **RF07.4**: O sistema deve permitir ativar/desativar fornecedores
- **RF07.5**: O sistema deve permitir edição e exclusão de fornecedores

### RF08 - Gestão de Vendas
- **RF08.1**: O sistema deve permitir registro de vendas com múltiplos itens
- **RF08.2**: O sistema deve calcular valor total da venda automaticamente
- **RF08.3**: O sistema deve permitir registro de CPF do comprador (opcional)
- **RF08.4**: O sistema deve validar CPF do comprador quando informado
- **RF08.5**: O sistema deve permitir múltiplos métodos de pagamento por venda (dinheiro, cartão crédito, cartão débito, PIX)
- **RF08.6**: O sistema deve atualizar estoque automaticamente após finalizar venda
- **RF08.7**: O sistema deve registrar venda vinculada a loja e usuário
- **RF08.8**: O sistema deve permitir consulta de vendas por loja, data e usuário
- **RF08.9**: O sistema deve permitir edição e exclusão de vendas

### RF09 - Gestão de Caixa
- **RF09.1**: O sistema deve permitir abertura de caixa com valor inicial
- **RF09.2**: O sistema deve registrar usuário que abriu o caixa
- **RF09.3**: O sistema deve permitir fechamento de caixa com valor final
- **RF09.4**: O sistema deve registrar usuário que fechou o caixa
- **RF09.5**: O sistema deve controlar status do caixa (aberto/fechado)
- **RF09.6**: O sistema deve permitir consulta de caixas por loja e período
- **RF09.7**: O sistema deve permitir edição e exclusão de registros de caixa

### RF10 - Gestão Financeira
- **RF10.1**: O sistema deve permitir cadastro de despesas por loja
- **RF10.2**: O sistema deve categorizar despesas
- **RF10.3**: O sistema deve controlar status de pagamento (pendente/pago)
- **RF10.4**: O sistema deve permitir registro de pagamentos a fornecedores
- **RF10.5**: O sistema deve permitir registro de pagamentos a funcionários (salário e comissão)
- **RF10.6**: O sistema deve controlar vencimento e data de pagamento
- **RF10.7**: O sistema deve permitir consulta de despesas e pagamentos por loja e período

### RF11 - Validações e Segurança
- **RF11.1**: O sistema deve validar CPF/CNPJ usando biblioteca especializada
- **RF11.2**: O sistema deve validar CEP usando API externa
- **RF11.3**: O sistema deve filtrar palavras ofensivas em campos de texto
- **RF11.4**: O sistema deve validar dados de entrada usando schemas Zod
- **RF11.5**: O sistema deve tratar erros e retornar mensagens apropriadas

### RF12 - Upload de Arquivos
- **RF12.1**: O sistema deve permitir upload de imagens de produtos
- **RF12.2**: O sistema deve permitir upload de imagens de funcionários
- **RF12.3**: O sistema deve armazenar arquivos em diretórios organizados
- **RF12.4**: O sistema deve servir arquivos estáticos via API

---

## 🔧 Requisitos Não Funcionais

### RNF01 - Performance
- **RNF01.1**: O sistema deve responder a requisições em menos de 2 segundos em condições normais
- **RNF01.2**: O sistema deve suportar múltiplas requisições simultâneas
- **RNF01.3**: O sistema deve otimizar consultas ao banco de dados usando índices apropriados

### RNF02 - Segurança
- **RNF02.1**: O sistema deve usar HTTPS em produção
- **RNF02.2**: O sistema deve criptografar senhas usando bcrypt
- **RNF02.3**: O sistema deve validar tokens JWT em todas as rotas protegidas
- **RNF02.4**: O sistema deve implementar CORS adequadamente
- **RNF02.5**: O sistema deve sanitizar dados de entrada para prevenir SQL injection
- **RNF02.6**: O sistema deve validar tipos de arquivo no upload

### RNF03 - Usabilidade
- **RNF03.1**: O sistema deve fornecer mensagens de erro claras e objetivas
- **RNF03.2**: O sistema deve validar dados antes de processar
- **RNF03.3**: O sistema deve fornecer feedback visual para operações

### RNF04 - Confiabilidade
- **RNF04.1**: O sistema deve usar transações de banco de dados para operações críticas
- **RNF04.2**: O sistema deve validar integridade referencial (foreign keys)
- **RNF04.3**: O sistema deve tratar erros de forma adequada sem expor informações sensíveis
- **RNF04.4**: O sistema deve implementar soft delete quando apropriado

### RNF05 - Manutenibilidade
- **RNF05.1**: O código deve seguir padrões de organização modular
- **RNF05.2**: O sistema deve usar ORM (Prisma) para abstração do banco de dados
- **RNF05.3**: O sistema deve ter validação centralizada usando schemas
- **RNF05.4**: O sistema deve ter middlewares reutilizáveis

### RNF06 - Escalabilidade
- **RNF06.1**: O sistema deve suportar múltiplas lojas (matriz e filiais)
- **RNF06.2**: O sistema deve permitir crescimento do número de produtos e transações
- **RNF06.3**: O sistema deve usar arquitetura que permita adicionar novos módulos facilmente

### RNF07 - Compatibilidade
- **RNF07.1**: O sistema deve funcionar em navegadores modernos
- **RNF07.2**: O sistema deve ser compatível com Node.js versão 18 ou superior
- **RNF07.3**: O sistema deve usar MySQL 8.0 ou superior

### RNF08 - Disponibilidade
- **RNF08.1**: O sistema deve ter tratamento de erros que não interrompam o funcionamento
- **RNF08.2**: O sistema deve validar conexão com banco de dados
- **RNF08.3**: O sistema deve retornar respostas apropriadas mesmo em caso de erro

---

## 🛣️ Rotas da API

### Base URL
```
http://localhost:8080
```

### Autenticação (`/auth`)

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| POST | `/auth/login` | Realiza login e retorna token JWT | Não |
| POST | `/auth/logout` | Realiza logout | Não |
| GET | `/auth/check-auth` | Verifica se usuário está autenticado | Não |
| POST | `/auth/change-password` | Altera senha do usuário autenticado | Sim |

### Lojas (`/lojas`)

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|-----------|
| GET | `/lojas` | Lista todas as lojas | admin, gerente, caixa |
| GET | `/lojas/:id` | Busca loja por ID | admin, gerente, caixa |
| POST | `/lojas` | Cria nova loja | admin, gerente, caixa |
| PUT | `/lojas/:id` | Atualiza loja | admin, gerente, caixa |
| DELETE | `/lojas/:id` | Remove loja | admin, gerente, caixa |

### Funcionários (`/funcionarios`)

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|-----------|
| GET | `/funcionarios` | Lista todos os funcionários | admin, gerente |
| GET | `/funcionarios/:id` | Busca funcionário por ID | admin, gerente |
| GET | `/funcionarios/verificar-cpf/:cpf` | Verifica se CPF já está cadastrado | admin, gerente |
| POST | `/funcionarios` | Cria novo funcionário | admin, gerente |
| POST | `/funcionarios/upload-imagem` | Faz upload de imagem do funcionário | admin, gerente |
| PUT | `/funcionarios/:id` | Atualiza funcionário | admin, gerente |
| DELETE | `/funcionarios/:id` | Remove funcionário | admin, gerente |

### Usuários (`/usuarios`)

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|-----------|
| GET | `/usuarios` | Lista todos os usuários | admin, gerente |
| GET | `/usuarios/:id` | Busca usuário por ID | admin, gerente |
| POST | `/usuarios` | Cria novo usuário | admin, gerente |
| PUT | `/usuarios/:id` | Atualiza usuário | admin, gerente |
| DELETE | `/usuarios/:id` | Remove usuário | admin, gerente |

### Produtos (`/produtos`)

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|-----------|
| GET | `/produtos` | Lista todos os produtos | admin, gerente |
| GET | `/produtos/:id` | Busca produto por ID | admin, gerente |
| POST | `/produtos` | Cria novo produto | admin, gerente |
| POST | `/produtos/upload-imagem` | Faz upload de imagem do produto | admin, gerente |
| PUT | `/produtos/:id` | Atualiza produto | admin, gerente |
| DELETE | `/produtos/:id` | Remove produto | admin, gerente |

### Estoque (`/estoque`)

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|-----------|
| GET | `/estoque` | Lista todo o estoque | admin, gerente, caixa |
| GET | `/estoque/:produtoId/:lojaId` | Busca estoque específico | admin, gerente, caixa |
| POST | `/estoque` | Cria/atualiza registro de estoque | admin, gerente, caixa |
| PUT | `/estoque/:produtoId/:lojaId` | Atualiza estoque | admin, gerente, caixa |
| DELETE | `/estoque/:produtoId/:lojaId` | Remove registro de estoque | admin, gerente, caixa |

### Fornecedores (`/fornecedores`)

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|-----------|
| GET | `/fornecedores` | Lista todos os fornecedores | admin, gerente |
| GET | `/fornecedores/:id` | Busca fornecedor por ID | admin, gerente |
| POST | `/fornecedores` | Cria novo fornecedor | admin, gerente |
| PUT | `/fornecedores/:id` | Atualiza fornecedor | admin, gerente |
| DELETE | `/fornecedores/:id` | Remove fornecedor | admin, gerente |

### Fornecedor-Produtos (`/fornecedor-produtos`)

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|-----------|
| GET | `/fornecedor-produtos` | Lista todas as relações | admin |
| GET | `/fornecedor-produtos/:id` | Busca relação por ID | admin |
| POST | `/fornecedor-produtos` | Associa fornecedor a produto | admin |
| PUT | `/fornecedor-produtos/:id` | Atualiza relação | admin |
| DELETE | `/fornecedor-produtos/:id` | Remove relação | admin |

### Vendas (`/vendas`)

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|-----------|
| GET | `/vendas` | Lista todas as vendas | admin, gerente, caixa |
| GET | `/vendas/:id` | Busca venda por ID | admin, gerente, caixa |
| POST | `/vendas` | Cria nova venda | admin, gerente, caixa |
| POST | `/vendas/finalizar` | Finaliza venda e atualiza estoque | admin, gerente, caixa |
| PUT | `/vendas/:id` | Atualiza venda | admin, gerente, caixa |
| DELETE | `/vendas/:id` | Remove venda | admin, gerente, caixa |

### Venda Itens (`/venda-itens`)

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|-----------|
| GET | `/venda-itens` | Lista todos os itens de venda | admin, gerente, caixa |
| GET | `/venda-itens/:id` | Busca item por ID | admin, gerente, caixa |
| POST | `/venda-itens` | Cria novo item de venda | admin, gerente, caixa |
| PUT | `/venda-itens/:id` | Atualiza item de venda | admin, gerente, caixa |
| DELETE | `/venda-itens/:id` | Remove item de venda | admin, gerente, caixa |

### Venda Pagamentos (`/venda-pagamentos`)

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|-----------|
| GET | `/venda-pagamentos` | Lista todos os pagamentos | admin, gerente, caixa |
| GET | `/venda-pagamentos/:id` | Busca pagamento por ID | admin, gerente, caixa |
| POST | `/venda-pagamentos` | Cria novo pagamento | admin, gerente, caixa |
| PUT | `/venda-pagamentos/:id` | Atualiza pagamento | admin, gerente, caixa |
| DELETE | `/venda-pagamentos/:id` | Remove pagamento | admin, gerente, caixa |

### Caixa (`/caixa`)

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|-----------|
| GET | `/caixa` | Lista todos os caixas | admin, gerente, caixa |
| GET | `/caixa/:id` | Busca caixa por ID | admin, gerente, caixa |
| POST | `/caixa` | Abre novo caixa | admin, gerente, caixa |
| PUT | `/caixa/:id` | Atualiza caixa (fechamento) | admin, gerente, caixa |
| DELETE | `/caixa/:id` | Remove registro de caixa | admin, gerente, caixa |

### Despesas (`/despesas`)

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|-----------|
| GET | `/despesas` | Lista todas as despesas | admin, gerente |
| GET | `/despesas/:id` | Busca despesa por ID | admin, gerente |
| POST | `/despesas` | Cria nova despesa | admin, gerente |
| PUT | `/despesas/:id` | Atualiza despesa | admin, gerente |
| DELETE | `/despesas/:id` | Remove despesa | admin, gerente |

### Pagamentos Fornecedores (`/pagamentos-fornecedores`)

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|-----------|
| GET | `/pagamentos-fornecedores` | Lista todos os pagamentos | admin, gerente |
| GET | `/pagamentos-fornecedores/:id` | Busca pagamento por ID | admin, gerente |
| POST | `/pagamentos-fornecedores` | Cria novo pagamento | admin, gerente |
| PUT | `/pagamentos-fornecedores/:id` | Atualiza pagamento | admin, gerente |
| DELETE | `/pagamentos-fornecedores/:id` | Remove pagamento | admin, gerente |

### Pagamentos Funcionários (`/pagamentos-funcionarios`)

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|-----------|
| GET | `/pagamentos-funcionarios` | Lista todos os pagamentos | admin, gerente |
| GET | `/pagamentos-funcionarios/:id` | Busca pagamento por ID | admin, gerente |
| POST | `/pagamentos-funcionarios` | Cria novo pagamento | admin, gerente |
| PUT | `/pagamentos-funcionarios/:id` | Atualiza pagamento | admin, gerente |
| DELETE | `/pagamentos-funcionarios/:id` | Remove pagamento | admin, gerente |

### Arquivos Estáticos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/uploads/produtos/:filename` | Acessa imagem de produto |
| GET | `/uploads/funcionarios/:filename` | Acessa imagem de funcionário |

---

## 📖 Casos de Uso

### CU01 - Realizar Login no Sistema

**Ator**: Usuário do sistema (admin, gerente ou caixa)

**Pré-condições**: 
- Usuário deve ter cadastro no sistema
- Sistema deve estar em funcionamento

**Fluxo Principal**:
1. Usuário acessa a tela de login
2. Usuário informa username e senha
3. Sistema valida credenciais
4. Sistema gera token JWT
5. Sistema retorna token e informações do usuário
6. Sistema armazena token no cookie do navegador
7. Usuário é redirecionado para área logada

**Fluxos Alternativos**:
- **3a**: Credenciais inválidas → Sistema retorna erro e solicita nova tentativa
- **3b**: Usuário inativo → Sistema retorna erro informando que usuário está inativo

**Pós-condições**: 
- Usuário autenticado no sistema
- Token JWT válido armazenado

---

### CU02 - Cadastrar Nova Loja

**Ator**: Admin ou Gerente

**Pré-condições**: 
- Usuário deve estar autenticado
- Usuário deve ter permissão de acesso ao módulo de lojas

**Fluxo Principal**:
1. Usuário acessa módulo de lojas
2. Usuário seleciona opção "Nova Loja"
3. Usuário preenche dados: nome, tipo (matriz/filial), CEP, número, complemento
4. Sistema valida CEP (deve ser único)
5. Sistema valida dados de entrada
6. Sistema cria registro da loja
7. Sistema retorna confirmação de criação

**Fluxos Alternativos**:
- **4a**: CEP já cadastrado → Sistema retorna erro informando que CEP já existe
- **4b**: CEP inválido → Sistema retorna erro solicitando CEP válido

**Pós-condições**: 
- Nova loja cadastrada no sistema
- Loja disponível para associação com funcionários, estoque e vendas

---

### CU03 - Cadastrar Funcionário

**Ator**: Admin ou Gerente

**Pré-condições**: 
- Usuário deve estar autenticado
- Usuário deve ter permissão de acesso ao módulo de funcionários
- Loja deve estar cadastrada

**Fluxo Principal**:
1. Usuário acessa módulo de funcionários
2. Usuário seleciona opção "Novo Funcionário"
3. Usuário preenche dados: nome, CPF, email, telefone, idade, cargo, salário, loja
4. Sistema valida CPF (deve ser único e válido)
5. Sistema valida email (deve ser único)
6. Sistema cria registro do funcionário
7. Sistema retorna confirmação de criação

**Fluxos Alternativos**:
- **4a**: CPF já cadastrado → Sistema retorna erro informando que CPF já existe
- **4b**: CPF inválido → Sistema retorna erro solicitando CPF válido
- **5a**: Email já cadastrado → Sistema retorna erro informando que email já existe

**Pós-condições**: 
- Novo funcionário cadastrado no sistema
- Funcionário disponível para criação de usuário do sistema

---

### CU04 - Criar Usuário do Sistema

**Ator**: Admin ou Gerente

**Pré-condições**: 
- Usuário deve estar autenticado
- Usuário deve ter permissão de acesso ao módulo de usuários
- Funcionário deve estar cadastrado

**Fluxo Principal**:
1. Usuário acessa módulo de usuários
2. Usuário seleciona opção "Novo Usuário"
3. Usuário seleciona funcionário
4. Usuário define função (admin, gerente, caixa)
5. Usuário define username (deve ser único)
6. Usuário define senha
7. Sistema criptografa senha
8. Sistema cria registro do usuário
9. Sistema retorna confirmação de criação

**Fluxos Alternativos**:
- **5a**: Username já existe → Sistema retorna erro informando que username já existe

**Pós-condições**: 
- Novo usuário criado no sistema
- Usuário pode realizar login

---

### CU05 - Cadastrar Produto

**Ator**: Admin ou Gerente

**Pré-condições**: 
- Usuário deve estar autenticado
- Usuário deve ter permissão de acesso ao módulo de produtos

**Fluxo Principal**:
1. Usuário acessa módulo de produtos
2. Usuário seleciona opção "Novo Produto"
3. Usuário preenche dados: nome, marca, categoria, descrição, SKU, fabricação, validade
4. Usuário pode fazer upload de imagem
5. Usuário pode associar fornecedores
6. Sistema valida SKU (deve ser único)
7. Sistema valida dados de entrada
8. Sistema cria registro do produto
9. Sistema retorna confirmação de criação

**Fluxos Alternativos**:
- **6a**: SKU já cadastrado → Sistema retorna erro informando que SKU já existe

**Pós-condições**: 
- Novo produto cadastrado no sistema
- Produto disponível para cadastro de estoque

---

### CU06 - Cadastrar Estoque

**Ator**: Admin, Gerente ou Caixa

**Pré-condições**: 
- Usuário deve estar autenticado
- Usuário deve ter permissão de acesso ao módulo de estoque
- Produto e loja devem estar cadastrados

**Fluxo Principal**:
1. Usuário acessa módulo de estoque
2. Usuário seleciona opção "Novo Estoque"
3. Usuário seleciona produto
4. Usuário seleciona loja
5. Usuário informa quantidade e preço
6. Usuário informa período de validade (opcional)
7. Sistema valida dados de entrada
8. Sistema cria/atualiza registro de estoque
9. Sistema retorna confirmação

**Fluxos Alternativos**:
- **8a**: Estoque já existe → Sistema atualiza quantidade e preço

**Pós-condições**: 
- Estoque cadastrado/atualizado
- Produto disponível para venda na loja

---

### CU07 - Realizar Venda

**Ator**: Admin, Gerente ou Caixa

**Pré-condições**: 
- Usuário deve estar autenticado
- Usuário deve ter permissão de acesso ao módulo de vendas
- Caixa deve estar aberto
- Produtos devem estar em estoque

**Fluxo Principal**:
1. Usuário acessa PDV (Ponto de Venda)
2. Usuário seleciona produtos e quantidades
3. Sistema verifica disponibilidade em estoque
4. Sistema calcula valor total
5. Usuário pode informar CPF do comprador (opcional)
6. Usuário seleciona método(s) de pagamento
7. Usuário confirma venda
8. Sistema finaliza venda (transação)
9. Sistema atualiza estoque automaticamente
10. Sistema registra venda, itens e pagamentos
11. Sistema retorna confirmação de venda

**Fluxos Alternativos**:
- **3a**: Produto sem estoque suficiente → Sistema retorna erro e impede venda
- **6a**: Múltiplos métodos de pagamento → Sistema permite divisão do valor entre métodos

**Pós-condições**: 
- Venda registrada no sistema
- Estoque atualizado
- Caixa atualizado com valor da venda

---

### CU08 - Abrir Caixa

**Ator**: Admin, Gerente ou Caixa

**Pré-condições**: 
- Usuário deve estar autenticado
- Usuário deve ter permissão de acesso ao módulo de caixa
- Não deve haver caixa aberto na loja

**Fluxo Principal**:
1. Usuário acessa módulo de caixa
2. Usuário seleciona opção "Abrir Caixa"
3. Usuário informa valor inicial
4. Sistema valida dados
5. Sistema cria registro de caixa com status "aberto"
6. Sistema registra usuário que abriu o caixa
7. Sistema registra data/hora de abertura
8. Sistema retorna confirmação

**Fluxos Alternativos**:
- **3a**: Valor inicial não informado → Sistema assume valor zero

**Pós-condições**: 
- Caixa aberto na loja
- Vendas podem ser realizadas

---

### CU09 - Fechar Caixa

**Ator**: Admin, Gerente ou Caixa

**Pré-condições**: 
- Usuário deve estar autenticado
- Usuário deve ter permissão de acesso ao módulo de caixa
- Caixa deve estar aberto

**Fluxo Principal**:
1. Usuário acessa módulo de caixa
2. Usuário seleciona caixa aberto
3. Usuário seleciona opção "Fechar Caixa"
4. Usuário informa valor final
5. Sistema valida dados
6. Sistema atualiza registro de caixa com status "fechado"
7. Sistema registra usuário que fechou o caixa
8. Sistema registra data/hora de fechamento
9. Sistema calcula diferença (valor final - valor inicial - vendas)
10. Sistema retorna confirmação com resumo

**Pós-condições**: 
- Caixa fechado
- Registro completo de movimentação do caixa

---

### CU10 - Cadastrar Fornecedor

**Ator**: Admin ou Gerente

**Pré-condições**: 
- Usuário deve estar autenticado
- Usuário deve ter permissão de acesso ao módulo de fornecedores

**Fluxo Principal**:
1. Usuário acessa módulo de fornecedores
2. Usuário seleciona opção "Novo Fornecedor"
3. Usuário preenche dados: nome, CNPJ/CPF
4. Sistema valida CNPJ/CPF (deve ser único e válido)
5. Sistema valida dados de entrada
6. Sistema cria registro do fornecedor
7. Sistema retorna confirmação de criação

**Fluxos Alternativos**:
- **4a**: CNPJ/CPF já cadastrado → Sistema retorna erro informando que já existe
- **4b**: CNPJ/CPF inválido → Sistema retorna erro solicitando documento válido

**Pós-condições**: 
- Novo fornecedor cadastrado no sistema
- Fornecedor disponível para associação com produtos

---

### CU11 - Registrar Despesa

**Ator**: Admin ou Gerente

**Pré-condições**: 
- Usuário deve estar autenticado
- Usuário deve ter permissão de acesso ao módulo financeiro
- Loja deve estar cadastrada

**Fluxo Principal**:
1. Usuário acessa módulo financeiro
2. Usuário seleciona opção "Nova Despesa"
3. Usuário seleciona loja
4. Usuário preenche dados: descrição, valor, data, categoria
5. Sistema valida dados de entrada
6. Sistema cria registro de despesa com status "pendente"
7. Sistema retorna confirmação de criação

**Pós-condições**: 
- Despesa registrada no sistema
- Despesa disponível para consulta e controle de pagamento

---

### CU12 - Registrar Pagamento a Fornecedor

**Ator**: Admin ou Gerente

**Pré-condições**: 
- Usuário deve estar autenticado
- Usuário deve ter permissão de acesso ao módulo financeiro
- Fornecedor e loja devem estar cadastrados

**Fluxo Principal**:
1. Usuário acessa módulo financeiro
2. Usuário seleciona opção "Novo Pagamento Fornecedor"
3. Usuário seleciona fornecedor
4. Usuário seleciona loja
5. Usuário informa valor e data de vencimento
6. Sistema valida dados de entrada
7. Sistema cria registro de pagamento com status "pendente"
8. Sistema retorna confirmação de criação

**Fluxos Alternativos**:
- **7a**: Pagamento realizado → Usuário informa data de pagamento e sistema atualiza status para "pago"

**Pós-condições**: 
- Pagamento registrado no sistema
- Pagamento disponível para consulta e controle

---

### CU13 - Registrar Pagamento a Funcionário

**Ator**: Admin ou Gerente

**Pré-condições**: 
- Usuário deve estar autenticado
- Usuário deve ter permissão de acesso ao módulo financeiro
- Funcionário e loja devem estar cadastrados

**Fluxo Principal**:
1. Usuário acessa módulo financeiro
2. Usuário seleciona opção "Novo Pagamento Funcionário"
3. Usuário seleciona funcionário
4. Usuário seleciona loja
5. Sistema carrega salário do funcionário
6. Usuário pode informar comissão adicional
7. Sistema valida dados de entrada
8. Sistema cria registro de pagamento com status "pendente"
9. Sistema retorna confirmação de criação

**Fluxos Alternativos**:
- **8a**: Pagamento realizado → Usuário informa data de pagamento e sistema atualiza status para "pago"

**Pós-condições**: 
- Pagamento registrado no sistema
- Pagamento disponível para consulta e controle

---

### CU14 - Consultar Vendas

**Ator**: Admin, Gerente ou Caixa

**Pré-condições**: 
- Usuário deve estar autenticado
- Usuário deve ter permissão de acesso ao módulo de vendas

**Fluxo Principal**:
1. Usuário acessa módulo de vendas
2. Usuário pode filtrar por loja, data, usuário
3. Sistema busca vendas conforme filtros
4. Sistema retorna lista de vendas com detalhes
5. Usuário pode visualizar detalhes de uma venda específica (itens e pagamentos)

**Pós-condições**: 
- Usuário visualiza informações das vendas

---

### CU15 - Consultar Estoque

**Ator**: Admin, Gerente ou Caixa

**Pré-condições**: 
- Usuário deve estar autenticado
- Usuário deve ter permissão de acesso ao módulo de estoque

**Fluxo Principal**:
1. Usuário acessa módulo de estoque
2. Usuário pode filtrar por loja e/ou produto
3. Sistema busca estoque conforme filtros
4. Sistema retorna lista de estoque com quantidade, preço e validade
5. Usuário pode visualizar detalhes de um produto específico

**Pós-condições**: 
- Usuário visualiza informações do estoque

---

## 🔐 Permissões por Função

### Admin
- Acesso total a todos os módulos
- Pode gerenciar autenticação
- Pode gerenciar fornecedor-produtos

### Gerente
- Acesso a: caixa, estoque, fornecedores, funcionários, lojas, produtos, usuários, vendas, financeiro
- Não pode gerenciar autenticação
- Não pode gerenciar fornecedor-produtos

### Caixa
- Acesso a: caixa, estoque, lojas, vendas
- Acesso limitado para operações de venda e consulta

---

## 📊 Modelo de Dados

### Entidades Principais

- **lojas**: Matriz e filiais da empresa
- **funcionarios**: Todos os funcionários da empresa
- **usuarios**: Funcionários com acesso ao sistema
- **produtos**: Catálogo de produtos
- **estoque**: Estoque por loja e produto
- **fornecedores**: Fornecedores de produtos
- **vendas**: Registro de vendas
- **venda_itens**: Itens de cada venda
- **venda_pagamentos**: Formas de pagamento das vendas
- **caixa**: Controle de abertura/fechamento de caixa
- **despesas**: Despesas por loja
- **pagamentos_fornecedores**: Pagamentos a fornecedores
- **pagamentos_funcionarios**: Pagamentos a funcionários

---

## 📝 Notas Técnicas

### Autenticação
- Tokens JWT armazenados em cookies HTTP-only
- Validação de token em todas as rotas protegidas
- Middleware de autenticação aplicado globalmente

### Validação
- Validação de dados usando Zod schemas
- Validação de CPF/CNPJ usando biblioteca especializada
- Validação de CEP usando API externa
- Filtro de palavras ofensivas em campos de texto

### Transações
- Operações críticas (como finalizar venda) usam transações de banco de dados
- Garantia de integridade referencial com foreign keys

### Upload de Arquivos
- Armazenamento local em diretórios organizados
- Serviço de arquivos estáticos via Express
- Suporte a imagens (JPG, PNG, WEBP)

---

**Documentação gerada em**: 2024
**Versão do Sistema**: 1.0.0

