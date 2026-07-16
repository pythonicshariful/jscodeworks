/**
 * JS CodeWorks - Multi-Section 3D Cyber Engine
 * Ultra-Performance Optimized with IntersectionObserver Canvas Pausing & Mobile Throttling
 */

(function () {
  const isMobile = window.innerWidth < 768 || ('ontouchstart' in window);
  const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.2 : 2);

  // Helper to attach IntersectionObserver so off-screen 3D canvases stop rendering
  function createOptimized3DScene(containerId, initFn) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let isVisible = false;
    let stopAnimation = null;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !stopAnimation) {
          stopAnimation = initFn(container);
        } else if (!isVisible && stopAnimation) {
          stopAnimation();
          stopAnimation = null;
        }
      });
    }, { threshold: 0.05 });

    observer.observe(container);
  }

  // --- 1. ABOUT SECTION: 3D Cyber Core Dodecahedron ---
  createOptimized3DScene('canvas-3d-about', function (container) {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = isMobile ? 6 : 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    container.appendChild(renderer.domElement);

    // Dodecahedron Outer Core Wireframe
    const outerGeo = new THREE.DodecahedronGeometry(isMobile ? 1.5 : 1.8, 1);
    const outerMat = new THREE.MeshBasicMaterial({ color: 0x06B6D4, wireframe: true, transparent: true, opacity: 0.35 });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerMesh);

    // Inner Glowing Icosahedron
    const innerGeo = new THREE.IcosahedronGeometry(isMobile ? 0.9 : 1.1, 0);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x2563EB, wireframe: true, transparent: true, opacity: 0.6 });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // Particles Cloud
    const particleCount = isMobile ? 40 : 100;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * (isMobile ? 7 : 10);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({ size: isMobile ? 0.04 : 0.03, color: 0x06B6D4, transparent: true, opacity: 0.7 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    let animId = null;
    function animate() {
      animId = requestAnimationFrame(animate);
      outerMesh.rotation.y += 0.003;
      outerMesh.rotation.x += 0.002;
      innerMesh.rotation.y -= 0.005;
      innerMesh.rotation.z += 0.003;
      particles.rotation.y += 0.001;
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    return function cleanup() {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  });

  // --- 2. SERVICES SECTION: 3D Floating Glass Matrices ---
  createOptimized3DScene('canvas-3d-services', function (container) {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = isMobile ? 7 : 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    const cubeCount = isMobile ? 4 : 8;
    const cubes = [];

    for (let i = 0; i < cubeCount; i++) {
      const geo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
      const mat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x06B6D4 : 0x7C3AED, wireframe: true, transparent: true, opacity: 0.4 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((Math.random() - 0.5) * (isMobile ? 5 : 8), (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 3);
      group.add(mesh);
      cubes.push({ mesh, rotX: (Math.random() - 0.5) * 0.01, rotY: (Math.random() - 0.5) * 0.01 });
    }
    scene.add(group);

    let animId = null;
    function animate() {
      animId = requestAnimationFrame(animate);
      cubes.forEach(c => {
        c.mesh.rotation.x += c.rotX;
        c.mesh.rotation.y += c.rotY;
      });
      group.rotation.y += 0.002;
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    return function cleanup() {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  });

  // --- 3. PORTFOLIO SECTION: 3D Particle Streams ---
  createOptimized3DScene('canvas-3d-portfolio', function (container) {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    container.appendChild(renderer.domElement);

    const particleCount = isMobile ? 60 : 150;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * (isMobile ? 6 : 10);
      pos[i + 1] = (Math.random() - 0.5) * 6;
      pos[i + 2] = (Math.random() - 0.5) * 5;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ size: isMobile ? 0.04 : 0.03, color: 0x10B981, transparent: true, opacity: 0.6 });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let animId = null;
    function animate() {
      animId = requestAnimationFrame(animate);
      points.rotation.y += 0.001;
      points.rotation.x += 0.0005;
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    return function cleanup() {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  });

  // --- 4. TEAM SECTION: 3D Interconnected Node Mesh ---
  createOptimized3DScene('canvas-3d-team', function (container) {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = isMobile ? 6 : 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    container.appendChild(renderer.domElement);

    const nodeCount = isMobile ? 8 : 16;
    const nodesGroup = new THREE.Group();
    const positions = [];

    for (let i = 0; i < nodeCount; i++) {
      const geo = new THREE.SphereGeometry(0.12, 8, 8);
      const mat = new THREE.MeshBasicMaterial({ color: 0x06B6D4 });
      const mesh = new THREE.Mesh(geo, mat);
      const p = new THREE.Vector3((Math.random() - 0.5) * (isMobile ? 4 : 7), (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 3);
      mesh.position.copy(p);
      nodesGroup.add(mesh);
      positions.push(p);
    }

    // Connect nodes with line segments
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = [];
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (positions[i].distanceTo(positions[j]) < (isMobile ? 2.2 : 3.0)) {
          linePositions.push(positions[i].x, positions[i].y, positions[i].z);
          linePositions.push(positions[j].x, positions[j].y, positions[j].z);
        }
      }
    }
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x2563EB, transparent: true, opacity: 0.35 });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    nodesGroup.add(lines);

    scene.add(nodesGroup);

    let animId = null;
    function animate() {
      animId = requestAnimationFrame(animate);
      nodesGroup.rotation.y += 0.002;
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    return function cleanup() {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  });

  // --- 5. CONTACT SECTION: 3D Wireframe Earth Globe ---
  createOptimized3DScene('canvas-3d-contact', function (container) {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = isMobile ? 5.5 : 4.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    container.appendChild(renderer.domElement);

    // Globe sphere wireframe
    const globeGeo = new THREE.SphereGeometry(isMobile ? 1.3 : 1.6, isMobile ? 14 : 20, isMobile ? 14 : 20);
    const globeMat = new THREE.MeshBasicMaterial({ color: 0x06B6D4, wireframe: true, transparent: true, opacity: 0.3 });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    // Orbit Ring
    const ringGeo = new THREE.TorusGeometry(isMobile ? 2.0 : 2.4, 0.02, 8, isMobile ? 30 : 60);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x7C3AED, transparent: true, opacity: 0.6 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    let animId = null;
    function animate() {
      animId = requestAnimationFrame(animate);
      globe.rotation.y += 0.003;
      ring.rotation.z += 0.002;
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    return function cleanup() {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  });
})();
