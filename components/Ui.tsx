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
  // An F that is also a progress meter: blue stem and top bar, orange lower bar = the loan being paid down.
  return (
    <span className="flex items-center gap-2.5 text-[17px] font-extrabold tracking-[-0.03em]">
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
        <rect x="2" y="2" width="5" height="18" rx="2.5" fill="#0297DE" />
        <rect x="2" y="2" width="18" height="5" rx="2.5" fill="#0297DE" />
        <rect x="9" y="10" width="7" height="5" rx="2.5" fill="#FC734D" />
        <rect x="17" y="10" width="3" height="5" rx="1.5" fill="#FC734D" opacity="0.35" />
      </svg>
      Fleiss
    </span>
  );
}
