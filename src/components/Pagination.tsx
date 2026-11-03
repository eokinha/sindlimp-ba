import Link from "next/link";

export default function Pagination({
  basePath,
  page,
  totalPages,
}: {
  basePath: string;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;
  const href = (n: number) => (n === 1 ? basePath : `${basePath}/page/${n}`);
  return (
    <nav className="pagination" aria-label="Paginação">
      {page > 1 && (
        <Link href={href(page - 1)} className="page-numbers">
          &lsaquo; Anterior
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) =>
        n === page ? (
          <span key={n} className="page-numbers current" aria-current="page">
            {n}
          </span>
        ) : (
          <Link key={n} href={href(n)} className="page-numbers">
            {n}
          </Link>
        ),
      )}
      {page < totalPages && (
        <Link href={href(page + 1)} className="page-numbers">
          Próxima &rsaquo;
        </Link>
      )}
    </nav>
  );
}
