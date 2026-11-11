"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Html, Lightformer, OrbitControls, RoundedBox, SoftShadows } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import type { Robot } from "@/lib/engine";
import { monthlyRevenue } from "@/lib/engine";

// A working factory: three lines, each fed by a conveyor and served by an arm. AMRs shuttle,
// humanoids tend the lines, quadrupeds patrol. A faulted robot jams its station.

const M = {
  paint: <meshPhysicalMaterial color="#FC734D" roughness={0.32} metalness={0.15} clearcoat={1} clearcoatRoughness={0.18} />,
  graphite: <meshStandardMaterial color="#26313a" metalness={0.85} roughness={0.32} />,
  steel: <meshStandardMaterial color="#a9b6c0" metalness={1} roughness={0.22} />,
  white: <meshPhysicalMaterial color="#e9eef2" roughness={0.38} clearcoat={0.6} clearcoatRoughness={0.3} />,
  rubber: <meshStandardMaterial color="#0d1114" roughness={0.95} />,
  card: <meshStandardMaterial color="#b88a5a" roughness={0.88} />,
  glowBlue: <meshStandardMaterial color="#0297DE" emissive="#0297DE" emissiveIntensity={0.9} />,
  wall: <meshStandardMaterial color="#2a3238" roughness={0.95} metalness={0.05} />,
};
// Procedural textures (no downloads): concrete grain and brushed-metal streaks.
function noiseTex(w: number, h: number, paint: (ctx: CanvasRenderingContext2D) => void, repeat: number) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  paint(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat, repeat); t.anisotropy = 8;
  return t;
}
function useTextures() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const concrete = noiseTex(512, 512, (g) => {
      g.fillStyle = "#1b2228"; g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 26000; i++) { const v = 20 + Math.random() * 40; g.fillStyle = `rgba(${v},${v + 6},${v + 10},${Math.random() * 0.35})`; g.fillRect(Math.random() * 512, Math.random() * 512, 1.5, 1.5); }
      g.strokeStyle = "rgba(0,0,0,0.5)"; g.lineWidth = 2; g.strokeRect(0, 0, 512, 512); // slab joints
    }, 8);
    const brushed = noiseTex(256, 256, (g) => {
      g.fillStyle = "#808080"; g.fillRect(0, 0, 256, 256);
      for (let y = 0; y < 256; y++) { const v = 110 + Math.random() * 60; g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(0, y, 256, 1); }
    }, 2);
    return { concrete, brushed };
  }, []);
}

