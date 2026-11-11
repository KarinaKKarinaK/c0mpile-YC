"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Html, Lightformer, MeshReflectorMaterial, OrbitControls, RoundedBox, SoftShadows } from "@react-three/drei";
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

function Conveyor({ z, jammed }: { z: number; jammed: boolean }) {
  const boxes = useRef<THREE.Group>(null);
  const len = BELT_END - BELT_START;
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    boxes.current?.children.forEach((b, i) => {
      const travel = ((t * SPEED + i * SPACING) % (len + SPACING)) - 0.2;
      let x = BELT_START + travel;
      if (jammed) x = Math.min(BELT_START + ((t * SPEED + i * SPACING) % 999), BELT_END - 0.5 - i * 0.62); // queue up at the end
      b.position.x = x;
      b.visible = jammed || x < BELT_END - 0.3;
      b.rotation.z = jammed && i > 2 ? Math.sin(i) * 0.12 : 0;
    });
  });
  const rollers = useMemo(() => Array.from({ length: 22 }, (_, i) => BELT_START + 0.25 + i * (len / 22)), [len]);
  return (
    <group position={[0, 0, z]}>
      <RoundedBox args={[len + 0.4, 0.18, 1.3]} radius={0.04} position={[(BELT_START + BELT_END) / 2, 0.82, 0]} castShadow receiveShadow>{M.graphite}</RoundedBox>
      <mesh position={[(BELT_START + BELT_END) / 2, 0.93, 0]} receiveShadow><boxGeometry args={[len, 0.04, 1.05]} />{M.rubber}</mesh>
      {rollers.map((x) => (
        <mesh key={x} position={[x, 0.86, 0.62]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />{M.steel}</mesh>
      ))}
      {[-8.6, -5, -1.5, 0.6].map((x) => [-0.55, 0.55].map((dz) => (
        <mesh key={`${x}${dz}`} position={[x, 0.37, dz]} castShadow><boxGeometry args={[0.1, 0.74, 0.1]} />{M.steel}</mesh>
      )))}
      {[-0.6, 0.6].map((dz) => (
        <group key={dz}>
          <mesh position={[(BELT_START + BELT_END) / 2, 1.12, dz]} castShadow><boxGeometry args={[len, 0.04, 0.04]} />{M.steel}</mesh>
          {Array.from({ length: 9 }, (_, k) => BELT_START + 0.4 + k * (len - 0.8) / 8).map((x) => <mesh key={x} position={[x, 1.02, dz]}><boxGeometry args={[0.03, 0.2, 0.03]} />{M.steel}</mesh>)}
        </group>
      ))}
      <group position={[BELT_START - 0.35, 0, 0]}>
        <RoundedBox args={[0.6, 0.5, 1.2]} radius={0.04} position={[0, 0.82, 0]} castShadow>{M.graphite}</RoundedBox>
        <mesh position={[0, 0.82, 0.75]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.16, 0.16, 0.35, 28]} />{M.white}</mesh>
      </group>
      <group position={[BELT_START - 0.4, 0, -1.3]}>
        <RoundedBox args={[0.7, 1.7, 0.45]} radius={0.03} position={[0, 0.85, 0]} castShadow receiveShadow>{M.white}</RoundedBox>
        <mesh position={[0, 1.25, 0.231]}><planeGeometry args={[0.42, 0.28]} /><meshStandardMaterial color="#0b2233" emissive={jammed ? "#FC734D" : "#0297DE"} emissiveIntensity={0.6} /></mesh>
        <mesh position={[0.18, 0.75, 0.231]}><circleGeometry args={[0.05, 20]} /><meshStandardMaterial color="#c62828" /></mesh>
        <mesh position={[0, 2.05, 0]}><cylinderGeometry args={[0.025, 0.025, 0.6, 10]} />{M.steel}</mesh>
        {[["#2e7d32", !jammed], ["#f9a825", jammed], ["#c62828", false]].map(([c, on], k) => (
          <mesh key={k} position={[0, 2.4 + k * 0.13, 0]}><cylinderGeometry args={[0.07, 0.07, 0.12, 20]} /><meshStandardMaterial color={c as string} emissive={c as string} emissiveIntensity={on ? 2.2 : 0.05} transparent opacity={0.9} /></mesh>
        ))}
      </group>
      <group ref={boxes}>
        {Array.from({ length: 5 }, (_, i) => (
          <RoundedBox key={i} args={[0.55, 0.42, 0.55]} radius={0.03} position={[0, 1.17, 0]} castShadow>{M.card}</RoundedBox>
        ))}
      </group>
    </group>
  );
}

