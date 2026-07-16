/**
 * JS CodeWorks - Hero Section 3D Workspace Scene
 * Performance Optimized with IntersectionObserver & Mobile Frame Scaling
 */

(function () {
  const container = document.getElementById('canvas-3d-workspace');
  if (!container) return;

  const isMobile = window.innerWidth < 768 || ('ontouchstart' in window);
  const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.2 : 2);

  let isVisible = false;
  let stopAnimation = null;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible && !stopAnimation) {
        stopAnimation = initHero3D();
      } else if (!isVisible && stopAnimation) {
        stopAnimation();
        stopAnimation = null;
      }
    });
  }, { threshold: 0.05 });

  observer.observe(container);

  function initHero3D() {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, isMobile ? 8.5 : 7);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    container.appendChild(renderer.domElement);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(isMobile ? 16 : 24, isMobile ? 16 : 24, 0x06B6D4, 0x1E293B);
    gridHelper.position.y = -2.2;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.4;
    scene.add(gridHelper);

    // Floating Cyber Node Core
    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(isMobile ? 1.2 : 1.6, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x06B6D4,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Inner Glowing Core
    const innerGeo = new THREE.OctahedronGeometry(isMobile ? 0.7 : 0.9, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x2563EB,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    scene.add(coreGroup);

    // Orbiting Particles Cloud
    const particleCount = isMobile ? 50 : 150;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * (isMobile ? 8 : 14);
      positions[i + 1] = (Math.random() - 0.5) * 8;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.05 : 0.03,
      color: 0x06B6D4,
      transparent: true,
      opacity: 0.65
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Smooth Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    function onMouseMove(e) {
      if (isMobile) return;
      mouseX = (e.clientX - window.innerWidth / 2) * 0.0003;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.0003;
    }
    window.addEventListener('mousemove', onMouseMove);

    let animId = null;
    function animate() {
      animId = requestAnimationFrame(animate);

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      coreGroup.rotation.y += 0.004;
      coreGroup.rotation.x += 0.002;
      innerMesh.rotation.y -= 0.008;

      particles.rotation.y += 0.001;

      camera.position.x = targetX * 3;
      camera.position.y = 1.2 + (-targetY * 3);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    return function cleanup() {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }
})();
