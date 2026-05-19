import Link from "next/link";

export default function Header() {
  return (
    <header className="px-4 py-4" style={{ background: "#FCFFFE" }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/">
          <img src="/images/logo.webp" alt="Calzasi" width={160} height={60} />
        </Link>
        <nav className="flex gap-6 text-sm">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/catalogo" className="hover:text-primary transition-colors">
            Catalogo
          </Link>
        </nav>
      </div>
    </header>
  );
}
