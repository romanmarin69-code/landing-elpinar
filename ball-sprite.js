// Ball sprite renderer: 20 interpolated frames (18° steps) drawn discretely.
// With 20 frames the swap is small enough to read as continuous rotation — no
// crossfade needed (crossfading ghosts the felt). Driven by GSAP scroll in script.js.
(function () {
  const canvas = document.getElementById('ballSprite');
  if (!canvas) return;

  const FRAME_COUNT = 20;
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
    const pos = ((progress % 1) + 1) % 1 * FRAME_COUNT;
    const index = Math.min(FRAME_COUNT - 1, Math.floor(pos));
    if (index === current) return;
    current = index;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frames[index], 0, 0, canvas.width, canvas.height);
  }

  for (let i = 1; i <= FRAME_COUNT; i += 1) {
    const img = new Image();
    img.src = 'frames/frame-' + String(i).padStart(2, '0') + '.png';
    img.onload = () => {
      loaded += 1;
      if (loaded === FRAME_COUNT) {
        resize();
        draw(window.ballSprite.progress);
      }
    };
    frames.push(img);
  }

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
