import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getMenu } from "@/lib/content";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Sindilimp BA",
    template: "%s – Sindilimp BA",
  },
  description:
    "Sindicato dos trabalhadores e trabalhadoras da limpeza pública e terceirizados da Bahia",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const menu = await getMenu();
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body>
        <noscript>
          <style>{`.wow{visibility:visible}`}</style>
        </noscript>
        <a className="skip-link" href="#content">
          Pular para o conteúdo
        </a>
        <Header menu={menu} />
        <main id="content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
