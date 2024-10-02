import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const AbstractBall: React.FC<any> = ({
  perlinTime = 25.0,
  perlinMorph = 25.0,
  perlinDNoise = 0.0,
  chromaRGBr = 7.5,
  chromaRGBg = 5.0,
  chromaRGBb = 7.0,
  chromaRGBn = 1.0,
  chromaRGBm = 1.0,
  sphereWireframe = false,
  spherePoints = false,
  spherePsize = 1.0,
  cameraSpeedY = 0.0,
  cameraSpeedX = 0.0,
  cameraZoom = 150,
  cameraGuide = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const pointRef = useRef<THREE.Points | null>(null);
  const uniformsRef = useRef<any>({
    time: { value: 0.0 },
    RGBr: { value: chromaRGBr / 10 },
    RGBg: { value: chromaRGBg / 10 },
    RGBb: { value: chromaRGBb / 10 },
    RGBn: { value: chromaRGBn / 100 },
    RGBm: { value: chromaRGBm },
    morph: { value: perlinMorph },
    dnoise: { value: perlinDNoise },
    psize: { value: spherePsize }
  });

  useEffect(() => {
    const width = mountRef.current!.clientWidth;
    const height = mountRef.current!.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(20, width / height, 1, 1000);
    camera.position.set(0, 10, cameraZoom);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    mountRef.current!.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(20, 20);

    const material = new THREE.ShaderMaterial({
      uniforms: uniformsRef.current,
      side: THREE.DoubleSide,
      vertexShader: document.getElementById('noiseVertexShader')!.textContent!,
      fragmentShader: document.getElementById('fragmentShader')!.textContent!,
      wireframe: sphereWireframe
    });

    const mesh = new THREE.Mesh(geometry, material);
    const point = new THREE.Points(geometry, material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.geometry.morphTargetsRelative = true;

    scene.add(mesh);
    scene.add(point);

    const animate = () => {
        uniformsRef.current.time.value += perlinTime / 10000;
        uniformsRef.current.morph.value = perlinMorph;
        uniformsRef.current.dnoise.value = perlinDNoise;
      
        uniformsRef.current.RGBr.value = chromaRGBr / 10;
        uniformsRef.current.RGBg.value = chromaRGBg / 10;
        uniformsRef.current.RGBb.value = chromaRGBb / 10;
        uniformsRef.current.RGBn.value = chromaRGBn / 100;
        uniformsRef.current.RGBm.value = chromaRGBm;
        uniformsRef.current.psize.value = spherePsize;
      
        mesh.rotation.y += cameraSpeedY / 100;
        mesh.rotation.z += cameraSpeedX / 100;
        point.rotation.y = mesh.rotation.y;
        point.rotation.z = mesh.rotation.z;
      
        material.wireframe = sphereWireframe;
        mesh.visible = !spherePoints;
        point.visible = spherePoints;
      
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };      

    animate();

    const handleResize = () => {
      const width = mountRef.current!.clientWidth;
      const height = mountRef.current!.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    materialRef.current = material;
    meshRef.current = mesh;
    pointRef.current = point;

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [perlinTime, perlinMorph, perlinDNoise, chromaRGBr, chromaRGBg, chromaRGBb, chromaRGBn, chromaRGBm, sphereWireframe, spherePoints, spherePsize, cameraSpeedY, cameraSpeedX, cameraZoom]);

  // Using gsap for animations
  useEffect(() => {
    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, {
        duration: 2,
        z: 300 - cameraZoom
      });
    }
    gsap.to(uniformsRef.current.RGBr, { duration: 1, value: Math.random() * 10 });
    gsap.to(uniformsRef.current.RGBg, { duration: 1, value: Math.random() * 10 });
    gsap.to(uniformsRef.current.RGBb, { duration: 1, value: Math.random() * 10 });
    gsap.to(uniformsRef.current.RGBn, { duration: 1, value: Math.random() * 2 });
    gsap.to(uniformsRef.current.RGBm, { duration: 1, value: Math.random() * 5 });
  }, [cameraZoom]);  

  return (
    <div ref={mountRef} style={{ width: '100%', height: '500px' }} className='rounded-2xl mt-2'>
      <script id="noiseVertexShader" type="x-shader/x-vertex">
        {`varying vec3 vNormal;
        uniform float time;
        uniform float weight;
        uniform float morph;
        uniform float psize;

        vec3 mod289(vec3 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 mod289(vec4 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 permute(vec4 x) {
          return mod289(((x * 34.0) + 1.0) * x);
        }

        vec4 taylorInvSqrt(vec4 r) {
          return 1.79284291400159 - 0.85373472095314 * r;
        }

        vec3 fade(vec3 t) {
          return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
        }

        float cnoise(vec3 P) {
          vec3 Pi0 = floor(P);
          vec3 Pi1 = Pi0 + vec3(1.0);
          Pi0 = mod289(Pi0);
          Pi1 = mod289(Pi1);
          vec3 Pf0 = fract(P);
          vec3 Pf1 = Pf0 - vec3(1.0);
          vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
          vec4 iy = vec4(Pi0.yy, Pi1.yy);
          vec4 iz0 = Pi0.zzzz;
          vec4 iz1 = Pi1.zzzz;
          vec4 ixy = permute(permute(ix) + iy);
          vec4 ixy0 = permute(ixy + iz0);
          vec4 ixy1 = permute(ixy + iz1);
          vec4 gx0 = ixy0 * (1.0 / 7.0);
          vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
          gx0 = fract(gx0);
          vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
          vec4 sz0 = step(gz0, vec4(0.0));
          gx0 -= sz0 * (step(0.0, gx0) - 0.5);
          gy0 -= sz0 * (step(0.0, gy0) - 0.5);
          vec4 gx1 = ixy1 * (1.0 / 7.0);
          vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
          gx1 = fract(gx1);
          vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
          vec4 sz1 = step(gz1, vec4(0.0));
          gx1 -= sz1 * (step(0.0, gx1) - 0.5);
          gy1 -= sz1 * (step(0.0, gy1) - 0.5);
          vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
          vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
          vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
          vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
          vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
          vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
          vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
          vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);
          vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
          g000 *= norm0.x;
          g010 *= norm0.y;
          g100 *= norm0.z;
          g110 *= norm0.w;
          vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
          g001 *= norm1.x;
          g011 *= norm1.y;
          g101 *= norm1.z;
          g111 *= norm1.w;
          float n000 = dot(g000, Pf0);
          float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
          float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
          float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
          float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
          float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
          float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
          float n111 = dot(g111, Pf1);
          vec3 fade_xyz = fade(Pf0);
          vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
          vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
          float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
          return 1.2 * n_xyz;
        }

        void main() {
          float f = morph * cnoise(normal + time);
          vNormal = normalize(normal);
          vec4 pos = vec4(position + f * normal, 1.0);
          gl_Position = projectionMatrix * modelViewMatrix * pos;
          gl_PointSize = psize;
        }`}
      </script>
      <script id="fragmentShader" type="x-shader/x-vertex">
  {`varying vec3 vNormal;
  uniform float time;
  uniform float RGBr;
  uniform float RGBg;
  uniform float RGBb;
  uniform float RGBn;
  uniform float RGBm;
  uniform float dnoise;

  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
  }

  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  vec3 fade(vec3 t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  }

  float cnoise(vec3 P) {
    vec3 Pi0 = floor(P);
    vec3 Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P);
    vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;
    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);
    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);
    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;
    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);
    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }

  void main() {
    float r = cnoise(RGBr * (vNormal + time));
    float g = cnoise(RGBg * (vNormal + time));
    float b = cnoise(RGBb * (vNormal + time));
    float n = cnoise(-1.0 * (vNormal + time));
    n = 50.0 * cnoise((RGBn) * (vNormal)) * cnoise(RGBm * (vNormal + time));
    n -= 0.10 * cnoise(dnoise * vNormal);
    vec3 color = vec3(r + n, g + n, b + n);
    gl_FragColor = vec4(color, 1.0);
  }`}
      </script>
    </div>
  );
};

export default AbstractBall;
