import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { formatPostDate } from "@/components/format";
import PostThumb from "@/components/PostThumb";
import Sidebar from "@/components/Sidebar";
import { getCategories, getPage, getPages, getPost, getPosts } from "@/lib/content";

// Rotas todas pré-geradas por generateStaticParams; qualquer outro parâmetro responde 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const { items } = await getPosts({ perPage: 1000 });
  return [...items.map((p) => ({ slug: p.slug })), ...(await getPages()).map((p) => ({ slug: p.slug }))];
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = (await getPost(slug)) ?? (await getPage(slug));
  return { title: item?.title ?? "Página não encontrada" };
}

export default async function SlugPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (post) {
    const categories = await getCategories();
    const firstCat = categories.find((c) => post.categories.includes(c.slug));
    const { day, monthYear } = formatPostDate(post.date);
    return (
      <>
        <Breadcrumb
          title={post.title}
          trail={[
            ...(firstCat ? [{ label: firstCat.name, href: `/category/${firstCat.slug}` }] : []),
            { label: post.title },
          ]}
        />
        <div className="section container layout-sidebar">
          <article className="post-single">
            <div className="post-single__image">
              <PostThumb src={post.image} alt="" sizes="(max-width: 992px) 100vw, 800px" priority />
            </div>
            <div className="post-single__body">
              <span className="post-date">
                <span>{day}</span>
                {monthYear}
              </span>
              <h5 className="post-single__title">{post.title}</h5>
              <div className="entry-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
              {post.categories.length > 0 && (
                <p className="post-single__cats">
                  Categorias:{" "}
                  {categories
                    .filter((c) => post.categories.includes(c.slug))
                    .map((c, i) => (
                      <span key={c.slug}>
                        {i > 0 && ", "}
                        <Link href={`/category/${c.slug}`}>{c.name}</Link>
                      </span>
                    ))}
                </p>
              )}
            </div>
          </article>
          <Sidebar />
        </div>
      </>
    );
  }

  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <>
      <Breadcrumb title={page.title} trail={[{ label: page.title }]} />
      <div className="section container layout-sidebar">
        <div className="entry-content page-content" dangerouslySetInnerHTML={{ __html: page.contentHtml }} />
        <Sidebar />
      </div>
    </>
  );
}
