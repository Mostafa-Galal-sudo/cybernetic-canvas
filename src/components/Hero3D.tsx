import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import {
  Float,
  Environment,
  MeshDistortMaterial,
  MeshTransmissionMaterial,
  ContactShadows,
  Lightformer,
  AdaptiveDpr,
  AdaptiveEvents,
  PerformanceMonitor,
} from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

/**
 * Responsive layout: shapes are positioned in normalized "design" coords,
 * then offset/scaled per breakpoint so they never collide with the hero copy
 * on the left and the composition stays balanced on every screen size.
 */
function useResponsiveLayout() {
  const { viewport, size } = useThree();
  return useMemo(() => {
    const w = size.width;
    // breakpoints follow common tailwind sm/md/lg
    if (w < 640) {
      // Mobile: stack shapes mostly upper area, smaller, centered
      return {
        scale: 0.65,
        offsetX: 0,
        offsetY: 1.2,
        clusterSpread: 0.85,
      };
    }
    if (w < 1024) {
      // Tablet: shift right of copy, medium scale
      return {
        scale: 0.85,
        offsetX: 1.2,
        offsetY: 0.2,
        clusterSpread: 0.95,
      };
    }
    // Desktop: pushed to the right side so left text breathes
    return {
      scale: 1,
      offsetX: 2.2,
      offsetY: 0,
      clusterSpread: 1,
      _v: viewport.width, // reactive ref
    };
  }, [size.width, viewport.width]);
}

function FloatingShapes() {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const layout = useResponsiveLayout();

  useFrame((_, delta) => {
    if (!group.current) return;
    const lerp = Math.min(1, delta * 4);
    current.current.x += (target.current.x - current.current.x) * lerp;
    current.current.y += (target.current.y - current.current.y) * lerp;
    group.current.rotation.y =
      current.current.x * 0.35 + performance.now() * 0.00007;
    group.current.rotation.x = current.current.y * 0.2;
    group.current.position.x =
      layout.offsetX + current.current.x * 0.3;
    group.current.position.y =
      layout.offsetY + current.current.y * 0.18;
  });

  const handleMove = (e: ThreeEvent<PointerEvent>) => {
    const t = e.nativeEvent.target;
    const w = t instanceof HTMLCanvasElement ? t.clientWidth : window.innerWidth;
    const h = t instanceof HTMLCanvasElement ? t.clientHeight : window.innerHeight;
    target.current.x = (e.nativeEvent.clientX / w) * 2 - 1;
    target.current.y = -((e.nativeEvent.clientY / h) * 2 - 1);
  };

  const s = layout.clusterSpread;

  return (
    <group ref={group} onPointerMove={handleMove} scale={layout.scale}>
      {/* HERO: Glass icosahedron — refractive centerpiece */}
      <Float speed={1.1} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[0.2 * s, 0.1 * s, 0]} castShadow receiveShadow>
          <icosahedronGeometry args={[1.5, 6]} />
          <MeshTransmissionMaterial
            color="#cdf7ff"
            thickness={1.8}
            roughness={0.02}
            transmission={1}
            ior={1.52}
            chromaticAberration={0.1}
            anisotropy={0.4}
            backside
            samples={12}
            resolution={1024}
            distortion={0.2}
            distortionScale={0.3}
            temporalDistortion={0.08}
            attenuationDistance={2.2}
            attenuationColor="#7af1ff"
            clearcoat={1}
            clearcoatRoughness={0.05}
          />
        </mesh>
      </Float>

      {/* TORUS KNOT — polished metallic violet */}
      <Float speed={0.9} rotationIntensity={0.6} floatIntensity={0.8}>
        <mesh position={[1.9 * s, -1.4 * s, -0.4]} castShadow>
          <torusKnotGeometry args={[0.55, 0.18, 256, 48]} />
          <meshPhysicalMaterial
            color="#a06bff"
            metalness={1}
            roughness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.08}
            envMapIntensity={1.4}
            emissive="#3a1a6b"
            emissiveIntensity={0.25}
          />
        </mesh>
      </Float>

      {/* DISTORTED SPHERE — magenta organic blob */}
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={1.2}>
        <mesh position={[-1.4 * s, 1.6 * s, -0.8]} castShadow>
          <sphereGeometry args={[0.5, 128, 128]} />
          <MeshDistortMaterial
            color="#ff6bd9"
            distort={0.38}
            speed={1.6}
            metalness={0.55}
            roughness={0.18}
            envMapIntensity={1.2}
            emissive="#5a1a45"
            emissiveIntensity={0.35}
          />
        </mesh>
      </Float>

      {/* OCTAHEDRON crystal */}
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.4}>
        <mesh
          position={[-1.8 * s, -1.5 * s, -0.6]}
          rotation={[0.4, 0.3, 0]}
          castShadow
        >
          <octahedronGeometry args={[0.55, 0]} />
          <meshPhysicalMaterial
            color="#7af1ff"
            metalness={0.95}
            roughness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={1.5}
            emissive="#0a3a4a"
            emissiveIntensity={0.45}
            flatShading
          />
        </mesh>
      </Float>

      {/* DODECAHEDRON accent */}
      <Float speed={1.6} rotationIntensity={0.9} floatIntensity={1.6}>
        <mesh
          position={[2.5 * s, 1.3 * s, -2]}
          rotation={[0.2, 0.6, 0.1]}
          castShadow
        >
          <dodecahedronGeometry args={[0.36, 0]} />
          <meshPhysicalMaterial
            color="#a06bff"
            metalness={0.95}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.15}
            envMapIntensity={1.4}
            emissive="#2a0d5a"
            emissiveIntensity={0.4}
            flatShading
          />
        </mesh>
      </Float>

      {/* TETRAHEDRON accent */}
      <Float speed={1.3} rotationIntensity={0.8} floatIntensity={1.4}>
        <mesh
          position={[-2.6 * s, 0.6 * s, -1.8]}
          rotation={[0.3, 0.5, 0]}
          castShadow
        >
          <tetrahedronGeometry args={[0.42, 0]} />
          <meshPhysicalMaterial
            color="#7af1ff"
            metalness={0.9}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.18}
            envMapIntensity={1.4}
            emissive="#0a3a4a"
            emissiveIntensity={0.4}
            flatShading
          />
        </mesh>
      </Float>

      <BackgroundOrbs />
    </group>
  );
}

