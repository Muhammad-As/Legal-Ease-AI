"use client";
import { useMemo, useState } from "react";
import { api, getErrorMessage } from "../../lib/api";
import UploadCard from "../../components/UploadCard";
import Alert from "../../components/Alert";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("../../components/PdfViewer"), { ssr: false });

const COLORS: Record<string, string> = {
  LOW: "#4CAF50",
  MEDIUM: "#FFC107",
  HIGH: "#F44336",
};

type RiskItem = {
  clause: string;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  reason: string;
};

export default function Risks() {
  const [file, setFile] = useState<File | null>(null);
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  async function handleUpload() {
    if (!file) return;
    setError(null);
    setLoading(true);
    setProgress(0);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await api.post("/risks", form, {
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        },
      });
      setRisks(res.data.risks ?? []);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  const data = useMemo(() => {
    return ["LOW", "MEDIUM", "HIGH"].map((level) => ({
      name: level,
      value: risks.filter((r) => r.risk_level === level).length,
    }));
  }, [risks]);

  const total = data.reduce((s, d) => s + d.value, 0);

  // Create/cleanup object URL for PDF preview
  useMemo(() => {
    if (!file) { setFileUrl(null); return; }
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">⚠️ Risk Analysis</h2>

      <UploadCard
        file={file}
        onFileSelected={setFile}
        accept=".pdf,application/pdf"
        helpText="Upload a PDF to analyze clauses and risk levels."
      />

      <button onClick={handleUpload} className="btn mt-4" disabled={loading || !file}>
        {loading ? "Analyzing..." : "Analyze Risks"}
      </button>

      {error && (
        <div className="mt-4">
          <Alert kind="error">{error}</Alert>
        </div>
      )}

      {loading && (
        <div className="mt-6 animate-pulse text-sm text-gray-500">
          {progress > 0 ? `Uploading: ${progress}%` : "Analyzing..."}
        </div>
      )}

      {total > 0 && (
        <div className="mt-8 flex flex-col md:flex-row gap-8">
          <div className="card w-full md:w-[420px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Distribution</h3>
              <div className="text-sm text-gray-500">Total: {total}</div>
            </div>
            <PieChart width={380} height={280}>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={110} label>
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          <div className="flex-1 card">
            <h3 className="text-lg font-semibold mb-3">Detailed Risks</h3>
            <ul className="space-y-2 max-h-[600px] overflow-y-auto">
              {risks.map((r, i) => (
                <li key={i} className="p-3 border rounded bg-white">
                  <p>
                    <b>Clause:</b> {r.clause}
                  </p>
                  <p>
                    <b>Risk:</b> <span className="font-bold">{r.risk_level}</span>
                  </p>
                  <p>
                    <b>Reason:</b> {r.reason}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {file && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-3">Document Preview</h3>
          <div className="border rounded overflow-hidden">
            <PdfViewer fileUrl={fileUrl} highlightTerms={risks.map(r => r.clause).slice(0, 20)} />
          </div>
        </div>
      )}

      {total === 0 && !loading && (
        <p className="mt-6 text-gray-500">No risky items detected yet. Try another document.</p>
      )}
    </div>
  );
}
