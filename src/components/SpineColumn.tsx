import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

/**
 * SpineColumn — A 3D anatomical vertebral column.
 * 14 vertebrae stacked along Y, intervertebral discs between them,
 * spinal-cord channel through the middle, and faint nerve roots at each level.
 * The whole column sways gently with scroll progress (0..1).
 */

type SpineColumnProps = {
  scrollProgress: number;
};

const VERTEBRA_COUNT = 14;
const VERTEBRA_GAP = 0.52;
const START_Y = 3.5;

const CYBER_CYAN = "#22d3ee";
const CYBER_VIOLET = "#a78bfa";

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
      <mesh geometry={bodyGeom} material={bodyMat} />
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

function Column({ scrollProgress }: SpineColumnProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Geometries (shared)
  const bodyGeom = useMemo(
    () => new THREE.CylinderGeometry(0.35, 0.38, 0.28, 16),
    [],
  );
  const processGeom = useMemo(
    () => new THREE.CylinderGeometry(0.04, 0.07, 0.45, 8),
    [],
  );
  const wingGeom = useMemo(
    () => new THREE.CylinderGeometry(0.035, 0.05, 0.35, 8),
    [],
  );
  const discGeom = useMemo(
    () => new THREE.CylinderGeometry(0.32, 0.32, 0.1, 24),
    [],
  );
  const cordGeom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 4, 0),
      new THREE.Vector3(0, -4, 0),
    ]);
    return new THREE.TubeGeometry(curve, 32, 0.04, 8, false);
  }, []);

  // Materials
  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0a0f1a"),
        emissive: new THREE.Color(CYBER_CYAN),
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.8,
      }),
    [],
  );
  const spineProcessMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0a0f1a"),
        emissive: new THREE.Color(CYBER_CYAN),
        emissiveIntensity: 0.6,
        roughness: 0.4,
        metalness: 0.7,
      }),
    [],
  );
  const wingMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0a0f1a"),
        emissive: new THREE.Color(CYBER_CYAN),
        emissiveIntensity: 0.5,
        roughness: 0.4,
        metalness: 0.7,
      }),
    [],
  );
  const discMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1a0a2e"),
        emissive: new THREE.Color(CYBER_VIOLET),
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.85,
        roughness: 0.2,
        metalness: 0.3,
      }),
    [],
  );
  const cordMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#ffffff"),
        emissive: new THREE.Color("#ffffff"),
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.6,
      }),
    [],
  );

  // Vertebrae positions
  const vertebraYs = useMemo(
    () => Array.from({ length: VERTEBRA_COUNT }, (_, i) => START_Y - i * VERTEBRA_GAP),
    [],
  );
  // Disc positions = midpoints between adjacent vertebrae
  const discYs = useMemo(
    () =>
      vertebraYs
        .slice(0, -1)
        .map((y, i) => (y + vertebraYs[i + 1]) / 2),
    [vertebraYs],
  );

  // Nerve root line points (per vertebra, both sides)
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

  // Sway with scroll
  const targetY = useRef(0);
  const targetX = useRef(0);
  targetY.current = Math.sin(scrollProgress * Math.PI) * 0.4;
  targetX.current = scrollProgress * 0.08;

  useFrame(() => {
    if (!groupRef.current) return;
    const g = groupRef.current;
    g.rotation.y += (targetY.current - g.rotation.y) * 0.07;
    g.rotation.x += (targetX.current - g.rotation.x) * 0.07;
  });

  return (
    <group ref={groupRef}>
      {/* Spinal cord */}
      <mesh geometry={cordGeom} material={cordMat} />

      {/* Vertebrae */}
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

      {/* Discs */}
      {discYs.map((y) => (
        <mesh key={`d-${y}`} geometry={discGeom} material={discMat} position={[0, y, 0]} />
      ))}

      {/* Nerve roots */}
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

export function SpineColumn({ scrollProgress }: SpineColumnProps) {
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
      <ambientLight intensity={0.2} />
      <pointLight color={CYBER_CYAN} position={[2, 4, 3]} intensity={6} />
      <pointLight color={CYBER_VIOLET} position={[-2, -4, -2]} intensity={4} />
      <pointLight color="#ffffff" position={[0, 0, 5]} intensity={2} />
      <Column scrollProgress={scrollProgress} />
    </Canvas>
  );
}

/** Scroll progress (0..1) of the container relative to viewport. */
export function useSpineScrollProgress(ref: React.RefObject<HTMLElement | null>) {
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
