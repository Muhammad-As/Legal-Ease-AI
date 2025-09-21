"use client";
import { useState } from "react";
import { api, getErrorMessage } from "../../lib/api";
import UploadCard from "../../components/UploadCard";
import Alert from "../../components/Alert";

export default function Summarize() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  async function handleUpload() {
    if (!file) return;
    setError(null);
    setProgress(0);
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await api.post("/summarize", form, {
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        },
      });
      setResult(res.data.summary ?? "");
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  function handleDownload() {
    if (!result) return;
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📄 Summarize</h2>

      <UploadCard
        file={file}
        onFileSelected={setFile}
        accept=".pdf,application/pdf"
        helpText="PDF only. Your file stays in your session."
      />

      <div className="mt-4 flex gap-2">
        <button onClick={handleUpload} className="btn" disabled={loading || !file}>
          {loading ? "Summarizing..." : "Summarize"}
        </button>
        {result && (
          <>
            <button onClick={handleCopy} className="btn bg-gray-800 hover:bg-gray-900">
              {copied ? "Copied" : "Copy"}
            </button>
            <button onClick={handleDownload} className="btn bg-green-600 hover:bg-green-700">
              Download
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="mt-4">
          <Alert kind="error">{error}</Alert>
        </div>
      )}

      {loading && (
        <div className="mt-6 animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
          {progress > 0 && (
            <div className="mt-2 text-sm text-gray-500">Uploading: {progress}%</div>
          )}
        </div>
      )}

      {result && !loading && (
        <pre className="mt-6 p-4 bg-white border rounded-lg whitespace-pre-wrap mono">
          {result}
        </pre>
      )}
    </div>
  );
}
