import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import * as THREE from "three";

/**
 * SpineColumn — A 3D anatomical vertebral column.
 * 14 vertebrae stacked along Y, intervertebral discs between them,
 * spinal-cord channel through the middle, faint nerve roots, hover-revealed
 * vertebra labels (C1..T7), procedural bone normal map, fresnel rim, and a
 * subtle bloom postprocessing pass.
 *
 * Scroll progress is delivered via a ref so we can update it every frame
 * WITHOUT triggering React re-renders.
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
const BONE_BASE = "#e8dcc4"; // ivory bone
const BONE_DEEP = "#a89878"; // bottom darker
const DISC_GEL = "#3a2540"; // intervertebral disc (gel-like)

// Anatomical-style labels for 14 vertebrae: 7 cervical + 7 thoracic.
const VERTEBRA_LABELS = [
  "C1", "C2", "C3", "C4", "C5", "C6", "C7",
  "T1", "T2", "T3", "T4", "T5", "T6", "T7",
];

/** Procedural bone normal map — subtle micro-bumpiness baked once. */
function makeBoneNormalMap(): THREE.DataTexture {
  const size = 128;
  const data = new Uint8Array(size * size * 4);
  // Generate a soft, low-frequency noise then convert into a tangent-space normal.
  const heights = new Float32Array(size * size);
  const rand = (x: number, y: number) => {
    const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return s - Math.floor(s);
  };
  // Cheap value-noise blend (a couple of octaves)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n1 = rand(Math.floor(x / 8), Math.floor(y / 8));
      const n2 = rand(Math.floor(x / 4), Math.floor(y / 4)) * 0.5;
      const n3 = rand(x, y) * 0.15;
      heights[y * size + x] = (n1 + n2 + n3) * 0.6;
    }
  }
  // Sobel-ish gradient → normal
  const idx = (x: number, y: number) =>
    heights[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = idx(x + 1, y) - idx(x - 1, y);
      const dy = idx(x, y + 1) - idx(x, y - 1);
      const nx = -dx * 2.0;
      const ny = -dy * 2.0;
      const nz = 1.0;
      const len = Math.hypot(nx, ny, nz);
      const i = (y * size + x) * 4;
      data[i] = Math.floor(((nx / len) * 0.5 + 0.5) * 255);
      data[i + 1] = Math.floor(((ny / len) * 0.5 + 0.5) * 255);
      data[i + 2] = Math.floor(((nz / len) * 0.5 + 0.5) * 255);
      data[i + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.needsUpdate = true;
  return tex;
}

function Vertebra({
  y,
  label,
  hovered,
  onHover,
  bodyMat,
  spineMat,
  wingMat,
  bodyGeom,
  processGeom,
  wingGeom,
}: {
  y: number;
  label: string;
  hovered: boolean;
  onHover: (h: boolean) => void;
  bodyMat: THREE.Material;
  spineMat: THREE.Material;
  wingMat: THREE.Material;
  bodyGeom: THREE.BufferGeometry;
  processGeom: THREE.BufferGeometry;
  wingGeom: THREE.BufferGeometry;
}) {
  return (
    <group position={[0, y, 0]}>
      {/* Vertebral body — interactive */}
      <mesh
        geometry={bodyGeom}
        material={bodyMat}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
        }}
        onPointerOut={() => onHover(false)}
      />
      {/* Spinous process */}
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
      {/* Hover label */}
      <Html
        position={[0.7, 0.05, 0]}
        center
        style={{
          pointerEvents: "none",
          opacity: hovered ? 1 : 0,
          transition: "opacity 220ms ease",
          fontFamily:
            "ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace",
          fontSize: 10,
          letterSpacing: "0.18em",
          color: "#22d3ee",
          textShadow: "0 0 6px rgba(34,211,238,0.5)",
          background: "rgba(8,12,20,0.55)",
          border: "1px solid rgba(34,211,238,0.35)",
          borderRadius: 999,
          padding: "2px 8px",
          whiteSpace: "nowrap",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Html>
    </group>
  );
}

/** Custom shader chunks: inject a cyan fresnel rim into the standard material. */
function patchFresnelRim(mat: THREE.Material, color: THREE.Color, power = 2.5) {
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uRimColor = { value: color };
    shader.uniforms.uRimPower = { value: power };
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
         uniform vec3 uRimColor;
         uniform float uRimPower;`,
      )
      .replace(
        "#include <output_fragment>",
        `
         #ifdef USE_TRANSMISSION
           // skip on transmissive disc
         #endif
         vec3 viewDir = normalize(vViewPosition);
         float fres = pow(1.0 - clamp(dot(normalize(vNormal), viewDir), 0.0, 1.0), uRimPower);
         outgoingLight += uRimColor * fres * 0.55;
         #include <output_fragment>`,
      );
  };
  mat.needsUpdate = true;
}

