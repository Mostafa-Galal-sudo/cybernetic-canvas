import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  Float,
  Icosahedron,
  TorusKnot,
  Environment,
  MeshDistortMaterial,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import * as THREE from "three";

function FloatingShapes() {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.08;
    const tx = mouse.current.x * 0.5;
    const ty = mouse.current.y * 0.3;
    group.current.rotation.x += (ty - group.current.rotation.x) * 0.05;
    group.current.position.x += (tx - group.current.position.x) * 0.05;
  });

  const handleMove = (e: ThreeEvent<PointerEvent>) => {
    const target = e.nativeEvent.target;
    const w = target instanceof HTMLCanvasElement ? target.clientWidth : window.innerWidth;
    const h = target instanceof HTMLCanvasElement ? target.clientHeight : window.innerHeight;
    mouse.current.x = (e.nativeEvent.clientX / w) * 2 - 1;
    mouse.current.y = -((e.nativeEvent.clientY / h) * 2 - 1);
  };

  return (
    <group ref={group} onPointerMove={handleMove}>
      {/* HERO: Glass icosahedron — refractive, premium look */}
      <Float speed={1.1} rotationIntensity={0.5} floatIntensity={1.2}>
        <Icosahedron args={[1.5, 1]} position={[-1.5, 0.4, 0]}>
          <MeshTransmissionMaterial
            color="#7af1ff"
            thickness={1.2}
            roughness={0.05}
            transmission={1}
            ior={1.5}
            chromaticAberration={0.06}
            backside
            samples={6}
            resolution={256}
            distortion={0.3}
            distortionScale={0.4}
            temporalDistortion={0.15}
          />
        </Icosahedron>
      </Float>

      {/* TORUS KNOT — solid, metallic violet */}
      <Float speed={0.9} rotationIntensity={0.7} floatIntensity={0.9}>
        <TorusKnot args={[0.7, 0.22, 128, 32]} position={[1.8, -0.1, -0.5]}>
          <meshStandardMaterial
            color="#a06bff"
            metalness={0.95}
            roughness={0.18}
            emissive="#3a1a6b"
            emissiveIntensity={0.5}
          />
        </TorusKnot>
      </Float>

      {/* DISTORTED SPHERE — magenta, organic blob */}
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={1.3}>
        <mesh position={[0.8, 1.6, -1.3]}>
          <sphereGeometry args={[0.55, 64, 64]} />
          <MeshDistortMaterial
            color="#ff6bd9"
            distort={0.45}
            speed={2}
            metalness={0.7}
            roughness={0.2}
            emissive="#5a1a45"
            emissiveIntensity={0.6}
          />
        </mesh>
      </Float>

      {/* OCTAHEDRON — solid cyan crystal */}
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.6}>
        <mesh position={[-2.4, -1.5, -1]} rotation={[0.4, 0.3, 0]}>
          <octahedronGeometry args={[0.65]} />
          <meshStandardMaterial
            color="#7af1ff"
            metalness={0.85}
            roughness={0.15}
            emissive="#0a3a4a"
            emissiveIntensity={0.7}
            flatShading
          />
        </mesh>
      </Float>

      {/* DODECAHEDRON — small accent */}
      <Float speed={1.6} rotationIntensity={1} floatIntensity={1.8}>
        <mesh position={[2.6, 1.4, -2]} rotation={[0.2, 0.6, 0.1]}>
          <dodecahedronGeometry args={[0.42]} />
          <meshStandardMaterial
            color="#a06bff"
            metalness={0.9}
            roughness={0.2}
            emissive="#2a0d5a"
            emissiveIntensity={0.6}
            flatShading
          />
        </mesh>
      </Float>

      {/* TETRAHEDRON — small accent */}
      <Float speed={1.3} rotationIntensity={0.9} floatIntensity={1.5}>
        <mesh position={[-3, 1.6, -2.2]} rotation={[0.3, 0.5, 0]}>
          <tetrahedronGeometry args={[0.5]} />
          <meshStandardMaterial
            color="#7af1ff"
            metalness={0.85}
            roughness={0.2}
            emissive="#0a3a4a"
            emissiveIntensity={0.6}
            flatShading
          />
        </mesh>
      </Float>

      {/* Background floating spheres — depth particles */}
      <BackgroundOrbs />
    </group>
  );
}

function BackgroundOrbs() {
  const orbs = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        key: i,
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 6,
          -3 - Math.random() * 5,
        ] as [number, number, number],
        scale: 0.05 + Math.random() * 0.12,
        speed: 0.4 + Math.random() * 0.8,
        color: i % 2 === 0 ? "#7af1ff" : "#a06bff",
      })),
    [],
  );

  return (
    <>
      {orbs.map((o) => (
        <Float key={o.key} speed={o.speed} floatIntensity={2}>
          <mesh position={o.position} scale={o.scale}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color={o.color}
              emissive={o.color}
              emissiveIntensity={1.4}
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
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Lighting rig */}
          <ambientLight intensity={0.35} />
          <pointLight position={[5, 5, 5]} intensity={1.4} color="#7af1ff" />
          <pointLight position={[-5, -3, 4]} intensity={1.2} color="#a06bff" />
          <pointLight position={[0, 2, 3]} intensity={0.7} color="#ff6bd9" />
          <directionalLight position={[3, 4, 5]} intensity={0.5} />

          {/* HDRI for reflections on metals & glass */}
          <Environment preset="night" />

          <FloatingShapes />
        </Suspense>
      </Canvas>
    </div>
  );
}
