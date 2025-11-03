"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function Estoque() {
  const router = useRouter();
  const [lojas, setLojas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [selectedLoja, setSelectedLoja] = useState("");
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const [novoEstoque, setNovoEstoque] = useState({
    produto_id: "",
    loja_id: "",
    quantidade: "",
    preco: "",
    valido_ate: "",
  });

  // Sincroniza loja selecionada com o novo estoque
  useEffect(() => {
    setNovoEstoque((prev) => ({ ...prev, loja_id: selectedLoja }));
  }, [selectedLoja]);

  // Exibe alertas
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false }), 3000);
  };

  // Carregar lojas e produtos
  useEffect(() => {
    async function carregarDados() {
      try {
        const [resProdutos, resLojas] = await Promise.all([
          fetch(`${API_URL}/produtos`),
          fetch(`${API_URL}/lojas`),
        ]);

        const produtosJson = await resProdutos.json();
        const lojasJson = await resLojas.json();

        const produtosArray = Array.isArray(produtosJson)
          ? produtosJson
          : produtosJson.produtos || [];
        const lojasArray = Array.isArray(lojasJson)
          ? lojasJson
          : lojasJson.lojas || [];

        setProdutos(produtosArray);
        setLojas(lojasArray);
      } catch (err) {
        console.error(err);
        showAlert("error", "Erro ao carregar produtos e lojas");
      }
    }
    carregarDados();
  }, []);

  // Carregar estoque
  useEffect(() => {
    if (!selectedLoja) return;
    async function carregarEstoque() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/estoque?loja_id=${selectedLoja}`);
        const json = await res.json();
        setEstoque(Array.isArray(json.estoque) ? json.estoque : []);
      } catch (err) {
        showAlert("error", "Erro ao carregar estoque");
      } finally {
        setLoading(false);
      }
    }
    carregarEstoque();
  }, [selectedLoja]);

  // Adicionar item
  const handleAdd = async (e) => {
    e.preventDefault();
    const { produto_id, quantidade, preco, valido_ate } = novoEstoque;

    if (!produto_id || !selectedLoja)
      return showAlert("error", "Selecione uma loja e um produto.");

    try {
      const res = await fetch(`${API_URL}/estoque/${produto_id}/${selectedLoja}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantidade: parseFloat(quantidade),
          preco: parseFloat(preco),
          valido_ate: valido_ate || null,
        }),
      });

      if (!res.ok) throw new Error("Erro ao adicionar no estoque");

      showAlert("success", "Item adicionado!");
      setNovoEstoque({
        produto_id: "",
        loja_id: selectedLoja,
        quantidade: "",
        preco: "",
        valido_ate: "",
      });

      // Atualiza lista
      const updated = await fetch(`${API_URL}/estoque?loja_id=${selectedLoja}`);
      const json = await updated.json();
      setEstoque(json.estoque || []);
    } catch (err) {
      showAlert("error", err.message);
    }
  };

  // Excluir item
  const handleDelete = async (produto_id, loja_id) => {
    if (!window.confirm("Excluir este item do estoque?")) return;

    try {
      const res = await fetch(`${API_URL}/estoque/${produto_id}/${loja_id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao excluir");

      showAlert("success", "Item removido!");
      setEstoque((prev) =>
        prev.filter((p) => !(p.produto_id === produto_id && p.loja_id === loja_id))
      );
    } catch (err) {
      showAlert("error", err.message);
    }
  };

  return (
    <main className="min-h-screen bg-white pt-14 sm:pt-16">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {alert.show && (
          <div className="mb-6">
            <Alert variant={alert.type === "success" ? "default" : "destructive"}>
              {alert.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>{alert.type === "success" ? "Sucesso!" : "Erro!"}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          </div>
        )}

        <h1 className="text-2xl font-bold text-center text-[#2A4E73] mb-6">
          Gerenciamento de Estoque
        </h1>

        {/* Selecionar Loja */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#2A4E73] mb-2">
            Selecione uma Loja
          </label>
          <select
            value={selectedLoja}
            onChange={(e) => setSelectedLoja(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#CFE8F9]"
          >
            <option value="">Selecione...</option>
            {lojas.map((loja) => (
              <option key={loja.id ?? loja.loja_id} value={loja.id ?? loja.loja_id}>
                {loja.nome} ({loja.tipo})
              </option>
            ))}
          </select>
        </div>

        {/* Formulário de Adição */}
        <form onSubmit={handleAdd} className="bg-[#F7FAFC] rounded-lg p-4 shadow-md mb-8">
          <h2 className="text-lg font-semibold text-[#2A4E73] mb-3 text-center">
            Adicionar Item ao Estoque
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Produto */}
            <div>
              <label className="block text-sm font-medium text-[#2A4E73] mb-1">Produto</label>
              <select
                value={novoEstoque.produto_id}
                onChange={(e) =>
                  setNovoEstoque({ ...novoEstoque, produto_id: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#CFE8F9]"
              >
                <option value="">Selecione...</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantidade */}
            <div>
              <label className="block text-sm font-medium text-[#2A4E73] mb-1">Quantidade</label>
              <input
                type="number"
                value={novoEstoque.quantidade}
                onChange={(e) =>
                  setNovoEstoque({ ...novoEstoque, quantidade: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#CFE8F9]"
                min="1"
              />
            </div>

            {/* Preço */}
            <div>
              <label className="block text-sm font-medium text-[#2A4E73] mb-1">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                value={novoEstoque.preco}
                onChange={(e) =>
                  setNovoEstoque({ ...novoEstoque, preco: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#CFE8F9]"
                min="0"
              />
            </div>

            {/* Validade */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#2A4E73] mb-1">Válido até</label>
              <input
                type="date"
                value={novoEstoque.valido_ate}
                onChange={(e) =>
                  setNovoEstoque({ ...novoEstoque, valido_ate: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#CFE8F9]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 w-full py-2 bg-[#2A4E73] text-white rounded-md hover:bg-[#AD343E] transition-colors"
          >
            Adicionar
          </button>
        </form>

        {/* Lista de Estoque */}
        <section className="bg-[#F7FAFC] rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-[#2A4E73] mb-3 text-center">
            Itens no Estoque
          </h2>

          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-[#2A4E73]" />
            </div>
          ) : !selectedLoja ? (
            <p className="text-center text-[#2A4E73] py-6">
              Selecione uma loja para visualizar o estoque.
            </p>
          ) : estoque.length === 0 ? (
            <p className="text-center text-[#2A4E73] py-6">Nenhum item cadastrado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-[#2A4E73] border-collapse">
                <thead>
                  <tr className="bg-[#2A4E73] text-white">
                    <th className="px-3 py-2 text-left">Produto</th>
                    <th className="px-3 py-2 text-center">Qtd</th>
                    <th className="px-3 py-2 text-center">Preço</th>
                    <th className="px-3 py-2 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {estoque.map((item) => {
                    const produto = produtos.find((p) => p.id === item.produto_id);
                    return (
                      <tr
                        key={`${item.produto_id}-${item.loja_id}`}
                        className="border-b border-gray-200 hover:bg-[#CFE8F9]"
                      >
                        <td className="px-3 py-2">{produto?.nome || "Desconhecido"}</td>
                        <td
                          className={`px-3 py-2 text-center ${
                            item.quantidade < 10 ? "text-[#AD343E]" : ""
                          }`}
                        >
                          {item.quantidade}
                        </td>
                        <td className="px-3 py-2 text-center">
                          R$ {parseFloat(item.preco).toFixed(2).replace(".", ",")}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => handleDelete(item.produto_id, item.loja_id)}
                            className="px-3 py-1 bg-[#AD343E] text-white rounded hover:bg-[#2A4E73] transition"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
}
