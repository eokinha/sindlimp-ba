import Link from "next/link";

export default function Breadcrumb({
  title,
  trail,
}: {
  title: string;
  trail: { label: string; href?: string }[];
}) {
  return (
    <section className="breadcrumb-area">
      <div className="container">
        <h2>{title}</h2>
        <ol className="breadcrumb-list">
          <li>
            <Link href="/">Página inicial</Link>
          </li>
          {trail.map((t) => (
            <li key={t.label} className={t.href ? undefined : "active"}>
              {t.href ? <Link href={t.href}>{t.label}</Link> : t.label}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
