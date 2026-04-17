import { Suspense, useRef } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Float, Icosahedron, Torus, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function Scene() {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!group.current) return;
    // smooth camera-style parallax via group rotation
    group.current.rotation.y += delta * 0.1;
    const tx = mouse.current.x * 0.4;
    const ty = mouse.current.y * 0.25;
    group.current.rotation.x += (ty - group.current.rotation.x) * 0.05;
    group.current.position.x += (tx - group.current.position.x) * 0.05;
    state.camera.position.z = 6;
  });

  const handleMove = (e: ThreeEvent<PointerEvent>) => {
    const { width, height } = e.nativeEvent.target instanceof HTMLCanvasElement
      ? { width: e.nativeEvent.target.clientWidth, height: e.nativeEvent.target.clientHeight }
      : { width: window.innerWidth, height: window.innerHeight };
    mouse.current.x = (e.nativeEvent.clientX / width) * 2 - 1;
    mouse.current.y = -((e.nativeEvent.clientY / height) * 2 - 1);
  };

  return (
    <group ref={group} onPointerMove={handleMove}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#7af1ff" />
      <pointLight position={[-5, -3, 4]} intensity={1.1} color="#a06bff" />
      <pointLight position={[0, 0, 3]} intensity={0.6} color="#ff6bd9" />

      <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.4}>
        <Icosahedron args={[1.4, 1]} position={[-1.4, 0.3, 0]}>
          <MeshDistortMaterial
            color="#7af1ff"
            distort={0.35}
            speed={1.6}
            metalness={0.85}
            roughness={0.15}
            emissive="#0a3a4a"
            emissiveIntensity={0.6}
            wireframe
          />
        </Icosahedron>
      </Float>

      <Float speed={1} rotationIntensity={0.8} floatIntensity={1}>
        <Torus args={[0.9, 0.18, 16, 64]} position={[1.6, -0.2, -0.5]} rotation={[0.4, 0.2, 0]}>
          <meshStandardMaterial
            color="#a06bff"
            metalness={0.9}
            roughness={0.2}
            emissive="#3a1a6b"
            emissiveIntensity={0.7}
          />
        </Torus>
      </Float>

      <Float speed={0.8} rotationIntensity={1.2} floatIntensity={1.4}>
        <mesh position={[0.6, 1.4, -1.2]} rotation={[0.4, 0.5, 0]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial
            color="#ff6bd9"
            metalness={0.7}
            roughness={0.25}
            emissive="#5a1a45"
            emissiveIntensity={0.7}
            wireframe
          />
        </mesh>
      </Float>

      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={2}>
        <mesh position={[-2.2, -1.4, -1.5]}>
          <octahedronGeometry args={[0.55]} />
          <meshStandardMaterial
            color="#7af1ff"
            metalness={0.8}
            roughness={0.2}
            emissive="#0a3a4a"
            emissiveIntensity={0.6}
          />
        </mesh>
      </Float>

      {/* Drifting code-fragment planes */}
      {Array.from({ length: 14 }).map((_, i) => (
        <Float key={i} speed={0.6 + (i % 3) * 0.3} floatIntensity={1.5}>
          <mesh
            position={[
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 5,
              -2 - Math.random() * 4,
            ]}
            rotation={[Math.random(), Math.random(), 0]}
          >
            <planeGeometry args={[0.6, 0.06]} />
            <meshBasicMaterial
              color={i % 2 ? "#7af1ff" : "#a06bff"}
              transparent
              opacity={0.55}
            />
          </mesh>
        </Float>
      ))}
    </group>
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
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
