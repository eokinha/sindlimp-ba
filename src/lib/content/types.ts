export type Category = {
  slug: string;
  name: string;
};

export type Post = {
  slug: string;
  title: string;
  /** ISO 8601 */
  date: string;
  excerpt: string;
  contentHtml: string;
  /** Caminho público da imagem destacada, ou null se não houver */
  image: string | null;
  /** Slugs das categorias */
  categories: string[];
};

export type Page = {
  slug: string;
  title: string;
  contentHtml: string;
};

export type MenuItem = {
  label: string;
  href: string;
  children?: MenuItem[];
};

export type Paginated<T> = {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
};