function Arm(p: P & { z: number }) {
  const turret = useRef<THREE.Group>(null), shoulder = useRef<THREE.Group>(null), elbow = useRef<THREE.Group>(null), held = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (p.rb.faulted) { // frozen mid-swing
      turret.current!.rotation.y = 0.7; shoulder.current!.rotation.z = -0.15; elbow.current!.rotation.z = 0.4; held.current!.visible = false; return;
    }
    const ph = ((clock.elapsedTime * SPEED) / SPACING) % 1; // one pick per box
    const swing = ph < 0.5 ? Math.sin(ph * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5 : Math.sin((1 - ph) * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5;
    turret.current!.rotation.y = -Math.PI / 2 + swing * Math.PI * 0.62;
    shoulder.current!.rotation.z = -0.55 + Math.sin(ph * Math.PI * 4) * 0.12;
    elbow.current!.rotation.z = 1.1 - Math.sin(ph * Math.PI * 4) * 0.25;
    held.current!.visible = ph < 0.5;
  });
  return (
    <group position={[2.4, 0, p.z]}>
      <Pickable {...p} height={2.6}>
        <RoundedBox args={[1.2, 0.3, 1.2]} radius={0.05} position={[0, 0.15, 0]} castShadow>{M.graphite}</RoundedBox>
        {[[-0.48, -0.48], [0.48, -0.48], [-0.48, 0.48], [0.48, 0.48]].map(([x, z]) => <mesh key={`${x}${z}`} position={[x, 0.32, z]}><cylinderGeometry args={[0.04, 0.04, 0.05, 12]} />{M.steel}</mesh>)}
        <group ref={turret} position={[0, 0.3, 0]}>
          <mesh position={[0, 0.25, 0]} castShadow><cylinderGeometry args={[0.42, 0.5, 0.5, 40]} />{M.paint}</mesh>
          <group ref={shoulder} position={[0, 0.65, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.24, 0.24, 0.62, 32]} />{M.graphite}</mesh>
            <RoundedBox args={[0.34, 1.5, 0.34]} radius={0.12} position={[0, 0.75, 0]} castShadow>{M.paint}</RoundedBox>
            <group ref={elbow} position={[0, 1.5, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[0.19, 0.19, 0.5, 32]} />{M.graphite}</mesh>
              <RoundedBox args={[1.35, 0.26, 0.26]} radius={0.1} position={[0.65, 0, 0]} castShadow>{M.paint}</RoundedBox>
              <group position={[1.35, -0.1, 0]}>
                <mesh castShadow><cylinderGeometry args={[0.11, 0.11, 0.26, 24]} />{M.steel}</mesh>
                {[-0.1, 0.1].map((dz) => <mesh key={dz} position={[0, -0.22, dz]} castShadow><boxGeometry args={[0.06, 0.24, 0.04]} />{M.steel}</mesh>)}
                <mesh ref={held} position={[0, -0.55, 0]} castShadow><boxGeometry args={[0.5, 0.4, 0.5]} />{M.card}</mesh>
              </group>
            </group>
          </group>
        </group>
      </Pickable>
      <group position={[0, 0, 2.3]}>
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow><boxGeometry args={[1.3, 0.16, 1.1]} /><meshStandardMaterial color="#6b5236" roughness={0.9} /></mesh>
        {[[-0.3, 0.38, -0.25], [0.3, 0.38, -0.25], [-0.3, 0.38, 0.25], [0.3, 0.38, 0.25], [0, 0.8, 0]].map(([x, y, zz], i) => (
          <mesh key={i} position={[x, y, zz]} castShadow><boxGeometry args={[0.55, 0.42, 0.48]} />{M.card}</mesh>
        ))}
      </group>
    </group>
  );
}

function Amr(p: P & { i: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!g.current || p.rb.faulted) return;
    const a = clock.elapsedTime * 0.18 + (p.i * Math.PI * 2) / 3;
    const x = 7.5 + Math.cos(a) * 2.4, z = Math.sin(a) * 7;
    g.current.position.set(x, 0, z);
    g.current.rotation.y = Math.atan2(-Math.cos(a) * 7, -Math.sin(a) * 2.4);
  });
  return (
    <group ref={g} position={[7.5 + 2.4, 0, p.i * 3 - 3]}>
      <Pickable {...p} height={1}>
        <RoundedBox args={[1.3, 0.32, 0.9]} radius={0.1} position={[0, 0.28, 0]} castShadow>{M.white}</RoundedBox>
        <mesh position={[0, 0.45, 0]}><boxGeometry args={[1.32, 0.03, 0.92]} />{M.glowBlue}</mesh>
        <mesh position={[0.35, 0.56, 0]} castShadow><cylinderGeometry args={[0.12, 0.12, 0.14, 24]} />{M.graphite}</mesh>
        <RoundedBox args={[0.6, 0.45, 0.6]} radius={0.03} position={[-0.2, 0.68, 0]} castShadow>{M.card}</RoundedBox>
        {[[-0.45, -0.46], [0.45, -0.46], [-0.45, 0.46], [0.45, 0.46]].map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x, 0.12, z]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.08, 20]} />{M.rubber}</mesh>
        ))}
      </Pickable>
    </group>
  );
}

