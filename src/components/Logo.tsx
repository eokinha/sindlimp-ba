import Link from "next/link";

// O logo original (LOGO-1.png) não está no espelho: versão tipográfica.
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`logo${light ? " logo--light" : ""}`} aria-label="Sindilimp BA - início">
      <span className="logo__mark">SINDILIMP</span>
      <span className="logo__ba">BA</span>
    </Link>
  );
}
