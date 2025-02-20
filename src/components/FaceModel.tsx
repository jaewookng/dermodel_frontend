import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const FaceModel = forwardRef((_, ref) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useImperativeHandle(ref, () => ({
    resetView: () => {
      if (controlsRef.current && cameraRef.current) {
        cameraRef.current.position.set(-2, 0.5, 2);
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    }
  }));

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xB5ECE5);

    // Add ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Add directional lights for better depth
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
    frontLight.position.set(0, 0, 10);
    scene.add(frontLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(0, 0, -10);
    scene.add(backLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 0.5);
    topLight.position.set(0, 10, 0);
    scene.add(topLight);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-2, 0.5, 2); // Moved camera even closer
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Adds smooth damping effect
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = true; // Enable command/ctrl + drag for panning
    controls.minDistance = 1; // Reduced minimum distance further
    controls.maxDistance = 8; // Reduced maximum distance
    controls.maxPolarAngle = Math.PI / 1.5; // Limit vertical rotation
    controls.target.set(0, 0, 0); // Set the orbit target to center
    controls.update();
    controlsRef.current = controls;

    const loader = new GLTFLoader();
    loader.load('./untitled.glb', (gltf) => {
      const face = gltf.scene;
      
      // Adjust material properties if needed
      face.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.metalness = 0.3;  // Reduce metalness
          child.material.roughness = 0.7;  // Increase roughness
        }
      });
      
      scene.add(face);
    });

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Required for damping
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      scene.clear();
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  return <div ref={mountRef} className="face-model-container" />;
});

FaceModel.displayName = 'FaceModel';

export default FaceModel;