function Humanoid(p: P & { z: number }) {
  const g = useRef<THREE.Group>(null), armL = useRef<THREE.Group>(null), armR = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 2 + p.z;
    if (p.rb.faulted) { if (g.current) g.current.rotation.z = 0.08; return; }
    if (g.current) g.current.position.y = Math.abs(Math.sin(t)) * 0.03;
    if (armL.current) armL.current.rotation.x = -0.9 + Math.sin(t) * 0.35;
    if (armR.current) armR.current.rotation.x = -0.9 - Math.sin(t) * 0.35;
  });
  const limb = (len: number, r: number) => <mesh position={[0, -len / 2, 0]} castShadow><capsuleGeometry args={[r, len, 8, 16]} />{M.white}</mesh>;
  return (
    <group position={[-4, 0, p.z - 1.9]}>
      <Pickable {...p} height={2.1}>
        <group ref={g}>
          <RoundedBox args={[0.62, 0.78, 0.36]} radius={0.14} position={[0, 1.42, 0]} castShadow>{M.white}</RoundedBox>
          <mesh position={[0, 1.42, 0.19]}><boxGeometry args={[0.3, 0.05, 0.01]} />{M.glowBlue}</mesh>
          <RoundedBox args={[0.5, 0.3, 0.3]} radius={0.1} position={[0, 0.95, 0]} castShadow>{M.graphite}</RoundedBox>
          <mesh position={[0, 2.0, 0]} castShadow><sphereGeometry args={[0.2, 32, 32]} />{M.white}</mesh>
          <mesh position={[0, 2.0, 0.12]}><boxGeometry args={[0.28, 0.08, 0.12]} /><meshPhysicalMaterial color="#02070A" roughness={0.05} metalness={0.5} clearcoat={1} /></mesh>
          <group ref={armL} position={[-0.4, 1.72, 0]}>{limb(0.6, 0.08)}</group>
          <group ref={armR} position={[0.4, 1.72, 0]}>{limb(0.6, 0.08)}</group>
          <group position={[-0.15, 0.82, 0]}>{limb(0.7, 0.1)}</group>
          <group position={[0.15, 0.82, 0]}>{limb(0.7, 0.1)}</group>
        </group>
      </Pickable>
      <RoundedBox args={[1.4, 0.08, 0.7]} radius={0.02} position={[0, 0.95, 0.75]} castShadow receiveShadow>{M.steel}</RoundedBox>
      {[[-0.6, 0.45], [0.6, 0.45], [-0.6, 1.05], [0.6, 1.05]].map(([x, z]) => <mesh key={`${x}${z}`} position={[x, 0.47, z]} castShadow><boxGeometry args={[0.05, 0.95, 0.05]} />{M.steel}</mesh>)}
      <RoundedBox args={[0.45, 0.32, 0.45]} radius={0.02} position={[0.3, 1.15, 0.75]} castShadow>{M.card}</RoundedBox>
    </group>
  );
}

