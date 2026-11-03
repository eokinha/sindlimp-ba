"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { MenuItem } from "@/lib/content";
import Icon from "./Icon";
import Logo from "./Logo";
import SearchForm from "./SearchForm";
import { SOCIAL } from "./site";

function isActive(pathname: string, item: MenuItem): boolean {
  if (pathname === item.href || pathname.startsWith(item.href + "/")) return true;
  return item.children?.some((c) => isActive(pathname, c)) ?? false;
}

export default function Header({ menu }: { menu: MenuItem[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  // sticky-nav do tema: passado o cabeçalho, a barra (menu no desktop, logo+hambúrguer no mobile) fica fixa e entra com fadeInDown.
  const headerRef = useRef<HTMLElement>(null);
  const [sticky, setSticky] = useState(false);
  const [height, setHeight] = useState<number | undefined>(undefined);
  useEffect(() => {
    const onScroll = () => {
      const el = headerRef.current;
      if (!el) return;
      if (!el.classList.contains("is-sticky")) setHeight(el.offsetHeight);
      setSticky(window.scrollY > el.offsetHeight);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  // Fecha o menu móvel ao trocar de rota (ajuste de estado durante o render).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
    setOpenSub(null);
  }

  return (
    <header ref={headerRef} className={`site-header${sticky ? " is-sticky" : ""}`} style={sticky ? { minHeight: height } : undefined}>
      <div className="header-top">
        <div className="container header-top__inner">
          <Logo />
          <div className="header-top__right">
            <div className="contact-area">
              <span className="contact-icon">
                <Icon name="chat" />
              </span>
              <span className="contact-info">
                <span className="title">Telefone</span>
                <span className="text">(71) 3032-8550</span>
              </span>
            </div>
            <div className="contact-area">
              <span className="contact-icon">
                <Icon name="clock" />
              </span>
              <span className="contact-info">
                <span className="title">Horário de funcionamento</span>
                <span className="text">De segunda a sexta; das 8h às 16h</span>
              </span>
            </div>
            <a href={SOCIAL.instagram} className="btn-primary" target="_blank" rel="noreferrer">
              Seguir <Icon name="user" size={14} />
            </a>
          </div>
          <button
            type="button"
            className={`hamburger${mobileOpen ? " is-open" : ""}`}
            aria-label="Abrir menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`navbar${mobileOpen ? " is-open" : ""}`}>
        <div className="container navbar__inner">
          <div className="navbar__social">
            <span className="share-toggle" aria-hidden="true">
              <Icon name="share" />
            </span>
            <a href={SOCIAL.facebook} aria-label="Facebook" target="_blank" rel="noreferrer">
              <Icon name="facebook" size={14} />
            </a>
            <a href={SOCIAL.instagram} aria-label="Instagram" target="_blank" rel="noreferrer">
              <Icon name="instagram" size={14} />
            </a>
          </div>
          <nav className="menubar" aria-label="Menu principal">
            <ul className="menu-wrap">
              {menu.map((item) => (
                <li
                  key={item.href}
                  className={`menu-item${item.children ? " has-children" : ""}${
                    isActive(pathname, item) ? " active" : ""
                  }${openSub === item.href ? " sub-open" : ""}`}
                >
                  <Link href={item.href}>{item.label}</Link>
                  {item.children && (
                    <>
                      <button
                        type="button"
                        className="sub-toggle"
                        aria-label={`Submenu ${item.label}`}
                        aria-expanded={openSub === item.href}
                        onClick={() => setOpenSub((v) => (v === item.href ? null : item.href))}
                      >
                        <Icon name="chevronDown" size={16} />
                      </button>
                      <ul className="dropdown-menu">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href}>{c.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            className="header-search-toggle"
            aria-label="Abrir busca"
            onClick={() => setSearchOpen(true)}
          >
            <Icon name="search" />
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="search-popup" role="dialog" aria-label="Pesquisa do site">
          <div className="search-popup__overlay" onClick={() => setSearchOpen(false)} />
          <div className="search-popup__box">
            <SearchForm placeholder="Digite para pesquisar" />
            <button
              type="button"
              className="search-popup__close"
              aria-label="Fechar busca"
              onClick={() => setSearchOpen(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
