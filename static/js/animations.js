/* Bidirectional GSAP ScrollDown & ScrollUp Animations Engine */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Bidirectional scroll down & scroll up animations for headers and cards
    gsap.utils.toArray('.section-header, .service-card, .project-card, .team-card, .stat-card').forEach((el) => {
      gsap.fromTo(el,
        {
          y: 60,
          opacity: 0,
          scale: 0.94,
          rotationX: 10
        },
        {
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            end: "bottom 15%",
            toggleActions: "play reverse play reverse" // Scroll down plays forward, scroll up reverses smoothly!
          },
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          duration: 0.9,
          ease: "power3.out"
        }
      );
    });

    // Timeline Fill Line Progress
    const timelineFill = document.querySelector('.timeline-line-fill');
    const timelineContainer = document.querySelector('.timeline-container');
    if (timelineFill && timelineContainer) {
      gsap.to(timelineFill, {
        scrollTrigger: {
          trigger: timelineContainer,
          start: "top 70%",
          end: "bottom 70%",
          scrub: 1 // Smooth bidirectional scrub on scroll down & up!
        },
        height: "100%",
        ease: "none"
      });
    }

    // Animated Metric Counters
    document.querySelectorAll('.stat-number').forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target') || '0', 10);
      gsap.to(counter, {
        scrollTrigger: {
          trigger: counter,
          start: "top 85%",
          toggleActions: "play none none reverse"
        },
        innerText: target,
        duration: 2,
        snap: { innerText: 1 },
        ease: "power1.out"
      });
    });
  }

  // 3D Card Hover Perspective Tilt Physics
  const cards = document.querySelectorAll('.service-card, .project-card, .team-card, .stat-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
});
