/* Custom Particle Trail Cursor Engine */
document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Spawn tiny particle dot trail occasionally
    if (Math.random() > 0.6) {
      const dot = document.createElement('div');
      dot.className = 'cursor-dot';
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      document.body.appendChild(dot);

      setTimeout(() => {
        dot.style.opacity = '0';
        setTimeout(() => dot.remove(), 500);
      }, 100);
    }
  });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }

  renderCursor();

  // Expand cursor over interactive elements
  const interactiveElems = document.querySelectorAll('a, button, input, textarea, select, .service-card, .project-card');
  interactiveElems.forEach(elem => {
    elem.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    elem.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
});
