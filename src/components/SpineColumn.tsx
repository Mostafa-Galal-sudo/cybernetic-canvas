import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

/**
 * SpineColumn — A 3D anatomical vertebral column.
 * 14 vertebrae stacked along Y, intervertebral discs between them,
 * spinal-cord channel through the middle, and faint nerve roots at each level.
 * The whole column sways gently with scroll progress (0..1).
 *
 * Scroll progress is delivered via a ref-shaped object so we can update it
 * every frame WITHOUT triggering React re-renders of consumers.
 */

export type ScrollProgressRef = { current: number };

type SpineColumnProps = {
  progressRef: ScrollProgressRef;
};

const VERTEBRA_COUNT = 14;
const VERTEBRA_GAP = 0.52;
const START_Y = 3.5;

const CYBER_CYAN = "#22d3ee";
const CYBER_VIOLET = "#a78bfa";
// Realistic bone tones
const BONE_BASE = "#e8dcc4"; // ivory bone
const BONE_DEEP = "#a89878"; // bottom darker
const DISC_GEL = "#3a2540"; // intervertebral disc (gel-like)

function Vertebra({
  y,
  bodyMat,
  spineMat,
  wingMat,
  bodyGeom,
  processGeom,
  wingGeom,
}: {
  y: number;
  bodyMat: THREE.Material;
  spineMat: THREE.Material;
  wingMat: THREE.Material;
  bodyGeom: THREE.BufferGeometry;
  processGeom: THREE.BufferGeometry;
  wingGeom: THREE.BufferGeometry;
}) {
  return (
    <group position={[0, y, 0]}>
      {/* Vertebral body */}
      <mesh geometry={bodyGeom} material={bodyMat} castShadow receiveShadow />
      {/* Spinous process — points back-down */}
      <mesh
        geometry={processGeom}
        material={spineMat}
        position={[0, -0.05, 0.2]}
        rotation={[-(70 * Math.PI) / 180, 0, 0]}
      />
      {/* Transverse processes */}
      <mesh
        geometry={wingGeom}
        material={wingMat}
        position={[-0.38, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      />
      <mesh
        geometry={wingGeom}
        material={wingMat}
        position={[0.38, 0, 0]}
        rotation={[0, 0, -Math.PI / 2]}
      />
    </group>
  );
}

function Column({ progressRef }: SpineColumnProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Geometries — slightly higher segment count for smoother bone
  const bodyGeom = useMemo(
    () => new THREE.CylinderGeometry(0.35, 0.38, 0.28, 24),
    [],
  );
  const processGeom = useMemo(
    () => new THREE.CylinderGeometry(0.04, 0.07, 0.45, 10),
    [],
  );
  const wingGeom = useMemo(
    () => new THREE.CylinderGeometry(0.035, 0.05, 0.35, 10),
    [],
  );
  const discGeom = useMemo(
    () => new THREE.CylinderGeometry(0.32, 0.32, 0.1, 32),
    [],
  );
  const cordGeom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 4, 0),
      new THREE.Vector3(0, -4, 0),
    ]);
    return new THREE.TubeGeometry(curve, 48, 0.04, 12, false);
  }, []);

  // Materials — realistic bone (creamy, slightly rough, low metalness, faint cyan rim emissive)
  const bodyMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(BONE_BASE),
        emissive: new THREE.Color(CYBER_CYAN),
        emissiveIntensity: 0.08,
        roughness: 0.78,
        metalness: 0.05,
        clearcoat: 0.15,
        clearcoatRoughness: 0.6,
        sheen: 0.2,
        sheenColor: new THREE.Color("#fff5d6"),
      }),
    [],
  );
  const spineProcessMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(BONE_DEEP),
        emissive: new THREE.Color(CYBER_CYAN),
        emissiveIntensity: 0.12,
        roughness: 0.85,
        metalness: 0.04,
      }),
    [],
  );
  const wingMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(BONE_DEEP),
        emissive: new THREE.Color(CYBER_CYAN),
        emissiveIntensity: 0.1,
        roughness: 0.8,
        metalness: 0.04,
      }),
    [],
  );
  // Disc — translucent gel feel via PhysicalMaterial transmission
  const discMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(DISC_GEL),
        emissive: new THREE.Color(CYBER_VIOLET),
        emissiveIntensity: 0.55,
        transparent: true,
        opacity: 0.85,
        roughness: 0.25,
        metalness: 0.0,
        transmission: 0.35,
        thickness: 0.4,
        ior: 1.4,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
      }),
    [],
  );
  const cordMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#ffffff"),
        emissive: new THREE.Color("#ffffff"),
        emissiveIntensity: 1.1,
        transparent: true,
        opacity: 0.55,
      }),
    [],
  );

  const vertebraYs = useMemo(
    () => Array.from({ length: VERTEBRA_COUNT }, (_, i) => START_Y - i * VERTEBRA_GAP),
    [],
  );
  const discYs = useMemo(
    () => vertebraYs.slice(0, -1).map((y, i) => (y + vertebraYs[i + 1]) / 2),
    [vertebraYs],
  );

  const nerveRoots = useMemo(() => {
    return vertebraYs.flatMap((y) => [
      {
        key: `nl-${y}`,
        points: [
          [-0.4, y, 0] as [number, number, number],
          [-1.2, y - 0.15, 0] as [number, number, number],
        ],
      },
      {
        key: `nr-${y}`,
        points: [
          [0.4, y, 0] as [number, number, number],
          [1.2, y - 0.15, 0] as [number, number, number],
        ],
      },
    ]);
  }, [vertebraYs]);

  // Cleanup
  useEffect(() => {
    return () => {
      bodyGeom.dispose();
      processGeom.dispose();
      wingGeom.dispose();
      discGeom.dispose();
      cordGeom.dispose();
      bodyMat.dispose();
      spineProcessMat.dispose();
      wingMat.dispose();
      discMat.dispose();
      cordMat.dispose();
    };
  }, [
    bodyGeom,
    processGeom,
    wingGeom,
    discGeom,
    cordGeom,
    bodyMat,
    spineProcessMat,
    wingMat,
    discMat,
    cordMat,
  ]);

  // Sway with scroll — read from ref, never trigger React render
  useFrame(() => {
    if (!groupRef.current) return;
    const p = progressRef.current;
    const targetY = Math.sin(p * Math.PI) * 0.4;
    const targetX = p * 0.08;
    const g = groupRef.current;
    g.rotation.y += (targetY - g.rotation.y) * 0.07;
    g.rotation.x += (targetX - g.rotation.x) * 0.07;
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={cordGeom} material={cordMat} />

      {vertebraYs.map((y) => (
        <Vertebra
          key={`v-${y}`}
          y={y}
          bodyMat={bodyMat}
          spineMat={spineProcessMat}
          wingMat={wingMat}
          bodyGeom={bodyGeom}
          processGeom={processGeom}
          wingGeom={wingGeom}
        />
      ))}

      {discYs.map((y) => (
        <mesh key={`d-${y}`} geometry={discGeom} material={discMat} position={[0, y, 0]} />
      ))}

      {nerveRoots.map((n) => (
        <Line
          key={n.key}
          points={n.points}
          color={CYBER_CYAN}
          lineWidth={1}
          transparent
          opacity={0.4}
        />
      ))}
    </group>
  );
}

