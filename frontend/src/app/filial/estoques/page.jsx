"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Sem importações de componentes UI personalizados

export default function EstoqueFilial() {
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);
  const [filialId, setFilialId] = useState(1); // ID da filial atual (deve ser obtido do contexto de autenticação)
  const [modalEntradaAberto, setModalEntradaAberto] = useState(false);
  const [modalAjusteAberto, setModalAjusteAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [formEntrada, setFormEntrada] = useState({
    quantidade: "",
    lote: "",
    dataValidade: "",
    observacao: "",
  });
  const [formAjuste, setFormAjuste] = useState({
    quantidade: "",
    tipo: "adicao", // adicao ou remocao
    motivo: "",
  });

  // Função para carregar produtos da filial
  useEffect(() => {
    // Simulação de dados - em produção, substituir por chamada à API
    const produtosSimulados = [
      {
        id: 1,
        nome: "Leite Integral",
        estoque: 150,
        estoqueMinimo: 50,
        unidade: "L",
        lotes: [
          { lote: "L123", quantidade: 100, validade: "2024-12-31" },
          { lote: "L124", quantidade: 50, validade: "2025-01-15" },
        ],
      },
      {
        id: 2,
        nome: "Queijo Minas",
        estoque: 80,
        estoqueMinimo: 30,
        unidade: "Kg",
        lotes: [
          { lote: "Q456", quantidade: 50, validade: "2024-11-20" },
          { lote: "Q457", quantidade: 30, validade: "2024-12-05" },
        ],
      },
      {
        id: 3,
        nome: "Iogurte Natural",
        estoque: 45,
        estoqueMinimo: 40,
        unidade: "Un",
        lotes: [
          { lote: "I789", quantidade: 45, validade: "2024-10-15" },
        ],
      },
    ];
    
    setProdutos(produtosSimulados);
  }, []);

  // Função para abrir modal de entrada de estoque
  const abrirModalEntrada = (produto) => {
    setProdutoSelecionado(produto);
    setFormEntrada({
      quantidade: "",
      lote: "",
      dataValidade: new Date().toISOString().split("T")[0],
      observacao: "",
    });
    setModalEntradaAberto(true);
  };

  // Função para abrir modal de ajuste de estoque
  const abrirModalAjuste = (produto) => {
    setProdutoSelecionado(produto);
    setFormAjuste({
      quantidade: "",
      tipo: "adicao",
      motivo: "",
    });
    setModalAjusteAberto(true);
  };

  // Função para registrar entrada de estoque
  const registrarEntrada = () => {
    // Validação do formulário
    if (!formEntrada.quantidade || !formEntrada.lote || !formEntrada.dataValidade) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Simulação de registro - em produção, substituir por chamada à API
    const produtosAtualizados = produtos.map(p => {
      if (p.id === produtoSelecionado.id) {
        const novoLote = {
          lote: formEntrada.lote,
          quantidade: parseInt(formEntrada.quantidade),
          validade: formEntrada.dataValidade,
        };
        
        return {
          ...p,
          estoque: p.estoque + parseInt(formEntrada.quantidade),
          lotes: [...p.lotes, novoLote],
        };
      }
      return p;
    });
    
    setProdutos(produtosAtualizados);
    setModalEntradaAberto(false);
    
    toast({
      title: "Sucesso",
      description: `Entrada de ${formEntrada.quantidade} ${produtoSelecionado.unidade} de ${produtoSelecionado.nome} registrada com sucesso!`,
    });
  };

  // Função para registrar ajuste de estoque
  const registrarAjuste = () => {
    // Validação do formulário
    if (!formAjuste.quantidade || !formAjuste.motivo) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Simulação de registro - em produção, substituir por chamada à API
    const produtosAtualizados = produtos.map(p => {
      if (p.id === produtoSelecionado.id) {
        const quantidadeAjuste = parseInt(formAjuste.quantidade);
        let novoEstoque = p.estoque;
        
        if (formAjuste.tipo === "adicao") {
          novoEstoque += quantidadeAjuste;
        } else {
          // Verificar se há estoque suficiente para remoção
          if (p.estoque < quantidadeAjuste) {
            toast({
              title: "Erro",
              description: "Quantidade insuficiente em estoque para remoção",
              variant: "destructive",
            });
            return p;
          }
          novoEstoque -= quantidadeAjuste;
        }
        
        return {
          ...p,
          estoque: novoEstoque,
        };
      }
      return p;
    });
    
    setProdutos(produtosAtualizados);
    setModalAjusteAberto(false);
    
    toast({
      title: "Sucesso",
      description: `Ajuste de ${formAjuste.quantidade} ${produtoSelecionado.unidade} de ${produtoSelecionado.nome} registrado com sucesso!`,
    });
  };

  const [activeTab, setActiveTab] = useState("estoque");

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Gestão de Estoque - Filial</h1>
      
      <div className="w-full">
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'estoque'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('estoque')}
            >
              Estoque Atual
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'lotes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('lotes')}
            >
              Lotes e Validades
            </button>
          </nav>
        </div>
        
        {activeTab === "estoque" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Estoque de Produtos</h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque Atual</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque Mínimo</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidade</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {produtos.map((produto) => (
                      <tr key={produto.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{produto.nome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produto.estoque} {produto.unidade}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produto.estoqueMinimo} {produto.unidade}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produto.unidade}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            produto.estoque < produto.estoqueMinimo 
                              ? "bg-red-100 text-red-800" 
                              : "bg-green-100 text-green-800"
                          }`}>
                            {produto.estoque < produto.estoqueMinimo ? "Abaixo do mínimo" : "Normal"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              className="text-blue-600 hover:text-blue-900 focus:outline-none border border-blue-600 px-2 py-1 rounded text-xs"
                              onClick={() => abrirModalEntrada(produto)}
                            >
                              Entrada
                            </button>
                            <button 
                              className="text-blue-600 hover:text-blue-900 focus:outline-none border border-blue-600 px-2 py-1 rounded text-xs"
                              onClick={() => abrirModalAjuste(produto)}
                            >
                              Ajuste
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "lotes" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Lotes e Validades</h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lote</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validade</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {produtos.flatMap((produto) => 
                      produto.lotes.map((lote, index) => (
                        <tr key={`${produto.id}-${lote.lote}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{produto.nome}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lote.lote}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lote.quantidade} {produto.unidade}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(lote.validade).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              new Date(lote.validade) < new Date() 
                                ? "bg-red-100 text-red-800" 
                                : new Date(lote.validade) < new Date(Date.now() + 30*24*60*60*1000)
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }`}>
                              {new Date(lote.validade) < new Date() 
                                ? "Vencido" 
                                : new Date(lote.validade) < new Date(Date.now() + 30*24*60*60*1000)
                                  ? "Próximo ao vencimento"
                                  : "Normal"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal de Entrada de Estoque */}
      {modalEntradaAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setModalEntradaAberto(false)}></div>
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Entrada de Estoque - {produtoSelecionado?.nome}</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="quantidade" className="text-right text-sm font-medium text-gray-700">
                  Quantidade
                </label>
                <input
                  id="quantidade"
                  type="number"
                  min="1"
                  className="col-span-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formEntrada.quantidade}
                  onChange={(e) => setFormEntrada({ ...formEntrada, quantidade: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="lote" className="text-right text-sm font-medium text-gray-700">
                  Lote
                </label>
                <input
                  id="lote"
                  className="col-span-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formEntrada.lote}
                  onChange={(e) => setFormEntrada({ ...formEntrada, lote: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="dataValidade" className="text-right text-sm font-medium text-gray-700">
                  Data de Validade
                </label>
                <input
                  id="dataValidade"
                  type="date"
                  className="col-span-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formEntrada.dataValidade}
                  onChange={(e) => setFormEntrada({ ...formEntrada, dataValidade: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="observacao" className="text-right text-sm font-medium text-gray-700">
                  Observação
                </label>
                <input
                  id="observacao"
                  className="col-span-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formEntrada.observacao}
                  onChange={(e) => setFormEntrada({ ...formEntrada, observacao: e.target.value })}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setModalEntradaAberto(false)}
              >
                Cancelar
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={registrarEntrada}
              >
                Registrar Entrada
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Ajuste de Estoque */}
      {modalAjusteAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setModalAjusteAberto(false)}></div>
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Ajuste de Estoque - {produtoSelecionado?.nome}</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="tipoAjuste" className="text-right text-sm font-medium text-gray-700">
                  Tipo de Ajuste
                </label>
                <div className="col-span-3 flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="adicao"
                      name="tipoAjuste"
                      value="adicao"
                      checked={formAjuste.tipo === "adicao"}
                      onChange={() => setFormAjuste({ ...formAjuste, tipo: "adicao" })}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="adicao" className="text-sm text-gray-700">Adição</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="remocao"
                      name="tipoAjuste"
                      value="remocao"
                      checked={formAjuste.tipo === "remocao"}
                      onChange={() => setFormAjuste({ ...formAjuste, tipo: "remocao" })}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="remocao" className="text-sm text-gray-700">Remoção</label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="quantidadeAjuste" className="text-right text-sm font-medium text-gray-700">
                  Quantidade
                </label>
                <input
                  id="quantidadeAjuste"
                  type="number"
                  min="1"
                  className="col-span-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formAjuste.quantidade}
                  onChange={(e) => setFormAjuste({ ...formAjuste, quantidade: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="motivo" className="text-right text-sm font-medium text-gray-700">
                  Motivo
                </label>
                <input
                  id="motivo"
                  className="col-span-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formAjuste.motivo}
                  onChange={(e) => setFormAjuste({ ...formAjuste, motivo: e.target.value })}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setModalAjusteAberto(false)}
              >
                Cancelar
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={registrarAjuste}
              >
                Registrar Ajuste
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}