// Worn corrugated cartons: six texture variants (fibres, scuffs, scratches, a crease, dark edges)
// plus a small per-box bend, so no two boxes look the same. Textures are cached per variant.
const CARTON_TEX: THREE.Texture[] = [];
function cartonTex(v: number) {
  if (typeof document === "undefined") return null;
  const k = ((v % 6) + 6) % 6;
  if (CARTON_TEX[k]) return CARTON_TEX[k];
  let seed = 17 + k * 101;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  CARTON_TEX[k] = noiseTex(256, 256, (g) => {
    const tone = 150 + k * 6;
    g.fillStyle = `rgb(${tone},${Math.round(tone * 0.72)},${Math.round(tone * 0.45)})`; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1400; i++) { g.strokeStyle = `rgba(${rnd() > 0.5 ? "60,35,15" : "230,200,160"},${rnd() * 0.08})`; g.beginPath(); const x = rnd() * 256, y = rnd() * 256; g.moveTo(x, y); g.lineTo(x + rnd() * 18 - 9, y + rnd() * 4 - 2); g.stroke(); }
    for (let i = 0; i < 3 + k; i++) { const x = rnd() * 256, y = rnd() * 256, r = 10 + rnd() * 34; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(55,35,18,${0.18 + rnd() * 0.2})`); gr.addColorStop(1, "rgba(55,35,18,0)"); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
    for (let i = 0; i < 4 + (k % 3) * 2; i++) { g.strokeStyle = `rgba(240,225,200,${0.25 + rnd() * 0.3})`; g.lineWidth = 0.6 + rnd(); g.beginPath(); const x = rnd() * 256, y = rnd() * 256; g.moveTo(x, y); g.lineTo(x + rnd() * 60 - 30, y + rnd() * 26 - 13); g.stroke(); }
    g.strokeStyle = "rgba(70,45,20,0.35)"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 90 + k * 14); g.quadraticCurveTo(128, 70 + rnd() * 60, 256, 100 + k * 10); g.stroke();
    const edge = g.createLinearGradient(0, 0, 0, 256); edge.addColorStop(0, "rgba(40,25,10,0.35)"); edge.addColorStop(0.08, "rgba(40,25,10,0)"); edge.addColorStop(0.92, "rgba(40,25,10,0)"); edge.addColorStop(1, "rgba(40,25,10,0.35)"); g.fillStyle = edge; g.fillRect(0, 0, 256, 256);
  }, 1);
  return CARTON_TEX[k];
}
function Carton({ w = 0.55, h = 0.42, d = 0.55, v = 0 }: { w?: number; h?: number; d?: number; v?: number }) {
  const tex = useMemo(() => cartonTex(v), [v]);
  const bend = ((v * 37) % 7 - 3) * 0.012, sq = 1 + ((v * 13) % 5 - 2) * 0.015;
  return (
    <group rotation={[bend * 0.6, (v % 4) * 0.04 - 0.06, bend]} scale={[sq, 2 - sq, 1 + bend]}>
      <RoundedBox args={[w, h, d]} radius={0.012} castShadow receiveShadow><meshStandardMaterial map={tex} color="#e8d9c4" roughness={0.95} /></RoundedBox>
      <mesh position={[0, h / 2 + 0.002, 0]} rotation={[0, 0, bend * 2]}><boxGeometry args={[w * 1.01, 0.004, 0.09]} /><meshStandardMaterial color="#c9a477" roughness={0.3} transparent opacity={0.85} /></mesh>
      {v % 3 !== 2 && <mesh position={[w * 0.18, 0, d / 2 + 0.002]}><planeGeometry args={[w * 0.32, h * 0.38]} /><meshStandardMaterial color="#efebe2" roughness={0.85} /></mesh>}
      {v % 3 !== 2 && <mesh position={[w * 0.18, -h * 0.05, d / 2 + 0.003]}><planeGeometry args={[w * 0.22, h * 0.06]} /><meshStandardMaterial color="#1a1a1a" /></mesh>}
    </group>
  );
}

// Chest wordmark texture for the humanoids.
function useWordmark() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas"); c.width = 256; c.height = 64;
    const g = c.getContext("2d")!; g.fillStyle = "#0b0f12"; g.fillRect(0, 0, 256, 64);
    g.fillStyle = "#7fd4ff"; g.font = "600 34px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("FIGURE", 128, 34);
    return new THREE.CanvasTexture(c);
  }, []);
}

function useLineTextures(len: number) {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const belt = noiseTex(256, 64, (g) => {
      g.fillStyle = "#15191c"; g.fillRect(0, 0, 256, 64);
      for (let x = 0; x < 256; x += 16) { g.fillStyle = "#23292e"; g.fillRect(x, 0, 6, 64); }
      for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`; g.fillRect(Math.random() * 256, Math.random() * 64, 1, 1); }
    }, 1);
    belt.repeat.set(len * 2, 1);
    const hazard = noiseTex(128, 32, (g) => {
      g.fillStyle = "#d9a520"; g.fillRect(0, 0, 128, 32); g.fillStyle = "#111";
      for (let x = -32; x < 160; x += 32) { g.beginPath(); g.moveTo(x, 32); g.lineTo(x + 16, 32); g.lineTo(x + 32, 0); g.lineTo(x + 16, 0); g.closePath(); g.fill(); }
    }, 1);
    hazard.repeat.set(8, 1);
    return { belt, hazard };
  }, [len]);
}

const LINES = [-5, 0, 5];
const SPEED = 0.6, SPACING = 2.4, BELT_START = -9, BELT_END = 1;

type P = { rb: Robot; selected: boolean; onSelect: (id: string) => void; max: number };

