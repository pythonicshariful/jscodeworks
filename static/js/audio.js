/* Web Audio API Sound Synth Engine for Futuristic UI Micro-Audio */
window.AudioEngine = (function() {
  let audioCtx = null;
  let isMuted = false;

  function initCtx() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playIntroSynth() {
    if (isMuted) return;
    initCtx();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 1.5);

      gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.0);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 2.0);
    } catch (e) {
      console.warn("Audio Context synth error", e);
    }
  }

  function playClickBeep() {
    if (isMuted) return;
    initCtx();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      // Audio optional
    }
  }

  function toggleMute() {
    isMuted = !isMuted;
    return isMuted;
  }

  return {
    init: initCtx,
    playIntroSynth: playIntroSynth,
    playClickBeep: playClickBeep,
    toggleMute: toggleMute,
    isMuted: () => isMuted
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('audio-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const muted = window.AudioEngine.toggleMute();
      toggleBtn.querySelector('.audio-label').textContent = muted ? 'SOUND: OFF' : 'SOUND: ON';
      if (!muted) window.AudioEngine.playClickBeep();
    });
  }

  document.querySelectorAll('button, a.btn-primary, a.btn-secondary').forEach(btn => {
    btn.addEventListener('click', () => {
      window.AudioEngine.playClickBeep();
    });
  });
});
