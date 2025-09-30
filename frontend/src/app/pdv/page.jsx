"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function PDV() {
    const router = useRouter();

    const produtos = [
        { id: 1, nome: 'Queijo', descricao: 'Queijo Minas', img: "/queijo.jpg", preco: 10.99 },
        { id: 2, nome: 'Leite', descricao: 'Leite Integral', img: "/leite.jpeg", preco: 19.99 }
    ];

    const [quantidades, setQuantidades] = useState({});
    const [listaCompras, setListaCompras] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [keypadMode, setKeypadMode] = useState('discount');
    const [inputValue, setInputValue] = useState("");
    const [termoBusca, setTermoBusca] = useState("");

    const produtosFiltrados = produtos.filter(p =>
        p.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        p.descricao.toLowerCase().includes(termoBusca.toLowerCase())
    );

    const adicionarProduto = (produto) => {
        const quantidade = parseInt(String(quantidades[produto.id])) || 1;
        const existente = listaCompras.find((i) => i.id === produto.id);
        if (existente) {
            setListaCompras(listaCompras.map((i) => (i.id === produto.id ? { ...i, quantidade: i.quantidade + quantidade } : i)));
        } else {
            setListaCompras([
                ...listaCompras,
                { ...produto, quantidade, originalPreco: produto.preco, descontoPercent: 0, precoCustom: false }
            ]);
        }
        setSelectedItemId(produto.id);
        setInputValue("");
    };

    const removerProduto = (id) => {
        setListaCompras(listaCompras.filter((i) => i.id !== id));
        if (selectedItemId === id) setSelectedItemId(null);
    };

    const atualizarQuantidadeCarrinho = (id, novaQuantidade) => {
        if (novaQuantidade <= 0) return removerProduto(id);
        setListaCompras(listaCompras.map((i) => (i.id === id ? { ...i, quantidade: novaQuantidade } : i)));
    };

    const valorTotal = listaCompras.reduce((t, i) => t + i.preco * i.quantidade, 0);

    const atualizarQuantidade = (id, valor) => {
        setQuantidades({ ...quantidades, [id]: valor });
    };

    const handleKey = (key) => {
        if (key === 'C') return setInputValue("");
        if (key === 'BACK') return setInputValue((v) => v.slice(0, -1));
        setInputValue((v) => v + key);
    };

    const aplicarValor = () => {
        if (selectedItemId == null) return;
        const item = listaCompras.find((i) => i.id === selectedItemId);
        if (!item) return;
        if (keypadMode === 'qty') {
            const q = Math.max(1, parseInt(inputValue || '0'));
            atualizarQuantidadeCarrinho(item.id, q);
        } else if (keypadMode === 'discount') {
            const percent = Math.max(0, Math.min(100, parseFloat(inputValue || '0')));
            const base = item.originalPreco ?? item.preco;
            const novoPreco = Math.max(0, parseFloat((base * (1 - percent / 100)).toFixed(2)));
            setListaCompras(listaCompras.map((i) => i.id === item.id ? { ...i, preco: novoPreco, descontoPercent: percent, precoCustom: false } : i));
        } else if (keypadMode === 'price') {
            const novoPreco = Math.max(0, parseFloat(inputValue || '0'));
            if (!isNaN(novoPreco)) {
                setListaCompras(listaCompras.map((i) => i.id === item.id ? { ...i, preco: parseFloat(novoPreco.toFixed(2)), descontoPercent: 0, precoCustom: true, originalPreco: i.originalPreco ?? i.preco } : i));
            }
        }
        setInputValue("");
    };

    const aplicarDesabilitado = () => {
        if (!selectedItemId || inputValue === '') return true;
        if (keypadMode === 'qty') return parseInt(inputValue) <= 0 || isNaN(parseInt(inputValue));
        if (keypadMode === 'discount') return isNaN(parseFloat(inputValue));
        if (keypadMode === 'price') return isNaN(parseFloat(inputValue));
        return true;
    };

    return (
        <>
            <main className="min-h-screen bg-[#FFFFFF] transition-all duration-300">
                <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-3 xl:px-4 py-4">
                    {/* Barra superior */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Início</span>
                            </button>
                        <div className="w-56">
                            <input value={termoBusca} onChange={(e)=>setTermoBusca(e.target.value)} className="w-full px-3 py-2 text-sm text-[#2A4E73] bg-[#F7FAFC] border border-gray-200 rounded-md" placeholder="Buscar produtos" />
                        </div>
                    </div>

                    {/* Grid principal: esquerda (4) | centro (8) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* ESQUERDA: carrinho + total + teclado */}
                        <div className="lg:col-span-4">
                            {/* Lista do carrinho */}
                            <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 h-[360px] overflow-y-auto">
                                <h2 className="text-lg font-semibold text-[#2A4E73] mb-4">Carrinho</h2>
                        {listaCompras.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-[#2A4E73] text-sm">Nenhum item no carrinho</p>
                                    </div>
                        ) : (
                                    <div className="space-y-2">
                                {listaCompras.map((item) => (
                                            <div key={item.id} onClick={() => setSelectedItemId(item.id)} className={`rounded-md p-3 border bg-white hover:shadow ${selectedItemId===item.id ? 'border-[#2A4E73]' : 'border-gray-200'} cursor-pointer`}>
                                                <div className="flex justify-between text-sm">
                                                    <div className="truncate max-w-[60%] text-[#2A4E73] font-medium">{item.nome}</div>
                                                    <div className="text-[#2A4E73] font-semibold">R$ {(item.preco * item.quantidade).toFixed(2)}</div>
                                                </div>
                                                <div className="flex items-center justify-between mt-1 text-xs text-gray-600">
                                                    <span>{item.quantidade}.00 Unidades × R$ {item.preco.toFixed(2)} / Unidade</span>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={(e)=>{e.stopPropagation(); atualizarQuantidadeCarrinho(item.id, item.quantidade-1);}} className="w-5 h-5 flex items-center justify-center rounded-full bg-[#AD343E] text-white">-</button>
                                                        <button onClick={(e)=>{e.stopPropagation(); atualizarQuantidadeCarrinho(item.id, item.quantidade+1);}} className="w-5 h-5 flex items-center justify-center rounded-full bg-[#2A4E73] text-white">+</button>
                                                        <button onClick={(e)=>{e.stopPropagation(); removerProduto(item.id);}} className="text-[#AD343E] hover:text-[#2A4E73]">✕</button>
                                                    </div>
                                                </div>

                                                {/* Preço/Desconto badges */}
                                                <div className="mt-1">
                                                    {item.descontoPercent > 0 ? (
                                                        <div className="text-xs">
                                                            <span className="line-through text-gray-400 mr-2">R$ {(item.originalPreco ?? item.preco).toFixed(2)}</span>
                                                            <span className="text-[#2A4E73] font-semibold">R$ {item.preco.toFixed(2)} cada</span>
                                                            <span className="ml-2 px-2 py-0.5 rounded-full bg-[#CFE8F9] text-[#2A4E73]">-{item.descontoPercent}%</span>
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-gray-600">R$ {item.preco.toFixed(2)} cada</p>
                                                    )}
                                                    {item.precoCustom && item.descontoPercent === 0 && (
                                                        <span className="mt-1 inline-block px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-[10px] font-medium">Preço ajustado</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Total (sem impostos) */}
                            <section className="bg-white rounded-lg shadow-md border border-gray-200 mt-3 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-xl font-bold text-[#2A4E73]">Total: R$ {valorTotal.toFixed(2)}</div>
                                    <div className="text-xs text-gray-500"></div>
                                </div>
                                {listaCompras.length > 0 && (
                                    <div className="mt-3 flex justify-end">
                                        <button
                                            onClick={() => {
                                                try {
                                                    const payload = { itens: listaCompras, total: valorTotal };
                                                    if (typeof window !== 'undefined') {
                                                        localStorage.setItem('pdv_cart', JSON.stringify(payload));
                                                    }
                                                } catch (_) {}
                                                router.push('/pdv/pagamento');
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-white bg-[#2A4E73] rounded-md hover:bg-[#AD343E]"
                                        >
                                            Ir para pagamento
                                        </button>
                                    </div>
                                )}
                            </section>

                            {/* Teclado + Pagamento (limpo) */}
                            <section className="mt-3 grid grid-cols-3 gap-2 items-stretch">
                                {/* Numpad 3x4 (limpo) */}
                                <div className="col-span-2 grid grid-cols-3 gap-2">
                                    {['1','2','3','4','5','6','7','8','9','C','0','BACK'].map((k) => (
                                        <button
                                            key={k}
                                            onClick={() => handleKey(k)}
                                            className="px-4 py-3 text-sm font-medium text-[#2A4E73] bg-white border border-gray-200 rounded-md hover:bg-[#CFE8F9]"
                                        >{k === 'BACK' ? '⌫' : k}</button>
                                    ))}
                                </div>

                                {/* Coluna de modos/aplicar (sem Qtd) */}
                                <div className="col-span-1 grid grid-rows-3 gap-2">
                                    <button onClick={() => setKeypadMode('discount')} className={`px-3 py-2 rounded-md text-sm ${keypadMode==='discount' ? 'bg-[#2A4E73] text-white' : 'bg-white text-[#2A4E73] border border-gray-200'}`}>% Desconto</button>
                                    <button onClick={() => setKeypadMode('price')} className={`px-3 py-2 rounded-md text-sm ${keypadMode==='price' ? 'bg-[#2A4E73] text-white' : 'bg-white text-[#2A4E73] border border-gray-200'}`}>Preço</button>
                                    <button onClick={aplicarValor} disabled={aplicarDesabilitado()} className="px-3 py-2 rounded-md text-sm bg-green-600 text-white disabled:opacity-50">Aplicar</button>
                    </div>
                            </section>
                </div>

                        {/* CENTRO: produtos */}
                        <div className="lg:col-span-8">
                            <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 min-h-[680px]">
                                {/* Grade de produtos */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                    {produtosFiltrados.map((produto) => (
                                        <button
                                            key={produto.id}
                                            onClick={() => adicionarProduto(produto)}
                                            className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 hover:shadow-md transition-shadow text-left"
                                        >
                                            <div className="relative">
                                                <img className="w-full h-28 object-cover rounded-md" src={produto.img} alt={produto.nome} />
                                            </div>
                                            <div className="mt-2 truncate text-sm font-semibold text-[#2A4E73]">{produto.nome}</div>
                                            <div className="text-xs text-gray-600 truncate">R$ {produto.preco.toFixed(2)}/Unidade</div>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}