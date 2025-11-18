"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from "@/components/Headerfilial/page";
import { apiJson } from "@/lib/api";

export default function Produtos() {
  const router = useRouter();
  const [lojaId, setLojaId] = useState(null);
  const [lojaNome, setLojaNome] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Obter loja do usuário logado
  useEffect(() => {
    (async () => {
      try {
        const auth = await apiJson('/auth/check-auth');
        const id = Number(auth?.user?.loja_id) || null;
        setLojaId(id);
        try {
          const lojas = await apiJson('/lojas');
          const loja = (lojas.lojas || []).find((l) => Number(l.id) === id);
          if (loja) setLojaNome(loja.nome);
        } catch {}
      } catch (e) {
        setErro(e?.message || 'Falha ao identificar loja do usuário');
      }
    })();
  }, []);

  // Carregar produtos da filial
  useEffect(() => {
    if (!lojaId) return;
    (async () => {
      try {
        setLoading(true);
        // No backend, a matriz usa /produtos?loja_id= para retornar disponibilidade por loja
        const res = await apiJson(`/produtos?loja_id=${lojaId}`);
        const lista = res.produtos || res || [];
        setProdutos(lista);
      } catch (e) {
        setErro(e?.message || 'Erro ao carregar produtos');
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [lojaId]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFFFF] pt-20 pb-20 flex flex-col items-center justify-start transition-all duration-300">
  <div className="w-full max-w-3xl px-4 flex flex-col items-center text-center">

          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-6 text-center">
            Produtos - {lojaNome || `Loja ${lojaId || ''}`}
          </h1>

          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Lista de Produtos disponíveis na sua loja
            </h2>

            {erro && (
              <p className="text-center text-red-600 mb-4">{erro}</p>
            )}

            {loading ? (
              <p className="text-[#2A4E73] text-center">Carregando...</p>
            ) : produtos.length === 0 ? (
              <p className="text-[#2A4E73] text-center">Nenhum produto encontrado para esta loja.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base text-[#2A4E73] border-collapse">
                  <thead>
                    <tr className="bg-[#2A4E73] text-[#FFFFFF]">
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left rounded-tl-md">SKU</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Nome</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Marca</th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">Categoria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map((p) => (
                      <tr key={p.id} className="border-b border-gray-200 hover:bg-[#CFE8F9]">
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{p.sku}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 truncate max-w-[180px]">{p.nome}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{p.marca || '-'}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">{p.categoria || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}