export function SpineColumn({ progressRef }: SpineColumnProps) {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 8], fov: 42 }}
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
      <ambientLight intensity={0.35} />
      <hemisphereLight color={"#fff5d6"} groundColor={"#1a1428"} intensity={0.6} />
      <pointLight color={CYBER_CYAN} position={[3, 5, 4]} intensity={5} />
      <pointLight color={CYBER_VIOLET} position={[-3, -4, -2]} intensity={3.5} />
      <pointLight color="#ffffff" position={[0, 0, 6]} intensity={1.5} />
      <Column progressRef={progressRef} />
    </Canvas>
  );
}

/**
 * Returns a stable ref whose .current is updated from passive scroll listeners.
 * NEVER triggers React re-renders — consumers should read from the ref inside
 * useFrame / requestAnimationFrame loops only.
 */
export function useSpineScrollProgress(
  ref: React.RefObject<HTMLElement | null>,
): ScrollProgressRef {
  const progressRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    let queued = false;

    const compute = () => {
      queued = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      if (total <= 0) {
        progressRef.current = 0;
        return;
      }
      const pct = Math.min(1, Math.max(0, -rect.top / total));
      progressRef.current = pct;
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      rafId = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);

  return progressRef;
}

/** SSR-safe mobile detector at 640px breakpoint. */
export function useIsSmall() {
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setSmall(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return small;
}
