import type { Metadata } from "next";
import CategoryArchive from "@/components/CategoryArchive";
import { getCategories } from "@/lib/content";

// Rotas todas pré-geradas por generateStaticParams; qualquer outro parâmetro responde 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getCategories()).find((c) => c.slug === slug);
  return { title: category?.name ?? "Página não encontrada" };
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  return <CategoryArchive slug={slug} page={1} />;
}
