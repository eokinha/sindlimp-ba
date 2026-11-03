import Image from "next/image";
import Link from "next/link";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`logo${light ? " logo--light" : ""}`} aria-label="Sindilimp BA - início">
      <Image src="/wp-content/uploads/2023/04/LOGO-1.png" alt="Sindilimp-BA" width={504} height={75} priority={!light} />
    </Link>
  );
}
