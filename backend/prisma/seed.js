import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
	// Limpa dados em ordem de dependência (ambiente de DEV)
	await prisma.venda_pagamentos.deleteMany().catch(() => {});
	await prisma.venda_itens.deleteMany().catch(() => {});
	await prisma.vendas.deleteMany().catch(() => {});
	await prisma.caixa.deleteMany().catch(() => {});
	await prisma.estoque.deleteMany().catch(() => {});
	await prisma.fornecedor_produtos.deleteMany().catch(() => {});
	await prisma.usuarios.deleteMany().catch(() => {});
	await prisma.funcionarios.deleteMany().catch(() => {});
	await prisma.fornecedores.deleteMany().catch(() => {});
	await prisma.produtos.deleteMany().catch(() => {});
	await prisma.lojas.deleteMany().catch(() => {});

	// Cria loja matriz
	const loja = await prisma.lojas.create({
		data: {
			nome: 'Loja Matriz',
			tipo: 'matriz',
			CEP: '01001000',
			numero: 100,
			complemento: 'Centro',
			ativo: true,
		},
	});

	// Cria funcionário e usuário admin
	const funcionario = await prisma.funcionarios.create({
		data: {
			loja_id: loja.id,
			nome: 'Admin Principal',
			cpf: '11122233344',
			email: 'admin@example.com',
			telefone: '11999990000',
			idade: 30,
			cargo: 'Administrador',
			salario: '10000.00',
			ativo: true,
		},
	});

	const senha_hash = await bcrypt.hash('admin123', 10);
	await prisma.usuarios.create({
		data: {
			funcionario_id: funcionario.id,
			loja_id: loja.id,
			funcao: 'admin',
			username: 'admin',
			senha_hash,
			ativo: true,
		},
	});

	// Fornecedor
	const fornecedor = await prisma.fornecedores.create({
		data: {
			nome: 'Fornecedor Padrão',
			cnpj_cpf: '12345678000100',
			ativo: true,
		},
	});

	// Produtos
	const produtos = await prisma.$transaction([
		prisma.produtos.create({
			data: {
				nome: 'Camiseta Básica',
				marca: 'Milkie',
				categoria: 'Vestuário',
				descricao: 'Camiseta 100% algodão',
				sku: 'CAM-001',
				fabricacao: new Date(),
				validade: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
				ativo: true,
			},
		}),
		prisma.produtos.create({
			data: {
				nome: 'Caneca Personalizada',
				marca: 'Milkie',
				categoria: 'Acessórios',
				descricao: 'Caneca de cerâmica 300ml',
				sku: 'CAN-001',
				fabricacao: new Date(),
				validade: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
				ativo: true,
			},
		}),
	]);

	// Relaciona fornecedor aos produtos
	await prisma.fornecedor_produtos.createMany({
		data: produtos.map((p) => ({
			fornecedor_id: fornecedor.id,
			produto_id: p.id,
		})),
	});

	// Cria estoque com preço
	await prisma.estoque.createMany({
		data: [
			{
				produto_id: produtos[0].id,
				loja_id: loja.id,
				preco: '49.90',
				quantidade: 50,
				valido_de: new Date(),
			},
			{
				produto_id: produtos[1].id,
				loja_id: loja.id,
				preco: '39.90',
				quantidade: 30,
				valido_de: new Date(),
			},
		],
	});

	console.log('🌱 Seed concluído com sucesso.');
	console.log('Credenciais de login -> username: admin | senha: admin123');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});



