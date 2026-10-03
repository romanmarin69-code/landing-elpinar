// Ball sprite: crossfades between the 5 rotation frames on a canvas, driven by scroll progress.
// window.ballSprite.set(0..1) is called from the GSAP timeline in script.js.
(function () {
  const canvas = document.getElementById('ballSprite');
  if (!canvas) return;

  const FRAME_COUNT = 5;
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
    // Map progress to a continuous position over the frame sequence, looped.
    const position = ((progress % 1) + 1) % 1 * FRAME_COUNT;
    const index = Math.floor(position) % FRAME_COUNT;
    const next = (index + 1) % FRAME_COUNT;
    const blend = position - Math.floor(position);
    const key = index * 1000 + next * 10 + Math.round(blend * 40);
    if (key === current) return;
    current = key;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = 1 - blend;
    ctx.drawImage(frames[index], 0, 0, w, h);
    ctx.globalAlpha = blend;
    ctx.drawImage(frames[next], 0, 0, w, h);
    ctx.globalAlpha = 1;
  }

  for (let i = 1; i <= FRAME_COUNT; i += 1) {
    const img = new Image();
    img.src = 'frames/frame-' + i + '.png';
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
