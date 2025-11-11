import supabase from '../config/supabase.js';

export default async function uploadImagem(arquivo, pasta = 'geral') {
    if (!arquivo) return null;

    const caminho = `${pasta}/${Date.now()}_${arquivo.name}`;

    const { data, err } = await supabase.storage
        .from('imagens')
        .upload(caminho, arquivo.data, {
            contentType: arquivo.mimetype,
            upsert: true,
        });

    if (err) throw new Error('Erro ao enviar imagem: ', err.message);

    const { data: publicUrl } = supabase.storage
        .from('imagens')
        .getPublicUrl(data.path);

    return publicUrl.publicUrl;
}
