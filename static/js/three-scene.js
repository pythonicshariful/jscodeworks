/* Three.js Futuristic 3D Developer Workspace Canvas */
(function() {
  const container = document.getElementById('canvas-3d-workspace');
  if (!container || typeof THREE === 'undefined') return;

  let scene, camera, renderer, particlesMesh, codeCanvasTexture, codeCtx, codeCanvas;
  let logoImg = null;
  let mouseX = 0, mouseY = 0;

  // Real-time live code typing variables
  const codeLines = [
    "class JSCodeWorksEngine:",
    "    def __init__(self):",
    "        self.status = 'INITIALIZED'",
    "        self.founders = ['Jahidur Islam', 'Shariful Islam']",
    "        self.capabilities = ['AI', 'Cloud', 'Web', 'Mobile']",
    "",
    "    def deploy_world_class(self, client_idea):",
    "        product = self.compile_solution(client_idea)",
    "        return product.scale(to='infinity')",
    "",
    "engine = JSCodeWorksEngine()",
    "engine.deploy_world_class('Your Dream Software')"
  ];
  let currentLineIdx = 0;
  let currentCharIdx = 0;
  let displayedLines = [""];

  function init() {
    // 1. Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050816, 0.08);

    // 2. Camera setup
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 5, 12);

    // 3. Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.5);
    scene.add(ambientLight);

    const blueSpotLight = new THREE.SpotLight(0x2563EB, 4, 20, Math.PI / 4);
    blueSpotLight.position.set(-4, 6, 4);
    scene.add(blueSpotLight);

    const cyanSpotLight = new THREE.SpotLight(0x06B6D4, 5, 20, Math.PI / 4);
    cyanSpotLight.position.set(4, 5, 4);
    scene.add(cyanSpotLight);

    const purplePointLight = new THREE.PointLight(0x7C3AED, 3, 15);
    purplePointLight.position.set(0, 2, -2);
    scene.add(purplePointLight);

    // 5. Load Logo Image object for Monitor Canvas
    logoImg = new Image();
    logoImg.src = '/static/images/logo.png';
    logoImg.onload = () => {
      if (codeCanvasTexture) codeCanvasTexture.needsUpdate = true;
    };

    // 6. Dynamic Code Canvas Texture
    codeCanvas = document.createElement('canvas');
    codeCanvas.width = 1024;
    codeCanvas.height = 512;
    codeCtx = codeCanvas.getContext('2d');
    codeCanvasTexture = new THREE.CanvasTexture(codeCanvas);
    updateCodeCanvas();

    // 7. Build Workspace (Clean 3D Scene - no floating giant plane overlay)
    buildWorkspace();

    // 8. Floating Particle Systems
    buildParticles();

    // 9. Event Listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);

    // 10. Intro Camera Animation Sequence
    gsap.to(camera.position, {
      x: 0,
      y: 1.8,
      z: 6,
      duration: 2.5,
      ease: "power3.inOut"
    });

    animate();
  }

  function buildWorkspace() {
    // Desk Surface
    const deskGeo = new THREE.BoxGeometry(6, 0.15, 2.5);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.8
    });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(0, 0, 0);
    scene.add(desk);

    // Main Curved Monitor Screen
    const monitorMat = new THREE.MeshBasicMaterial({ map: codeCanvasTexture });
    const screenGeo = new THREE.PlaneGeometry(3.6, 2.0);
    const centerScreen = new THREE.Mesh(screenGeo, monitorMat);
    centerScreen.position.set(0, 1.45, -0.2);
    scene.add(centerScreen);

    // Monitor Frame
    const frameGeo = new THREE.BoxGeometry(3.7, 2.1, 0.1);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x030712, roughness: 0.4 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(0, 1.45, -0.26);
    scene.add(frame);

    // Side Monitor (Angled Left)
    const sideScreenGeo = new THREE.PlaneGeometry(2.0, 1.4);
    const sideMat = new THREE.MeshBasicMaterial({ color: 0x060b1e });
    const leftScreen = new THREE.Mesh(sideScreenGeo, sideMat);
    leftScreen.position.set(-2.5, 1.35, 0.3);
    leftScreen.rotation.y = 0.4;
    scene.add(leftScreen);

    // Neon Glow Line on Desk Edge
    const edgeGeo = new THREE.BoxGeometry(6.1, 0.04, 0.04);
    const edgeMat = new THREE.MeshBasicMaterial({ color: 0x06B6D4 });
    const edge = new THREE.Mesh(edgeGeo, edgeMat);
    edge.position.set(0, 0.08, 1.24);
    scene.add(edge);
  }

  function buildParticles() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 15;
      positions[i + 1] = Math.random() * 8;
      positions[i + 2] = (Math.random() - 0.5) * 15;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0x06B6D4,
      size: 0.04,
      transparent: true,
      opacity: 0.7
    });

    particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);
  }

  function updateCodeCanvas() {
    if (!codeCtx) return;
    codeCtx.fillStyle = '#050a1c';
    codeCtx.fillRect(0, 0, 1024, 512);

    // Header bar inside monitor
    codeCtx.fillStyle = '#0f172a';
    codeCtx.fillRect(0, 0, 1024, 40);

    // Draw small icon logo inside the code editor header bar
    if (logoImg && logoImg.complete && logoImg.naturalWidth !== 0) {
      try {
        codeCtx.drawImage(logoImg, 20, 6, 28, 28);
      } catch (e) {}
    }

    codeCtx.fillStyle = '#94a3b8';
    codeCtx.font = 'bold 16px "JetBrains Mono"';
    codeCtx.fillText("JS CODEWORKS - main.py", 60, 26);

    // Window controls
    codeCtx.fillStyle = '#ef4444'; codeCtx.beginPath(); codeCtx.arc(960, 20, 6, 0, Math.PI*2); codeCtx.fill();
    codeCtx.fillStyle = '#f59e0b'; codeCtx.beginPath(); codeCtx.arc(980, 20, 6, 0, Math.PI*2); codeCtx.fill();
    codeCtx.fillStyle = '#10b981'; codeCtx.beginPath(); codeCtx.arc(1000, 20, 6, 0, Math.PI*2); codeCtx.fill();

    // Render code text lines
    codeCtx.font = '20px "JetBrains Mono"';
    codeCtx.fillStyle = '#10b981';
    let y = 80;
    displayedLines.forEach(line => {
      codeCtx.fillText(line, 40, y);
      y += 32;
    });

    if (codeCanvasTexture) codeCanvasTexture.needsUpdate = true;
  }

  function stepCodeTyping() {
    if (currentLineIdx < codeLines.length) {
      const fullLine = codeLines[currentLineIdx];
      if (currentCharIdx < fullLine.length) {
        displayedLines[displayedLines.length - 1] += fullLine[currentCharIdx];
        currentCharIdx++;
      } else {
        currentLineIdx++;
        currentCharIdx = 0;
        if (currentLineIdx < codeLines.length) {
          displayedLines.push("");
        }
      }
    } else {
      setTimeout(() => {
        currentLineIdx = 0;
        currentCharIdx = 0;
        displayedLines = [""];
      }, 3000);
    }
    updateCodeCanvas();
  }

  setInterval(stepCodeTyping, 45);

  function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);

    camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.05;
    camera.position.y += (1.8 - mouseY * 0.4 - camera.position.y) * 0.05;
    camera.lookAt(0, 1.4, 0);

    if (particlesMesh) {
      particlesMesh.rotation.y += 0.0005;
    }

    renderer.render(scene, camera);
  }

  window.addEventListener('load', init);
})();
