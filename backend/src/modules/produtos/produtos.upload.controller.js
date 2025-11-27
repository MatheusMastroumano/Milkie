import upload from '../../shared/config/upload.js';

// Middleware de upload (single = um arquivo, campo 'imagem')
export const uploadImagem = upload.single('imagem');

// Controller para processar o upload
export async function uploadImagemController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ mensagem: 'Nenhuma imagem foi enviada' });
    }

    // Retorna a URL da imagem
    const imagemUrl = `/uploads/produtos/${req.file.filename}`;
    
    res.status(200).json({ 
      mensagem: 'Imagem enviada com sucesso',
      imagem_url: imagemUrl 
    });
  } catch (error) {
    console.error('Erro ao fazer upload da imagem: ', error.message);
    res.status(500).json({ 
      mensagem: 'Erro ao fazer upload da imagem', 
      erro: error.message 
    });
  }
}



