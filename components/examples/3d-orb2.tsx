"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';
import useVapi from '@/hooks/use-vapi';

const Orb: React.FC = () => {
  const { volumeLevel, isSessionActive, toggleCall } = useVapi();
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const ballRef = useRef<THREE.Mesh | null>(null);
  const originalPositionsRef = useRef<any | null>(null);
  const noise = createNoise3D();

  useEffect(() => {
    initViz();
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  useEffect(() => {
    if (isSessionActive && ballRef.current) {
      updateBallMorph(ballRef.current, volumeLevel);
    } else if (!isSessionActive && ballRef.current && originalPositionsRef.current) {
      resetBallMorph(ballRef.current, originalPositionsRef.current);
    }
  }, [volumeLevel, isSessionActive]);

  const initViz = () => {
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Aspect ratio 1 for square
    camera.position.set(0, 0, 20);
    camera.lookAt(scene.position);

    scene.add(camera);
    sceneRef.current = scene;
    groupRef.current = group;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    rendererRef.current = renderer;

    const icosahedronGeometry = new THREE.IcosahedronGeometry(5, 8);
    const lambertMaterial = new THREE.MeshLambertMaterial({
      color: 0xFFFFFF,
      wireframe: true,
    });

    const ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    ball.position.set(0, 0, 0);
    ballRef.current = ball;

    // Store the original positions of the vertices
    originalPositionsRef.current = ball.geometry.attributes.position.array.slice();

    group.add(ball);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.intensity = 0.9;
    spotLight.position.set(-10, 40, 20);
    spotLight.lookAt(ball.position);
    spotLight.castShadow = true;
    scene.add(spotLight);

    scene.add(group);

    const outElement = document.getElementById('out');
    if (outElement) {
      outElement.innerHTML = ''; // Clear any existing renderer
      outElement.appendChild(renderer.domElement);
      renderer.setSize(outElement.clientWidth, outElement.clientWidth); // Square canvas
    }

    render();
  };

  const render = () => {
    if (!groupRef.current || !ballRef.current || !cameraRef.current || !rendererRef.current || !sceneRef.current) {
      return;
    }

    groupRef.current.rotation.y += 0.005;
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    requestAnimationFrame(render);
  };

  const onWindowResize = () => {
    if (!cameraRef.current || !rendererRef.current) return;

    const outElement = document.getElementById('out');
    if (outElement) {
      cameraRef.current.aspect = 1; // Maintain square aspect ratio
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(outElement.clientWidth, outElement.clientWidth); // Square canvas
    }
  };

  const updateBallMorph = (mesh: THREE.Mesh, volume: number) => {
    const geometry = mesh.geometry as THREE.BufferGeometry;
    const positionAttribute = geometry.getAttribute('position');

    for (let i = 0; i < positionAttribute.count; i++) {
      const vertex = new THREE.Vector3(
        positionAttribute.getX(i),
        positionAttribute.getY(i),
        positionAttribute.getZ(i)
      );

      const offset = 5; // Radius of the icosahedron
      const amp = 2.5; // Dramatic effect
      const time = window.performance.now();
      vertex.normalize();
      const rf = 0.00001;
      const distance =
        offset +
        volume * 4 + // Amplify volume effect
        noise(vertex.x + time * rf * 7, vertex.y + time * rf * 8, vertex.z + time * rf * 9) * amp * volume;
      vertex.multiplyScalar(distance);

      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();

    // Update color based on volume
    const color = new THREE.Color(`hsl(${(volume * 120)}, 100%, 50%)`);
    (mesh.material as THREE.MeshLambertMaterial).color = color;
  };

  const resetBallMorph = (mesh: THREE.Mesh, originalPositions: Float32Array) => {
    const geometry = mesh.geometry as THREE.BufferGeometry;
    const positionAttribute = geometry.getAttribute('position');

    for (let i = 0; i < positionAttribute.count; i++) {
      positionAttribute.setXYZ(
        i,
        originalPositions[i * 3],
        originalPositions[i * 3 + 1],
        originalPositions[i * 3 + 2]
      );
    }

    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();

    // Reset color
    (mesh.material as THREE.MeshLambertMaterial).color.set(0xFFFFFF);
  };

  return (
    <div className='h-fit'>
      <div id="out" className="hover:cursor-pointer" onClick={toggleCall} style={{ height: '100%', width: '100%' }}></div>
    </div>
  );
};

export default Orb;
