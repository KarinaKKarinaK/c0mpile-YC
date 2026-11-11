"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, RoundedBox } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import type { Robot } from "@/lib/engine";
import { monthlyRevenue } from "@/lib/engine";

const BLUE = new THREE.Color("#0297DE"), ORANGE = new THREE.Color("#FC734D"), BODY = "#4a6a80";

function Body({ kind }: { kind: Robot["kind"] }) {
  const mat = <meshStandardMaterial color={BODY} metalness={0.35} roughness={0.45} emissive="#0b2a3d" emissiveIntensity={0.6} />;
  if (kind === "AMR")
    return (
      <group>
        <RoundedBox args={[1.2, 0.35, 0.9]} radius={0.08} position={[0, 0.3, 0]}>{mat}</RoundedBox>
        <RoundedBox args={[0.9, 0.12, 0.7]} radius={0.04} position={[0, 0.54, 0]}><meshStandardMaterial color="#2c3f4d" /></RoundedBox>
      </group>
    );
  if (kind === "Arm")
    return (
      <group>
        <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.4, 0.5, 0.3, 24]} />{mat}</mesh>
        <mesh position={[0, 0.75, 0]}><cylinderGeometry args={[0.14, 0.16, 1, 16]} />{mat}</mesh>
        <mesh position={[0.35, 1.3, 0]} rotation={[0, 0, -1.1]}><cylinderGeometry args={[0.1, 0.12, 0.9, 16]} />{mat}</mesh>
      </group>
    );
  if (kind === "Humanoid")
    return (
      <group>
        <mesh position={[0, 0.95, 0]}><capsuleGeometry args={[0.28, 0.6, 8, 16]} />{mat}</mesh>
        <mesh position={[0, 1.65, 0]}><sphereGeometry args={[0.2, 24, 24]} />{mat}</mesh>
        <mesh position={[-0.12, 0.3, 0]}><capsuleGeometry args={[0.09, 0.45, 6, 10]} />{mat}</mesh>
        <mesh position={[0.12, 0.3, 0]}><capsuleGeometry args={[0.09, 0.45, 6, 10]} />{mat}</mesh>
      </group>
    );
  return (
    <group>
      <RoundedBox args={[1.1, 0.3, 0.5]} radius={0.08} position={[0, 0.65, 0]}>{mat}</RoundedBox>
      {[[-0.4, -0.18], [-0.4, 0.18], [0.4, -0.18], [0.4, 0.18]].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.3, z]}><cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />{mat}</mesh>
      ))}
    </group>
  );
}

function Unit({ rb, max, selected, onSelect }: { rb: Robot; max: number; selected: boolean; onSelect: (id: string) => void }) {
  const g = useRef<THREE.Group>(null);
  const beam = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  const rev = monthlyRevenue(rb), k = rev / max;
  const h = 0.4 + k * 2.6;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + rb.x;
    if (g.current) {
      g.current.position.y = rb.kind === "Humanoid" ? Math.sin(t * 2) * 0.03 : 0;
      if (rb.kind === "AMR") g.current.position.x = rb.x + Math.sin(t * 0.6) * 0.35;
      const s = hover || selected ? 1.08 : 1;
      g.current.scale.lerp(new THREE.Vector3(s, s, s), 0.15);
    }
    if (beam.current) {
      const m = beam.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = rb.faulted ? 1 + Math.sin(t * 8) * 0.9 : 1.2 + Math.sin(t * 1.5) * 0.25;
    }
  });

  const col = rb.faulted ? ORANGE : BLUE.clone().lerp(new THREE.Color("#7fd4ff"), k);
  return (
    <group position={[rb.x, 0, rb.z]}>
      <group
        ref={g}
        onClick={(e) => { e.stopPropagation(); onSelect(rb.id); }}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = ""; }}
      >
        <Body kind={rb.kind} />
      </group>
      <mesh ref={beam} position={[0, 2 + h / 2, 0]}>
        <cylinderGeometry args={[0.035, 0.035, h, 12]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={1.2} transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.9, selected ? 1.05 : 0.95, 48]} />
        <meshBasicMaterial color={selected ? "#FC734D" : "#0297DE"} transparent opacity={selected ? 0.9 : 0.25} />
      </mesh>
      {(hover || selected) && (
        <Html position={[0, 2.4 + h, 0]} center distanceFactor={9} style={{ pointerEvents: "none" }}>
          <div className="card whitespace-nowrap px-3 py-2 text-[11px]">
            <div>{rb.id} {rb.kind}{rb.faulted ? " FAULT" : ""}</div>
            <div className="text-white/60">${Math.round(rev).toLocaleString()}/mo verified</div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function Fleet3D({ fleet, selected, onSelect }: { fleet: Robot[]; selected: string; onSelect: (id: string) => void }) {
  const max = Math.max(...fleet.map(monthlyRevenue));
  return (
    <Canvas camera={{ position: [9, 8, 11], fov: 40 }} dpr={[1, 1.75]}>
      <color attach="background" args={["#02070A"]} />
      <fog attach="fog" args={["#02070A", 14, 32]} />
      <ambientLight intensity={0.9} /><hemisphereLight args={["#bfe6ff", "#02070A", 0.9]} />
      <directionalLight position={[6, 10, 4]} intensity={1.1} />
      <pointLight position={[-6, 4, -4]} color="#0297DE" intensity={40} />
      <pointLight position={[6, 3, 6]} color="#FC734D" intensity={30} />
      <gridHelper args={[30, 30, "#0b3a52", "#0a1a24"]} />
      {fleet.map((rb) => <Unit key={rb.id} rb={rb} max={max} selected={rb.id === selected} onSelect={onSelect} />)}
      <OrbitControls autoRotate autoRotateSpeed={0.4} enablePan={false} minDistance={8} maxDistance={22} maxPolarAngle={1.35} />
    </Canvas>
  );
}
