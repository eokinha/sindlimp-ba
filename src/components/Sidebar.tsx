import Link from "next/link";
import { getCategories, getPosts } from "@/lib/content";
import SearchForm from "./SearchForm";

export default async function Sidebar() {
  const [categories, recent] = await Promise.all([getCategories(), getPosts({ perPage: 5 })]);
  return (
    <aside className="sidebar">
      <section className="widget">
        <h5 className="widget-title">Pesquisar</h5>
        <SearchForm />
      </section>
      <section className="widget">
        <h5 className="widget-title">Posts recentes</h5>
        <ul>
          {recent.items.map((p) => (
            <li key={p.slug}>
              <Link href={`/${p.slug}`}>{p.title}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="widget">
        <h5 className="widget-title">Categorias</h5>
        <ul>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/category/${c.slug}`}>{c.name}</Link>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
