"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function PDV() {
    const router = useRouter();

    return (
        <>
            <main className="min-h-screen bg-[#FFFFFF] transition-all duration-300">
                <div className="max-w-4xl mx-auto px-1 sm:px-2 lg:px-3 xl:px-4 py-4">
                    {/* Barra superior */}
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Início</span>
                        </button>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] text-center flex-1">
                            Sistema PDV
                        </h1>
                        <div className="w-32"></div>
                    </div>

                    {/* Conteúdo principal */}
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-semibold text-[#2A4E73] mb-4">
                            Escolha o modo de operação
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Selecione entre o modo manual para funcionários ou auto atendimento para clientes
                        </p>
                    </div>

                    {/* Cards de seleção */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {/* PDV Manual */}
                        <div 
                            onClick={() => router.push('/pdv/manual')}
                            className="bg-[#F7FAFC] rounded-lg shadow-md p-8 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-[#2A4E73] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#AD343E] transition-colors">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-[#2A4E73] mb-3">
                                    PDV Manual
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Modo operado por funcionários com acesso completo às funcionalidades do sistema
                                </p>
                                <ul className="text-sm text-gray-500 text-left space-y-1">
                                    <li>• Controle de estoque</li>
                                    <li>• Aplicação de descontos</li>
                                    <li>• Gestão de preços</li>
                                    <li>• Relatórios detalhados</li>
                                </ul>
                            </div>
                        </div>

                        {/* Auto Atendimento */}
                        <div 
                            onClick={() => router.push('/pdv/auto-atendimento')}
                            className="bg-[#F7FAFC] rounded-lg shadow-md p-8 border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-[#2A4E73] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#AD343E] transition-colors">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-[#2A4E73] mb-3">
                                    Auto Atendimento
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Modo simplificado para clientes realizarem suas próprias compras
                                </p>
                                <ul className="text-sm text-gray-500 text-left space-y-1">
                                    <li>• Interface simplificada</li>
                                    <li>• Seleção de produtos</li>
                                    <li>• Cálculo automático</li>
                                    <li>• Pagamento integrado</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Informações adicionais */}
                    <div className="mt-12 text-center">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
                            <p className="text-sm text-blue-800">
                                <strong>Dica:</strong> O modo manual oferece funcionalidades completas para funcionários, 
                                enquanto o auto atendimento é otimizado para uma experiência rápida e intuitiva para os clientes.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}