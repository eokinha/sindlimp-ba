import type { MenuItem } from "../types";

export const menu: MenuItem[] = [
  {
    label: "Institucional",
    href: "/category/instuticional",
    children: [
      { label: "Histórico", href: "/histor" },
      { label: "Diretoria", href: "/secretarias" },
    ],
  },
  { label: "Jurídico", href: "/plantoes-juridicos" },
  { label: "Política", href: "/category/politica" },
  { label: "Mulheres", href: "/category/mulheres" },
  { label: "Em Pauta", href: "/category/em-pauta" },
  { label: "Opinião", href: "/category/opiniao" },
  { label: "Parcerias", href: "/category/parcerias" },
];
