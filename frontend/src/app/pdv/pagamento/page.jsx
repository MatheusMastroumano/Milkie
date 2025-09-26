"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Pagamento() {
    const router = useRouter();
    const [metodoPagamento, setMetodoPagamento] = useState('');
    const [valorTotal, setValorTotal] = useState(150.00); // Valor exemplo
    const [valorRecebido, setValorRecebido] = useState('');
    const [troco, setTroco] = useState(0);

    const calcularTroco = (recebido) => {
        const valor = parseFloat(recebido) || 0;
        const trocoCalculado = valor - valorTotal;
        setTroco(trocoCalculado > 0 ? trocoCalculado : 0);
    };

    const handleValorRecebidoChange = (e) => {
        const valor = e.target.value;
        setValorRecebido(valor);
        calcularTroco(valor);
    };

    const finalizarVenda = () => {
        if (metodoPagamento && (metodoPagamento !== 'dinheiro' || valorRecebido >= valorTotal)) {
            alert('Venda finalizada com sucesso!');
            router.push('/pdv');
        } else {
            alert('Preencha todos os campos obrigatórios');
        }
    };

    return (
        <>
            <main className="min-h-screen bg-[#FFFFFF] transition-all duration-300">
                <div className="max-w-4xl mx-auto px-1 sm:px-2 lg:px-3 xl:px-4 py-4">
                    {/* Botão de Retorno e Título */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => router.push('/pdv')}
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Voltar</span>
                        </button>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] text-center flex-1">
                            Método de Pagamento
                        </h1>
                        <div className="w-32"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Resumo da Venda */}
                        <div className="bg-[#F7FAFC] rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-semibold text-[#2A4E73] mb-4">Resumo da Venda</h2>
                            
                            {/* Itens do carrinho (exemplo) */}
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-sm text-gray-600">Queijo x2</span>
                                    <span className="text-sm font-medium text-[#2A4E73]">R$ 21,98</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-sm text-gray-600">Leite x1</span>
                                    <span className="text-sm font-medium text-[#2A4E73]">R$ 19,99</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-300 pt-4">
                                <div className="flex justify-between items-center text-lg font-bold text-[#2A4E73]">
                                    <span>Total:</span>
                                    <span>R$ {valorTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Seleção de Método de Pagamento */}
                        <div className="bg-[#F7FAFC] rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-semibold text-[#2A4E73] mb-4">Escolha o Método de Pagamento</h2>
                            
                            <div className="space-y-4">
                                {/* Dinheiro */}
                                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                                     onClick={() => setMetodoPagamento('dinheiro')}>
                                    <input
                                        type="radio"
                                        id="dinheiro"
                                        name="pagamento"
                                        value="dinheiro"
                                        checked={metodoPagamento === 'dinheiro'}
                                        onChange={(e) => setMetodoPagamento(e.target.value)}
                                        className="text-[#2A4E73] focus:ring-[#CFE8F9]"
                                    />
                                    <label htmlFor="dinheiro" className="flex items-center space-x-3 cursor-pointer flex-1">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="font-medium text-[#2A4E73]">Dinheiro</span>
                                            <p className="text-sm text-gray-600">Pagamento em espécie</p>
                                        </div>
                                    </label>
                                </div>

                                {/* Cartão de Débito */}
                                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                                     onClick={() => setMetodoPagamento('debito')}>
                                    <input
                                        type="radio"
                                        id="debito"
                                        name="pagamento"
                                        value="debito"
                                        checked={metodoPagamento === 'debito'}
                                        onChange={(e) => setMetodoPagamento(e.target.value)}
                                        className="text-[#2A4E73] focus:ring-[#CFE8F9]"
                                    />
                                    <label htmlFor="debito" className="flex items-center space-x-3 cursor-pointer flex-1">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-6 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="font-medium text-[#2A4E73]">Cartão de Débito</span>
                                            <p className="text-sm text-gray-600">Pagamento à vista</p>
                                        </div>
                                    </label>
                                </div>

                                {/* Cartão de Crédito */}
                                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                                     onClick={() => setMetodoPagamento('credito')}>
                                    <input
                                        type="radio"
                                        id="credito"
                                        name="pagamento"
                                        value="credito"
                                        checked={metodoPagamento === 'credito'}
                                        onChange={(e) => setMetodoPagamento(e.target.value)}
                                        className="text-[#2A4E73] focus:ring-[#CFE8F9]"
                                    />
                                    <label htmlFor="credito" className="flex items-center space-x-3 cursor-pointer flex-1">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-6 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="font-medium text-[#2A4E73]">Cartão de Crédito</span>
                                            <p className="text-sm text-gray-600">Pagamento parcelado</p>
                                        </div>
                                    </label>
                                </div>

                                {/* PIX */}
                                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                                     onClick={() => setMetodoPagamento('pix')}>
                                    <input
                                        type="radio"
                                        id="pix"
                                        name="pagamento"
                                        value="pix"
                                        checked={metodoPagamento === 'pix'}
                                        onChange={(e) => setMetodoPagamento(e.target.value)}
                                        className="text-[#2A4E73] focus:ring-[#CFE8F9]"
                                    />
                                    <label htmlFor="pix" className="flex items-center space-x-3 cursor-pointer flex-1">
                                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="font-medium text-[#2A4E73]">PIX</span>
                                            <p className="text-sm text-gray-600">Pagamento instantâneo</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Campo para valor recebido (apenas para dinheiro) */}
                            {metodoPagamento === 'dinheiro' && (
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <label htmlFor="valorRecebido" className="block text-sm font-medium text-[#2A4E73] mb-2">
                                        Valor Recebido (R$)
                                    </label>
                                    <input
                                        type="number"
                                        id="valorRecebido"
                                        value={valorRecebido}
                                        onChange={handleValorRecebidoChange}
                                        step="0.01"
                                        min="0"
                                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                                        placeholder="0,00"
                                    />
                                    {troco > 0 && (
                                        <div className="mt-2 p-2 bg-green-100 rounded-md">
                                            <span className="text-sm font-medium text-green-800">
                                                Troco: R$ {troco.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Botões de Ação */}
                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={finalizarVenda}
                                    className="w-full px-4 py-3 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                                >
                                    Finalizar Venda
                                </button>
                                <button
                                    onClick={() => router.push('/pdv/produtos')}
                                    className="w-full px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                                >
                                    Voltar aos Produtos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
