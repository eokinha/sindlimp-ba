"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Motion";

export type Slide = { image: string; title: string; highlight: string; text: string; align: "left" | "center" };

// Como no tema (owl): slide horizontal, autoplay de 9s, sem loop (volta ao início ao fim), arrastar por
// toque/ponteiro e, a cada troca, h1/p do slide ativo entram com data-animation/data-delay.
const AUTOPLAY_MS = 9000;
const SWIPE_PX = 50;

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [changed, setChanged] = useState(false);
  const [paused, setPaused] = useState(false); // botão de pausa
  const [hovering, setHovering] = useState(false); // mouse/foco dentro do hero
  const [reduced, setReduced] = useState(false);
  const [drag, setDrag] = useState(0);
  const start = useRef<{ x: number; y: number; id: number } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const stopped = paused || hovering || reduced;
  useEffect(() => {
    if (stopped) return;
    const id = setTimeout(() => {
      setChanged(true);
      setCurrent((c) => (c + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [current, slides.length, stopped]);

  function goTo(i: number) {
    setChanged(true);
    setCurrent(Math.max(0, Math.min(slides.length - 1, i)));
  }

  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button")) return;
    start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  }
  function onPointerMove(e: React.PointerEvent) {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > Math.abs(e.clientY - s.y)) setDrag(dx);
  }
  function onPointerEnd(e: React.PointerEvent) {
    const s = start.current;
    if (!s || s.id !== e.pointerId) return;
    start.current = null;
    if (drag <= -SWIPE_PX && current < slides.length - 1) goTo(current + 1);
    else if (drag >= SWIPE_PX && current > 0) goTo(current - 1);
    setDrag(0);
  }

  return (
    <section
      className="hero"
      role="region"
      aria-roledescription="carrossel"
      aria-label="Destaques"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHovering(false);
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      <div
        className={`hero__track${drag ? " is-dragging" : ""}`}
        style={{ transform: `translateX(calc(-${current * 100}% + ${drag}px))` }}
      >
        {slides.map((s, i) => {
          const anim = s.align === "center" ? "fadeInUp" : "fadeInLeft";
          const animClass = changed && i === current ? `animated ${anim}` : "";
          return (
            <div
              key={s.image}
              className="hero__slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${slides.length}`}
              aria-hidden={i !== current}
            >
              <Image src={s.image} alt="" fill priority={i === 0} sizes="100vw" style={{ objectFit: "cover" }} draggable={false} />
              <div className="hero__overlay">
                <div className="container">
                  <Reveal animation="zoomIn" className={`hero__content hero__content--${s.align}`}>
                    {/* key muda a cada troca para reiniciar a animação do texto */}
                    <h1 key={`h${current}`} className={animClass} style={{ animationDelay: "200ms" }}>
                      {s.title} <span className="primary-color">{s.highlight}</span>
                    </h1>
                    <p key={`p${current}`} className={animClass} style={{ animationDelay: "500ms" }}>
                      {s.text}
                    </p>
                  </Reveal>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {current > 0 && (
        <button type="button" className="hero__nav hero__nav--prev" aria-label="Slide anterior" onClick={() => goTo(current - 1)}>
          &lsaquo;
        </button>
      )}
      {current < slides.length - 1 && (
        <button type="button" className="hero__nav hero__nav--next" aria-label="Próximo slide" onClick={() => goTo(current + 1)}>
          &rsaquo;
        </button>
      )}
      {!reduced && (
        <button
          type="button"
          className="hero__pause"
          aria-label={paused ? "Retomar rotação automática" : "Pausar rotação automática"}
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? "▶" : "❚❚"}
        </button>
      )}
    </section>
  );
}
