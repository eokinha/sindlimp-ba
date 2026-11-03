import Image from "next/image";

export default function PostThumb({
  src,
  alt,
  sizes,
  priority,
}: {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  const url = src ?? "/placeholder.svg";
  return (
    <Image
      src={url}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={url.endsWith(".svg")}
      style={{ objectFit: "cover" }}
    />
  );
}
