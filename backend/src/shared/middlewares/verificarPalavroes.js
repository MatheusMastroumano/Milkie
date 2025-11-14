import { Filter } from "bad-words";
import 'dotenv/config';

// cria filtro padrão (inglês)
const filtro = new Filter();

// carrega lista PT-BR do .env usando SPLIT
const listaPTBR = (process.env.BAD_WORDS || "")
	.split(",")               // divide por vírgula
	.map(p => p.trim())       // remove espaços extras
	.filter(Boolean);         // remove strings vazias

// adiciona ao filtro
filtro.addWords(...listaPTBR);

export default function verificarPalavroes(req, res, next) {
	try {
		const textoPlano = JSON.stringify(req.body || {}).toLowerCase();

		if (filtro.isProfane(textoPlano)) {
			return res.status(400).json({
				mensagem: "O texto contém palavras impróprias. Por favor, revise o conteúdo.",
			});
		}

		next();
	} catch (err) {
		console.error("Erro ao verificar palavrões:", err.message);
		res.status(500).json({ mensagem: "Erro ao verificar conteúdo impróprio." });
	}
}
