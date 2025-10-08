"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function PDVAutoAtendimento() {
    const router = useRouter();

    const produtos = [
        { id: 1, nome: 'Queijo', descricao: 'Queijo Minas', img: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=200&h=150&fit=crop", preco: 10.99 },
        { id: 2, nome: 'Leite', descricao: 'Leite Integral', img: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=150&fit=crop", preco: 19.99 },
        { id: 3, nome: 'Iogurte', descricao: 'Iogurte Natural', img: "https://images.unsplash.com/photo-1571212056062-4fafa40182d9?w=200&h=150&fit=crop", preco: 8.50 }
    ];

    const [listaCompras, setListaCompras] = useState([]);
    const [termoBusca, setTermoBusca] = useState("");

    const produtosFiltrados = produtos.filter(p =>
        p.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        p.descricao.toLowerCase().includes(termoBusca.toLowerCase())
    );

    const adicionarProduto = (produto) => {
        const existente = listaCompras.find((i) => i.id === produto.id);
        if (existente) {
            setListaCompras(listaCompras.map((i) => (i.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i)));
        } else {
            setListaCompras([
                ...listaCompras,
                { ...produto, quantidade: 1 }
            ]);
        }
    };

    const removerProduto = (id) => {
        setListaCompras(listaCompras.filter((i) => i.id !== id));
    };

    const atualizarQuantidadeCarrinho = (id, novaQuantidade) => {
        if (novaQuantidade <= 0) return removerProduto(id);
        setListaCompras(listaCompras.map((i) => (i.id === id ? { ...i, quantidade: novaQuantidade } : i)));
    };

    const valorTotal = listaCompras.reduce((t, i) => t + i.preco * i.quantidade, 0);

    const finalizarCompra = () => {
        if (listaCompras.length === 0) {
            alert('Adicione pelo menos um produto ao carrinho');
            return;
        }
        
        try {
            const payload = { itens: listaCompras, total: valorTotal };
            if (typeof window !== 'undefined') {
                localStorage.setItem('pdv_cart', JSON.stringify(payload));
            }
        } catch (_) { }
        router.push('/pdv/pagamento');
    };

    return (
        <>
            <main className="min-h-screen bg-[#FFFFFF] transition-all duration-300">
                <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-3 xl:px-4 py-4">
                    {/* Barra superior */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => router.push('/pdv')}
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Voltar</span>
                        </button>
                        <div className="text-center">
                            <h1 className="text-xl font-bold text-[#2A4E73]">Auto Atendimento</h1>
                            <p className="text-sm text-gray-600">Selecione seus produtos</p>
                        </div>
                        <div className="w-56">
                            <input 
                                value={termoBusca} 
                                onChange={(e) => setTermoBusca(e.target.value)} 
                                className="w-full px-3 py-2 text-sm text-[#2A4E73] bg-[#F7FAFC] border border-gray-200 rounded-md" 
                                placeholder="Buscar produtos" 
                            />
                        </div>
                    </div>

                    {/* Grid principal: esquerda (4) | centro (8) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* ESQUERDA: carrinho + total */}
                        <div className="lg:col-span-4">
                            {/* Lista do carrinho */}
                            <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 h-[400px] overflow-y-auto">
                                <h2 className="text-lg font-semibold text-[#2A4E73] mb-4">Seu Carrinho</h2>
                                {listaCompras.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                                            </svg>
                                        </div>
                                        <p className="text-[#2A4E73] text-sm">Seu carrinho está vazio</p>
                                        <p className="text-gray-500 text-xs mt-1">Toque nos produtos para adicionar</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {listaCompras.map((item) => (
                                            <div key={item.id} className="rounded-md p-3 border bg-white shadow-sm">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                    <img 
                                                        src={item.img} 
                                                        alt={item.nome}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-medium text-[#2A4E73] truncate">{item.nome}</div>
                                                        <div className="text-xs text-gray-600">R$ {item.preco.toFixed(2)} cada</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-semibold text-[#2A4E73]">R$ {(item.preco * item.quantidade).toFixed(2)}</div>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <button 
                                                                onClick={() => atualizarQuantidadeCarrinho(item.id, item.quantidade - 1)} 
                                                                className="w-6 h-6 flex items-center justify-center rounded-full bg-[#AD343E] text-white text-xs"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="text-xs text-gray-600 min-w-[20px] text-center">{item.quantidade}</span>
                                                            <button 
                                                                onClick={() => atualizarQuantidadeCarrinho(item.id, item.quantidade + 1)} 
                                                                className="w-6 h-6 flex items-center justify-center rounded-full bg-[#2A4E73] text-white text-xs"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Total e botão de finalizar */}
                            <section className="bg-white rounded-lg shadow-md border border-gray-200 mt-3 p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-xl font-bold text-[#2A4E73]">Total: R$ {valorTotal.toFixed(2)}</div>
                                </div>
                                
                                {listaCompras.length > 0 && (
                                    <button
                                        onClick={finalizarCompra}
                                        className="w-full px-4 py-3 text-sm font-medium text-white bg-[#2A4E73] rounded-md hover:bg-[#AD343E] transition-colors"
                                    >
                                        Finalizar Compra
                                    </button>
                                )}
                                
                                {listaCompras.length === 0 && (
                                    <div className="text-center py-4">
                                        <p className="text-sm text-gray-500">Adicione produtos para continuar</p>
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* CENTRO: produtos */}
                        <div className="lg:col-span-8">
                            <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 min-h-[680px]">
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold text-[#2A4E73] mb-2">Produtos Disponíveis</h2>
                                    <p className="text-sm text-gray-600">Toque nos produtos para adicionar ao carrinho</p>
                                </div>
                                
                                {/* Grade de produtos */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {produtosFiltrados.map((produto) => (
                                        <button
                                            key={produto.id}
                                            onClick={() => adicionarProduto(produto)}
                                            className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-all duration-200 text-left group"
                                        >
                                            <div className="relative mb-3">
                                                <div className="w-full h-24 bg-gray-100 rounded-md overflow-hidden">
                                                    <img 
                                                        src={produto.img} 
                                                        alt={produto.nome}
                                                        className="w-full h-full object-cover"
                                                        onLoad={() => console.log('✅ Imagem carregada:', produto.nome, produto.img)}
                                                        onError={(e) => {
                                                            console.log('❌ Erro ao carregar:', produto.nome, produto.img);
                                                            console.log('Erro:', e);
                                                        }}
                                                        style={{
                                                            border: '2px solid red',
                                                            backgroundColor: 'yellow'
                                                        }}
                                                    />
                                                </div>
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-md flex items-center justify-center">
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <div className="w-8 h-8 bg-[#2A4E73] rounded-full flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="truncate text-sm font-semibold text-[#2A4E73] mb-1">{produto.nome}</div>
                                            <div className="text-xs text-gray-600 truncate mb-2">{produto.descricao}</div>
                                            <div className="text-sm font-bold text-[#2A4E73]">R$ {produto.preco.toFixed(2)}</div>
                                        </button>
                                    ))}
                                </div>
                                
                                {produtosFiltrados.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-[#2A4E73] text-sm">Nenhum produto encontrado</p>
                                        <p className="text-gray-500 text-xs mt-1">Tente buscar por outro termo</p>
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
