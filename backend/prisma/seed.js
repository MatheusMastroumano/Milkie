import prisma from '../src/shared/config/database.js';
import bcrypt from 'bcrypt';

async function main() {
	console.log('🌱 Iniciando seed do banco de dados...\n');

	// Limpa dados em ordem de dependência (ambiente de DEV)
	console.log('🧹 Limpando dados antigos...');
	await prisma.venda_pagamentos.deleteMany().catch(() => { });
	await prisma.venda_itens.deleteMany().catch(() => { });
	await prisma.vendas.deleteMany().catch(() => { });
	await prisma.caixa.deleteMany().catch(() => { });
	await prisma.estoque.deleteMany().catch(() => { });
	await prisma.fornecedor_produtos.deleteMany().catch(() => { });
	await prisma.usuarios.deleteMany().catch(() => { });
	await prisma.funcionarios.deleteMany().catch(() => { });
	await prisma.fornecedores.deleteMany().catch(() => { });
	await prisma.produtos.deleteMany().catch(() => { });
	await prisma.lojas.deleteMany().catch(() => { });
	console.log('✅ Dados antigos removidos\n');

	// ==================== LOJAS ====================
	console.log('🏪 Criando lojas...');
	const lojaMatriz = await prisma.lojas.create({
		data: {
			nome: 'Loja Matriz - Centro',
			tipo: 'matriz',
			CEP: '01001000',
			numero: 100,
			complemento: 'Sala 1',
			ativo: true,
		},
	});

	const lojaFilial1 = await prisma.lojas.create({
		data: {
			nome: 'Loja Filial - Zona Norte',
			tipo: 'filial',
			CEP: '02001000',
			numero: 250,
			complemento: 'Loja 5',
			ativo: true,
		},
	});

	const lojaFilial2 = await prisma.lojas.create({
		data: {
			nome: 'Loja Filial - Zona Sul',
			tipo: 'filial',
			CEP: '04001000',
			numero: 380,
			complemento: 'Térreo',
			ativo: true,
		},
	});
	console.log(`✅ ${3} lojas criadas\n`);

	// ==================== FUNCIONÁRIOS ====================
	console.log('👥 Criando funcionários...');
	const funcionarioAdmin = await prisma.funcionarios.create({
		data: {
			loja_id: lojaMatriz.id,
			nome: 'Admin Principal',
			cpf: '11122233344',
			email: 'admin@example.com',
			telefone: '11999990000',
			idade: 30,
			cargo: 'Administrador',
			salario: '10000.00',
			imagem: '/uploads/funcionarios/i1.webp',
			ativo: true,
		},
	});

	const funcionarioGerente1 = await prisma.funcionarios.create({
		data: {
			loja_id: lojaMatriz.id,
			nome: 'Maria Silva',
			cpf: '22233344455',
			email: 'maria.silva@example.com',
			telefone: '11999991111',
			idade: 28,
			cargo: 'Gerente',
			salario: '5000.00',
			imagem: '/uploads/funcionarios/i2.webp',
			ativo: true,
		},
	});

	const funcionarioGerente2 = await prisma.funcionarios.create({
		data: {
			loja_id: lojaFilial1.id,
			nome: 'João Santos',
			cpf: '33344455566',
			email: 'joao.santos@example.com',
			telefone: '11999992222',
			idade: 32,
			cargo: 'Gerente',
			salario: '4500.00',
			imagem: '/uploads/funcionarios/i3.webp',
			ativo: true,
		},
	});

	const funcionarioCaixa1 = await prisma.funcionarios.create({
		data: {
			loja_id: lojaMatriz.id,
			nome: 'Ana Costa',
			cpf: '44455566677',
			email: 'ana.costa@example.com',
			telefone: '11999993333',
			idade: 24,
			cargo: 'Caixa',
			salario: '2500.00',
			imagem: '/uploads/funcionarios/i4.webp',
			ativo: true,
		},
	});

	const funcionarioCaixa2 = await prisma.funcionarios.create({
		data: {
			loja_id: lojaFilial1.id,
			nome: 'Pedro Oliveira',
			cpf: '55566677788',
			email: 'pedro.oliveira@example.com',
			telefone: '11999994444',
			idade: 22,
			cargo: 'Caixa',
			salario: '2300.00',
			imagem: '/uploads/funcionarios/i5.webp',
			ativo: true,
		},
	});

	const funcionarioCaixa3 = await prisma.funcionarios.create({
		data: {
			loja_id: lojaFilial2.id,
			nome: 'Carla Mendes',
			cpf: '66677788899',
			email: 'carla.mendes@example.com',
			telefone: '11999995555',
			idade: 26,
			cargo: 'Caixa',
			salario: '2400.00',
			imagem: '/uploads/funcionarios/i6.webp',
			ativo: true,
		},
	});
	console.log(`✅ ${6} funcionários criados\n`);

	// ==================== USUÁRIOS ====================
	console.log('🔐 Criando usuários...');
	const senhaHashAdmin = await bcrypt.hash('admin123', 10);
	const senhaHashGerente = await bcrypt.hash('gerente123', 10);
	const senhaHashCaixa = await bcrypt.hash('caixa123', 10);

	const usuarioAdmin = await prisma.usuarios.create({
		data: {
			funcionario_id: funcionarioAdmin.id,
			loja_id: lojaMatriz.id,
			funcao: 'admin',
			username: 'admin',
			senha_hash: senhaHashAdmin,
			ativo: true,
		},
	});

	const usuarioGerente1 = await prisma.usuarios.create({
		data: {
			funcionario_id: funcionarioGerente1.id,
			loja_id: lojaMatriz.id,
			funcao: 'gerente',
			username: 'maria.gerente',
			senha_hash: senhaHashGerente,
			ativo: true,
		},
	});

	const usuarioGerente2 = await prisma.usuarios.create({
		data: {
			funcionario_id: funcionarioGerente2.id,
			loja_id: lojaFilial1.id,
			funcao: 'gerente',
			username: 'joao.gerente',
			senha_hash: senhaHashGerente,
			ativo: true,
		},
	});

	const usuarioCaixa1 = await prisma.usuarios.create({
		data: {
			funcionario_id: funcionarioCaixa1.id,
			loja_id: lojaMatriz.id,
			funcao: 'caixa',
			username: 'ana.caixa',
			senha_hash: senhaHashCaixa,
			ativo: true,
		},
	});

	const usuarioCaixa2 = await prisma.usuarios.create({
		data: {
			funcionario_id: funcionarioCaixa2.id,
			loja_id: lojaFilial1.id,
			funcao: 'caixa',
			username: 'pedro.caixa',
			senha_hash: senhaHashCaixa,
			ativo: true,
		},
	});

	const usuarioCaixa3 = await prisma.usuarios.create({
		data: {
			funcionario_id: funcionarioCaixa3.id,
			loja_id: lojaFilial2.id,
			funcao: 'caixa',
			username: 'carla.caixa',
			senha_hash: senhaHashCaixa,
			ativo: true,
		},
	});
	console.log(`✅ ${6} usuários criados\n`);

	// ==================== FORNECEDORES ====================
	console.log('🏭 Criando fornecedores...');
	const fornecedor1 = await prisma.fornecedores.create({
		data: {
			nome: 'Distribuidora ABC Ltda',
			cnpj_cpf: '12345678000100',
			ativo: true,
		},
	});

	const fornecedor2 = await prisma.fornecedores.create({
		data: {
			nome: 'Importadora XYZ S.A.',
			cnpj_cpf: '98765432000111',
			ativo: true,
		},
	});

	const fornecedor3 = await prisma.fornecedores.create({
		data: {
			nome: 'Fábrica Nacional de Produtos',
			cnpj_cpf: '11223344000155',
			ativo: true,
		},
	});
	console.log(`✅ ${3} fornecedores criados\n`);

	// ==================== PRODUTOS ====================
	console.log('📦 Criando produtos...');

	const produtosData = [
		{
			nome: 'Leite Integral 1L',
			marca: 'Milkie',
			categoria: 'Laticínio',
			descricao: 'Leite integral pasteurizado',
			sku: 'LAT-001',
			fabricacao: new Date('2024-01-01'),
			validade: new Date('2026-01-01'),
			imagem_url: '/uploads/produtos/leite_integral.png',
			ativo: true,
			fornecedores_ids: [fornecedor1.id, fornecedor3.id],
		},
		{
			nome: 'Leite Desnatado 1L',
			marca: 'Milkie',
			categoria: 'Laticínio',
			descricao: 'Leite desnatado 0% gordura',
			sku: 'LAT-002',
			fabricacao: new Date('2024-01-01'),
			validade: new Date('2026-01-01'),
			imagem_url: '/uploads/produtos/leite_desnatado.png',
			ativo: true,
			fornecedores_ids: [fornecedor1.id, fornecedor3.id],
		},
		{
			nome: 'Queijo Minas Frescal 500g',
			marca: 'Milkie',
			categoria: 'Laticínio',
			descricao: 'Queijo minas frescal tradicional',
			sku: 'LAT-003',
			fabricacao: new Date('2024-02-01'),
			validade: new Date('2026-02-01'),
			imagem_url: '/uploads/produtos/queijo_prato.png',
			ativo: true,
			fornecedores_ids: [fornecedor3.id],
		},
		{
			nome: 'Iogurte Natural 170g',
			marca: 'Milkie',
			categoria: 'Laticínio',
			descricao: 'Iogurte natural sem açúcar',
			sku: 'LAT-004',
			fabricacao: new Date('2024-01-15'),
			validade: new Date('2026-01-15'),
			imagem_url: '/uploads/produtos/iogurte_integral.png',
			ativo: true,
			fornecedores_ids: [fornecedor2.id],
		},
		{
			nome: 'Queijo Mussarela 400g',
			marca: 'Milkie',
			categoria: 'Laticínio',
			descricao: 'Queijo mussarela fatiado',
			sku: 'LAT-005',
			fabricacao: new Date('2024-03-01'),
			validade: new Date('2026-03-01'),
			imagem_url: '/uploads/produtos/queijo_prato.png',
			ativo: true,
			fornecedores_ids: [fornecedor1.id],
		},
		{
			nome: 'Manteiga sem Sal 200g',
			marca: 'Milkie',
			categoria: 'Laticínio',
			descricao: 'Manteiga cremosa sem sal',
			sku: 'LAT-006',
			fabricacao: new Date('2024-02-15'),
			validade: new Date('2026-02-15'),
			imagem_url: '/uploads/produtos/doce_leite.png',
			ativo: true,
			fornecedores_ids: [fornecedor2.id, fornecedor3.id],
		},
		{
			nome: 'Creme de Leite 300g',
			marca: 'Milkie',
			categoria: 'Laticínio',
			descricao: 'Creme de leite fresco',
			sku: 'LAT-007',
			fabricacao: new Date('2024-01-20'),
			validade: new Date('2026-01-20'),
			imagem_url: '/uploads/produtos/creme_leite.png',
			ativo: true,
			fornecedores_ids: [fornecedor2.id],
		},
		{
			nome: 'Requeijão Cremoso 220g',
			marca: 'Milkie',
			categoria: 'Laticínio',
			descricao: 'Requeijão cremoso tradicional',
			sku: 'LAT-008',
			fabricacao: new Date('2024-03-10'),
			validade: new Date('2026-03-10'),
			imagem_url: '/uploads/produtos/doce_leite.png',
			ativo: true,
			fornecedores_ids: [fornecedor2.id],
		},
		{
			nome: 'Queijo Parmesão Ralado 100g',
			marca: 'Milkie',
			categoria: 'Laticínio',
			descricao: 'Queijo parmesão ralado fino',
			sku: 'LAT-009',
			fabricacao: new Date('2024-01-05'),
			validade: new Date('2026-01-05'),
			imagem_url: '/uploads/produtos/queijo_ralado.png',
			ativo: true,
			fornecedores_ids: [fornecedor1.id],
		},
		{
			nome: 'Iogurte Grego 150g',
			marca: 'Milkie',
			categoria: 'Laticínio',
			descricao: 'Iogurte grego natural cremoso',
			sku: 'LAT-010',
			fabricacao: new Date('2024-02-01'),
			validade: new Date('2026-02-01'),
			imagem_url: '/uploads/produtos/iogurte_morango.png',
			ativo: true,
			fornecedores_ids: [fornecedor1.id, fornecedor3.id],
		}
	];

const produtos = [];
	for (const produtoInfo of produtosData) {
		const { fornecedores_ids, ...produtoData } = produtoInfo;
		
		const produto = await prisma.produtos.create({
			data: {
				...produtoData,
				fornecedores_ids: fornecedores_ids // Salvar IDs no campo JSON
			}
		});
		
		produtos.push({ ...produto, fornecedores_ids_temp: fornecedores_ids });
	}

	console.log(`✅ ${produtos.length} produtos criados\n`);

	// ==================== RELACIONAMENTO FORNECEDOR-PRODUTOS ====================
	console.log('🔗 Criando relacionamentos fornecedor-produtos...');
	for (const produto of produtos) {
		if (produto.fornecedores_ids_temp && Array.isArray(produto.fornecedores_ids_temp)) {
			for (const fornecedorId of produto.fornecedores_ids_temp) {
				await prisma.fornecedor_produtos.create({
					data: {
						fornecedor_id: fornecedorId,
						produto_id: produto.id,
					}
				});
			}
		}
	}
	
	const totalRelacionamentos = await prisma.fornecedor_produtos.count();
	console.log(`✅ ${totalRelacionamentos} relacionamentos criados\n`);

	// ==================== ESTOQUE ====================
	console.log('📊 Criando estoque...');
	const estoqueData = [];

	// Estoque da Matriz
estoqueData.push(
		{ produto_id: produtos[0].id, loja_id: lojaMatriz.id, preco: '5.90', quantidade: 100, valido_de: new Date() },
		{ produto_id: produtos[1].id, loja_id: lojaMatriz.id, preco: '6.50', quantidade: 80, valido_de: new Date() },
		{ produto_id: produtos[2].id, loja_id: lojaMatriz.id, preco: '18.90', quantidade: 50, valido_de: new Date() },
		{ produto_id: produtos[3].id, loja_id: lojaMatriz.id, preco: '4.50', quantidade: 120, valido_de: new Date() },
		{ produto_id: produtos[4].id, loja_id: lojaMatriz.id, preco: '22.90', quantidade: 60, valido_de: new Date() },
		{ produto_id: produtos[5].id, loja_id: lojaMatriz.id, preco: '12.90', quantidade: 45, valido_de: new Date() },
		{ produto_id: produtos[6].id, loja_id: lojaMatriz.id, preco: '7.90', quantidade: 70, valido_de: new Date() },
		{ produto_id: produtos[7].id, loja_id: lojaMatriz.id, preco: '9.90', quantidade: 55, valido_de: new Date() },
		{ produto_id: produtos[8].id, loja_id: lojaMatriz.id, preco: '8.90', quantidade: 90, valido_de: new Date() },
		{ produto_id: produtos[9].id, loja_id: lojaMatriz.id, preco: '5.50', quantidade: 100, valido_de: new Date() }
	);

	// Estoque da Filial 1
	estoqueData.push(
		{ produto_id: produtos[0].id, loja_id: lojaFilial1.id, preco: '5.90', quantidade: 60, valido_de: new Date() },
		{ produto_id: produtos[1].id, loja_id: lojaFilial1.id, preco: '6.50', quantidade: 50, valido_de: new Date() },
		{ produto_id: produtos[3].id, loja_id: lojaFilial1.id, preco: '4.50', quantidade: 70, valido_de: new Date() },
		{ produto_id: produtos[4].id, loja_id: lojaFilial1.id, preco: '22.90', quantidade: 40, valido_de: new Date() },
		{ produto_id: produtos[6].id, loja_id: lojaFilial1.id, preco: '7.90', quantidade: 45, valido_de: new Date() },
		{ produto_id: produtos[8].id, loja_id: lojaFilial1.id, preco: '8.90', quantidade: 60, valido_de: new Date() }
	);

	// Estoque da Filial 2
	estoqueData.push(
		{ produto_id: produtos[0].id, loja_id: lojaFilial2.id, preco: '5.90', quantidade: 55, valido_de: new Date() },
		{ produto_id: produtos[2].id, loja_id: lojaFilial2.id, preco: '18.90', quantidade: 35, valido_de: new Date() },
		{ produto_id: produtos[5].id, loja_id: lojaFilial2.id, preco: '12.90', quantidade: 30, valido_de: new Date() },
		{ produto_id: produtos[7].id, loja_id: lojaFilial2.id, preco: '9.90', quantidade: 40, valido_de: new Date() },
		{ produto_id: produtos[9].id, loja_id: lojaFilial2.id, preco: '5.50', quantidade: 65, valido_de: new Date() }
	);

	await prisma.estoque.createMany({ data: estoqueData });
	console.log(`✅ ${estoqueData.length} itens de estoque criados\n`);

	// ==================== RESUMO ====================
	console.log('\n═══════════════════════════════════════════════════');
	console.log('🎉 Seed concluído com sucesso!');
	console.log('═══════════════════════════════════════════════════');
	console.log('\n📋 RESUMO:');
	console.log(`  🏪 Lojas: ${3}`);
	console.log(`  👥 Funcionários: ${6}`);
	console.log(`  🔐 Usuários: ${6}`);
	console.log(`  🏭 Fornecedores: ${3}`);
	console.log(`  📦 Produtos: ${produtos.length}`);
	console.log(`  🔗 Relacionamentos Fornecedor-Produto: ${totalRelacionamentos}`);
	console.log(`  📊 Itens em Estoque: ${estoqueData.length}`);
	console.log('\n🔑 CREDENCIAIS DE ACESSO:');
	console.log('  ┌─────────────────────────────────────────┐');
	console.log('  │ ADMIN                                   │');
	console.log('  │ Username: admin                         │');
	console.log('  │ Senha: admin123                         │');
	console.log('  ├─────────────────────────────────────────┤');
	console.log('  │ GERENTES                                │');
	console.log('  │ Username: maria.gerente / joao.gerente  │');
	console.log('  │ Senha: gerente123                       │');
	console.log('  ├─────────────────────────────────────────┤');
	console.log('  │ CAIXAS                                  │');
	console.log('  │ Username: ana.caixa / pedro.caixa /     │');
	console.log('  │           carla.caixa                   │');
	console.log('  │ Senha: caixa123                         │');
	console.log('  └─────────────────────────────────────────┘');
	console.log('\n═══════════════════════════════════════════════════\n');
}

main()
	.catch((e) => {
		console.error('\n❌ Erro ao executar seed:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});