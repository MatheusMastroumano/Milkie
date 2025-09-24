"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGestaoOpen, setIsGestaoOpen] = useState(false);
  const [isProdutosOpen, setIsProdutosOpen] = useState(false);
  const [isVendasOpen, setIsVendasOpen] = useState(false);
  const [isFinanceiroOpen, setIsFinanceiroOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const navRef = useRef(null);

  // Função para fechar todos os dropdowns e abrir apenas o selecionado
  const toggleDropdown = (dropdown) => {
    setIsGestaoOpen(dropdown === 'Gestão Operacional' ? !isGestaoOpen : false);
    setIsProdutosOpen(dropdown === 'Produtos e Fornecimento' ? !isProdutosOpen : false);
    setIsVendasOpen(dropdown === 'Vendas e Atendimento' ? !isVendasOpen : false);
    setIsFinanceiroOpen(dropdown === 'Financeiro e Análise' ? !isFinanceiroOpen : false);
    setIsUserMenuOpen(dropdown === 'User' ? !isUserMenuOpen : false);
  };

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        toggleDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update body padding and overflow for mobile menu
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      if (isMenuOpen) {
        document.body.style.overflow = 'hidden';
        document.body.classList.add('navbar-open');
      } else {
        document.body.style.overflow = 'unset';
        document.body.classList.remove('navbar-open');
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'unset';
        document.body.classList.remove('navbar-open');
      }
    };
  }, [isMenuOpen]);

  // Fechar menu em mudanças de tela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      name: 'Gestão Operacional',
      shortName: 'Gestão',
      subItems: [
        {
          name: 'Lojas: Cadastrar/Editar/Excluir',
          shortName: 'Lojas',
          href: '/matriz/lojas',
          icon: (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
        },
        {
          name: 'funcionários: Cadastrar/Editar/Excluir',
          shortName: 'funcionários',
          href: '/matriz/funcionarios',
          icon: (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          ),
        },
        {
          name: 'Configurações do Sistema',
          shortName: 'Configurações',
          href: '/settings',
          icon: (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        },
      ],
    },
    {
      name: 'Produtos e Fornecimento',
      shortName: 'Produtos',
      subItems: [
        {
          name: 'Produtos: Cadastrar/Editar/Excluir',
          shortName: 'Produtos',
          href: '/products/manage',
          icon: (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          ),
        },
        {
          name: 'Fornecedores: Cadastrar/Editar',
          shortName: 'Fornecedores',
          href: '/suppliers/manage',
          icon: (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          ),
        },
        {
          name: 'Estoque: Consultar/Ajustar/Movimentar',
          shortName: 'Estoque',
          href: '/stock/manage',
          icon: (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          ),
        },
      ],
    },
    {
      name: 'Vendas e Atendimento',
      shortName: 'Vendas',
      subItems: [
        {
          name: 'PDV/Vendas: Visualizar Vendas',
          shortName: 'PDV/Vendas',
          href: '/sales/view',
          icon: (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
      ],
    },
    {
      name: 'Financeiro e Análise',
      shortName: 'Financeiro',
      subItems: [
        {
          name: 'Financeiro: Registrar Despesas, Pagamentos, Folha',
          shortName: 'Financeiro',
          href: '/finance/manage',
          icon: (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        {
          name: 'Relatórios: Gerar Relatórios',
          shortName: 'Relatórios',
          href: '/reports/generate',
          icon: (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-6m3 6v-3m-3-9a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ),
        },
      ],
    },
  ];

  const userMenuItems = [
    {
      name: 'Ver Perfil',
      href: '/profile',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      name: 'Sair',
      href: '/logout',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h3a3 3 0 013 3v1" />
        </svg>
      ),
    },
  ];

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <>
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-[#2A4E73] text-[#FFFFFF] shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-center h-14 sm:h-16">
            {/* Logo and Brand */}
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 min-w-0 flex-shrink-0">
              <img 
                src="/milkie.svg" 
                className="h-15 sm:h-18 w-18" 
                alt="Laticínios Sabor" 
              />
              
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center justify-center flex-grow gap-2 xl:gap-4">
              <ul className="flex justify-center gap-1 xl:gap-2">
                {menuItems.map((item) => (
                  <li key={item.name} className="relative">
                    <button
                      className="flex items-center justify-center px-2 xl:px-3 py-2 text-sm xl:text-base font-medium text-[#FFFFFF] rounded-md hover:bg-[#AD343E] hover:text-[#CFE8F9] transition-all duration-200 whitespace-nowrap"
                      onClick={() => toggleDropdown(item.name)}
                    >
                      <span className="xl:mr-2">{item.shortName}</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {(item.name === 'Gestão Operacional' && isGestaoOpen) ||
                    (item.name === 'Produtos e Fornecimento' && isProdutosOpen) ||
                    (item.name === 'Vendas e Atendimento' && isVendasOpen) ||
                    (item.name === 'Financeiro e Análise' && isFinanceiroOpen) ? (
                      <ul className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 xl:w-64 bg-[#FFFFFF] rounded-lg shadow-xl divide-y divide-gray-100 animate-fadeIn z-50 border border-gray-200">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              href={subItem.href}
                              className="flex items-center px-3 xl:px-4 py-2.5 xl:py-3 text-sm xl:text-base text-gray-700 hover:bg-gray-50 hover:text-[#2A4E73] transition-colors first:rounded-t-lg last:rounded-b-lg"
                              onClick={() => {
                                setIsMenuOpen(false);
                                toggleDropdown(null);
                              }}
                            >
                              <span className="mr-2 xl:mr-3 text-gray-500">{subItem.icon}</span>
                              <span className="truncate">{subItem.shortName}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
              
              {/* User Profile and Dropdown */}
              <div className="relative ml-2 xl:ml-4">
                <button
                  className="flex items-center justify-center text-sm xl:text-base font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] px-2 xl:px-3 py-2 hover:bg-[#AD343E] transition-colors"
                  onClick={() => toggleDropdown('User')}
                >
                  <span className="sr-only">Abrir menu do usuário</span>
                  <img
                    src="/profile-image.jpg" // Substitua por sua imagem de perfil
                    className="w-6 h-6 xl:w-7 xl:h-7 rounded-full bg-[#AD343E] object-cover"
                    alt="Foto de Perfil"
                  
                  />
                  <svg className="w-4 h-4 ml-1 text-[#FFFFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 xl:w-48 bg-[#FFFFFF] rounded-lg shadow-xl divide-y divide-gray-100 animate-fadeIn z-50 border border-gray-200">
                    <ul className="py-2">
                      {userMenuItems.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className="flex items-center px-3 xl:px-4 py-2.5 xl:py-3 text-sm xl:text-base text-gray-700 hover:bg-gray-50 hover:text-[#2A4E73] transition-colors"
                            onClick={() => {
                              setIsMenuOpen(false);
                              toggleDropdown(null);
                            }}
                          >
                            <span className="mr-2 xl:mr-3 text-gray-500">{item.icon}</span>
                            <span>{item.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden absolute right-3 sm:right-4">
              <button
                className="inline-flex items-center justify-center p-2 sm:p-3 w-10 h-10 sm:w-12 sm:h-12 text-sm sm:text-base text-[#FFFFFF] rounded-lg hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                  toggleDropdown(null);
                }}
              >
                <span className="sr-only">Abrir menu principal</span>
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-14 sm:top-16 bg-black bg-opacity-50 z-40">
            <div className="bg-[#2A4E73] h-full w-full sm:w-80 max-w-[20rem] ml-auto overflow-y-auto animate-slideIn mobile-menu-container">
              <div className="px-4 sm:px-6 pt-4 pb-6 space-y-2">
                {menuItems.map((item) => (
                  <div key={item.name} className="border-b border-[#3A5A7A] pb-2 mb-2 last:border-b-0">
                    <button
                      className="flex items-center justify-between w-full px-4 py-3 text-base sm:text-lg font-medium text-[#FFFFFF] rounded-md hover:bg-[#AD343E] hover:text-[#CFE8F9] transition-colors"
                      onClick={() => toggleDropdown(item.name)}
                    >
                      <span>{item.name}</span>
                      <svg 
                        className={`w-5 h-5 transition-transform duration-200 ${
                          (item.name === 'Gestão Operacional' && isGestaoOpen) ||
                          (item.name === 'Produtos e Fornecimento' && isProdutosOpen) ||
                          (item.name === 'Vendas e Atendimento' && isVendasOpen) ||
                          (item.name === 'Financeiro e Análise' && isFinanceiroOpen)
                            ? 'rotate-180' 
                            : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {(item.name === 'Gestão Operacional' && isGestaoOpen) ||
                    (item.name === 'Produtos e Fornecimento' && isProdutosOpen) ||
                    (item.name === 'Vendas e Atendimento' && isVendasOpen) ||
                    (item.name === 'Financeiro e Análise' && isFinanceiroOpen) ? (
                      <ul className="mt-2 space-y-1 animate-fadeIn">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              href={subItem.href}
                              className="flex items-center px-6 py-3 text-sm sm:text-base text-[#CFE8F9] rounded-md hover:bg-[#AD343E] hover:text-[#FFFFFF] transition-colors ml-4 border-l-2 border-[#CFE8F9] border-opacity-30"
                              onClick={() => {
                                setIsMenuOpen(false);
                                toggleDropdown(null);
                              }}
                            >
                              <span className="mr-3 text-[#CFE8F9]">{subItem.icon}</span>
                              <span className="truncate">{subItem.shortName}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
                
                {/* User Section in Mobile */}
                <div className="border-t border-[#3A5A7A] pt-4 mt-4">
                  <div className="flex items-center justify-start space-x-3 mb-4 px-4">
                    <div className="flex-shrink-0">
                      <img
                        src="/profile-image.jpg" // Substitua por sua imagem de perfil
                        className="w-10 h-10 rounded-full bg-[#AD343E] object-cover"
                        alt="Foto de Perfil"
                 
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-base font-medium text-[#FFFFFF] truncate">John Doe</span>
                      <span className="text-sm text-[#CFE8F9] truncate">Administrator</span>
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {userMenuItems.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="flex items-center px-4 py-3 text-base text-[#FFFFFF] rounded-md hover:bg-[#AD343E] hover:text-[#CFE8F9] transition-colors"
                          onClick={() => {
                            setIsMenuOpen(false);
                            toggleDropdown(null);
                          }}
                        >
                          <span className="mr-3">{item.icon}</span>
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        /* Breakpoint específico para tablets */
        @media (min-width: 768px) and (max-width: 1023px) {
          .navbar-tablet {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }

        /* Melhor scroll em mobile */
        @media (max-width: 1023px) {
          .mobile-menu-container {
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
          }
        }
      `}</style>
    </>
  );
}