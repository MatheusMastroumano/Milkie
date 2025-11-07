"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function Pagamento() {
    const router = useRouter();
    const [metodoPagamento, setMetodoPagamento] = useState('');
    const [itens, setItens] = useState([]);
    const [valorTotal, setValorTotal] = useState(0);
    const [valorRecebido, setValorRecebido] = useState('');
    const [troco, setTroco] = useState(0);
    const [loading, setLoading] = useState(false);
    const [lojaId, setLojaId] = useState(null);
    const [usuarioId, setUsuarioId] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const raw = localStorage.getItem('pdv_cart');
                if (raw) {
                    const parsed = JSON.parse(raw);
                    setItens(parsed.itens || []);
                    const total = (parsed.total != null) ? parsed.total : (parsed.itens || []).reduce((t, i) => t + i.preco * i.quantidade, 0);
                    setValorTotal(total);
                }
                
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                setLojaId(user.loja_id || 1);
                setUsuarioId(user.id || 1);
            } catch (_) {}
        }
    }, []);

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

    const finalizarVenda = async () => {
        const pagamentoOk = metodoPagamento && (metodoPagamento !== 'dinheiro' || parseFloat(valorRecebido || '0') >= valorTotal);
        if (!pagamentoOk) {
            alert('Preencha os dados de pagamento corretamente.');
            return;
        }
        
        if (!lojaId || !usuarioId) {
            alert('Erro: Loja ou usuário não identificado.');
            return;
        }
        
        if (itens.length === 0) {
            alert('Carrinho vazio. Adicione itens antes de finalizar.');
            return;
        }
        
        try {
            setLoading(true);
            
            // Mapear método de pagamento para o enum do backend
            const metodoMap = {
                'dinheiro': 'dinheiro',
                'debito': 'cartaodebito',
                'credito': 'cartaocredito',
                'pix': 'pix'
            };
            
            const metodoBackend = metodoMap[metodoPagamento] || 'dinheiro';
            
            // Criar a venda
            const vendaResponse = await fetch(`${API_URL}/vendas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    loja_id: lojaId,
                    usuario_id: usuarioId,
                    comprador_cpf: null,
                    valor_total: valorTotal
                })
            });
            
            if (!vendaResponse.ok) {
                const error = await vendaResponse.json();
                throw new Error(error.mensagem || 'Erro ao criar venda');
            }
            
            const vendaData = await vendaResponse.json();
            const vendaId = vendaData.venda.id;
            
            // Criar os itens da venda
            const itensPromises = itens.map(item => {
                const subtotal = parseFloat(item.preco) * parseFloat(item.quantidade);
                return fetch(`${API_URL}/venda-itens`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        venda_id: vendaId,
                        produto_id: parseInt(item.id),
                        quantidade: parseFloat(item.quantidade),
                        preco_unitario: parseFloat(item.preco),
                        subtotal: subtotal
                    })
                }).then(r => {
                    if (!r.ok) {
                        return r.json().then(err => { throw new Error(err.mensagem || 'Erro ao criar item'); });
                    }
                    return r.json();
                });
            });
            
            const itensResults = await Promise.all(itensPromises);
            console.log('Itens criados:', itensResults);
            
            // Criar o pagamento
            const pagamentoResponse = await fetch(`${API_URL}/venda-pagamentos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    venda_id: vendaId,
                    metodo: metodoBackend,
                    valor: parseFloat(valorTotal)
                })
            });
            
            if (!pagamentoResponse.ok) {
                const error = await pagamentoResponse.json();
                throw new Error(error.mensagem || 'Erro ao criar pagamento');
            }
            
            const pagamentoData = await pagamentoResponse.json();
            console.log('Pagamento criado:', pagamentoData);
            
            // Limpar carrinho
            if (typeof window !== 'undefined') {
                localStorage.removeItem('pdv_cart');
            }
            
            alert('Venda finalizada com sucesso!');
            router.push('/matriz/pdv');
        } catch (error) {
            console.error('Erro ao finalizar venda:', error);
            alert(`Erro ao finalizar venda: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <main className="min-h-screen bg-[#FFFFFF] transition-all duration-300">
                <div className="max-w-4xl mx-auto px-1 sm:px-2 lg:px-3 xl:px-4 py-4">
                    {/* Botão de Retorno e Título */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => router.back()}
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

                            <div className="space-y-3 mb-4">
                                {itens.length === 0 ? (
                                    <p className="text-sm text-[#2A4E73]">Nenhum item no carrinho.</p>
                                ) : (
                                    itens.map((i) => (
                                        <div key={i.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                                            <span className="text-sm text-gray-600">{i.nome} x{i.quantidade}</span>
                                            <span className="text-sm font-medium text-[#2A4E73]">R$ {(i.preco * i.quantidade).toFixed(2)}</span>
                                        </div>
                                    ))
                                )}
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
                                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setMetodoPagamento('dinheiro')}>
                                    <input type="radio" id="dinheiro" name="pagamento" value="dinheiro" checked={metodoPagamento === 'dinheiro'} onChange={(e) => setMetodoPagamento(e.target.value)} className="text-[#2A4E73] focus:ring-[#CFE8F9] checked:accent-[#AD343E]" />
                                    <label htmlFor="dinheiro" className="flex items-center space-x-3 cursor-pointer flex-1">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">💵</div>
                                        <div>
                                            <span className="font-medium text-[#2A4E73]">Dinheiro</span>
                                            <p className="text-sm text-gray-600">Pagamento em espécie</p>
                                        </div>
                                    </label>
                                </div>

                                {/* Cartão de Débito */}
                                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setMetodoPagamento('debito')}>
                                    <input type="radio" id="debito" name="pagamento" value="debito" checked={metodoPagamento === 'debito'} onChange={(e) => setMetodoPagamento(e.target.value)} className="text-[#2A4E73] focus:ring-[#CFE8F9] checked:accent-[#AD343E]" />
                                    <label htmlFor="debito" className="flex items-center space-x-3 cursor-pointer flex-1">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">💳</div>
                                        <div>
                                            <span className="font-medium text-[#2A4E73]">Cartão de Débito</span>
                                            <p className="text-sm text-gray-600">Pagamento à vista</p>
                                        </div>
                                    </label>
                                </div>

                                {/* Cartão de Crédito */}
                                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setMetodoPagamento('credito')}>
                                    <input type="radio" id="credito" name="pagamento" value="credito" checked={metodoPagamento === 'credito'} onChange={(e) => setMetodoPagamento(e.target.value)} className="text-[#2A4E73] focus:ring-[#CFE8F9] checked:accent-[#AD343E]" />
                                    <label htmlFor="credito" className="flex items-center space-x-3 cursor-pointer flex-1">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">💳</div>
                                        <div>
                                            <span className="font-medium text-[#2A4E73]">Cartão de Crédito</span>
                                            <p className="text-sm text-gray-600">Pagamento parcelado</p>
                                        </div>
                                    </label>
                                </div>

                                {/* PIX */}
                                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setMetodoPagamento('pix')}>
                                    <input type="radio" id="pix" name="pagamento" value="pix" checked={metodoPagamento === 'pix'} onChange={(e) => setMetodoPagamento(e.target.value)} className="text-[#2A4E73] focus:ring-[#CFE8F9] checked:accent-[#AD343E]" />
                                    <label htmlFor="pix" className="flex items-center space-x-3 cursor-pointer flex-1">
                                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">⚡</div>
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
                                    <label htmlFor="valorRecebido" className="block text-sm font-medium text-[#2A4E73] mb-2">Valor Recebido (R$)</label>
                                    <input type="number" id="valorRecebido" value={valorRecebido} onChange={handleValorRecebidoChange} step="0.01" min="0" className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]" placeholder="0,00" />
                                    {troco > 0 && (
                                        <div className="mt-2 p-2 bg-green-100 rounded-md">
                                            <span className="text-sm font-medium text-green-800">Troco: R$ {troco.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Botões de Ação */}
                            <div className="mt-6 space-y-3">
                                <button 
                                    onClick={finalizarVenda} 
                                    disabled={loading}
                                    className="w-full px-4 py-3 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Processando...' : 'Finalizar Venda'}
                                </button>
                                <button 
                                    onClick={() => router.back()} 
                                    disabled={loading}
                                    className="w-full px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Voltar ao PDV
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
