<div align="center" style="display: flex; align-items: center; justify-content: center; gap: 16px;">

  <img src="./20250922_1650_Minimalist Blue Cow_remix_01k5sfg70nfej9dhy9kapggzcx.svg" alt="Logo Milkiê" width="90"/>

  <h1 style="margin: 0; font-size: 42px; color: #2a4e73; font-weight: bold;">Milkiê</h1>

</div>

---

O **Milkiê** é um sistema voltado para o gerenciamento de **compras e vendas de produtos de laticínios**, permitindo controle eficiente de estoque, cadastro de clientes e fornecedores, além de relatórios de movimentações.

---

<div style="border-radius: 12px; padding: 16px; background: #cfe8f9; border: 1px solid #2a4e73; color: #3a3a3a;">

<h2 style="color:#2a4e73;">📂 Estrutura do Projeto</h2>

milkie/
│── src/ # Código-fonte principal
│── config/ # Arquivos de configuração
│── public/ # Arquivos estáticos
│── node_modules/ # Dependências instaladas
│── package.json # Dependências e scripts
│── README.md # Documentação do projeto

yaml
Copiar código
</div>

---

<div style="border-radius: 12px; padding: 16px; background: #ffffff; border: 1px solid #2a4e73; color: #3a3a3a;">

<h2 style="color:#ad343e;">⚙️ Instalação</h2>

Clone o repositório em sua máquina:

```bash
git clone https://github.com/seu-usuario/milkie.git
cd milkie
Instale as dependências dentro da pasta <b>src</b>:

bash
Copiar código
cd src
npm install
Para instalar pacotes apenas na pasta <b>config</b>:

bash
Copiar código
cd config
npm init -y
npm install dotenv
</div>
<div style="border-radius: 12px; padding: 16px; background: #cfe8f9; border: 1px solid #2a4e73; color: #3a3a3a;"> <h2 style="color:#2a4e73;">▶️ Como Usar</h2>
No diretório raiz do projeto, execute:

bash
Copiar código
npm run dev
Saída esperada no terminal:

shell
Copiar código
> Starting Milkiê server...
> Listening on http://localhost:3000
> Database connected successfully
Acesse em seu navegador:

arduino
Copiar código
http://localhost:3000
</div>
<div style="border-radius: 12px; padding: 16px; background: #ffffff; border: 1px solid #ad343e; color: #3a3a3a;"> <h2 style="color:#ad343e;">📌 Funcionalidades Principais</h2>
Cadastro de produtos de laticínios (leite, queijos, iogurtes, etc.)

Controle de estoque com atualização automática

Registro de compras e vendas

Relatórios detalhados de movimentação

Integração com base de dados relacional

</div>
<div style="border-radius: 12px; padding: 16px; background: #cfe8f9; border: 1px solid #2a4e73; color: #3a3a3a;"> <h2 style="color:#2a4e73;">🛠️ Scripts Disponíveis</h2>
Script	Função
npm run dev	Inicia o servidor em ambiente de desenvolvimento
npm run build	Gera a versão de produção do sistema
npm start	Executa o sistema em modo de produção
npm test	Executa a suíte de testes automáticos

</div>
<div style="border-radius: 12px; padding: 16px; background: #ffffff; border: 1px solid #2a4e73; color: #3a3a3a;"> <h2 style="color:#ad343e;">🧑‍💻 Contribuindo</h2>
Para contribuir com o projeto, faça um fork, crie uma branch e abra um Pull Request:

bash
Copiar código
git checkout -b minha-feature
git commit -m "Adicionando nova funcionalidade"
git push origin minha-feature
</div>
<div style="border-radius: 12px; padding: 16px; background: #cfe8f9; border: 1px solid #2a4e73; color: #3a3a3a;"> <h2 style="color:#2a4e73;">📄 Licença</h2>
Este projeto é licenciado sob a <b>MIT License</b>.

</div> ```