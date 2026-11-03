"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type Slide = { image: string; title: string; highlight: string; text: string; align: "left" | "center" };

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="hero" aria-roledescription="carrossel">
      {slides.map((s, i) => (
        <div key={s.image} className={`hero__slide${i === current ? " is-active" : ""}`} aria-hidden={i !== current}>
          <Image src={s.image} alt="" fill priority={i === 0} sizes="100vw" style={{ objectFit: "cover" }} />
          <div className="hero__overlay">
            <div className={`container hero__content hero__content--${s.align}`}>
              <h1>
                {s.title} <span className="primary-color">{s.highlight}</span>
              </h1>
              <p>{s.text}</p>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="hero__nav hero__nav--prev"
        aria-label="Slide anterior"
        onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
      >
        &lsaquo;
      </button>
      <button
        type="button"
        className="hero__nav hero__nav--next"
        aria-label="Próximo slide"
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
      >
        &rsaquo;
      </button>
    </section>
  );
}