function Pickable({ rb, selected, onSelect, max, children, height = 2 }: P & { children: ReactNode; height?: number }) {
  const [hover, setHover] = useState(false);
  return (
    <group
      onClick={(e) => { e.stopPropagation(); onSelect(rb.id); }}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = ""; }}
    >
      {children}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[1.08, 1.13, 64]} />
        <meshBasicMaterial color={rb.faulted || selected ? "#FC734D" : "#ffffff"} transparent opacity={rb.faulted ? 0.7 : selected ? 0.55 : hover ? 0.25 : 0} />
      </mesh>
      {rb.faulted && <Beacon y={height + 0.25} />}
      {(hover || selected || rb.faulted) && (
        <Html position={[0, height + 0.9, 0]} center distanceFactor={12} style={{ pointerEvents: "none" }}>
          <div className="card whitespace-nowrap px-3 py-2 text-[11px]">
            <div className={rb.faulted ? "text-orange" : ""}>{rb.id} {rb.maker} {rb.model ?? rb.kind}{rb.faulted ? " STOPPED" : ""}</div>
            <div className="text-white/60">${Math.round(monthlyRevenue(rb)).toLocaleString()}/mo &middot; {Math.round((monthlyRevenue(rb) / max) * 100)}% of best</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function Beacon({ y }: { y: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, d) => { if (g.current) g.current.rotation.y += d * 6; });
  return (
    <group position={[0, y, 0]}>
      <mesh><cylinderGeometry args={[0.12, 0.14, 0.22, 24]} /><meshStandardMaterial color="#FC734D" emissive="#FC734D" emissiveIntensity={6} toneMapped={false} /></mesh>
      <group ref={g}>
        <spotLight position={[0, 0, 0]} target-position={[3, -2, 0]} color="#FC734D" intensity={60} angle={0.5} penumbra={0.6} distance={9} />
        <pointLight color="#FC734D" intensity={8} distance={5} />
      </group>
    </group>
  );
}

// One production line with a single time base: infeed machine -> belt -> stop plate -> arm pick
// -> outfeed belt -> wrap tunnel. A fault stops the whole line in place (e-stop), like a real cell.
const STOP = BELT_END - 0.35, ENTRY = BELT_START + 0.6, P_BOX = SPACING / SPEED;
const T_BELT = (STOP - ENTRY) / SPEED, OUT_FROM = 1.45, OUT_LEN = 1.4;
const smooth = (x: number) => x * x * (3 - 2 * x);

function Line(p: P & { z: number }) {
  const jammed = !!p.rb.faulted;
  const tb = useRef({ off: 0, frozenAt: -1 });
  const boxes = useRef<THREE.Group>(null), outBoxes = useRef<THREE.Group>(null);
  const turret = useRef<THREE.Group>(null), shoulder = useRef<THREE.Group>(null), elbow = useRef<THREE.Group>(null), held = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const now = clock.elapsedTime, k = tb.current;
    if (jammed && k.frozenAt < 0) k.frozenAt = now;
    if (!jammed && k.frozenAt >= 0) { k.off += now - k.frozenAt; k.frozenAt = -1; }
    const t = (k.frozenAt >= 0 ? k.frozenAt : now) - k.off + 60; // start with a full line
    const kNow = Math.floor(t / P_BOX);
    const place = (grp: THREE.Group | null, onBelt: boolean) => grp?.children.forEach((bx, j) => {
      const kk = kNow - ((((kNow - j) % 8) + 8) % 8);
      const age = t - kk * P_BOX;
      if (onBelt) { bx.visible = age < T_BELT || (jammed && age >= T_BELT && age < T_BELT + 0.01); bx.position.set(Math.min(ENTRY + age * SPEED, STOP), 1.17, 0); }
      else { const o = age - T_BELT - P_BOX / 2; bx.visible = o >= 0 && o < OUT_LEN / SPEED; bx.position.set(2.4, 1.17, OUT_FROM + Math.max(0, o) * SPEED); }
    });
    place(boxes.current, true); place(outBoxes.current, false);
    if (lt) lt.belt.offset.x = -((t * SPEED) / (BELT_END - BELT_START)) * lt.belt.repeat.x; // belt surface moves with the boxes
    // arm: pick at the stop plate, swing 90 degrees, drop on the outfeed, swing back
    const ph = ((((t - T_BELT) % P_BOX) + P_BOX) % P_BOX) / P_BOX;
    const s = ph < 0.5 ? smooth(ph * 2) : smooth((1 - ph) * 2);
    const dip = Math.max(0, 1 - Math.min(ph, Math.abs(ph - 0.5), 1 - ph) * 10); // lower near pick and place
    turret.current!.rotation.y = Math.PI + s * (Math.PI / 2);
    shoulder.current!.rotation.z = -0.45 - dip * 0.22;
    elbow.current!.rotation.z = -1.15 + dip * 0.18;
    held.current!.visible = ph < 0.5 && !(jammed && ph < 0.02);
  });
  const len = BELT_END - BELT_START;
  const lt = useLineTextures(len);
  const tex = useTextures();
  const rollers = useMemo(() => Array.from({ length: 22 }, (_, i) => BELT_START + 0.25 + i * (len / 22)), [len]);
  return (
    <group position={[0, 0, p.z]}>
      {/* main belt */}
      <RoundedBox args={[len + 0.4, 0.18, 1.3]} radius={0.04} position={[(BELT_START + BELT_END) / 2, 0.82, 0]} castShadow receiveShadow><meshStandardMaterial color="#5d6870" metalness={0.8} roughness={0.38} map={tex?.brushed ?? null} /></RoundedBox>
      <mesh position={[(BELT_START + BELT_END) / 2, 0.93, 0]} receiveShadow><boxGeometry args={[len, 0.04, 1.05]} /><meshStandardMaterial map={lt?.belt ?? null} color="#9aa3a9" roughness={0.9} /></mesh>
      {[[2.4, -1.0, 2.6, 0], [2.4, 1.0, 2.6, 0], [1.1, 0, 2.0, Math.PI / 2], [3.7, 0, 2.0, Math.PI / 2]].map(([x, z, w, ry], k) => (
        <mesh key={k} position={[x, 0.006, z]} rotation={[-Math.PI / 2, 0, ry]}><planeGeometry args={[w, 0.12]} /><meshStandardMaterial map={lt?.hazard ?? null} roughness={0.7} /></mesh>
      ))}
      {rollers.map((x) => <mesh key={x} position={[x, 0.86, 0.62]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />{M.steel}</mesh>)}
      {[-8.6, -5, -1.5, 0.6].map((x) => [-0.55, 0.55].map((dz) => <mesh key={`${x}${dz}`} position={[x, 0.37, dz]} castShadow><boxGeometry args={[0.1, 0.74, 0.1]} />{M.steel}</mesh>))}
      {[-0.6, 0.6].map((dz) => <mesh key={dz} position={[(BELT_START + BELT_END) / 2 + 0.6, 1.12, dz]} castShadow><boxGeometry args={[len - 1.2, 0.04, 0.04]} />{M.steel}</mesh>)}
      <mesh position={[STOP + 0.33, 1.1, 0]} castShadow><boxGeometry args={[0.06, 0.3, 1.1]} />{M.paint}</mesh>
      {/* infeed machine the boxes come out of */}
      <group position={[BELT_START + 0.4, 0, 0]}>
        <RoundedBox args={[1.3, 1.9, 1.6]} radius={0.05} position={[0, 0.95, 0]} castShadow receiveShadow>{M.white}</RoundedBox>
        <mesh position={[0.651, 1.2, 0]}><planeGeometry args={[0.02, 0.01]} /></mesh>
        <mesh position={[0.66, 1.18, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.8, 0.55]} /><meshStandardMaterial color="#05090c" /></mesh>
        <mesh position={[0, 1.95, 0.81]}><planeGeometry args={[0.5, 0.3]} /><meshStandardMaterial color="#0b2233" emissive="#0297DE" emissiveIntensity={0.4} /></mesh>
      </group>
      <group ref={boxes}>{Array.from({ length: 8 }, (_, i) => <group key={i}><Carton v={i} /></group>)}</group>
      {/* control cabinet + stack light */}
      <group position={[BELT_START + 1.6, 0, -1.3]}>
        <RoundedBox args={[0.7, 1.7, 0.45]} radius={0.03} position={[0, 0.85, 0]} castShadow receiveShadow>{M.white}</RoundedBox>
        <mesh position={[0, 1.25, 0.231]}><planeGeometry args={[0.42, 0.28]} /><meshStandardMaterial color="#0b2233" emissive={jammed ? "#FC734D" : "#0297DE"} emissiveIntensity={0.6} /></mesh>
        <mesh position={[0, 2.05, 0]}><cylinderGeometry args={[0.025, 0.025, 0.6, 10]} />{M.steel}</mesh>
        {[["#2e7d32", !jammed], ["#f9a825", jammed], ["#c62828", false]].map(([c, on], k) => (
          <mesh key={k} position={[0, 2.4 + k * 0.13, 0]}><cylinderGeometry args={[0.07, 0.07, 0.12, 20]} /><meshStandardMaterial color={c as string} emissive={c as string} emissiveIntensity={on ? 2.2 : 0.05} /></mesh>
        ))}
      </group>
      {/* arm */}
      <group position={[2.4, 0, 0]}>
        <Pickable {...p} height={2.6}>
          <RoundedBox args={[1.2, 0.3, 1.2]} radius={0.05} position={[0, 0.15, 0]} castShadow>{M.graphite}</RoundedBox>
          {[[-0.48, -0.48], [0.48, -0.48], [-0.48, 0.48], [0.48, 0.48]].map(([x, z]) => <mesh key={`${x}${z}`} position={[x, 0.32, z]}><cylinderGeometry args={[0.04, 0.04, 0.05, 12]} />{M.steel}</mesh>)}
          <group ref={turret} position={[0, 0.3, 0]}>
            <mesh position={[0, 0.25, 0]} castShadow><cylinderGeometry args={[0.42, 0.5, 0.5, 40]} />{M.paint}</mesh>
            <group ref={shoulder} position={[0, 0.65, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.24, 0.24, 0.62, 32]} />{M.graphite}</mesh>
              <RoundedBox args={[0.34, 1.3, 0.34]} radius={0.12} position={[0, 0.65, 0]} castShadow>{M.paint}</RoundedBox>
              <group ref={elbow} position={[0, 1.3, 0]}>
                <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.19, 0.19, 0.5, 32]} />{M.graphite}</mesh>
                <RoundedBox args={[0.26, 1.35, 0.26]} radius={0.1} position={[0, 0.62, 0]} castShadow>{M.paint}</RoundedBox>
                <group position={[0, 1.3, 0]} rotation={[0, 0, 1.6]}>
                  <mesh castShadow><cylinderGeometry args={[0.11, 0.11, 0.26, 24]} />{M.steel}</mesh>
                  {[-0.1, 0.1].map((dz) => <mesh key={dz} position={[0, -0.22, dz]} castShadow><boxGeometry args={[0.06, 0.24, 0.04]} />{M.steel}</mesh>)}
                  <group ref={held} position={[0, -0.55, 0]}><Carton w={0.5} h={0.4} d={0.5} v={3} /></group>
                </group>
              </group>
            </group>
          </group>
        </Pickable>
      </group>
      {/* outfeed belt into the wrap tunnel */}
      <group position={[2.4, 0, OUT_FROM + 0.7]}>
        <RoundedBox args={[1.0, 0.16, 1.9]} radius={0.04} position={[0, 0.84, 0]} castShadow receiveShadow>{M.graphite}</RoundedBox>
        <mesh position={[0, 0.94, 0]}><boxGeometry args={[0.85, 0.03, 1.85]} />{M.rubber}</mesh>
        {[-0.7, 0.7].map((dz) => [-0.4, 0.4].map((dx) => <mesh key={`${dx}${dz}`} position={[dx, 0.38, dz]}><boxGeometry args={[0.08, 0.76, 0.08]} />{M.steel}</mesh>))}
      </group>
      <group ref={outBoxes}>{Array.from({ length: 8 }, (_, i) => <group key={i}><Carton v={i} /></group>)}</group>
      <group position={[2.4, 0, OUT_FROM + OUT_LEN + 0.35]}>
        <RoundedBox args={[1.4, 1.6, 1.0]} radius={0.05} position={[0, 0.8, 0]} castShadow receiveShadow>{M.white}</RoundedBox>
        <mesh position={[0, 1.15, -0.505]}><planeGeometry args={[0.8, 0.55]} /><meshStandardMaterial color="#05090c" /></mesh>
      </group>
      {/* fence behind the arm */}
      <mesh position={[2.4, 0.95, -1.15]}><planeGeometry args={[2.2, 1.5]} /><meshStandardMaterial color="#c9a227" transparent opacity={0.3} side={THREE.DoubleSide} /></mesh>
      {[1.3, 3.5].map((x) => <mesh key={x} position={[x, 0.9, -1.15]} castShadow><boxGeometry args={[0.07, 1.8, 0.07]} /><meshStandardMaterial color="#c9a227" /></mesh>)}
    </group>
  );
}


