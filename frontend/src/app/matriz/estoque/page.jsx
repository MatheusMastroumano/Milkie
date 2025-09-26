"use client";

import { useState } from "react";
import Header from "@/components/Header/page";

export default function Estoque() {
  const [lojas] = useState([
    { id: 1, nome: "Loja Centro", tipo: "Matriz", endereco: "Rua Principal, 123" },
    { id: 2, nome: "Loja Sul", tipo: "Filial", endereco: "Av. Sul, 456" },
    { id: 3, nome: "Loja Norte", tipo: "Filial", endereco: "Rua Norte, 789" },
    { id: 4, nome: "Loja Oeste", tipo: "Filial", endereco: "Av. Oeste, 321" },
  ]);

  const [estoque, setEstoque] = useState([
    { produto_id: 1, loja_id: 1, nomeProduto: "Camiseta Azul", quantidade: 50, preco: 29.90 },
    { produto_id: 2, loja_id: 1, nomeProduto: "Calça Jeans", quantidade: 20, preco: 89.90 },
    { produto_id: 3, loja_id: 2, nomeProduto: "Tênis Branco", quantidade: 15, preco: 149.90 },
    { produto_id: 4, loja_id: 1, nomeProduto: "Boné Preto", quantidade: 8, preco: 39.90 },
    { produto_id: 5, loja_id: 2, nomeProduto: "Jaqueta Vermelha", quantidade: 25, preco: 119.90 },
    { produto_id: 6, loja_id: 3, nomeProduto: "Bermuda Branca", quantidade: 12, preco: 49.90 },
    { produto_id: 7, loja_id: 4, nomeProduto: "Vestido Floral", quantidade: 18, preco: 79.90 },
  ]);

  const [novoProduto, setNovoProduto] = useState({
    nomeProduto: '',
    quantidade: '',
    preco: '',
    loja_id: '',
  });

  const [editProduto, setEditProduto] = useState(null);
  const [selectedLojaId, setSelectedLojaId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [lojaSearchTerm, setLojaSearchTerm] = useState("");
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Função para mostrar notificação e fechar após 3 segundos
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Função para validar o formulário
  const validateForm = (produto) => {
    const newErrors = {};
    if (!produto.nomeProduto.trim()) newErrors.nomeProduto = 'O nome do produto é obrigatório';
    if (!produto.quantidade) newErrors.quantidade = 'A quantidade é obrigatória';
    else if (produto.quantidade < 0) newErrors.quantidade = 'A quantidade deve ser maior ou igual a zero';
    if (!produto.preco) newErrors.preco = 'O preço é obrigatório';
    else if (produto.preco <= 0) newErrors.preco = 'O preço deve ser maior que zero';
    if (!produto.loja_id) newErrors.loja_id = 'Selecione uma loja';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para formatar preço enquanto digita
  const handlePrecoChange = (e, setProduto) => {
    let value = e.target.value.replace(/[^\d,]/g, ''); // Permite apenas dígitos e vírgula
    setProduto((prev) => ({ ...prev, preco: value }));
  };

  // Função para adicionar produto ao estoque
  const handleAddProduto = (e) => {
    e.preventDefault();
    const produto = {
      ...novoProduto,
      preco: parseFloat(novoProduto.preco.replace(',', '.')),
      quantidade: parseInt(novoProduto.quantidade)
    };
    
    if (validateForm(produto)) {
      const nextId = Math.max(...estoque.map(item => item.produto_id), 0) + 1;
      setEstoque([
        ...estoque,
        { 
          produto_id: nextId, 
          ...produto, 
          loja_id: parseInt(produto.loja_id) 
        },
      ]);
      setNovoProduto({ nomeProduto: '', quantidade: '', preco: '', loja_id: '' });
      setErrors({});
      showNotification('Produto adicionado ao estoque com sucesso! 🎉');
    }
  };

  // Função para editar produto no modal
  const handleEditProduto = (e) => {
    e.preventDefault();
    const produto = {
      ...editProduto,
      preco: parseFloat(editProduto.preco.replace(',', '.')),
      quantidade: parseInt(editProduto.quantidade)
    };
    
    if (validateForm(produto)) {
      setEstoque(
        estoque.map((item) =>
          item.produto_id === produto.produto_id 
            ? { ...produto, loja_id: parseInt(produto.loja_id) } 
            : item
        )
      );
      setIsModalOpen(false);
      setEditProduto(null);
      setErrors({});
      showNotification('Produto atualizado com sucesso! ✅');
    }
  };

  // Função para abrir modal de edição
  const openEditProduto = (produto) => {
    setEditProduto({ 
      ...produto, 
      loja_id: produto.loja_id.toString(),
      preco: produto.preco.toString().replace('.', ',')
    });
    setIsModalOpen(true);
    setErrors({});
  };

  // Função para fechar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditProduto(null);
    setErrors({});
  };

  // Função para excluir produto
  const handleDeleteProduto = (produto_id, loja_id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto do estoque?')) {
      setEstoque(estoque.filter((item) => !(item.produto_id === produto_id && item.loja_id === loja_id)));
      if (editProduto && editProduto.produto_id === produto_id && editProduto.loja_id === loja_id) {
        closeModal();
      }
      showNotification('Produto removido do estoque com sucesso! 🗑️');
    }
  };

  // Filtrar lojas pelo termo de busca
  const filteredLojas = lojas.filter(loja => 
    loja.nome.toLowerCase().includes(lojaSearchTerm.toLowerCase()) ||
    loja.tipo.toLowerCase().includes(lojaSearchTerm.toLowerCase()) ||
    loja.endereco.toLowerCase().includes(lojaSearchTerm.toLowerCase())
  );

  // Filtra estoque da loja selecionada
  const filteredEstoque = selectedLojaId
    ? estoque
        .filter((item) => item.loja_id === parseInt(selectedLojaId))
        .filter((item) =>
          item.nomeProduto.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFFFF] pt-14 sm:pt-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6">
          {/* Título */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A4E73] mb-6 text-center">
            Gerenciamento de Estoque
          </h1>

          {/* Formulário para Adicionar Produto ao Estoque */}
          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6 mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Adicionar Produto ao Estoque
            </h2>
            <form onSubmit={handleAddProduto} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex-1">
                <label htmlFor="nomeProduto" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  id="nomeProduto"
                  value={novoProduto.nomeProduto}
                  onChange={(e) => setNovoProduto({ ...novoProduto, nomeProduto: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                  placeholder="Ex.: Camiseta Azul"
                />
                {errors.nomeProduto && <p className="text-[#AD343E] text-sm mt-1">{errors.nomeProduto}</p>}
              </div>
              <div className="flex-1">
                <label htmlFor="quantidade" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  id="quantidade"
                  min="0"
                  value={novoProduto.quantidade}
                  onChange={(e) => setNovoProduto({ ...novoProduto, quantidade: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                  placeholder="Ex.: 50"
                />
                {errors.quantidade && <p className="text-[#AD343E] text-sm mt-1">{errors.quantidade}</p>}
              </div>
              <div className="flex-1">
                <label htmlFor="preco" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Preço (R$)
                </label>
                <input
                  type="text"
                  id="preco"
                  value={novoProduto.preco}
                  onChange={(e) => handlePrecoChange(e, setNovoProduto)}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                  placeholder="Ex.: 29,90"
                />
                {errors.preco && <p className="text-[#AD343E] text-sm mt-1">{errors.preco}</p>}
              </div>
              <div className="flex-1">
                <label htmlFor="loja_id" className="block text-sm font-medium text-[#2A4E73] mb-1">
                  Loja
                </label>
                <select
                  id="loja_id"
                  value={novoProduto.loja_id}
                  onChange={(e) => setNovoProduto({ ...novoProduto, loja_id: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                >
                  <option value="">Selecione uma loja</option>
                  {lojas.map((loja) => (
                    <option key={loja.id} value={loja.id}>
                      {loja.nome} ({loja.tipo})
                    </option>
                  ))}
                </select>
                {errors.loja_id && <p className="text-[#AD343E] text-sm mt-1">{errors.loja_id}</p>}
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </section>

          {/* Seção de Consulta de Estoque */}
          <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#2A4E73] mb-4 text-center">
              Consulta de Estoque por Loja
            </h2>

            {/* Busca de Loja com Lupa */}
            <div className="mb-6">
              <label htmlFor="search-loja" className="block text-sm font-medium text-[#2A4E73] mb-2">
                 Buscar Loja
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search-loja"
                  value={lojaSearchTerm}
                  onChange={(e) => setLojaSearchTerm(e.target.value)}
                  className="w-full sm:w-80 px-4 py-2 pl-10 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                  placeholder="Digite o nome, tipo ou endereço da loja..."
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2A4E73]">
                  
                </div>
              </div>
            </div>

            {/* Lista de Lojas Filtradas */}
            {lojaSearchTerm && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-[#2A4E73] mb-3">Lojas Encontradas:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredLojas.map((loja) => (
                    <div
                      key={loja.id}
                      onClick={() => {
                        setSelectedLojaId(loja.id.toString());
                        setLojaSearchTerm('');
                      }}
                      className="p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-[#CFE8F9] hover:border-[#2A4E73] transition-colors"
                    >
                      <h4 className="font-semibold text-[#2A4E73]">{loja.nome}</h4>
                      <p className="text-sm text-gray-600">{loja.tipo}</p>
                      <p className="text-sm text-gray-500">{loja.endereco}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seleção de Loja */}
            <div className="mb-6">
              <label htmlFor="select-loja" className="block text-sm font-medium text-[#2A4E73] mb-2">
                Loja Selecionada
              </label>
              <select
                id="select-loja"
                value={selectedLojaId}
                onChange={(e) => setSelectedLojaId(e.target.value)}
                className="w-full sm:w-80 px-3 py-2 text-sm sm:text-base text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
              >
                <option value="">Selecione uma loja</option>
                {lojas.map((loja) => (
                  <option key={loja.id} value={loja.id}>
                    {loja.nome} ({loja.tipo}) - {loja.endereco}
                  </option>
                ))}
              </select>
            </div>

            {/* Pesquisa de Produto */}
            {selectedLojaId && (
              <div className="mb-6">
                <label htmlFor="search-produto" className="block text-sm font-medium text-[#2A4E73] mb-2">
                  Pesquisar Produto no Estoque
                </label>
                <input
                  type="text"
                  id="search-produto"
                  placeholder="Digite o nome do produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base text-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                />
              </div>
            )}

            {/* Notificação */}
            {notification && (
              <div className="w-full max-w-md mx-auto mb-4 p-4 px-4 py-2 bg-[#CFE8F9] text-[#2A4E73] rounded-md shadow-md text-sm sm:text-base font-medium text-center animate-fadeIn">
                {notification}
              </div>
            )}

            {/* Estoque da Loja Selecionada */}
            {selectedLojaId ? (
              filteredEstoque.length === 0 ? (
                <p className="text-[#2A4E73] text-center font-medium">
                  Nenhum produto encontrado no estoque desta loja.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm sm:text-base text-[#2A4E73] border-collapse rounded-lg shadow-md">
                    <thead>
                      <tr className="bg-[#2A4E73] text-[#FFFFFF]">
                        <th className="px-3 sm:px-4 py-3 text-left rounded-tl-lg">
                          Código
                        </th>
                        <th className="px-3 sm:px-4 py-3 text-left">Produto</th>
                        <th className="px-3 sm:px-4 py-3 text-center">Quantidade</th>
                        <th className="px-3 sm:px-4 py-3 text-center">Preço (R$)</th>
                        <th className="px-3 sm:px-4 py-3 text-center rounded-tr-lg">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEstoque.map((item) => (
                        <tr
                          key={`${item.produto_id}-${item.loja_id}`}
                          className="border-b border-gray-200 hover:bg-[#CFE8F9]"
                        >
                          <td className="px-3 sm:px-4 py-3">{item.produto_id}</td>
                          <td className="px-3 sm:px-4 py-3 truncate max-w-[200px]">
                            {item.nomeProduto}
                          </td>
                          <td
                            className={`px-3 sm:px-4 py-3 text-center font-semibold ${
                              item.quantidade < 10
                                ? "text-[#AD343E]"
                                : "text-[#2A4E73]"
                            }`}
                          >
                            {item.quantidade}
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-center font-medium text-[#2A4E73]">
                            {item.preco.toFixed(2).replace('.', ',')}
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-center space-x-2">
                            <button
                              onClick={() => openEditProduto(item)}
                              className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteProduto(item.produto_id, item.loja_id)}
                              className="px-3 sm:px-4 py-1 sm:py-2 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <p className="text-[#2A4E73] text-center font-medium">
                Selecione uma loja para visualizar o estoque.
              </p>
            )}
          </section>

          {/* Modal de Edição de Produto */}
          {isModalOpen && editProduto && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-[#FFFFFF] rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-[#2A4E73]">Editar Produto</h2>
                    <button
                      onClick={closeModal}
                      className="text-[#2A4E73] hover:text-[#AD343E] text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={handleEditProduto} className="space-y-4">
                    <div>
                      <label htmlFor="edit-codigo" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Código do Produto
                      </label>
                      <input
                        type="text"
                        id="edit-codigo"
                        value={editProduto.produto_id}
                        disabled
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] bg-gray-100 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-nomeProduto" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Nome do Produto
                      </label>
                      <input
                        type="text"
                        id="edit-nomeProduto"
                        value={editProduto.nomeProduto}
                        onChange={(e) => setEditProduto({ ...editProduto, nomeProduto: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: Camiseta Azul"
                      />
                      {errors.nomeProduto && <p className="text-[#AD343E] text-sm mt-1">{errors.nomeProduto}</p>}
                    </div>
                    <div>
                      <label htmlFor="edit-quantidade" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Quantidade
                      </label>
                      <input
                        type="number"
                        id="edit-quantidade"
                        min="0"
                        value={editProduto.quantidade}
                        onChange={(e) => setEditProduto({ ...editProduto, quantidade: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: 50"
                      />
                      {errors.quantidade && <p className="text-[#AD343E] text-sm mt-1">{errors.quantidade}</p>}
                    </div>
                    <div>
                      <label htmlFor="edit-preco" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Preço (R$)
                      </label>
                      <input
                        type="text"
                        id="edit-preco"
                        value={editProduto.preco}
                        onChange={(e) => handlePrecoChange(e, setEditProduto)}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                        placeholder="Ex.: 29,90"
                      />
                      {errors.preco && <p className="text-[#AD343E] text-sm mt-1">{errors.preco}</p>}
                    </div>
                    <div>
                      <label htmlFor="edit-loja_id" className="block text-sm font-medium text-[#2A4E73] mb-1">
                        Loja
                      </label>
                      <select
                        id="edit-loja_id"
                        value={editProduto.loja_id}
                        onChange={(e) => setEditProduto({ ...editProduto, loja_id: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-[#2A4E73] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      >
                        <option value="">Selecione uma loja</option>
                        {lojas.map((loja) => (
                          <option key={loja.id} value={loja.id}>
                            {loja.nome} ({loja.tipo})
                          </option>
                        ))}
                      </select>
                      {errors.loja_id && <p className="text-[#AD343E] text-sm mt-1">{errors.loja_id}</p>}
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}