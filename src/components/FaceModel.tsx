import React, { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const FaceModel: React.FC = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xB5ECE5);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-6, 2, 7);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const loader = new GLTFLoader();
    loader.load('./resources/images/blender.glb', (gltf) => {
      const face = gltf.scene;
      scene.add(face);
      renderer.render(scene, camera);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      // Remove the canvas element
      document.body.removeChild(renderer.domElement);
      // Dispose of Three.js resources
      scene.clear();
      renderer.dispose();
    };
  }, []); // Empty dependency array

  return null;
};

export default FaceModel;