function Column({ progressRef }: SpineColumnProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  // Procedural normal map — built once, disposed on unmount
  const normalMap = useMemo(() => makeBoneNormalMap(), []);

  // Geometries
  const bodyGeom = useMemo(
    () => new THREE.CylinderGeometry(0.35, 0.38, 0.28, 28),
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

  // Realistic bone — physical material with SSS-feel sheen, normal map, fresnel rim
  const bodyMat = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(BONE_BASE),
      emissive: new THREE.Color(CYBER_CYAN),
      emissiveIntensity: 0.06,
      roughness: 0.72,
      metalness: 0.04,
      clearcoat: 0.18,
      clearcoatRoughness: 0.55,
      sheen: 0.35,
      sheenColor: new THREE.Color("#fff5d6"),
      sheenRoughness: 0.6,
      normalMap,
      normalScale: new THREE.Vector2(0.35, 0.35),
    });
    patchFresnelRim(m, new THREE.Color(CYBER_CYAN), 2.4);
    return m;
  }, [normalMap]);

  const spineProcessMat = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(BONE_DEEP),
      emissive: new THREE.Color(CYBER_CYAN),
      emissiveIntensity: 0.1,
      roughness: 0.82,
      metalness: 0.04,
      sheen: 0.25,
      sheenColor: new THREE.Color("#fff0c8"),
      normalMap,
      normalScale: new THREE.Vector2(0.5, 0.5),
    });
    patchFresnelRim(m, new THREE.Color(CYBER_CYAN), 2.6);
    return m;
  }, [normalMap]);

  const wingMat = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(BONE_DEEP),
      emissive: new THREE.Color(CYBER_CYAN),
      emissiveIntensity: 0.08,
      roughness: 0.78,
      metalness: 0.04,
      sheen: 0.3,
      sheenColor: new THREE.Color("#fff0c8"),
      normalMap,
      normalScale: new THREE.Vector2(0.45, 0.45),
    });
    patchFresnelRim(m, new THREE.Color(CYBER_CYAN), 2.6);
    return m;
  }, [normalMap]);

  // Disc — translucent gel
  const discMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(DISC_GEL),
        emissive: new THREE.Color(CYBER_VIOLET),
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.85,
        roughness: 0.22,
        metalness: 0.0,
        transmission: 0.4,
        thickness: 0.45,
        ior: 1.4,
        clearcoat: 0.65,
        clearcoatRoughness: 0.18,
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
    return vertebraYs.flatMap((y, i) => [
      {
        key: `nl-${i}`,
        points: [
          [-0.4, y, 0] as [number, number, number],
          [-1.2, y - 0.15, 0] as [number, number, number],
        ],
      },
      {
        key: `nr-${i}`,
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
      normalMap.dispose();
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
    normalMap,
  ]);

  // Sway with scroll
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

      {vertebraYs.map((y, i) => (
        <Vertebra
          key={`v-${i}`}
          y={y}
          label={VERTEBRA_LABELS[i] ?? `V${i + 1}`}
          hovered={hoverIdx === i}
          onHover={(h) => setHoverIdx(h ? i : (prev) => (prev === i ? null : prev))}
          bodyMat={bodyMat}
          spineMat={spineProcessMat}
          wingMat={wingMat}
          bodyGeom={bodyGeom}
          processGeom={processGeom}
          wingGeom={wingGeom}
        />
      ))}

      {discYs.map((y, i) => (
        <mesh key={`d-${i}`} geometry={discGeom} material={discMat} position={[0, y, 0]} />
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
        pointerEvents: "auto",
        background: "transparent",
      }}
    >
      <ambientLight intensity={0.32} />
      <hemisphereLight color={"#fff5d6"} groundColor={"#1a1428"} intensity={0.55} />
      <pointLight color={CYBER_CYAN} position={[3, 5, 4]} intensity={5} />
      <pointLight color={CYBER_VIOLET} position={[-3, -4, -2]} intensity={3.5} />
      <pointLight color="#ffffff" position={[0, 0, 6]} intensity={1.4} />
      <Column progressRef={progressRef} />
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.55}
          luminanceThreshold={0.45}
          luminanceSmoothing={0.22}
          kernelSize={KernelSize.LARGE}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}

/**
 * Returns a stable ref whose .current is updated from passive scroll listeners.
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
