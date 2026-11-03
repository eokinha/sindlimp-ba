import Link from "next/link";
import { Reveal } from "./Motion";

export default function Breadcrumb({
  title,
  trail,
}: {
  title: string;
  trail: { label: string; href?: string }[];
}) {
  return (
    <section className="breadcrumb-area">
      <div className="container breadcrumb-content">
        <Reveal animation="fadeInLeft" className="breadcrumb-heading">
          <h2>{title}</h2>
        </Reveal>
        <Reveal animation="fadeInRight" className="breadcrumb-list-wrap">
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
        </Reveal>
      </div>
    </section>
  );
}
