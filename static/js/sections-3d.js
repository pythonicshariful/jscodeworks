/* Three.js Multi-Section 3D Cyber Visualizers Engine */
(function() {
  if (typeof THREE === 'undefined') return;

  // Helper to init a background WebGL scene for a specific canvas container
  function initSection3D(canvasId, buildFn) {
    const container = document.getElementById(canvasId);
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Call custom geometry construction
    buildFn(scene, group);

    function animate() {
      requestAnimationFrame(animate);
      group.rotation.y += 0.003;
      group.rotation.x += 0.001;
      renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    animate();
  }

  // 1. About Section - 3D Wireframe Cyber Core Dodecahedron & Code Matrix Particles
  window.addEventListener('load', () => {
    initSection3D('canvas-3d-about', (scene, group) => {
      const geo = new THREE.DodecahedronGeometry(2.2, 1);
      const mat = new THREE.MeshBasicMaterial({ color: 0x06B6D4, wireframe: true, transparent: true, opacity: 0.4 });
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);

      // Inner glowing core
      const innerGeo = new THREE.IcosahedronGeometry(1.2, 0);
      const innerMat = new THREE.MeshBasicMaterial({ color: 0x2563EB, wireframe: true });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      group.add(innerMesh);
    });

    // 2. Services Section - 3D Floating Glass Matrices
    initSection3D('canvas-3d-services', (scene, group) => {
      for (let i = 0; i < 8; i++) {
        const boxGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const boxMat = new THREE.MeshBasicMaterial({ color: 0x7C3AED, wireframe: true });
        const cube = new THREE.Mesh(boxGeo, boxMat);
        cube.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4);
        group.add(cube);
      }
    });

    // 3. Portfolio Section - 3D Code Matrix Particle Streams
    initSection3D('canvas-3d-portfolio', (scene, group) => {
      const pCount = 150;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount * 3; i += 3) {
        pos[i] = (Math.random() - 0.5) * 12;
        pos[i + 1] = (Math.random() - 0.5) * 8;
        pos[i + 2] = (Math.random() - 0.5) * 6;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({ color: 0x10B981, size: 0.06, transparent: true, opacity: 0.8 });
      const points = new THREE.Points(geo, mat);
      group.add(points);
    });

    // 4. Team Section - 3D Interconnected Node Mesh Network
    initSection3D('canvas-3d-team', (scene, group) => {
      const nodeGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0x06B6D4 });
      for (let i = 0; i < 12; i++) {
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 4);
        group.add(node);
      }
    });

    // 5. Contact Section - 3D Wireframe Earth Globe Network
    initSection3D('canvas-3d-contact', (scene, group) => {
      const globeGeo = new THREE.SphereGeometry(2.4, 24, 24);
      const globeMat = new THREE.MeshBasicMaterial({ color: 0x2563EB, wireframe: true, transparent: true, opacity: 0.35 });
      const globe = new THREE.Mesh(globeGeo, globeMat);
      group.add(globe);

      const ringGeo = new THREE.TorusGeometry(3.2, 0.03, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x06B6D4 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      group.add(ring);
    });
  });
})();
