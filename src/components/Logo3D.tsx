'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';

type Mode = '3d' | 'ascii';

const LOGO_URL = '/logo.svg';
const ASCII_CHARS = ' .:-+*=%@#';

// Temporary: compare finishes with ?finish=navy or ?finish=flat-navy.
type Finish = 'silver' | 'navy' | 'flat-navy';

const FINISHES: Record<Finish, THREE.MeshPhysicalMaterialParameters> = {
  silver: { color: '#BBCCD7', metalness: 1, roughness: 0.22, clearcoat: 0.6 },
  navy: { color: '#152A55', metalness: 0.7, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.05 },
  'flat-navy': { color: '#152A55', metalness: 0, roughness: 0.6 },
};

function readFinish(): Finish {
  const param = new URLSearchParams(window.location.search).get('finish');
  return param === 'navy' || param === 'flat-navy' ? param : 'silver';
}

async function buildLogo(finish: Finish) {
  const svg = await fetch(LOGO_URL).then((res) => res.text());
  const { paths } = new SVGLoader().parse(svg);

  const material = new THREE.MeshPhysicalMaterial(FINISHES[finish]);

  const logo = new THREE.Group();
  for (const path of paths) {
    for (const shape of SVGLoader.createShapes(path)) {
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 60,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 6,
        bevelSegments: 6,
        curveSegments: 24,
      });
      logo.add(new THREE.Mesh(geometry, material));
    }
  }

  // SVG's y axis points down; flip it and move the logo's center to the origin.
  logo.scale.y = -1;
  const center = new THREE.Box3().setFromObject(logo).getCenter(new THREE.Vector3());
  logo.position.sub(center);

  const pivot = new THREE.Group();
  pivot.add(logo);
  return pivot;
}

export default function Logo3D({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>('3d');
  const modeRef = useRef<Mode>(mode);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const ascii = new AsciiEffect(renderer, ASCII_CHARS, { invert: true, resolution: 0.16 });
    Object.assign(ascii.domElement.style, {
      color: '#F59E0B',
      backgroundColor: 'transparent',
      fontWeight: '700',
    });

    container.append(renderer.domElement, ascii.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const keyLight = new THREE.DirectionalLight('#ffffff', 2.5);
    keyLight.position.set(-300, 400, 600);
    scene.add(keyLight);

    const finish = readFinish();
    if (finish === 'navy') {
      // Rim lights from behind pick out the bevelled edges so a dark logo stays visible on a black page.
      for (const x of [-900, 900]) {
        const rim = new THREE.DirectionalLight('#ffffff', 6);
        rim.position.set(x, 300, -500);
        scene.add(rim);
      }
    }

    const camera = new THREE.PerspectiveCamera(30, 1, 1, 10000);
    camera.position.set(0, 0, 1400);

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height);
      ascii.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // Pointer position across the whole window, in -1..1, drives the tilt.
    const pointer = { x: 0, y: 0 };
    const handlePointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', handlePointerMove);

    let visible = true;
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersectionObserver.observe(container);

    let logo: THREE.Group | null = null;
    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    const tick = () => {
      frameId = requestAnimationFrame(tick);
      if (!logo || !visible) return;

      const t = clock.getElapsedTime();
      const idle = reducedMotion ? 0 : Math.sin(t * 0.8) * 0.12;
      logo.rotation.y += (pointer.x * 0.6 + idle - logo.rotation.y) * 0.06;
      logo.rotation.x += (pointer.y * 0.35 - logo.rotation.x) * 0.06;
      logo.position.y = reducedMotion ? 0 : Math.sin(t * 1.2) * 12;

      const asciiMode = modeRef.current === 'ascii';
      renderer.domElement.style.visibility = asciiMode ? 'hidden' : 'visible';
      ascii.domElement.style.visibility = asciiMode ? 'visible' : 'hidden';
      // AsciiEffect reads transparent pixels as fully bright, so it needs an opaque black backdrop.
      renderer.setClearColor(0x000000, asciiMode ? 1 : 0);
      if (asciiMode) ascii.render(scene, camera);
      else renderer.render(scene, camera);
    };

    buildLogo(finish).then((group) => {
      if (disposed) return;
      logo = group;
      scene.add(group);
      tick();
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          obj.material.dispose();
        }
      });
      scene.environment?.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      ascii.domElement.remove();
    };
  }, []);

  const switchMode = (next: Mode) => {
    modeRef.current = next;
    setMode(next);
  };

  return (
    <div className={`relative ${className ?? ''}`}>
      {readFinish() === 'navy' && (
        <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(76,124,220,0.28),transparent)]" />
      )}
      <div
        ref={containerRef}
        role="img"
        aria-label="ASCII Ant logo"
        className="absolute inset-0 [&>*]:absolute [&>*]:inset-0"
      />
      <div className="absolute -top-2 left-1/2 flex -translate-x-1/2 gap-1 rounded-full border border-[#D7E2EA]/30 bg-[#0C0C0C]/70 p-1 text-xs font-medium uppercase tracking-widest backdrop-blur">
        {(['3d', 'ascii'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={`cursor-pointer rounded-full px-3 py-1 transition-colors duration-200 ${
              mode === m ? 'bg-[#D7E2EA] text-[#0C0C0C]' : 'text-[#D7E2EA] hover:bg-[#D7E2EA]/10'
            }`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}
