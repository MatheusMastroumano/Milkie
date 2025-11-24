import fetch from 'node-fetch';
import { CookieJar } from 'tough-cookie';
import fetchCookie from 'fetch-cookie';

const API_URL = process.env.API_URL || 'http://localhost:8080';
const USERNAME = process.env.TEST_USER || 'admin';
const PASSWORD = process.env.TEST_PASS || 'admin123';

const jar = new CookieJar();
const fetchWithCookies = fetchCookie(fetch, jar);

async function login() {
	const res = await fetchWithCookies(`${API_URL}/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username: USERNAME, senha: PASSWORD }),
	});
	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Login falhou: ${res.status} ${body}`);
	}
	console.log('✅ Login OK');
}

async function get(path) {
	const res = await fetchWithCookies(`${API_URL}${path}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	});
	const body = await res.text().catch(() => '');
	console.log(`${res.ok ? '✅' : '❌'} GET ${path} -> ${res.status}`);
	if (!res.ok) console.log(body);
	return { res, body };
}

async function post(path, data) {
	const res = await fetchWithCookies(`${API_URL}${path}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	const body = await res.text().catch(() => '');
	console.log(`${res.ok ? '✅' : '❌'} POST ${path} -> ${res.status}`);
	if (!res.ok) console.log(body);
	return { res, body };
}

async function put(path, data) {
	const res = await fetchWithCookies(`${API_URL}${path}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	const body = await res.text().catch(() => '');
	console.log(`${res.ok ? '✅' : '❌'} PUT ${path} -> ${res.status}`);
	if (!res.ok) console.log(body);
	return { res, body };
}

async function del(path) {
	const res = await fetchWithCookies(`${API_URL}${path}`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
	});
	const body = await res.text().catch(() => '');
	console.log(`${res.ok ? '✅' : '❌'} DELETE ${path} -> ${res.status}`);
	if (!res.ok) console.log(body);
	return { res, body };
}

async function run() {
	await login();

	// Rotas de leitura
	await get('/lojas');
	await get('/usuarios');
	await get('/produtos');
	await get('/estoque');
	await get('/fornecedores');
	await get('/vendas');
	await get('/venda-itens');
	await get('/venda-pagamentos');
	await get('/caixa');

	// Exercitar ciclo de produto básico
	const novoProduto = {
		nome: 'Produto Teste',
		marca: 'Marca X',
		categoria: 'Categoria Y',
		descricao: 'Descrição do produto',
		sku: `SKU-${Date.now()}`,
		fabricacao: new Date().toISOString(),
		validade: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
		ativo: true,
	};
	const { res: resCreate, body: bodyCreate } = await post('/produtos', novoProduto);
	let created;
	try {
		created = resCreate.ok ? JSON.parse(bodyCreate).produto : null;
	} catch {}

	if (created?.id) {
		await put(`/produtos/${created.id}`, {
			...novoProduto,
			nome: 'Produto Teste Editado',
			ativo: true,
		});
		// cria estoque para a loja 1
		await post('/estoque', {
			produto_id: created.id,
			loja_id: 1,
			quantidade: 5,
			preco: 9.9,
			valido_ate: null,
		});
		// busca detalhe
		await get(`/produtos/${created.id}`);
		// remove
		await del(`/produtos/${created.id}`);
	}

	console.log('🧪 Testes finalizados.');
}

run().catch((err) => {
	console.error(err);
	process.exit(1);
});



