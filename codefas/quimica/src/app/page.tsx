"use client";

import { useState, useRef, useEffect } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Filler,
} from "chart.js";
import AuthWrapper from "@/components/root/AuthWrapper";
import { FaCog } from "react-icons/fa";
import { useSession } from "next-auth/react";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Filler
);

export default function Chemistry() {
  const { data: session } = useSession();

  const [nomeCalculo, setNomeCalculo] = useState<string>("Teor de Umidade");
  const [massaInicial, setMassaInicial] = useState<number | "">("");
  const [tempoInicial, setTempoInicial] = useState<string>(() =>
    new Date().toTimeString().slice(0, 5)
  );
  const [leituras, setLeituras] = useState<{ tempo: string; massa: number }[]>(
    []
  );
  const [massaAtual, setMassaAtual] = useState<number | "">("");
  const [tempoAtual, setTempoAtual] = useState<string>(() =>
    new Date().toTimeString().slice(0, 5)
  );
  const [resultado, setResultado] = useState<string | null>(null);
  const [menuAberto, setMenuAberto] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("quimica-leituras");
    if (data) {
      try {
        const json = JSON.parse(data);
        if (json.massaInicial && json.leituras) {
          setMassaInicial(json.massaInicial);
          setLeituras(json.leituras);
          if (json.tempoInicial) setTempoInicial(json.tempoInicial);
          if (json.nomeCalculo) setNomeCalculo(json.nomeCalculo);
          setTimeout(() => renderizarGrafico(json.leituras), 100);
        }
      } catch {
        console.log("Arquivo localStorage inválido");
      }
    }
  }, []);

  useEffect(() => {
    const data = { nomeCalculo, massaInicial, tempoInicial, leituras };
    localStorage.setItem("quimica-leituras", JSON.stringify(data));
  }, [nomeCalculo, massaInicial, tempoInicial, leituras]);

  function renderizarGrafico(
    novasLeituras: { tempo: string; massa: number }[]
  ) {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const tempos = novasLeituras.map((l) => l.tempo);
    const massas = novasLeituras.map((l) => l.massa);

    if (chartInstanceRef.current) {
      chartInstanceRef.current.data.labels = tempos;
      chartInstanceRef.current.data.datasets[0].data = massas;
      chartInstanceRef.current.update();
    } else {
      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: tempos,
          datasets: [
            {
              label: "Curva de Secagem",
              data: massas,
              borderColor: "#06b6d4",
              backgroundColor: "rgba(6, 182, 212, 0.2)",
              tension: 0.4,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Tempo" } },
            y: {
              title: { display: true, text: "Massa (g)" },
              beginAtZero: false,
            },
          },
        },
      });
    }
  }

  function enviarMassaInicial() {
    if (!massaInicial || massaInicial <= 0)
      return alert("Insira uma massa inicial válida.");
    const novaLeitura = [{ tempo: tempoInicial, massa: massaInicial }];
    setLeituras(novaLeitura);
    renderizarGrafico(novaLeitura);
  }

  function adicionarLeitura() {
    if (!massaAtual || massaAtual <= 0)
      return alert("Insira uma massa atual válida.");
    const ultimaMassa = leituras[leituras.length - 1].massa;
    if (massaAtual > ultimaMassa)
      return alert("A massa deve diminuir com a secagem.");
    const novasLeituras = [
      ...leituras,
      { tempo: tempoAtual, massa: massaAtual },
    ];
    setLeituras(novasLeituras);
    setMassaAtual("");
    renderizarGrafico(novasLeituras);
  }

  function calcularUmidade() {
    if (leituras.length < 2) {
      setResultado(
        "São necessárias pelo menos duas leituras (Massa inicial + 1) para calcular."
      );
      return;
    }
    const massaFinal = leituras[leituras.length - 1].massa;
    const teorUmidade =
      (((massaInicial as number) - massaFinal) / (massaInicial as number)) *
      100;
    setResultado(
      teorUmidade < 0
        ? `Erro: Massa final (${massaFinal.toFixed(2)} g) maior que a inicial.`
        : `${nomeCalculo}: ${teorUmidade.toFixed(2)}%`
    );
  }

  function limparTudo() {
    setNomeCalculo("Teor de Umidade");
    setMassaInicial("");
    setTempoInicial(new Date().toTimeString().slice(0, 5));
    setLeituras([]);
    setMassaAtual("");
    setTempoAtual("00:10");
    setResultado(null);
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    chartInstanceRef.current = null;
    localStorage.removeItem("quimica-leituras");
    setMenuAberto(false);
  }

  function salvarJSON() {
    if (!leituras.length) return alert("Nenhuma leitura para salvar.");
    const nomeArquivo =
      nomeCalculo
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_-]/g, "") || "leituras";
    const dataObj = { name: nomeCalculo, leituras, massaInicial, tempoInicial };
    const dataStr = JSON.stringify(dataObj, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${nomeArquivo}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMenuAberto(false);
  }

  function aplicarJSON(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.massaInicial || !json.leituras)
          throw new Error("Formato inválido");
        setNomeCalculo(json.nomeCalculo || "Teor de Umidade");
        setMassaInicial(json.massaInicial);
        setLeituras(json.leituras);
        if (json.tempoInicial) setTempoInicial(json.tempoInicial);
        renderizarGrafico(json.leituras);
        setMenuAberto(false);
      } catch {
        alert("Arquivo inválido");
      }
    };
    reader.readAsText(file);
  }

  return (
    <AuthWrapper>
      <div className="max-w-3xl mx-auto p-6 shadow-lg rounded-2xl min-h-[80vh] flex flex-col justify-between border border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-center mb-6 text-cyan-600">
            Método de Secagem em Estufa
          </h1>

          {/* Nome do cálculo */}
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-700">
              Nome do Cálculo
            </label>
            <input
              type="text"
              value={nomeCalculo}
              onChange={(e) => setNomeCalculo(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none transition"
            />
          </div>

          {/* Massa inicial */}
          {leituras.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Massa Inicial (g)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={massaInicial}
                  onChange={(e) => setMassaInicial(parseFloat(e.target.value))}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none transition"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Hora da Leitura Inicial
                </label>
                <input
                  type="time"
                  value={tempoInicial}
                  onChange={(e) => setTempoInicial(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-cyan-400 outline-none transition"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  onClick={enviarMassaInicial}
                  className="w-full py-3 bg-cyan-500 text-white font-semibold rounded-xl hover:bg-cyan-600 transition shadow-md"
                >
                  Registrar Massa Inicial
                </button>
              </div>
            </div>
          )}

          {/* Tabela */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md text-center text-sm md:text-base">
              <thead>
                <tr className="bg-cyan-100 text-cyan-800">
                  <th className="border px-3 py-2">Tempo</th>
                  <th className="border px-3 py-2">Massa (g)</th>
                </tr>
              </thead>
              <tbody>
                {leituras.map((l, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="border px-3 py-2">{l.tempo}</td>
                    <td className="border px-3 py-2">{l.massa.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resultado */}
          {resultado && (
            <div className="p-4 bg-cyan-50 border border-cyan-300 rounded-xl text-center font-semibold text-cyan-700 shadow">
              {resultado}
            </div>
          )}
        </div>

        {/* Footer de botões */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 border-t pt-4">
          <button
            onClick={calcularUmidade}
            className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition shadow"
          >
            Calcular Umidade
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="p-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition shadow"
            >
              <FaCog className="text-gray-600" />
            </button>
            {menuAberto && (
              <div className="absolute bottom-full right-0 mb-2 w-56 bg-white border rounded-xl shadow-lg z-50 flex flex-col overflow-hidden">
                <button
                  onClick={limparTudo}
                  className="px-4 py-2 hover:bg-red-500 hover:text-white transition text-left"
                >
                  Limpar Tudo
                </button>
                <button
                  onClick={salvarJSON}
                  className="px-4 py-2 hover:bg-blue-500 hover:text-white transition text-left"
                >
                  Download
                </button>
                <label className="px-4 py-2 hover:bg-yellow-400 hover:text-white transition text-left cursor-pointer">
                  Aplicar JSON
                  <input
                    type="file"
                    accept=".json"
                    onChange={aplicarJSON}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
