"use client";

import { useState, useEffect } from 'react';
import Header from "@/components/Header/page";

export default function ProdutosFilial() {
  const [produtos, setProdutos] = useState([
    {
      id: 1,
      sku: 'ABC123',
      nome: 'Camiseta Básica',
      marca: 'Marca X',
      categoria: 'Roupas',
      descricao: 'Camiseta de algodão',
      fabricacao: '2023-01-01',
      validade: '2025-01-01',
      ativo: true,
      preco: 29.99,
      preco_local: 32.99,
      estoque_minimo_local: 5,
      em_promocao_local: false,
      filial_id: 1,
    },
    {
      id: 2,
      sku: 'XYZ789',
      nome: 'Calça Jeans',
      marca: 'Marca Y',
      categoria: 'Roupas',
      descricao: 'Calça jeans azul',
      fabricacao: '2023-06-01',
      validade: null,
      ativo: true,
      preco: 79.99,
      preco_local: 85.99,
      estoque_minimo_local: 3,
      em_promocao_local: true,
      filial_id: 1,
    },
  ]);
  
  const [editProduto, setEditProduto] = useState(null);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [filialId] = useState(1); // ID da filial atual (normalmente viria de autenticação)

  // Função para mostrar notificação e fechar após 3 segundos
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Função para validar o formulário
  const validateForm = (produto) => {
    const newErrors = {};
    if (!produto.preco_local) newErrors.preco_local = 'O preço local é obrigatório';
    else if (isNaN(produto.preco_local) || parseFloat(produto.preco_local) <= 0) {
      newErrors.preco_local = 'O preço local deve ser um número positivo';
    }
    if (!produto.estoque_minimo_local && produto.estoque_minimo_local !== 0) {
      newErrors.estoque_minimo_local = 'O estoque mínimo local é obrigatório';
    } else if (isNaN(produto.estoque_minimo_local) || parseInt(produto.estoque_minimo_local) < 0) {
      newErrors.estoque_minimo_local = 'O estoque mínimo local deve ser um número não negativo';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para editar produto local
  const handleEditProduto = (produto) => {
    setEditProduto(produto);
    setIsModalOpen(true);
  };

  // Função para salvar alterações locais do produto
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (validateForm(editProduto)) {
      setProdutos(produtos.map(p => p.id === editProduto.id ? editProduto : p));
      setIsModalOpen(false);
      showNotification('Produto atualizado com sucesso!');
    }
  };

  // Função para alternar promoção local
  const togglePromocao = (id) => {
    setProdutos(produtos.map(p => {
      if (p.id === id) {
        return { ...p, em_promocao_local: !p.em_promocao_local };
      }
      return p;
    }));
    showNotification('Status de promoção alterado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Produtos - Filial</h1>
        </div>

        {notification && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {notification}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Matriz</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Local</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque Mínimo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promoção</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {produtos.map((produto) => (
                  <tr key={produto.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produto.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{produto.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produto.marca}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {produto.preco.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {produto.preco_local.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produto.estoque_minimo_local}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${produto.em_promocao_local ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {produto.em_promocao_local ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditProduto(produto)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => togglePromocao(produto.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        {produto.em_promocao_local ? 'Remover Promoção' : 'Adicionar Promoção'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Editar Informações Locais do Produto</h2>
            <form onSubmit={handleSaveEdit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  value={editProduto.nome}
                  disabled
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Preço Local
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editProduto.preco_local}
                  onChange={(e) => setEditProduto({...editProduto, preco_local: parseFloat(e.target.value)})}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${errors.preco_local ? 'border-red-500' : ''}`}
                />
                {errors.preco_local && <p className="text-red-500 text-xs italic">{errors.preco_local}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Estoque Mínimo Local
                </label>
                <input
                  type="number"
                  value={editProduto.estoque_minimo_local}
                  onChange={(e) => setEditProduto({...editProduto, estoque_minimo_local: parseInt(e.target.value)})}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${errors.estoque_minimo_local ? 'border-red-500' : ''}`}
                />
                {errors.estoque_minimo_local && <p className="text-red-500 text-xs italic">{errors.estoque_minimo_local}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Em Promoção
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={editProduto.em_promocao_local}
                      onChange={(e) => setEditProduto({...editProduto, em_promocao_local: e.target.checked})}
                      className="form-checkbox h-5 w-5 text-indigo-600"
                    />
                    <span className="ml-2 text-gray-700">Produto em promoção na filial</span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}