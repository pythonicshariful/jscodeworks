/* Three.js 3D Interactive Process Timeline Pipeline Visualizer */
(function() {
  const container = document.getElementById('canvas-3d-timeline');
  if (!container || typeof THREE === 'undefined') return;

  let scene, camera, renderer, pipelineMesh, nodesGroup, codeParticlesGroup;
  let mouseX = 0, mouseY = 0;

  const timelineSteps = [
    { year: "2021", codeTag: "{ DISCOVERY }" },
    { year: "2022", codeTag: "[ ARCHITECTURE ]" },
    { year: "2023", codeTag: "< AI_WEBGL />" },
    { year: "2024", codeTag: "deploy.py" },
    { year: "2025+", codeTag: "ECOSYSTEM" }
  ];

  function createTextSprite(text, colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillStyle = colorHex;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 150, 40);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(3.0, 0.8, 1);
    return sprite;
  }

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 9);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.0);
    scene.add(ambientLight);

    const lightCyan = new THREE.PointLight(0x06B6D4, 4, 15);
    lightCyan.position.set(0, 3, 4);
    scene.add(lightCyan);

    const lightBlue = new THREE.PointLight(0x2563EB, 4, 15);
    lightBlue.position.set(0, -3, 4);
    scene.add(lightBlue);

    // 1. Vertical Glowing Pipeline Cylinder Mesh
    const pipeGeo = new THREE.CylinderGeometry(0.06, 0.06, 12, 32);
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0x06B6D4,
      emissive: 0x2563EB,
      emissiveIntensity: 0.8,
      roughness: 0.1
    });
    pipelineMesh = new THREE.Mesh(pipeGeo, pipeMat);
    pipelineMesh.position.set(0, 0, 0);
    scene.add(pipelineMesh);

    // 2. Build Interactive 3D Node Rings & Floating Code Sprites
    nodesGroup = new THREE.Group();
    codeParticlesGroup = new THREE.Group();
    scene.add(nodesGroup);
    scene.add(codeParticlesGroup);

    const stepYPositions = [4.0, 2.0, 0.0, -2.0, -4.0];

    timelineSteps.forEach((step, idx) => {
      const yPos = stepYPositions[idx];

      // Holographic Orbit Ring
      const ringGeo = new THREE.TorusGeometry(0.6, 0.04, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0x06B6D4 : 0x7C3AED,
        wireframe: true
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0, yPos, 0);
      ring.rotation.x = Math.PI / 2;
      nodesGroup.add(ring);

      // Inner Glowing Core Sphere
      const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
      const core = new THREE.Mesh(sphereGeo, sphereMat);
      core.position.set(0, yPos, 0);
      nodesGroup.add(core);

      // Floating 3D Code Syntax Text Sprite
      const sprite = createTextSprite(step.codeTag, idx % 2 === 0 ? '#06B6D4' : '#60A5FA');
      const offsetX = idx % 2 === 0 ? 2.5 : -2.5;
      sprite.position.set(offsetX, yPos, 0.2);
      codeParticlesGroup.add(sprite);
    });

    // 3. Ambient Particle Dust along Pipeline
    const pGeo = new THREE.BufferGeometry();
    const pCount = 120;
    const pPos = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 4;
      pPos[i + 1] = (Math.random() - 0.5) * 12;
      pPos[i + 2] = (Math.random() - 0.5) * 4;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x06B6D4,
      size: 0.05,
      transparent: true,
      opacity: 0.8
    });
    const pPoints = new THREE.Points(pGeo, pMat);
    scene.add(pPoints);

    // Event Listeners
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / container.clientWidth - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / container.clientHeight - 0.5) * 2;
    });

    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    animate();
  }

  function animate() {
    requestAnimationFrame(animate);

    // Rotate holographic rings dynamically
    nodesGroup.children.forEach((child, i) => {
      if (child.isMesh && child.geometry.type === 'TorusGeometry') {
        child.rotation.z += 0.02 * (i % 2 === 0 ? 1 : -1);
      }
    });

    // Gentle floating drift
    codeParticlesGroup.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    nodesGroup.rotation.y = mouseX * 0.2;

    renderer.render(scene, camera);
  }

  window.addEventListener('load', init);
})();
