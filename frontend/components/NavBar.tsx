import Link from "next/link";

export default function NavBar() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">LegalEase AI</Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/summarize" className="hover:underline">Summarize</Link>
          <Link href="/risks" className="hover:underline">Risks</Link>
          <Link href="/qa" className="hover:underline">Q&A</Link>
        </nav>
      </div>
    </header>
  );
}

