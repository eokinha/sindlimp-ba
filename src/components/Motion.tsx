"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Equivalente ao wow.js: esconde o elemento até entrar na viewport e então aplica a animação do animate.css. */
export function Reveal({
  animation,
  delay,
  className = "",
  children,
}: {
  animation: "fadeInUp" | "fadeInLeft" | "fadeInRight" | "zoomIn";
  delay?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setVisible(true);
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style: CSSProperties | undefined = delay ? { animationDelay: delay } : undefined;
  return (
    <div ref={ref} className={`wow ${visible ? `animated ${animation}` : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}

/** "data-roller" do tema: a seção cresce de scaleX(.94) para 1 quando o topo passa da metade da tela. */
export function Roller({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (el) setStarted(el.getBoundingClientRect().top / window.innerHeight < 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={ref} className={`roller${started ? " rollerstart" : ""} ${className}`}>
      {children}
    </section>
  );
}

/** TiltFx (anime.js) dos cards de features: inclina o card e desloca o conteúdo seguindo o mouse. */
export function Tilt({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function move(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || reducedMotion()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.classList.add("is-tilting");
    el.style.setProperty("--rx", `${(-y * 10).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
    el.style.setProperty("--tx", `${(x * 40).toFixed(1)}px`);
    el.style.setProperty("--ty", `${(y * 40).toFixed(1)}px`);
  }
  function leave() {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("is-tilting");
    for (const p of ["--rx", "--ry", "--tx", "--ty"]) el.style.removeProperty(p);
  }

  return (
    <div ref={ref} className="tilter" onPointerMove={move} onPointerLeave={leave}>
      {children}
    </div>
  );
}

/** Carrossel no estilo owl (loop, setas opcionais) com CSS scroll-snap. Itens por tela vêm do CSS (--per). */
export function Carousel({
  className = "",
  nav = false,
  children,
}: {
  className?: string;
  nav?: boolean;
  children: ReactNode;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);

  // Setas só quando há itens fora da tela (no desktop os 3 posts cabem e o owl não teria o que rolar).
  useEffect(() => {
    const el = track.current;
    if (!el || !nav) return;
    const ro = new ResizeObserver(() => setOverflow(el.scrollWidth > el.clientWidth + 2));
    ro.observe(el);
    return () => ro.disconnect();
  }, [nav]);

  function go(dir: 1 | -1) {
    const el = track.current;
    if (!el) return;
    const item = el.firstElementChild as HTMLElement | null;
    const step = item ? item.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || "0") : el.clientWidth;
    const max = el.scrollWidth - el.clientWidth - 2;
    const behavior: ScrollBehavior = reducedMotion() ? "auto" : "smooth";
    // loop: true do owl — do fim volta ao início e vice-versa
    if (dir === 1 && el.scrollLeft >= max) el.scrollTo({ left: 0, behavior });
    else if (dir === -1 && el.scrollLeft <= 2) el.scrollTo({ left: el.scrollWidth, behavior });
    else el.scrollBy({ left: dir * step, behavior });
  }

  return (
    <div className={`carousel ${className}`}>
      <div ref={track} className="carousel__track">
        {children}
      </div>
      {nav && overflow && (
        <div className="carousel__nav">
          <button type="button" aria-label="Anterior" onClick={() => go(-1)}>
            &larr;
          </button>
          <button type="button" aria-label="Próximo" onClick={() => go(1)}>
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
