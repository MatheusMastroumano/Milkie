import Filter from "bad-words";

// Cria o filtro padrão (inglês)
const filtro = new Filter();

// Adiciona palavrões em português manualmente
filtro.addWords(
	// TODO:
	// adicionar lista de palavrões no .env depois
);

// Middleware de verificação
export default function verificarPalavroes(req, res, next) {
	try {
		// Transforma o body inteiro em texto plano
		const textoPlano = JSON.stringify(req.body || {}).toLowerCase();

		// Verifica se contém palavrões
		const contem = filtro.isProfane(textoPlano);

		if (contem) {
			return res.status(400).json({
				mensagem: "O texto contém palavras impróprias. Por favor, revise o conteúdo.",
			});
		}

		next(); // tudo certo
	} catch (err) {
		console.error("Erro ao verificar palavrões:", err.message);
		res.status(500).json({ mensagem: "Erro ao verificar conteúdo impróprio." });
	}
}
