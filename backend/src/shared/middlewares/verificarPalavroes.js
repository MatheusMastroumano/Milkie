// middleware/verificarPalavroes.js
import { Filter } from "bad-words";
import { cuss as cussPt } from "cuss/pt"; // cuss/pt exporta um objeto com as palavras em pt

// cria filtro base (inglês) — mantém suporte a inglês também
const filtro = new Filter();

// pega as chaves do objeto cuss (são as palavras) -> array
const palavrasPt = Object.keys(cussPt || {});

// normaliza (minusculas, remove acentos) e remove duplicatas
const normaliza = (s) =>
	String(s || "")
		.toLowerCase()
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "");

// lista final = palavras portuguesas normalizadas (sem acento)
const listaPTBR = [...new Set(palavrasPt.map(normaliza))].filter(Boolean);

// adiciona ao filtro — adicionamos as formas normalizadas
filtro.addWords(...listaPTBR);

// função auxiliar: normaliza o texto de entrada (remove acentos, mantém espaços)
function limparTextoParaChecagem(obj) {
	const raw = JSON.stringify(obj || {});
	// transforma em minusculas, remove acentos e substitui tudo que não for letra/numero por espaço
	return raw
		.toLowerCase()
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.replace(/[^a-z0-9]+/g, " ");
}

// middleware final
export default function verificarPalavroes(req, res, next) {
	try {
		const textoPlano = limparTextoParaChecagem(req.body);

		// isProfane trabalha por palavras — agora com entrada normalizada captura variações básicas
		if (filtro.isProfane(textoPlano)) {
			return res.status(400).json({
				mensagem: "O texto contém palavras impróprias. Por favor, revise o conteúdo.",
			});
		}

		next();
	} catch (err) {
		console.error("Erro ao verificar palavrões:", err);
		res.status(500).json({ mensagem: "Erro ao verificar conteúdo impróprio." });
	}
}
