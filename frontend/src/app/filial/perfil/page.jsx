"use client"

import { useEffect, useState } from 'react';
import Header from '@/components/Headerfilial/page';
import { apiJson } from '@/lib/api';

export default function PerfilFilial() {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [lojaNome, setLojaNome] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const auth = await apiJson('/auth/check-auth');
        if (!auth?.authenticated) {
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        const user = auth.user || {};
        setUsuario(user);

        // Buscar nome da loja
        if (user?.loja_id) {
          try {
            const lojasResp = await apiJson('/lojas');
            const lojas = lojasResp?.lojas || [];
            const loja = lojas.find((l) => Number(l.id) === Number(user.loja_id));
            if (loja) setLojaNome(loja.nome);
          } catch {
            // ignora erro ao buscar lojas; exibiremos apenas o id
          }
        }
      } catch (e) {
        setErro(e?.message || 'Falha ao carregar perfil');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFFFF] pt-14 sm:pt-16 transition-all duration-300">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-6 text-center">
            Meu Perfil
          </h1>

          {erro && (
            <p className="text-center text-red-600 mb-4">{erro}</p>
          )}

          {loading ? (
            <p className="text-[#2A4E73] text-center">Carregando...</p>
          ) : (
            <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <span className="block text-sm text-gray-500">Usuário</span>
                  <span className="text-base sm:text-lg text-[#2A4E73] font-semibold">
                    {usuario?.username || '-'}
                  </span>
                </div>
                <div>
                  <span className="block text-sm text-gray-500">Função</span>
                  <span className="text-base sm:text-lg text-[#2A4E73] font-semibold capitalize">
                    {usuario?.funcao || '-'}
                  </span>
                </div>
                <div>
                  <span className="block text-sm text-gray-500">Loja</span>
                  <span className="text-base sm:text-lg text-[#2A4E73] font-semibold">
                    {lojaNome || (usuario?.loja_id ? `Loja ${usuario.loja_id}` : '-')}
                  </span>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

