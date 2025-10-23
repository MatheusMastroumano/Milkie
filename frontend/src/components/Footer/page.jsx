export default function Footer() {
  return (
    <footer className="w-full bg-[#F7FAFC] text-[#2A4E73] border-t border-[#2A4E73]" role="contentinfo">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          {/* Logo da Empresa */}
          <div className="flex flex-col items-center sm:items-start gap-3">
            <img
              src="/MEDGO_logo.png"
              alt="Logo MEDGO"
              className="h-16 w-auto object-contain"
            />
            <p className="text-sm max-w-xs">Cuidando da sua saúde com tecnologia.</p>
          </div>

          {/* Navegação */}
          <div>
            <h4 className="text-[#2A4E73] font-semibold mb-3">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/home" className="hover:text-[#AD343E] transition-colors" aria-label="Ir para a página inicial">
                  Home
                </a>
              </li>
              <li>
                <a href="/agenda" className="hover:text-[#AD343E] transition-colors" aria-label="Ir para a página de agenda">
                  Agenda
                </a>
              </li>
              <li>
                <a href="/sobrenos" className="hover:text-[#AD343E] transition-colors" aria-label="Ir para a página sobre nós">
                  Sobre nós
                </a>
              </li>
              <li>
                <a href="/sobrenos#faq" className="hover:text-[#AD343E] transition-colors" aria-label="Ir para a seção de perguntas frequentes">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-[#2A4E73] font-semibold mb-3">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li><strong>Email:</strong> medgo@gmail.com</li>
              <li><strong>Suporte:</strong> medgosuporte@gmail.com</li>
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
          © MEDGO. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}