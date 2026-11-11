"use client";
// Small headless, accessible atoms. Patterns inspired by LitenApe/Kitchen (accordion, alert, backdrop);
// written fresh here because Kitchen ships no license.
import { createContext, useContext, useEffect, useId, useState, type ReactNode } from "react";

// ---------- Accordion: header button controls a region, one or many open ----------
const Ctx = createContext<{ open: string[]; toggle: (id: string) => void }>({ open: [], toggle: () => {} });
export function Accordion({ children, multiple = false }: { children: ReactNode; multiple?: boolean }) {
  const [open, setOpen] = useState<string[]>([]);
  const toggle = (id: string) => setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : multiple ? [...o, id] : [id]));
  return <Ctx.Provider value={{ open, toggle }}><div className="divide-y divide-white/10">{children}</div></Ctx.Provider>;
}
export function AccordionItem({ title, children }: { title: string; children: ReactNode }) {
  const id = useId();
  const { open, toggle } = useContext(Ctx);
  const isOpen = open.includes(id);
  return (
    <div>
      <h3>
        <button id={`${id}-h`} aria-expanded={isOpen} aria-controls={`${id}-p`} onClick={() => toggle(id)}
          className="flex w-full items-center justify-between gap-4 py-5 text-left font-serif text-2xl transition-colors hover:text-orange md:text-3xl">
          {title}
          <span aria-hidden className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20 font-mono text-sm transition-transform duration-300 ${isOpen ? "rotate-45 border-orange text-orange" : ""}`}>+</span>
        </button>
      </h3>
      <div id={`${id}-p`} role="region" aria-labelledby={`${id}-h`}
        className={`grid transition-all duration-500 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden"><div className="pb-6 text-[13px] leading-relaxed text-white/70">{children}</div></div>
      </div>
    </div>
  );
}

// ---------- Alert: announces itself to screen readers ----------
const TONE = { info: "border-blue/50 text-paper", warn: "border-orange/60 text-orange", ok: "border-blue/60 text-blue" };
export function Alert({ tone = "info", children, className = "" }: { tone?: keyof typeof TONE; children: ReactNode; className?: string }) {
  return (
    <div role={tone === "warn" ? "alert" : "status"} aria-live={tone === "warn" ? "assertive" : "polite"}
      className={`rounded-xl border bg-black/30 p-3 text-[12px] ${TONE[tone]} ${className}`}>{children}</div>
  );
}

// ---------- Backdrop: overlay with Esc to close, click outside, scroll lock ----------
export function Backdrop({ open, onClose, children, label }: { open: boolean; onClose: () => void; children: ReactNode; label: string }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={label} className="card w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        {children}
        <button className="btn btn-ghost mt-5" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// Mobile nav built on Backdrop.
export function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button aria-label="Open menu" className="btn btn-ghost px-3 md:hidden" onClick={() => setOpen(true)}>Menu</button>
      <Backdrop open={open} onClose={() => setOpen(false)} label="Menu">
        <nav className="flex flex-col gap-4 font-serif text-3xl">
          {links.map((l) => <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="hover:text-orange">{l.label}</a>)}
        </nav>
      </Backdrop>
    </>
  );
}
