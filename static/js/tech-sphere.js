/* 3D Orbiting Technology Sphere Canvas */
(function() {
  const container = document.getElementById('tech-sphere-container');
  if (!container || typeof THREE === 'undefined') return;

  let scene, camera, renderer, techGroup;
  let mouseX = 0, mouseY = 0;

  const techList = [
    { name: "Python", color: "#3776AB" },
    { name: "Flask", color: "#00F0FF" },
    { name: "Django", color: "#092E20" },
    { name: "React", color: "#61DAFB" },
    { name: "Next.js", color: "#FFFFFF" },
    { name: "Docker", color: "#2496ED" },
    { name: "PostgreSQL", color: "#4169E1" },
    { name: "AWS", color: "#FF9900" },
    { name: "GitHub", color: "#FFFFFF" },
    { name: "Linux", color: "#FCC624" },
    { name: "Three.js", color: "#7C3AED" },
    { name: "Redis", color: "#DC382D" }
  ];

  function createTextSprite(text, colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 24px "Space Grotesk", sans-serif';
    ctx.fillStyle = colorHex;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(2.4, 0.6, 1);
    return sprite;
  }

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 8;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    techGroup = new THREE.Group();
    scene.add(techGroup);

    // Distribute nodes evenly around sphere using Fibonacci Sphere Algorithm
    const samples = techList.length;
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden ratio angle

    for (let i = 0; i < samples; i++) {
      const y = 1 - (i / (samples - 1)) * 2; // y goes from 1 to -1
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radius * 3.2;
      const z = Math.sin(theta) * radius * 3.2;
      const posY = y * 3.2;

      const sprite = createTextSprite(techList[i].name, techList[i].color);
      sprite.position.set(x, posY, z);
      techGroup.add(sprite);

      // Add connecting particle node
      const dotGeo = new THREE.SphereGeometry(0.06, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color: techList[i].color });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(x * 0.9, posY * 0.9, z * 0.9);
      techGroup.add(dot);
    }

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

    techGroup.rotation.y += 0.005 + mouseX * 0.01;
    techGroup.rotation.x += 0.002 + mouseY * 0.01;

    renderer.render(scene, camera);
  }

  window.addEventListener('load', init);
})();
