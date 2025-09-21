export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold tracking-tight">⚖️ LegalEase AI</h1>
      <p className="mt-3 text-lg text-gray-600 text-center">
        Upload contracts. Get clarity in seconds.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
        <a href="/summarize" className="card hover:shadow-lg transition">
          <div className="text-3xl">📄</div>
          <h3 className="mt-2 font-semibold">Summarize</h3>
          <p className="text-sm text-gray-600">Concise bullets and an ELI15 explanation.</p>
        </a>
        <a href="/risks" className="card hover:shadow-lg transition">
          <div className="text-3xl">⚠️</div>
          <h3 className="mt-2 font-semibold">Risks</h3>
          <p className="text-sm text-gray-600">Risk distribution and detailed clauses.</p>
        </a>
        <a href="/qa" className="card hover:shadow-lg transition">
          <div className="text-3xl">💬</div>
          <h3 className="mt-2 font-semibold">Q&amp;A</h3>
          <p className="text-sm text-gray-600">Ask questions and keep a session history.</p>
        </a>
      </div>
    </div>
  );
}
