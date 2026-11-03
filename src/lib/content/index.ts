// Camada única de conteúdo. Hoje lê mocks; depois, trocar a implementação
// destas funções pelo SDK do Directus mantendo as mesmas assinaturas.
import type { Category, MenuItem, Page, Paginated, Post } from "./types";
import { categories } from "./mock/categories";
import { menu } from "./mock/menu";
import pagesData from "./mock/pages.json";
import postsData from "./mock/posts.json";

export type { Category, MenuItem, Page, Paginated, Post } from "./types";

export const POSTS_PER_PAGE = 4;

const posts: Post[] = [...(postsData as Post[])].sort((a, b) =>
  b.date.localeCompare(a.date),
);
const pages: Page[] = pagesData as Page[];

export async function getPosts({
  category,
  page = 1,
  perPage = POSTS_PER_PAGE,
}: { category?: string; page?: number; perPage?: number } = {}): Promise<
  Paginated<Post>
> {
  const filtered = category
    ? posts.filter((p) => p.categories.includes(category))
    : posts;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  return {
    items: filtered.slice(start, start + perPage),
    page,
    totalPages,
    total: filtered.length,
  };
}

export async function getPost(slug: string): Promise<Post | null> {
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getPage(slug: string): Promise<Page | null> {
  return pages.find((p) => p.slug === slug) ?? null;
}

export async function getPages(): Promise<Page[]> {
  return pages;
}

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getMenu(): Promise<MenuItem[]> {
  return menu;
}
