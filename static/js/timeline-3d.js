/**
 * JS CodeWorks - Execution Process Timeline 3D Cyber Visualizer
 * Performance Optimized with IntersectionObserver & Mobile Frame Throttling
 */

(function () {
  const container = document.getElementById('canvas-3d-timeline');
  if (!container) return;

  const isMobile = window.innerWidth < 768 || ('ontouchstart' in window);
  const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.2 : 2);

  let isVisible = false;
  let stopAnimation = null;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible && !stopAnimation) {
        stopAnimation = initTimeline3D();
      } else if (!isVisible && stopAnimation) {
        stopAnimation();
        stopAnimation = null;
      }
    });
  }, { threshold: 0.05 });

  observer.observe(container);

  function initTimeline3D() {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, isMobile ? 9 : 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    container.appendChild(renderer.domElement);

    // Timeline Laser Pipeline Cylinder
    const pipeGeo = new THREE.CylinderGeometry(isMobile ? 0.3 : 0.4, isMobile ? 0.3 : 0.4, isMobile ? 10 : 14, 16, 1, true);
    const pipeMat = new THREE.MeshBasicMaterial({ color: 0x06B6D4, wireframe: true, transparent: true, opacity: 0.3 });
    const pipeline = new THREE.Mesh(pipeGeo, pipeMat);
    pipeline.rotation.z = Math.PI / 2;
    scene.add(pipeline);

    // Orbit Step Rings
    const ringCount = isMobile ? 3 : 5;
    const rings = [];
    for (let i = 0; i < ringCount; i++) {
      const ringGeo = new THREE.TorusGeometry(isMobile ? 0.8 : 1.1, 0.03, 8, 30);
      const ringMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x2563EB : 0x7C3AED, transparent: true, opacity: 0.7 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.x = (i - (ringCount - 1) / 2) * (isMobile ? 2.5 : 2.8);
      ring.rotation.y = Math.PI / 3;
      scene.add(ring);
      rings.push(ring);
    }

    // Floating Particle Matrix Particles
    const particleCount = isMobile ? 35 : 80;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * (isMobile ? 8 : 14);
      positions[i + 1] = (Math.random() - 0.5) * 4;
      positions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ size: isMobile ? 0.04 : 0.03, color: 0x06B6D4, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    let animId = null;
    function animate() {
      animId = requestAnimationFrame(animate);
      pipeline.rotation.x += 0.005;
      rings.forEach((r, idx) => {
        r.rotation.z += 0.01 * (idx % 2 === 0 ? 1 : -1);
      });
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
  }
})();
