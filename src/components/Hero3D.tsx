import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  Float,
  Environment,
  MeshDistortMaterial,
  MeshTransmissionMaterial,
  ContactShadows,
  Lightformer,
} from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

function FloatingShapes() {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (!group.current) return;
    // smooth interpolation toward target
    current.current.x += (target.current.x - current.current.x) * Math.min(1, delta * 4);
    current.current.y += (target.current.y - current.current.y) * Math.min(1, delta * 4);
    group.current.rotation.y = current.current.x * 0.4 + performance.now() * 0.00008;
    group.current.rotation.x = current.current.y * 0.25;
    group.current.position.x = current.current.x * 0.35;
    group.current.position.y = current.current.y * 0.2;
  });

  const handleMove = (e: ThreeEvent<PointerEvent>) => {
    const t = e.nativeEvent.target;
    const w = t instanceof HTMLCanvasElement ? t.clientWidth : window.innerWidth;
    const h = t instanceof HTMLCanvasElement ? t.clientHeight : window.innerHeight;
    target.current.x = (e.nativeEvent.clientX / w) * 2 - 1;
    target.current.y = -((e.nativeEvent.clientY / h) * 2 - 1);
  };

  return (
    <group ref={group} onPointerMove={handleMove}>
      {/* HERO: Glass icosahedron — refractive centerpiece */}
      <Float speed={1.1} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[-1.7, 0.3, 0]} castShadow receiveShadow>
          <icosahedronGeometry args={[1.4, 4]} />
          <MeshTransmissionMaterial
            color="#aef6ff"
            thickness={1.5}
            roughness={0.04}
            transmission={1}
            ior={1.55}
            chromaticAberration={0.08}
            anisotropy={0.3}
            backside
            samples={10}
            resolution={512}
            distortion={0.25}
            distortionScale={0.35}
            temporalDistortion={0.1}
            attenuationDistance={2}
            attenuationColor="#7af1ff"
          />
        </mesh>
      </Float>

      {/* TORUS KNOT — solid, polished metallic violet */}
      <Float speed={0.9} rotationIntensity={0.6} floatIntensity={0.8}>
        <mesh position={[2.0, -0.2, -0.4]} castShadow>
          <torusKnotGeometry args={[0.75, 0.24, 220, 48]} />
          <meshPhysicalMaterial
            color="#a06bff"
            metalness={1}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.1}
            emissive="#3a1a6b"
            emissiveIntensity={0.35}
          />
        </mesh>
      </Float>

      {/* DISTORTED SPHERE — magenta organic blob */}
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={1.2}>
        <mesh position={[1.0, 1.7, -1.2]} castShadow>
          <sphereGeometry args={[0.6, 96, 96]} />
          <MeshDistortMaterial
            color="#ff6bd9"
            distort={0.4}
            speed={1.8}
            metalness={0.6}
            roughness={0.2}
            emissive="#5a1a45"
            emissiveIntensity={0.45}
          />
        </mesh>
      </Float>

      {/* OCTAHEDRON — solid cyan crystal */}
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.4}>
        <mesh position={[-2.6, -1.6, -0.8]} rotation={[0.4, 0.3, 0]} castShadow>
          <octahedronGeometry args={[0.7, 0]} />
          <meshPhysicalMaterial
            color="#7af1ff"
            metalness={0.9}
            roughness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.15}
            emissive="#0a3a4a"
            emissiveIntensity={0.6}
            flatShading
          />
        </mesh>
      </Float>

      {/* DODECAHEDRON — small accent */}
      <Float speed={1.6} rotationIntensity={0.9} floatIntensity={1.6}>
        <mesh position={[2.9, 1.5, -2.2]} rotation={[0.2, 0.6, 0.1]} castShadow>
          <dodecahedronGeometry args={[0.45, 0]} />
          <meshPhysicalMaterial
            color="#a06bff"
            metalness={0.95}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.2}
            emissive="#2a0d5a"
            emissiveIntensity={0.5}
            flatShading
          />
        </mesh>
      </Float>

      {/* TETRAHEDRON — small accent */}
      <Float speed={1.3} rotationIntensity={0.8} floatIntensity={1.4}>
        <mesh position={[-3.2, 1.7, -2.0]} rotation={[0.3, 0.5, 0]} castShadow>
          <tetrahedronGeometry args={[0.55, 0]} />
          <meshPhysicalMaterial
            color="#7af1ff"
            metalness={0.9}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.2}
            emissive="#0a3a4a"
            emissiveIntensity={0.5}
            flatShading
          />
        </mesh>
      </Float>

      {/* Background depth orbs */}
      <BackgroundOrbs />
    </group>
  );
}

function BackgroundOrbs() {
  const orbs = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        key: i,
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 7,
          -3.5 - Math.random() * 5,
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
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export function Hero3D() {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6.2], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        shadows
      >
        <Suspense fallback={null}>
          {/* Lighting rig */}
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={1.4} color="#7af1ff" />
          <pointLight position={[-5, -3, 4]} intensity={1.1} color="#a06bff" />
          <pointLight position={[0, 2, 3]} intensity={0.6} color="#ff6bd9" />
          <directionalLight
            position={[3, 4, 5]}
            intensity={0.6}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          {/* HDRI environment with custom area lights for crisp reflections */}
          <Environment resolution={512}>
            <Lightformer
              intensity={2}
              color="#7af1ff"
              position={[3, 3, 3]}
              scale={[3, 3, 1]}
            />
            <Lightformer
              intensity={2}
              color="#a06bff"
              position={[-3, -2, 3]}
              scale={[3, 3, 1]}
            />
            <Lightformer
              intensity={1.5}
              color="#ff6bd9"
              position={[0, 3, -3]}
              scale={[5, 1, 1]}
            />
            <Lightformer
              intensity={0.8}
              color="#ffffff"
              position={[0, -3, 2]}
              scale={[4, 4, 1]}
            />
          </Environment>

          <FloatingShapes />

          {/* Soft contact shadow under main grouping */}
          <ContactShadows
            position={[0, -2.6, 0]}
            opacity={0.35}
            scale={14}
            blur={3}
            far={4}
            color="#000000"
          />

          {/* Post-processing for cinematic quality */}
          <EffectComposer multisampling={4}>
            <Bloom
              intensity={0.9}
              luminanceThreshold={0.25}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <ChromaticAberration
              offset={[0.0008, 0.0008]}
              blendFunction={BlendFunction.NORMAL}
              radialModulation={false}
              modulationOffset={0}
            />
            <Vignette eskil={false} offset={0.2} darkness={0.6} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
