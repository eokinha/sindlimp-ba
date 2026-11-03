import Link from "next/link";
import type { Post } from "@/lib/content";
import { formatPostDate } from "./format";
import PostThumb from "./PostThumb";

// `count`: variante da home (post-carousel do tema): imagem só no hover e número vazado.
export default function PostCard({ post, count }: { post: Post; count?: number }) {
  const { day, monthYear } = formatPostDate(post.date);
  const href = `/${post.slug}`;
  return (
    <article className={`post-card${count ? " post-card--overlay" : ""}`}>
      <Link href={href} className="post-card__image" aria-hidden="true" tabIndex={-1}>
        <PostThumb src={post.image} alt="" sizes="(max-width: 768px) 100vw, 400px" />
      </Link>
      <div className="post-card__content">
        <span className="post-date">
          <span>{day}</span>
          {monthYear}
        </span>
        <h5 className="post-card__title">
          <Link href={href}>{post.title}</Link>
        </h5>
        <p className="post-card__excerpt">{post.excerpt}</p>
        <Link href={href} className="more-link">
          Leia Mais
        </Link>
        {count ? <span className="post-count">{count}</span> : null}
      </div>
    </article>
  );
}
