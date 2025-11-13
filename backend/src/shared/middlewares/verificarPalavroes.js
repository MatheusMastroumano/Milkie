import Filter from "bad-words";
import BadWordsPTBR from "bad-words-pt-br";

const filtroEN = new Filter();
const filtroPT = new BadWordsPTBR();

// Middleware de verificação
export default function verificarPalavroes(req, res, next) {
  try {
    const textoPlano = JSON.stringify(req.body).toLowerCase();

    const contemIngles = filtroEN.isProfane(textoPlano);
    const contemPortugues = filtroPT.isProfane(textoPlano);

    if (contemIngles || contemPortugues) {
      return res.status(400).json({
        mensagem: "O texto contém palavras impróprias. Por favor, revise o conteúdo.",
      });
    }

    next(); // tudo ok, segue pra próxima função
  } catch (err) {
    console.error("Erro ao verificar palavrões:", err.message);
    res.status(500).json({ mensagem: "Erro ao verificar conteúdo impróprio" });
  }
}
