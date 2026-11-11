"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

// Card that tilts toward the cursor.
export function Tilt({ children, className = "", base = 0 }: { children: ReactNode; className?: string; base?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });
  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        setS({ rx: (0.5 - py) * 10, ry: (px - 0.5) * 12, gx: px * 100, gy: py * 100 });
      }}
      onPointerLeave={() => setS({ rx: 0, ry: 0, gx: 50, gy: 50 })}
      style={{
        transform: `perspective(900px) rotateZ(${base}deg) rotateX(${s.rx}deg) rotateY(${s.ry}deg)`,
        transition: "transform 0.25s ease-out",
        backgroundImage: `radial-gradient(circle at ${s.gx}% ${s.gy}%, rgba(255,255,255,0.12), transparent 45%)`,
      }}
    >
      {children}
    </div>
  );
}

// Counts up to a value when it scrolls into view.
export function Counter({ to, prefix = "", suffix = "", decimals = 0 }: { to: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400);
        setV(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{prefix}{v.toFixed(decimals)}{suffix}</span>;
}

// Fades children in on scroll.
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setIn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setIn(true), io.disconnect()), { threshold: 0.15 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${inView ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

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

// A word that runs: blurred copies streak in behind it on a loop, like a motion trail.
export function MotionWord({ children, className = "" }: { children: string; className?: string }) {
  return (
    <em className={`relative inline-block ${className}`}>
      {[0, 1, 2].map((k) => (
        <span key={k} aria-hidden className="pointer-events-none absolute inset-0 select-none" style={{ animation: `trail 3.6s cubic-bezier(.2,.7,.2,1) ${k * 0.07}s infinite`, filter: `blur(${4 + k * 3}px)` }}>{children}</span>
      ))}
      <span className="relative" style={{ animation: "runin 3.6s cubic-bezier(.2,.7,.2,1) infinite" }}>{children}</span>
    </em>
  );
}
