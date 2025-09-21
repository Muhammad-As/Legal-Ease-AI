"use client";
import { useState } from "react";
import { api, getErrorMessage } from "../../lib/api";
import UploadCard from "../../components/UploadCard";
import Alert from "../../components/Alert";

export default function QA() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState<{ chunk: number; snippet: string }[]>([]);
  const [history, setHistory] = useState<{ q: string; a: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  async function handleAsk() {
    if (!file || !question.trim()) return;
    setError(null);
    setProgress(0);
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("question", question);
    try {
      const res = await api.post("/qa", form, {
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        },
      });
      const ans = res.data.answer ?? "";
      setAnswer(ans);
      setCitations(res.data.citations ?? []);
      setHistory((h) => [{ q: question, a: ans }, ...h]);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">💬 Q&amp;A</h2>

      <UploadCard
        file={file}
        onFileSelected={setFile}
        accept=".pdf,application/pdf"
        helpText="Upload a PDF, then ask a question about its contents."
      />

      <textarea
        className="input mt-4"
        rows={4}
        placeholder="Enter your question here"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleAsk} className="btn mt-3" disabled={loading || !file || !question.trim()}>
        {loading ? "Thinking..." : "Ask"}
      </button>

      {error && (
        <div className="mt-4">
          <Alert kind="error">{error}</Alert>
        </div>
      )}

      {loading && (
        <div className="mt-4 text-sm text-gray-500">
          {progress > 0 ? `Uploading: ${progress}%` : "Thinking..."}
        </div>
      )}

      {answer && (
        <>
          <pre className="mt-6 p-4 bg-white border rounded-lg whitespace-pre-wrap mono">
            {answer}
          </pre>
          {citations.length > 0 && (
            <div className="mt-3 text-sm text-gray-600">
              <b>Citations:</b>
              <ul className="list-disc ml-6">
                {citations.map((c, i) => (
                  <li key={i}>[Chunk {c.chunk}] {c.snippet.slice(0, 120)}...</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      <div className="mt-6">
        <button className="btn bg-gray-800 hover:bg-gray-900" onClick={() => { setHistory([]); sessionStorage.removeItem("qaHistory"); }}>
          Clear History
        </button>
      </div>

      {history.length > 0 && (
        <div className="mt-10">
          <h3 className="font-semibold mb-2">Previous Questions</h3>
          <ul className="space-y-3">
            {history.map((h, i) => (
              <li key={i} className="border rounded p-3 bg-white">
                <p className="text-sm text-gray-500">Q: {h.q}</p>
                <pre className="mt-2 whitespace-pre-wrap mono">{h.a}</pre>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
