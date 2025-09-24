<p align="center">
  <img src="https://raw.githubusercontent.com/MatheusMastroumano/Milkie/refs/heads/main/frontend/public/Milkie.svg" alt="Logo Milkiê" width="120"/>
  &nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/MatheusMastroumano/Milkie/refs/heads/main/frontend/public/LogoMilkie.svg" alt="Logo Milkiê 2" width="90"/>
</p>

<h1 align="center">Milkiê</h1>

<p align="center">
  <a href="https://github.com/seu-usuario/milkie/stargazers">
    <img src="https://img.shields.io/github/stars/seu-usuario/milkie?style=flat-square" alt="Stars">
  </a>
  <a href="https://github.com/seu-usuario/milkie/issues">
    <img src="https://img.shields.io/github/issues/seu-usuario/milkie?style=flat-square" alt="Issues">
  </a>
  <a href="https://github.com/seu-usuario/milkie/network">
    <img src="https://img.shields.io/github/forks/seu-usuario/milkie?style=flat-square" alt="Forks">
  </a>
  <a href="https://img.shields.io/badge/license-MIT-blue?style=flat-square">
    <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License">
  </a>
</p>

---

O **Milkiê** é um sistema voltado para o gerenciamento de **compras e vendas de produtos de laticínios**, permitindo controle eficiente de estoque, cadastro de clientes e fornecedores, além de relatórios detalhados de movimentações.

---

## 📂 Estrutura do Projeto

```
milkie/
├── src/ # Código-fonte principal
├── config/ # Arquivos de configuração
├── public/ # Arquivos estáticos
├── node_modules/ # Dependências instaladas
├── package.json # Dependências e scripts
└── README.md # Documentação do projeto
```

---

## ⚙️ Instalação

Clone o repositório em sua máquina:

```bash
git clone https://github.com/seu-usuario/milkie.git
cd milkie
```

---

## Instale as dependências dentro da pasta src:

```bash
cd src
npm install
```

---

## Para instalar pacotes apenas na pasta config:

```bash
cd ../config
npm init -y
npm install dotenv
```

---

## ▶️ Como Usar
No diretório raiz do projeto, execute:
```bash
npm run dev
```

Saída esperada no terminal:

```bash
> Starting Milkiê server...
> Listening on http://localhost:3000
> Database connected successfully
```

## Acesse em seu navegador:

```bash
http://localhost:3000
```

---
## 📌 Funcionalidades Principais

 🥛 Cadastro de produtos de laticínios (leite, queijos, iogurtes, etc.)

 📦 Controle de estoque com atualização automática

 🛒 Registro de compras e vendas

 📊 Relatórios detalhados de movimentação

 🗄️ Integração com base de dados relacional

---

## 🛠️ Scripts Disponíveis

| Script          | Função                                           |
|-----------------|-------------------------------------------------|
| `npm run dev`   | Inicia o servidor em ambiente de desenvolvimento |
| `npm run build` | Gera a versão de produção do sistema            |
| `npm start`     | Executa o sistema em modo de produção          |
| `npm test`      | Executa a suíte de testes automáticos          |

---

## 💻 Tecnologias Utilizadas

### Node.js - Plataforma de backend

### Express - Framework para Node.js

### JavaScript - Linguagem principal

### MySQL - Banco de dados relacional

### dotenv - Gerenciamento de variáveis de ambiente

### React - Front-end

## 📄 Licença

Este projeto está licenciado sob a MIT License.

<p align="center"> Concluido na marra pela <strong>Equipe Milkiê</strong> </p>