function Quadruped(p: P & { i: number }) {
  const g = useRef<THREE.Group>(null), legs = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!g.current || p.rb.faulted) return;
    const t = clock.elapsedTime * 0.3 + p.i * 2.1;
    g.current.position.x = -7 + ((Math.sin(t) + 1) / 2) * 12;
    g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, Math.cos(t) > 0 ? 0 : Math.PI, 0.06);
    legs.current?.children.forEach((l, k) => { l.rotation.z = Math.sin(clock.elapsedTime * 7 + k * Math.PI) * 0.35; });
  });
  return (
    <group ref={g} position={[-7 + p.i * 4, 0, -9 + p.i * 0.01]}>
      <Pickable {...p} height={1}>
        <RoundedBox args={[1.1, 0.3, 0.45]} radius={0.12} position={[0, 0.72, 0]} castShadow>{M.graphite}</RoundedBox>
        <RoundedBox args={[0.3, 0.2, 0.3]} radius={0.06} position={[0.62, 0.8, 0]} castShadow>{M.paint}</RoundedBox>
        <mesh position={[0.78, 0.82, 0]}><boxGeometry args={[0.02, 0.06, 0.2]} />{M.glowBlue}</mesh>
        <group ref={legs}>
          {[[-0.42, -0.2], [0.42, -0.2], [-0.42, 0.2], [0.42, 0.2]].map(([x, z]) => (
            <group key={`${x}${z}`} position={[x, 0.62, z]}>
              <mesh position={[0, -0.3, 0]} castShadow><capsuleGeometry args={[0.05, 0.5, 6, 10]} />{M.steel}</mesh>
            </group>
          ))}
        </group>
      </Pickable>
    </group>
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

// Yellow safety fencing around each arm cell: posts, mesh panels.
function Fence({ z }: { z: number }) {
  const panel = <meshStandardMaterial color="#c9a227" metalness={0.3} roughness={0.5} transparent opacity={0.35} side={THREE.DoubleSide} />;
  return (
    <group position={[2.4, 0, z]}>
      {[[-1.6, -1.4], [1.6, -1.4], [1.6, 1.4], [3.0, 1.4], [3.0, 3.5], [1.6, 3.5]].map(([x, zz], i) => (
        <mesh key={i} position={[x, 0.9, zz]} castShadow><boxGeometry args={[0.07, 1.8, 0.07]} /><meshStandardMaterial color="#c9a227" metalness={0.4} roughness={0.4} /></mesh>
      ))}
      <mesh position={[0, 0.95, -1.4]}><planeGeometry args={[3.2, 1.5]} />{panel}</mesh>
      <mesh position={[1.6, 0.95, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[2.8, 1.5]} />{panel}</mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}><ringGeometry args={[1.5, 1.6, 64]} /><meshStandardMaterial color="#c9a227" roughness={0.7} /></mesh>
    </group>
  );
}

function Building() {
  const tex = useTextures();
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, 0, 0.25]} receiveShadow>
        <planeGeometry args={[30, 24]} />
        <MeshReflectorMaterial blur={[300, 80]} resolution={512} mixBlur={1} mixStrength={2.5} roughness={0.92} depthScale={0.6} minDepthThreshold={0.6} maxDepthThreshold={1.2} color="#7d878f" metalness={0.15} mirror={0} map={tex?.concrete} roughnessMap={tex?.concrete} />
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
      <Racks />
      {LINES.map((z) => <Fence key={`f${z}`} z={z} />)}
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
      <color attach="background" args={["#02070A"]} />
      <SoftShadows size={22} samples={10} focus={0.6} />
      <fog attach="fog" args={["#05090c", 26, 60]} />
      <hemisphereLight args={["#dfefff", "#2a2420", 0.55]} />
      <directionalLight position={[8, 14, 6]} intensity={0.9} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-16} shadow-camera-right={16} shadow-camera-top={14} shadow-camera-bottom={-14} shadow-bias={-0.0003} />
            <pointLight position={[11, 4, 8]} color="#ffe9d6" intensity={18} distance={18} />
      <Building />
      {LINES.map((z, i) => <Conveyor key={z} z={z} jammed={!!by("Arm")[i]?.faulted} />)}
      {by("Arm").map((rb, i) => <Arm key={rb.id} {...props(rb)} z={LINES[i]} />)}
      {by("Humanoid").map((rb, i) => <Humanoid key={rb.id} {...props(rb)} z={LINES[i]} />)}
      {by("AMR").map((rb, i) => <Amr key={rb.id} {...props(rb)} i={i} />)}
      {by("Quadruped").map((rb, i) => <Quadruped key={rb.id} {...props(rb)} i={i} />)}
      <ContactShadows position={[0, 0.015, 0]} scale={40} blur={2.4} far={4} opacity={0.6} />
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
