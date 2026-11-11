"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";




// Hebl mark: a slanted H, two leaning strokes joined by a soft crossbar. One colour.
export function HeblMark({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size * 1.25} height={size} viewBox="0 0 120 92" aria-hidden className={className} fill="currentColor" stroke="currentColor" strokeWidth="6" strokeLinejoin="round">
      <path d="M12 8 H32 L54 84 H34 Z" />
      <path d="M66 8 H86 L108 84 H88 Z" />
      <path d="M30 37 H66 C78 37 82 47 86 55 H50 C40 55 36 45 30 37 Z" />
    </svg>
  );
}
export function Logo() {
  return (
    <span className="flex items-center gap-2 text-[18px] font-bold tracking-[-0.02em] text-white">
      <HeblMark />
      Hebl
    </span>
  );
}


// Nav that sits transparently on the hero and only gets a backdrop once you scroll.
export function StickyHeader({ children }: { children: ReactNode }) {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 border-b border-dashed border-white/15 ${solid ? "bg-ink/80 backdrop-blur-md" : "bg-transparent"}`}>{children}</header>;
}

// Nav links that show where you are: current section on the landing page, or the current page.
export function NavLinks({ items }: { items: { label: string; href: string }[] }) {
  const [active, setActive] = useState("");
  useEffect(() => {
    if (location.pathname !== "/") { setActive(location.pathname); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)), { rootMargin: "-45% 0px -50% 0px" });
    items.filter((i) => i.href.startsWith("#")).forEach((i) => { const el = document.querySelector(i.href); if (el) io.observe(el); });
    const top = () => window.scrollY < 200 && setActive("");
    window.addEventListener("scroll", top, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", top); };
  }, [items]);
  return (
    <div className="hidden gap-10 font-mono text-[10px] uppercase tracking-[0.2em] md:flex">
      {items.map((i) => {
        const on = active === i.href;
        return (
          <a key={i.href} href={i.href} aria-current={on ? "page" : undefined} className={`relative pb-1 transition-colors ${on ? "text-white" : "text-white/55 hover:text-white"}`}>
            {i.label}
            <span className={`absolute inset-x-0 -bottom-0.5 h-px bg-orange transition-transform duration-300 ${on ? "scale-x-100" : "scale-x-0"}`} />
          </a>
        );
      })}
    </div>
  );
}