function BackgroundOrbs() {
  const orbs = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        key: i,
        position: [
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 8,
          -4 - Math.random() * 5,
        ] as [number, number, number],
        scale: 0.04 + Math.random() * 0.1,
        speed: 0.4 + Math.random() * 0.8,
        color: i % 3 === 0 ? "#ff6bd9" : i % 2 === 0 ? "#7af1ff" : "#a06bff",
      })),
    [],
  );

  return (
    <>
      {orbs.map((o) => (
        <Float key={o.key} speed={o.speed} floatIntensity={2}>
          <mesh position={o.position} scale={o.scale}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshStandardMaterial
              color={o.color}
              emissive={o.color}
              emissiveIntensity={2.2}
              toneMapped={false}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function ResponsiveCamera() {
  const { camera, size } = useThree();
  useMemo(() => {
    const cam = camera as THREE.PerspectiveCamera;
    if (size.width < 640) {
      cam.position.set(0, 0, 8);
      cam.fov = 60;
    } else if (size.width < 1024) {
      cam.position.set(0, 0, 7);
      cam.fov = 55;
    } else {
      cam.position.set(0, 0, 6.5);
      cam.fov = 48;
    }
    cam.updateProjectionMatrix();
  }, [camera, size.width]);
  return null;
}

export function Hero3D() {
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6.5], fov: 48 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        shadows
      >
        <PerformanceMonitor />
        <AdaptiveDpr pixelated={false} />
        <AdaptiveEvents />
        <ResponsiveCamera />

        <Suspense fallback={null}>
          {/* Lighting rig */}
          <ambientLight intensity={0.25} />
          <pointLight position={[5, 5, 5]} intensity={1.2} color="#7af1ff" />
          <pointLight position={[-5, -3, 4]} intensity={1} color="#a06bff" />
          <pointLight position={[0, 2, 3]} intensity={0.55} color="#ff6bd9" />
          <directionalLight
            position={[3, 4, 5]}
            intensity={0.55}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          {/* HDRI environment with custom area lights for crisp PBR reflections */}
          <Environment resolution={512}>
            <Lightformer
              form="rect"
              intensity={3}
              color="#7af1ff"
              position={[3, 3, 3]}
              scale={[3, 3, 1]}
            />
            <Lightformer
              form="rect"
              intensity={3}
              color="#a06bff"
              position={[-3, -2, 3]}
              scale={[3, 3, 1]}
            />
            <Lightformer
              form="rect"
              intensity={2}
              color="#ff6bd9"
              position={[0, 3, -3]}
              scale={[5, 1, 1]}
            />
            <Lightformer
              form="rect"
              intensity={1}
              color="#ffffff"
              position={[0, -3, 2]}
              scale={[4, 4, 1]}
            />
            <Lightformer
              form="ring"
              intensity={1.5}
              color="#aef6ff"
              position={[0, 0, 4]}
              scale={[2, 2, 1]}
            />
          </Environment>

          <FloatingShapes />

          <ContactShadows
            position={[0, -2.8, 0]}
            opacity={0.3}
            scale={16}
            blur={3.2}
            far={4.5}
            color="#000000"
          />

          {/* Cinematic post-processing */}
          <EffectComposer multisampling={4}>
            <Bloom
              intensity={0.85}
              luminanceThreshold={0.28}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <ChromaticAberration
              offset={[0.0006, 0.0006]}
              blendFunction={BlendFunction.NORMAL}
              radialModulation={false}
              modulationOffset={0}
            />
            <Vignette eskil={false} offset={0.25} darkness={0.55} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
