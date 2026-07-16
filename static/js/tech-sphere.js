/**
 * JS CodeWorks - 3D Technology Orbit Stack Cloud Visualizer
 * Performance Optimized with IntersectionObserver & Mobile Frame Throttling
 */

(function () {
  const container = document.getElementById('tech-sphere-container');
  if (!container) return;

  const isMobile = window.innerWidth < 768 || ('ontouchstart' in window);
  const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.2 : 2);

  let isVisible = false;
  let stopAnimation = null;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible && !stopAnimation) {
        stopAnimation = initTechSphere();
      } else if (!isVisible && stopAnimation) {
        stopAnimation();
        stopAnimation = null;
      }
    });
  }, { threshold: 0.05 });

  observer.observe(container);

  function initTechSphere() {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = isMobile ? 8.5 : 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    container.appendChild(renderer.domElement);

    const techCloud = new THREE.Group();

    // Wireframe Sphere Shell
    const shellGeo = new THREE.SphereGeometry(isMobile ? 2.2 : 2.8, isMobile ? 14 : 24, isMobile ? 14 : 24);
    const shellMat = new THREE.MeshBasicMaterial({ color: 0x06B6D4, wireframe: true, transparent: true, opacity: 0.25 });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    techCloud.add(shell);

    // Inner Glowing Ring
    const ringGeo = new THREE.TorusGeometry(isMobile ? 2.8 : 3.4, 0.02, 8, isMobile ? 30 : 60);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x2563EB, transparent: true, opacity: 0.5 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    techCloud.add(ring);

    // Orbit Node Sprites
    const techTags = ['Python', 'WebGL 3D', 'Flask', 'React', 'AI Automation', 'Docker', 'PostgreSQL', 'AWS Cloud', 'GSAP', 'TypeScript', 'TailwindCSS', 'Redis'];
    const radius = isMobile ? 2.4 : 3.0;

    techTags.forEach((tag, idx) => {
      const phi = Math.acos(-1 + (2 * idx) / techTags.length);
      const theta = Math.sqrt(techTags.length * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      const nodeGeo = new THREE.SphereGeometry(isMobile ? 0.12 : 0.15, 8, 8);
      const nodeMat = new THREE.MeshBasicMaterial({ color: idx % 2 === 0 ? 0x06B6D4 : 0x7C3AED });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(x, y, z);
      techCloud.add(nodeMesh);
    });

    scene.add(techCloud);

    // Smooth Orbit Rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    function onMouseDown(e) {
      isDragging = true;
      previousMousePosition = { x: e.clientX || (e.touches && e.touches[0].clientX), y: e.clientY || (e.touches && e.touches[0].clientY) };
    }

    function onMouseMove(e) {
      if (!isDragging) return;
      const currentX = e.clientX || (e.touches && e.touches[0].clientX);
      const currentY = e.clientY || (e.touches && e.touches[0].clientY);

      const deltaX = currentX - previousMousePosition.x;
      const deltaY = currentY - previousMousePosition.y;

      techCloud.rotation.y += deltaX * 0.005;
      techCloud.rotation.x += deltaY * 0.005;

      previousMousePosition = { x: currentX, y: currentY };
    }

    function onMouseUp() {
      isDragging = false;
    }

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    domEl.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    domEl.addEventListener('touchstart', onMouseDown, { passive: true });
    domEl.addEventListener('touchmove', onMouseMove, { passive: true });
    window.addEventListener('touchend', onMouseUp, { passive: true });

    let animId = null;
    function animate() {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        techCloud.rotation.y += 0.003;
        techCloud.rotation.x += 0.001;
      }
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    return function cleanup() {
      if (animId) cancelAnimationFrame(animId);
      domEl.removeEventListener('mousedown', onMouseDown);
      domEl.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('touchstart', onMouseDown);
      domEl.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
      window.removeEventListener('resize', onResize);

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }
})();
