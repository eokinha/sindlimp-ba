import { notFound } from "next/navigation";
import Breadcrumb from "./Breadcrumb";
import Pagination from "./Pagination";
import PostCard from "./PostCard";
import Sidebar from "./Sidebar";
import { getCategories, getPosts } from "@/lib/content";

export default async function CategoryArchive({ slug, page }: { slug: string; page: number }) {
  const category = (await getCategories()).find((c) => c.slug === slug);
  if (!category || !Number.isInteger(page) || page < 1) notFound();

  const result = await getPosts({ category: slug, page });
  if (page > result.totalPages) notFound();

  return (
    <>
      <Breadcrumb
        title={`Arquivo da categoria: ${category.name}`}
        trail={[{ label: `Arquivo por categoria "${category.name}"` }]}
      />
      <div className="section container layout-sidebar">
        <div>
          {result.items.length === 0 ? (
            <p className="empty">Nenhum post nesta categoria ainda.</p>
          ) : (
            <div className="grid-2">
              {result.items.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
          <Pagination basePath={`/category/${slug}`} page={page} totalPages={result.totalPages} />
        </div>
        <Sidebar />
      </div>
    </>
  );
}
