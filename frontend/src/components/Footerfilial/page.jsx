export default function Footer() {
  return (
    <footer className="w-full bg-[#F7FAFC] text-[#2A4E73] border-t border-[#2A4E73]" role="contentinfo">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          {/* Logo da Empresa */}
          <div className="flex flex-col items-center sm:items-start gap-3">
            <img
              src="/logomilkie.svg"
              alt="Logo milkie"
              className="h-16 w-auto object-contain"
            />
            <p className="text-sm max-w-xs">Os melhores produtos de laticínios para voce.</p>
          </div>

          {/* Navegação */}
          <div>
            <h4 className="text-[#2A4E73] font-semibold mb-3">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/filial/home" className="hover:text-[#AD343E] transition-colors" aria-label="Ir para a página inicial">
                  Home
                </a>
              </li>
              <li>
                <a href="/filial/funcionarios" className="hover:text-[#AD343E] transition-colors" aria-label="Ir para a página de funcionários">
                  Funcionários
                </a>
              </li>
              <li>
                <a href="/filial/produtos" className="hover:text-[#AD343E] transition-colors" aria-label="Ir para a de produtos">
                  Produtos
                </a>
              </li>
              <li>
                <a href="/filial/financeiro" className="hover:text-[#AD343E] transition-colors" aria-label="Ir para a seção de financeiro">
                  financeiro
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-[#2A4E73] font-semibold mb-3">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li><strong>Email:</strong> milkie@gmail.com</li>
              <li><strong>Suporte:</strong> milkiesuporte@gmail.com</li>
              <li><strong>Telefone:</strong> (11) 99887-1356</li>
            </ul>
          </div>

          {/* Redes sociais */}
          <div>
            <h4 className="text-[#2A4E73] font-semibold mb-3">Siga-nos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.instagram.com/" className="hover:text-[#AD343E] transition-colors" aria-label="Seguir no Instagram">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://br.linkedin.com/" className="hover:text-[#AD343E] transition-colors" aria-label="Seguir no LinkedIn">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/" className="hover:text-[#AD343E] transition-colors" aria-label="Seguir no Facebook">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-[#2A4E73] pt-4 text-center text-xs text-gray-400">
          © MILKIE. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}