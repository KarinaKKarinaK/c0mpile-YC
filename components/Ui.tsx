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

export function Logo() {
  // Two collar points folded into a check mark: blue collar, approved.
  return (
    <span className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
      <svg width="24" height="20" viewBox="0 0 24 20" aria-hidden>
        <path d="M2 3 L9 3 L12 9 L5 15 Z" fill="#0297DE" />
        <path d="M22 3 L15 3 L12 9 L19 15 Z" fill="#0297DE" opacity="0.65" />
        <path d="M6.5 11.5 L11 16 L19.5 6.5" fill="none" stroke="#FC734D" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Bluecollar
    </span>
  );
}