function Humanoid(p: P & { z: number }) {
  const g = useRef<THREE.Group>(null), armL = useRef<THREE.Group>(null), armR = useRef<THREE.Group>(null), foreL = useRef<THREE.Group>(null), foreR = useRef<THREE.Group>(null);
  const mark = useWordmark();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 1.6 + p.z;
    if (p.rb.faulted) { if (g.current) g.current.rotation.z = 0.06; return; }
    if (g.current) g.current.position.y = Math.abs(Math.sin(t)) * 0.015;
    if (armL.current) armL.current.rotation.x = -0.75 + Math.sin(t) * 0.25;
    if (armR.current) armR.current.rotation.x = -0.75 - Math.sin(t) * 0.25;
    if (foreL.current) foreL.current.rotation.x = -0.9 - Math.sin(t + 0.6) * 0.35;
    if (foreR.current) foreR.current.rotation.x = -0.9 + Math.sin(t + 0.6) * 0.35;
  });
  const shell = <meshPhysicalMaterial color="#111518" roughness={0.28} metalness={0.3} clearcoat={1} clearcoatRoughness={0.15} />;
  const joint = <meshStandardMaterial color="#0297DE" emissive="#0297DE" emissiveIntensity={1.4} />;
  const limb = (len: number, r: number) => (
    <group>
      <mesh position={[0, -len / 2, 0]} castShadow><capsuleGeometry args={[r, len, 8, 20]} />{shell}</mesh>
      <mesh position={[0, -len - 0.02, 0]}><torusGeometry args={[r * 0.9, 0.012, 8, 24]} />{joint}</mesh>
    </group>
  );
  const arm = (fore: React.RefObject<THREE.Group | null>) => (
    <>
      <mesh position={[0, -0.16, 0]} castShadow><capsuleGeometry args={[0.065, 0.26, 8, 20]} />{shell}</mesh>
      <mesh position={[0, -0.34, 0]} castShadow><sphereGeometry args={[0.07, 24, 24]} /><meshStandardMaterial color="#1b2328" metalness={0.6} roughness={0.3} /></mesh>
      <mesh position={[0, -0.34, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.072, 0.01, 8, 24]} />{joint}</mesh>
      <group ref={fore} position={[0, -0.34, 0]}>
        <mesh position={[0, -0.15, 0]} castShadow><capsuleGeometry args={[0.055, 0.24, 8, 20]} />{shell}</mesh>
        <RoundedBox args={[0.09, 0.12, 0.05]} radius={0.02} position={[0, -0.34, 0]} castShadow>{shell}</RoundedBox>
      </group>
    </>
  );
  return (
    <group position={[[-6.3, -2.6, -4.7][Math.round((p.z + 5) / 5)] ?? -4, 0, p.z - [1.85, 2.05, 1.95][Math.round((p.z + 5) / 5)]]} rotation={[0, [0.12, -0.18, 0.05][Math.round((p.z + 5) / 5)] ?? 0, 0]}>
      <Pickable {...p} height={2.1}>
        <group ref={g}>
          <RoundedBox args={[0.56, 0.72, 0.32]} radius={0.14} position={[0, 1.44, 0]} castShadow>{shell}</RoundedBox>
          {mark && <mesh position={[0, 1.52, 0.165]}><planeGeometry args={[0.32, 0.08]} /><meshBasicMaterial map={mark} /></mesh>}
          <mesh position={[0, 1.08, 0]}><torusGeometry args={[0.2, 0.014, 8, 32]} />{joint}</mesh>
          <RoundedBox args={[0.42, 0.26, 0.26]} radius={0.1} position={[0, 0.96, 0]} castShadow>{shell}</RoundedBox>
          <mesh position={[0, 1.88, 0]}><cylinderGeometry args={[0.07, 0.08, 0.12, 20]} />{shell}</mesh>
          <mesh position={[0, 2.06, 0]} scale={[0.9, 1.15, 1]} castShadow><sphereGeometry args={[0.17, 40, 40]} /><meshPhysicalMaterial color="#05080a" roughness={0.05} metalness={0.6} clearcoat={1} /></mesh>
          <mesh position={[0, 2.08, 0.155]}><boxGeometry args={[0.16, 0.012, 0.01]} />{joint}</mesh>
          <group ref={armL} position={[-0.36, 1.72, 0]}>{arm(foreL)}</group>
          <group ref={armR} position={[0.36, 1.72, 0]}>{arm(foreR)}</group>
          <group position={[-0.13, 0.84, 0]}>{limb(0.72, 0.085)}</group>
          <group position={[0.13, 0.84, 0]}>{limb(0.72, 0.085)}</group>
        </group>
      </Pickable>
      <RoundedBox args={[1.4, 0.08, 0.7]} radius={0.02} position={[0, 0.95, 0.75]} castShadow receiveShadow>{M.steel}</RoundedBox>
      {[[-0.6, 0.45], [0.6, 0.45], [-0.6, 1.05], [0.6, 1.05]].map(([x, z]) => <mesh key={`${x}${z}`} position={[x, 0.47, z]} castShadow><boxGeometry args={[0.05, 0.95, 0.05]} />{M.steel}</mesh>)}
      <group position={[0.3, 1.2, 0.75]}><Carton w={0.45} h={0.32} d={0.45} v={4} /></group>
    </group>
  );
}

