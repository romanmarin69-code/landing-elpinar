// Ball sprite: discrete frame drawing (Apple-style, no crossfade — crossfading rotation
// frames ghosts the felt). The continuous spin comes from GSAP rotating the canvas element
// itself (see script.js): each 90° frame step lands mid-spin, so the swap reads as motion.
(function () {
  const canvas = document.getElementById('ballSprite');
  if (!canvas) return;

  const FRAME_FILES = ['frames/frame-2.png', 'frames/frame-3.png', 'frames/frame-4.png', 'frames/frame-5.png'];
  const FRAME_COUNT = FRAME_FILES.length;
  const frames = [];
  let loaded = 0;
  let current = -1;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    current = -1;
  }

  function draw(progress) {
    if (loaded < FRAME_COUNT) return;
    const position = ((progress % 1) + 1) % 1 * FRAME_COUNT;
    const index = Math.min(FRAME_COUNT - 1, Math.floor(position));
    if (index === current) return;
    current = index;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frames[index], 0, 0, canvas.width, canvas.height);
  }

  FRAME_FILES.forEach((src) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loaded += 1;
      if (loaded === FRAME_COUNT) {
        resize();
        draw(window.ballSprite.progress);
      }
    };
    frames.push(img);
  });

  window.ballSprite = {
    progress: 0,
    set(progress) {
      this.progress = progress;
      draw(progress);
    },
  };

  window.addEventListener('resize', resize);
  resize();
})();
