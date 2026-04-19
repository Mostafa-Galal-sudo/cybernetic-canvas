import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * HelixSpine — A 3D DNA double-helix backbone that orbits around a central Y axis.
 *
 * Geometry:
 * - Central spine: vertical TubeGeometry from (0, +8, 0) to (0, -8, 0)
 * - Two parametric helix strands (300 points) orbiting at helixRadius=1.4, 4 turns
 * - 32 cross-rungs connecting both strands through the center
 * - Node spheres at each rung endpoint
 *
 * The whole structure rotates around Y based on scrollProgress (0..1).
 */

type HelixSpineProps = {
  scrollProgress: number;
};

const HELIX_RADIUS = 1.4;
const TURNS = 4;
const HEIGHT = 16;
const HALF_H = HEIGHT / 2;
const STRAND_POINTS = 300;
const RUNG_COUNT = 32;

function strandPoint(t: number, phase: number) {
  const angle = t * TURNS * Math.PI * 2 + phase;
  return new THREE.Vector3(
    HELIX_RADIUS * Math.cos(angle),
    HALF_H - t * HEIGHT,
    HELIX_RADIUS * Math.sin(angle),
  );
}

function HelixGroup({ scrollProgress }: HelixSpineProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Central spine
  const spineGeom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, HALF_H, 0),
      new THREE.Vector3(0, -HALF_H, 0),
    ]);
    return new THREE.TubeGeometry(curve, 64, 0.025, 8, false);
  }, []);

  const spineMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#ffffff"),
        emissive: new THREE.Color("#ffffff"),
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.4,
      }),
    [],
  );

  // Strand A (cyan, phase 0)
  const strandAGeom = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < STRAND_POINTS; i++) {
      pts.push(strandPoint(i / (STRAND_POINTS - 1), 0));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, STRAND_POINTS, 0.06, 12, false);
  }, []);

  const strandAMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#22d3ee"),
        emissive: new THREE.Color("#22d3ee"),
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.3,
        metalness: 0.4,
      }),
    [],
  );

  // Strand B (violet, phase PI)
  const strandBGeom = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < STRAND_POINTS; i++) {
      pts.push(strandPoint(i / (STRAND_POINTS - 1), Math.PI));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, STRAND_POINTS, 0.06, 12, false);
  }, []);

  const strandBMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#a78bfa"),
        emissive: new THREE.Color("#a78bfa"),
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.3,
        metalness: 0.4,
      }),
    [],
  );

  // Cross-rungs
  const rungs = useMemo(() => {
    const items: { geom: THREE.TubeGeometry; a: THREE.Vector3; b: THREE.Vector3 }[] = [];
    for (let i = 0; i < RUNG_COUNT; i++) {
      const t = i / (RUNG_COUNT - 1);
      const a = strandPoint(t, 0);
      const b = strandPoint(t, Math.PI);
      const curve = new THREE.CatmullRomCurve3([a, b]);
      const geom = new THREE.TubeGeometry(curve, 8, 0.015, 6, false);
      items.push({ geom, a, b });
    }
    return items;
  }, []);

  const rungMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#ffffff"),
        emissive: new THREE.Color("#ffffff"),
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.25,
      }),
    [],
  );

  const nodeGeom = useMemo(() => new THREE.SphereGeometry(0.06, 16, 16), []);
  const nodeMatA = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#22d3ee"),
        emissive: new THREE.Color("#22d3ee"),
        emissiveIntensity: 4,
      }),
    [],
  );
  const nodeMatB = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#a78bfa"),
        emissive: new THREE.Color("#a78bfa"),
        emissiveIntensity: 4,
      }),
    [],
  );

  // Cleanup
  useEffect(() => {
    return () => {
      spineGeom.dispose();
      spineMat.dispose();
      strandAGeom.dispose();
      strandAMat.dispose();
      strandBGeom.dispose();
      strandBMat.dispose();
      nodeGeom.dispose();
      nodeMatA.dispose();
      nodeMatB.dispose();
      rungs.forEach((r) => r.geom.dispose());
      rungMat.dispose();
    };
  }, [
    spineGeom,
    spineMat,
    strandAGeom,
    strandAMat,
    strandBGeom,
    strandBMat,
    nodeGeom,
    nodeMatA,
    nodeMatB,
    rungs,
    rungMat,
  ]);

  // Sync rotation to scroll
  const targetRot = useRef(0);
  targetRot.current = scrollProgress * Math.PI * 4;

  useFrame(() => {
    if (!groupRef.current) return;
    // Smooth lerp
    const cur = groupRef.current.rotation.y;
    groupRef.current.rotation.y = cur + (targetRot.current - cur) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={spineGeom} material={spineMat} />
      <mesh geometry={strandAGeom} material={strandAMat} />
      <mesh geometry={strandBGeom} material={strandBMat} />
      {rungs.map((r, i) => (
        <mesh key={`r-${i}`} geometry={r.geom} material={rungMat} />
      ))}
      {rungs.map((r, i) => (
        <mesh
          key={`na-${i}`}
          geometry={nodeGeom}
          material={nodeMatA}
          position={r.a}
        />
      ))}
      {rungs.map((r, i) => (
        <mesh
          key={`nb-${i}`}
          geometry={nodeGeom}
          material={nodeMatB}
          position={r.b}
        />
      ))}
    </group>
  );
}

export function HelixSpine({ scrollProgress }: HelixSpineProps) {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 7], fov: 45 }}
      dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 1.5) : 1.5}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        background: "transparent",
      }}
    >
      <ambientLight intensity={0.15} />
      <pointLight color="#22d3ee" position={[3, 6, 3]} intensity={5} />
      <pointLight color="#a78bfa" position={[-3, -6, -3]} intensity={5} />
      <HelixGroup scrollProgress={scrollProgress} />
    </Canvas>
  );
}

/**
 * Hook: returns scroll progress (0..1) of a container relative to the viewport.
 * Computed on a passive scroll listener.
 */
export function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const pct = Math.min(1, Math.max(0, -rect.top / total));
      setProgress(pct);
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [ref]);

  return progress;
}

/**
 * Hook: detects mobile breakpoint (< 640px). SSR-safe.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}