// Robot dogs ferry cartons on their own lanes: take one off the source pallet, walk it over,
// set it on the destination stack, walk back. Stacks shrink and grow; nothing appears from nowhere.
const DOG_LANES = [-8.4, 9.3, 10.7];
const STACK = [[-0.27, 0.21, -0.22], [0.27, 0.21, -0.22], [-0.27, 0.21, 0.22], [0.27, 0.21, 0.22], [-0.27, 0.63, 0], [0.27, 0.63, 0]];
function Pallet({ x, z, refFn, v0 }: { x: number; z: number; refFn: React.RefObject<THREE.Group | null>; v0: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow><boxGeometry args={[1.2, 0.12, 1.0]} /><meshStandardMaterial color="#7a5c3a" roughness={0.95} /></mesh>
      <group ref={refFn}>{STACK.map(([px, py, pz], k) => <group key={k} position={[px, py + 0.12, pz]}><Carton w={0.5} h={0.42} d={0.42} v={v0 + k} /></group>)}</group>
    </group>
  );
}
function Quadruped(p: P & { i: number }) {
  const g = useRef<THREE.Group>(null), legs = useRef<THREE.Group>(null), cargo = useRef<THREE.Group>(null);
  const src = useRef<THREE.Group>(null), dst = useRef<THREE.Group>(null);
  const C = 22, xa = -9 + p.i, xb = 6 - p.i, lane = DOG_LANES[p.i] ?? 10;
  useFrame(({ clock }, d) => {
    if (!g.current) return;
    const T = clock.elapsedTime + p.i * 7.3, n = Math.floor(T / C), t = T % C, done = n % 6;
    if (p.rb.faulted) return;
    let x = xa, moving = false, out = true;
    if (t < 1.6) x = xa;
    else if (t < 10.4) { x = xa + (xb - xa) * smooth((t - 1.6) / 8.8); moving = true; }
    else if (t < 12) { x = xb; out = false; }
    else if (t < 20.8) { x = xb + (xa - xb) * smooth((t - 12) / 8.8); moving = true; out = false; }
    g.current.position.x = x;
    g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, out ? 0 : Math.PI, Math.min(1, d * 4));
    const carrying = t >= 1.2 && t < 10.8;
    if (cargo.current) cargo.current.visible = carrying;
    const taken = done + (t >= 1.2 ? 1 : 0), dropped = done + (t >= 10.8 ? 1 : 0);
    src.current?.children.forEach((c, k) => { c.visible = k < 6 - taken; });
    dst.current?.children.forEach((c, k) => { c.visible = k < dropped; });
    legs.current?.children.forEach((l, k) => { l.rotation.z = moving ? Math.sin(clock.elapsedTime * 9 + (k % 2 ? Math.PI : 0)) * 0.4 : THREE.MathUtils.lerp(l.rotation.z, 0, 0.2); });
  });
  return (
    <>
      <Pallet x={xa - 1.05} z={lane} refFn={src} v0={p.i * 2} />
      <Pallet x={xb + 1.05} z={lane} refFn={dst} v0={p.i * 2 + 1} />
      <group ref={g} position={[xa, 0, lane]}>
        <Pickable {...p} height={1.3}>
          <RoundedBox args={[1.1, 0.28, 0.48]} radius={0.12} position={[0, 0.72, 0]} castShadow>{M.graphite}</RoundedBox>
          <RoundedBox args={[0.8, 0.04, 0.42]} radius={0.02} position={[0, 0.88, 0]} castShadow>{M.steel}</RoundedBox>
          <RoundedBox args={[0.28, 0.2, 0.3]} radius={0.06} position={[0.62, 0.8, 0]} castShadow>{M.paint}</RoundedBox>
          <mesh position={[0.77, 0.82, 0]}><boxGeometry args={[0.02, 0.05, 0.2]} />{M.glowBlue}</mesh>
          <group ref={cargo} position={[0, 1.11, 0]}><Carton w={0.5} h={0.42} d={0.42} v={p.i + 5} /></group>
          <group ref={legs}>
            {[[0.42, -0.21], [-0.42, 0.21], [0.42, 0.21], [-0.42, -0.21]].map(([x, z]) => (
              <group key={`${x}${z}`} position={[x, 0.66, z]}>
                <mesh position={[0, -0.17, 0]} castShadow><capsuleGeometry args={[0.055, 0.26, 6, 12]} />{M.graphite}</mesh>
                <mesh position={[0.04, -0.47, 0]} rotation={[0, 0, 0.25]} castShadow><capsuleGeometry args={[0.04, 0.28, 6, 12]} />{M.steel}</mesh>
              </group>
            ))}
          </group>
        </Pickable>
      </group>
    </>
  );
}

