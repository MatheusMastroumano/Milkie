"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Headerfilial/page";

export default function FuncionariosFilial() {
  const router = useRouter();
  const [funcionarios, setFuncionarios] = useState([]);
  const [filialId, setFilialId] = useState(1); // ID da filial atual (deve ser obtido do contexto de autenticação)
  const [modalAberto, setModalAberto] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [formFuncionario, setFormFuncionario] = useState({
    nome: "",
    cargo: "",
    email: "",
    telefone: "",
    status: "ativo",
  });
  const [carregando, setCarregando] = useState(false);

  // Função para carregar funcionários da filial
  useEffect(() => {
    // Simulação de dados - em produção, substituir por chamada à API
    const funcionariosSimulados = [
      {
        id: 1,
        nome: "João Silva",
        cargo: "Atendente",
        email: "joao.silva@milki.com",
        telefone: "(11) 98765-4321",
        status: "ativo",
      },
      {
        id: 2,
        nome: "Maria Oliveira",
        cargo: "Caixa",
        email: "maria.oliveira@milki.com",
        telefone: "(11) 91234-5678",
        status: "ativo",
      },
      {
        id: 3,
        nome: "Pedro Santos",
        cargo: "Estoquista",
        email: "pedro.santos@milki.com",
        telefone: "(11) 99876-5432",
        status: "inativo",
      },
    ];
    
    setFuncionarios(funcionariosSimulados);
  }, []);

  // Função para abrir modal de edição
  const abrirModalEdicao = (funcionario) => {
    setFuncionarioSelecionado(funcionario);
    setFormFuncionario({
      nome: funcionario.nome,
      cargo: funcionario.cargo,
      email: funcionario.email,
      telefone: funcionario.telefone,
      status: funcionario.status,
    });
    setModalAberto(true);
  };

  // Função para salvar alterações do funcionário
  const salvarFuncionario = () => {
    // Validação do formulário
    if (!formFuncionario.nome || !formFuncionario.cargo || !formFuncionario.email) {
      alert("Erro: Preencha todos os campos obrigatórios");
      return;
    }

    // Simulação de atualização - em produção, substituir por chamada à API
    const funcionariosAtualizados = funcionarios.map(f => {
      if (f.id === funcionarioSelecionado.id) {
        return {
          ...f,
          ...formFuncionario,
        };
      }
      return f;
    });
    
    setFuncionarios(funcionariosAtualizados);
    setModalAberto(false);
    
    alert(`Sucesso: Funcionário ${formFuncionario.nome} atualizado com sucesso!`);
  };

  // Função para alternar status do funcionário
  const alternarStatus = (funcionario) => {
    const novoStatus = funcionario.status === "ativo" ? "inativo" : "ativo";
    
    // Simulação de atualização - em produção, substituir por chamada à API
    const funcionariosAtualizados = funcionarios.map(f => {
      if (f.id === funcionario.id) {
        return {
          ...f,
          status: novoStatus,
        };
      }
      return f;
    });
    
    setFuncionarios(funcionariosAtualizados);
    
    alert(`Sucesso: Status do funcionário ${funcionario.nome} alterado para ${novoStatus}!`);
  };

  return (
    <div className="container mx-auto py-6">
        <Header />
      <h1 className="text-3xl font-bold mb-6">Gestão de Funcionários - Filial</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Funcionários da Filial</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {funcionarios.map((funcionario) => (
                  <tr key={funcionario.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{funcionario.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{funcionario.cargo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{funcionario.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{funcionario.telefone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        funcionario.status === "ativo" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {funcionario.status === "ativo" ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button 
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                          onClick={() => abrirModalEdicao(funcionario)}
                        >
                          Editar
                        </button>
                        <button 
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            funcionario.status === "ativo" 
                              ? "bg-red-600 text-white hover:bg-red-700" 
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                          onClick={() => alternarStatus(funcionario)}
                        >
                          {funcionario.status === "ativo" ? "Desativar" : "Ativar"}
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
      
      {/* Modal de Edição de Funcionário */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Editar Funcionário</h3>
            </div>
            <div className="p-6">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="nome" className="text-right text-sm font-medium text-gray-700">
                    Nome
                  </label>
                  <input
                    id="nome"
                    className="col-span-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formFuncionario.nome}
                    onChange={(e) => setFormFuncionario({ ...formFuncionario, nome: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="cargo" className="text-right text-sm font-medium text-gray-700">
                    Cargo
                  </label>
                  <input
                    id="cargo"
                    className="col-span-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formFuncionario.cargo}
                    onChange={(e) => setFormFuncionario({ ...formFuncionario, cargo: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="email" className="text-right text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    className="col-span-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formFuncionario.email}
                    onChange={(e) => setFormFuncionario({ ...formFuncionario, email: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="telefone" className="text-right text-sm font-medium text-gray-700">
                    Telefone
                  </label>
                  <input
                    id="telefone"
                    className="col-span-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formFuncionario.telefone}
                    onChange={(e) => setFormFuncionario({ ...formFuncionario, telefone: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="status" className="text-right text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    className="col-span-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formFuncionario.status}
                    onChange={(e) => setFormFuncionario({ ...formFuncionario, status: e.target.value })}
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  onClick={salvarFuncionario} 
                  disabled={carregando}
                >
                  {carregando ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}