import type { Metadata } from "next";
import CategoryArchive from "@/components/CategoryArchive";
import { getCategories, getPosts } from "@/lib/content";

// Rotas todas pré-geradas por generateStaticParams; qualquer outro parâmetro responde 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const params: { slug: string; page: string }[] = [];
  for (const c of await getCategories()) {
    const { totalPages } = await getPosts({ category: c.slug });
    for (let n = 2; n <= totalPages; n++) params.push({ slug: c.slug, page: String(n) });
  }
  // Com Cache Components a lista não pode ser vazia.
  return params.length > 0 ? params : [{ slug: "em-pauta", page: "2" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/category/[slug]/page/[page]">): Promise<Metadata> {
  const { slug, page } = await params;
  const category = (await getCategories()).find((c) => c.slug === slug);
  return { title: category ? `${category.name} – Página ${page}` : "Página não encontrada" };
}

export default async function CategoryPagedPage({ params }: PageProps<"/category/[slug]/page/[page]">) {
  const { slug, page } = await params;
  return <CategoryArchive slug={slug} page={Number(page)} />;
}