// Pallet racking along the back wall: uprights, beams, stocked pallets.
function Racks() {
  const bays = Array.from({ length: 7 }, (_, i) => -11 + i * 3.1);
  return (
    <group position={[0, 0, -10.2]}>
      {bays.map((x) => (
        <group key={x} position={[x, 0, 0]}>
          {[-1.45, 1.45].map((dx) => [-0.5, 0.5].map((dz) => <mesh key={`${dx}${dz}`} position={[dx, 2.6, dz]} castShadow><boxGeometry args={[0.1, 5.2, 0.1]} /><meshStandardMaterial color="#1f5f8a" metalness={0.6} roughness={0.4} /></mesh>))}
          {[0.15, 1.8, 3.45].map((y) => (
            <group key={y} position={[0, y, 0]}>
              {[-0.5, 0.5].map((dz) => <mesh key={dz} position={[0, 0, dz]} castShadow><boxGeometry args={[3, 0.14, 0.08]} />{M.paint}</mesh>)}
              {[-0.75, 0.75].map((px) => (
                <group key={px} position={[px, 0.12, 0]}>
                  <mesh castShadow receiveShadow><boxGeometry args={[1.2, 0.12, 1]} /><meshStandardMaterial color="#6b5236" roughness={0.9} /></mesh>
                  <mesh position={[0, 0.55, 0]} castShadow><boxGeometry args={[1.1, 0.95, 0.9]} />{M.card}</mesh>
                  <mesh position={[0, 0.55, 0.451]}><planeGeometry args={[0.4, 0.25]} /><meshStandardMaterial color="#f2f2f2" roughness={0.8} /></mesh>
                </group>
              ))}
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

function Building() {
  const tex = useTextures();
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, 0, 0.25]} receiveShadow>
        <planeGeometry args={[30, 24]} />
        <meshStandardMaterial color="#8f969c" roughness={0.97} metalness={0} map={tex?.concrete ?? null} />
      </mesh>
      {LINES.map((z) => <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[-4, 0.01, z + 1.05]}><planeGeometry args={[11, 0.08]} /><meshStandardMaterial color="#c9a227" roughness={0.6} /></mesh>)}
      <mesh position={[1, 5, -11.6]} receiveShadow><boxGeometry args={[30, 10, 0.3]} />{M.wall}</mesh>
      <mesh position={[1, 0.25, -11.4]}><boxGeometry args={[30, 0.5, 0.05]} /><meshStandardMaterial color="#c9a227" roughness={0.6} /></mesh>
      <mesh position={[-14.15, 5, 0.25]} receiveShadow><boxGeometry args={[0.3, 10, 24]} />{M.wall}</mesh>
      {Array.from({ length: 13 }, (_, i) => -13 + i * 2.2).map((x) => (
        <group key={x}>
          <mesh position={[x, 5, -11.3]}><boxGeometry args={[0.18, 10, 0.12]} />{M.graphite}</mesh>
          <mesh position={[x + 1.1, 7.4, -11.32]}><boxGeometry args={[1.6, 1.2, 0.02]} /><meshStandardMaterial color="#9fb3c2" emissive="#cfe3ef" emissiveIntensity={0.35} /></mesh>
        </group>
      ))}
      {[-10, -4, 2, 8].map((x) => (
        <group key={x}>
          <mesh position={[x, 5, -10.6]} castShadow><boxGeometry args={[0.35, 10, 0.35]} />{M.graphite}</mesh>
          <mesh position={[x, 8.6, 0]}><boxGeometry args={[0.2, 0.35, 24]} />{M.graphite}</mesh>
        </group>
      ))}
      <mesh position={[1, 0.45, 12.3]} receiveShadow castShadow><boxGeometry args={[30, 0.9, 0.25]} />{M.wall}</mesh>
      <mesh position={[16.1, 0.45, 0.25]} receiveShadow castShadow><boxGeometry args={[0.25, 0.9, 24]} />{M.wall}</mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, -0.02, 0.25]}><planeGeometry args={[80, 70]} /><meshStandardMaterial color="#0a0d10" roughness={1} /></mesh>
      <Racks />
      {LINES.map((z) => (
        <group key={z} position={[-4, 6.2, z]}>
          <mesh><boxGeometry args={[9, 0.08, 0.35]} /><meshStandardMaterial color="#ffffff" emissive="#dff3ff" emissiveIntensity={3} toneMapped={false} /></mesh>
          <spotLight position={[0, -0.2, 0]} target-position={[0, -6, 0]} angle={0.9} penumbra={0.8} intensity={70} distance={12} color="#e8f6ff" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} />
        </group>
      ))}
    </group>
  );
}

export default function Fleet3D({ fleet, selected, onSelect }: { fleet: Robot[]; selected: string; onSelect: (id: string) => void }) {
  const max = Math.max(...fleet.map(monthlyRevenue));
  const by = (k: Robot["kind"]) => fleet.filter((r) => r.kind === k);
  const props = (rb: Robot) => ({ rb, selected: rb.id === selected, onSelect, max });
  return (
    <Canvas shadows camera={{ position: [13, 9, 15], fov: 38 }} dpr={[1, 1.5]} gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping }}>
      <color attach="background" args={["#0a0d10"]} />
      <SoftShadows size={22} samples={10} focus={0.6} />
      <fog attach="fog" args={["#05090c", 26, 60]} />
      <hemisphereLight args={["#dfefff", "#2a2420", 0.55]} />
      <directionalLight position={[8, 14, 6]} intensity={0.9} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-16} shadow-camera-right={16} shadow-camera-top={14} shadow-camera-bottom={-14} shadow-bias={-0.0003} />
            <pointLight position={[11, 4, 8]} color="#ffe9d6" intensity={18} distance={18} />
      <Building />
      {by("Arm").map((rb, i) => <Line key={rb.id} {...props(rb)} z={LINES[i]} />)}
      {by("Humanoid").map((rb, i) => <Humanoid key={rb.id} {...props(rb)} z={LINES[i]} />)}
      {by("Quadruped").map((rb, i) => <Quadruped key={rb.id} {...props(rb)} i={i} />)}
      <Environment resolution={512} frames={1} environmentIntensity={0.9}>
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 8, 0]} rotation-x={Math.PI / 2} scale={[20, 4, 1]} />
        <Lightformer form="rect" intensity={2} color="#e8f2ff" position={[-12, 3, -4]} rotation-y={Math.PI / 2} scale={[12, 6, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#fff1e6" position={[12, 2, 6]} rotation-y={-Math.PI / 2} scale={[10, 4, 1]} />
      </Environment>
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={1.3} intensity={0.35} radius={0.5} />
        <Vignette eskil={false} offset={0.25} darkness={0.45} />
      </EffectComposer>
      <OrbitControls enableDamping enablePan={false} minDistance={9} maxDistance={30} maxPolarAngle={1.32} target={[0, 1, 0]} />
    </Canvas>
  );
}
