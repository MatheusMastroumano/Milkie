"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PDV() {
    const router = useRouter();
    
    const produtos = [
        {
            id: 1,
            nome: 'Queijo',
            descricao: 'Queijin gotoso',
            img: "/queijo.jpg",
            preco: 10.99,
            svg: "/code.png"
        },
        {
            id: 2,
            nome: 'Leite',
            descricao: 'Las maiores leitadas de 2025',
            img: "/leite.jpeg",
            preco: 19.99,
            svg: "/code.png"
        },
    ];

    const [quantidades, setQuantidades] = useState({})
    const [listaCompras, setListaCompras] = useState([])
    
    const adicionarProduto = (produto) => {
        const quantidade = parseInt(quantidades[produto.id]) || 1;

        const existe = listaCompras.find((item) => item.id === produto.id);

        if (existe) {
            setListaCompras(
                listaCompras.map((item) =>
                    item.id === produto.id ? { ...item, quantidade: item.quantidade + quantidade } : item)
            )
        } else {
            setListaCompras([...listaCompras, { ...produto, quantidade }])
        }
    }

    const removerProduto = (id) => {
        setListaCompras(listaCompras.filter((item) => item.id !== id));
    }

    const atualizarQuantidadeCarrinho = (id, novaQuantidade) => {
        if (novaQuantidade <= 0) {
            removerProduto(id);
            return;
        }
        setListaCompras(
            listaCompras.map((item) =>
                item.id === id ? { ...item, quantidade: novaQuantidade } : item)
        );
    }

    const valorTotal = listaCompras.reduce(
        (total, item) => total + item.preco * item.quantidade, 0
    );

    const atualizarQuantidade = (id, valor) => {
        setQuantidades({ ...quantidades, [id]: valor })
    }

    return (
        <>
            <main className="min-h-screen bg-[#FFFFFF] transition-all duration-300">
                <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-3 xl:px-4 py-4">
                    {/* Botão de Retorno e Título */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Voltar para Home</span>
                            </button>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] text-center flex-1">
                            Ponto de Venda (PDV)
                        </h1>
                        <div className="w-32"></div> {/* Espaçador para centralizar o título */}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Seção de Produtos */}
                        <div className="lg:col-span-2">
                            <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
                                    Produtos Disponíveis
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {produtos.map((produto) => (
                                        <div key={produto.id} className="bg-[#FFFFFF] rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow">
                                            <div className="flex items-center space-x-4">
                                                <img 
                                                    className="w-16 h-16 object-cover rounded-lg" 
                                                    src={produto.img} 
                                                    alt={produto.nome}
                                                />
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-[#2A4E73]">{produto.nome}</h3>
                                                    <p className="text-sm text-gray-600 mb-2">{produto.descricao}</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-lg font-bold text-[#2A4E73]">
                                                            R$ {produto.preco.toFixed(2)}
                                                        </span>
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={quantidades[produto.id] || 1}
                                                                onChange={(e) => atualizarQuantidade(produto.id, e.target.value)}
                                                                className="w-16 px-2 py-1 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9]"
                                                            />
                                                            <button
                                                                onClick={() => adicionarProduto(produto)}
                                                                className="px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                                                            >
                                                                Adicionar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Seção do Carrinho */}
                        <div className="lg:col-span-1">
                            <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
                                    Carrinho de Compras
                                </h2>
                                
                        {listaCompras.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-[#2A4E73] text-lg">Nenhum item no carrinho</p>
                                        <p className="text-gray-600 text-sm mt-2">Adicione produtos para começar a venda</p>
                                    </div>
                        ) : (
                                    <>
                                        <div className="space-y-3 mb-6">
                                {listaCompras.map((item) => (
                                                <div key={item.id} className="bg-[#FFFFFF] rounded-lg p-3 border border-gray-200">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-[#2A4E73] text-sm">{item.nome}</h4>
                                                            <p className="text-xs text-gray-600">R$ {item.preco.toFixed(2)} cada</p>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => atualizarQuantidadeCarrinho(item.id, item.quantidade - 1)}
                                                                className="w-6 h-6 flex items-center justify-center text-[#FFFFFF] bg-[#AD343E] rounded-full hover:bg-[#2A4E73] transition-colors text-sm"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="text-sm font-medium text-[#2A4E73] min-w-[20px] text-center">
                                                                {item.quantidade}
                                                            </span>
                                                            <button
                                                                onClick={() => atualizarQuantidadeCarrinho(item.id, item.quantidade + 1)}
                                                                className="w-6 h-6 flex items-center justify-center text-[#FFFFFF] bg-[#2A4E73] rounded-full hover:bg-[#AD343E] transition-colors text-sm"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-sm font-bold text-[#2A4E73]">
                                                            Total: R$ {(item.preco * item.quantidade).toFixed(2)}
                                                        </span>
                                                        <button
                                                            onClick={() => removerProduto(item.id)}
                                                            className="text-[#AD343E] hover:text-[#2A4E73] text-sm font-medium transition-colors"
                                                        >
                                                            Remover
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Total */}
                                        <div className="border-t border-gray-300 pt-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-lg font-semibold text-[#2A4E73]">Total:</span>
                                                <span className="text-xl font-bold text-[#2A4E73]">
                                                    R$ {valorTotal.toFixed(2)}
                                                </span>
                                            </div>
                                            
                                            {/* Botões de Ação */}
                                            <div className="space-y-2">
                                                <button 
                                                    onClick={() => router.push('/pdv/pagamento')}
                                                    disabled={listaCompras.length === 0}
                                                    className="w-full px-4 py-3 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Ir para Pagamento
                                                </button>
                                                <button 
                                                    onClick={() => setListaCompras([])}
                                                    className="w-full px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                                                >
                                                    Limpar Carrinho
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

