import { useRef, useImperativeHandle, forwardRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

interface SceneProps {
  // No props needed, but including to satisfy TypeScript
}

interface FaceModelHandle {
  resetView: () => void;
}

const Model = () => {
  const { scene } = useGLTF('/untitled.glb');
  return <primitive object={scene} position={[0, -0.5, 0]} />;
};

const Scene = forwardRef<FaceModelHandle, SceneProps>((_props, ref) => {
  const orbitRef = useRef<any>(null);
  // We need to get the camera from useThree to use it inside the reset function
  useThree();
  
  useImperativeHandle(ref, () => ({
    resetView: () => {
      if (orbitRef.current) {
        orbitRef.current.reset();
      }
    }
  }));

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <directionalLight position={[-10, 10, 5]} intensity={1} />
      <Model />
      <OrbitControls
        ref={orbitRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        panSpeed={0.8}
        zoomSpeed={0.8}
        rotateSpeed={0.8}
        target={[0, 0, 0]}
        makeDefault
      />
    </>
  );
});

const FaceModel = forwardRef<FaceModelHandle, {}>((_, ref) => {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
      <Canvas
        camera={{ position: [-6, 2, 7], fov: 50 }}
        style={{ background: '#B5ECE5' }}
      >
        <Scene ref={ref} />
      </Canvas>
    </div>
  );
});

export default FaceModel;