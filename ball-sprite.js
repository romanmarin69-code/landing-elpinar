// Ball sprite renderer: draws the 4 rotation frames in order, and near each frame
// boundary applies a velocity-weighted rotate+scale to the bitmap (motion-blur
// simulation), so the swap reads as motion instead of a hard image swap.
// window.ballSprite.set(progress, velocity) is driven by the GSAP timeline in script.js.
(function () {
  const canvas = document.getElementById('ballSprite');
  if (!canvas) return;

  const FRAME_FILES = ['frames/frame-2.png', 'frames/frame-3.png', 'frames/frame-4.png', 'frames/frame-5.png'];
  const FRAME_COUNT = FRAME_FILES.length;
  const frames = [];
  let loaded = 0;
  let lastKey = '';
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    lastKey = '';
  }

  function draw(progress, velocity) {
    if (loaded < FRAME_COUNT) return;
    const pos = ((progress % 1) + 1) % 1 * FRAME_COUNT;
    const index = Math.floor(pos) % FRAME_COUNT;
    const next = (index + 1) % FRAME_COUNT;
    const t = pos - Math.floor(pos); // 0..1 within the current frame pair

    // Motion-blur weight: strongest at the frame boundary, scaled by scroll speed.
    const boundary = Math.min(t, 1 - t); // 0 at boundary, 0.5 mid-frame
    const speed = Math.min(Math.abs(velocity) / 2200, 1); // clamp px/s
    const w = Math.max(0, (0.5 - boundary) * 2) * Math.max(speed, 0.25);
    const rot = w * 0.055; // radians, subtle
    const scl = 1 - w * 0.03;

    const key = index + '|' + Math.round(w * 200) + '|' + Math.round(pos * 100);
    if (key === lastKey) return;
    lastKey = key;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    if (w > 0.04) {
      // Near a boundary: current frame rotates/scales slightly out, next one in.
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate(-rot);
      ctx.scale(scl, scl);
      ctx.drawImage(frames[index], -W / 2, -H / 2, W, H);
      ctx.restore();

      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate(rot);
      ctx.scale(2 - scl, 2 - scl);
      ctx.globalAlpha = Math.min(1, w * 0.5);
      ctx.drawImage(frames[next], -W / 2, -H / 2, W, H);
      ctx.restore();
      ctx.globalAlpha = 1;
    } else {
      ctx.drawImage(frames[index], 0, 0, W, H);
    }
  }

  FRAME_FILES.forEach((src) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loaded += 1;
      if (loaded === FRAME_COUNT) {
        resize();
        draw(window.ballSprite.progress, 0);
      }
    };
    frames.push(img);
  });

  window.ballSprite = {
    progress: 0,
    set(progress, velocity) {
      this.progress = progress;
      draw(progress, velocity || 0);
    },
  };

  window.addEventListener('resize', resize);
  resize();
})();
