# 🥛 Milkiê - Sistema de Compras e Vendas de Laticínios

O **Milkiê** é um sistema voltado para o gerenciamento de **compras e vendas de produtos de laticínios**, permitindo controle eficiente de estoque, cadastro de clientes e fornecedores, além de relatórios de movimentações.

---

> ## 📂 Estrutura do Projeto
> 
> ```
> milkie/
> │── src/              # Código-fonte principal
> │── config/           # Arquivos de configuração
> │── public/           # Arquivos estáticos
> │── node_modules/     # Dependências instaladas
> │── package.json      # Dependências e scripts
> │── README.md         # Documentação do projeto
> ```

---

> ## ⚙️ Instalação
>
> Clone o repositório em sua máquina:
>
> ```bash
> git clone https://github.com/seu-usuario/milkie.git
> cd milkie
> ```
>
> Instale as dependências dentro da pasta **src**:
>
> ```bash
> cd src
> npm install
> ```
>
> Para instalar pacotes apenas na pasta **config**:
>
> ```bash
> cd config
> npm init -y
> npm install dotenv
> ```

---

> ## ▶️ Como Usar
>
> No diretório raiz do projeto, execute:
>
> ```bash
> npm run dev
> ```
>
> Saída esperada no terminal:
>
> ```
> > Starting Milkiê server...
> > Listening on http://localhost:3000
> > Database connected successfully
> ```
>
> Acesse em seu navegador:
>
> ```
> http://localhost:3000
> ```

---

> ## 📌 Funcionalidades Principais
>
> - Cadastro de produtos de laticínios (leite, queijos, iogurtes, etc.)
> - Controle de estoque com atualização automática
> - Registro de compras e vendas
> - Relatórios detalhados de movimentação
> - Integração com base de dados relacional

---

> ## 🛠️ Scripts Disponíveis
>
> | Script          | Função                                          |
> |-----------------|-------------------------------------------------|
> | `npm run dev`   | Inicia o servidor em ambiente de desenvolvimento |
> | `npm run build` | Gera a versão de produção do sistema             |
> | `npm start`     | Executa o sistema em modo de produção            |
> | `npm test`      | Executa a suíte de testes automáticos            |

---

> ## 🧑‍💻 Contribuindo
>
> Para contribuir com o projeto, faça um fork, crie uma branch e abra um Pull Request:
>
> ```bash
> git checkout -b minha-feature
> git commit -m "Adicionando nova funcionalidade"
> git push origin minha-feature
> ```

---

> ## 📄 Licença
>
> Este projeto é licenciado sob a **MIT License**.
