import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

export default function NotFound() {
  return (
    <>
      <Breadcrumb title="Página não encontrada" trail={[{ label: "404" }]} />
      <section className="section container not-found">
        <h2 className="not-found__code">404</h2>
        <p>Desculpe, a página que você procura não existe ou foi removida.</p>
        <Link href="/" className="btn-primary">
          Voltar para a página inicial
        </Link>
      </section>
    </>
  );
}
