"use client";
import React from "react";
import Header from "@/components/Header/page";
import { useState } from "react";

export default function Home() {
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

    const valorTotal = listaCompras.reduce(
        (total, item) => total + item.preco * item.quantidade, 0
    );


    const atualizarQuantidade = (id, valor) => {
        setQuantidades({ ...quantidades, [id]: valor })
    }


    return (
        <div className="min-h-screen bg-gray-100">
            <main className="p-8">
                <h1 className="text-3xl font-bold">Pdv Sigma</h1>
                <p className="mt-4 text-black-600">Uhhh coisas</p>
                <div className="grid grid-cols-4 gap-4 overflow-x-hidden">
                    <div className="grid row-auto p-5 gap-10 col-span-3 border-r">
                        {produtos.map((produto) => (
                            <button onClick={() => adicionarProduto(produto)} className="grid grid-cols-4 max-w-xl h-fit bg-[#2A4E73] hover:bg-[#AD343E] p-3 justify-items-left align-items-center rounded-xl" key={produto.id}>
                                <img className="aspect-square size-18 rounded-xl" src={produto.img} />
                                <h2 className="text-white text-2xl">{produto.nome}</h2>
                                <p className="text-white text-2xl">{produto.preco}</p>
                                <img className=" w-50 rounded-xl" src={produto.svg}/>
                            </button>
                        ))}
                    </div>
                    <div className="p-5 flex flex-wrap gap-10 col-end">
                        {listaCompras.length === 0 ? (
                            <p>Nenhum item cadastrado</p>
                        ) : (
                            <ul>
                                {listaCompras.map((item) => (
                                    <li key={item.id}>
                                        {item.nome} - Quantidade: {item.quantidade} - Preço total: R$ {""}{(item.preco * item.quantidade).toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <h2>Valor Total das Compras: R$ {valorTotal.toFixed(2)}</h2>
                    </div>
                </div>

            </main>
        </div>
    );
}

