document.addEventListener('DOMContentLoaded', () => {
  const hasGsap = typeof gsap !== 'undefined';
  if (hasGsap && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  const intro = document.querySelector('#introScreen');
  const introStart = document.querySelector('#introStart');
  const nav = document.querySelector('#mainNav');
  const menuToggle = document.querySelector('#menuToggle');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointerTarget = { x: 0, y: 0 };
  const pointerCurrent = { x: 0, y: 0 };

  const driftWall = document.querySelector('#driftWall');
  const driftImages = ['imagen1.jpg', 'imagen2.jpg', 'imagen3.jpg'];
  const tileSetSize = 8;
  const columnWidth = window.innerWidth <= 700 ? window.innerWidth * .3 : 200;
  const columnCount = Math.ceil(window.innerWidth / columnWidth) + 4;
  const speedVariances = [1, .82, 1.18, .9, 1.1];
  for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
    const column = document.createElement('div');
    column.className = 'drift-column';
    for (let tileIndex = 0; tileIndex < tileSetSize * 2; tileIndex += 1) {
      const tile = document.createElement('figure');
      tile.className = 'drift-tile';
      const image = document.createElement('img');
      image.src = driftImages[(tileIndex + columnIndex) % driftImages.length];
      image.alt = '';
      tile.append(image);
      column.append(tile);
    }
    driftWall.append(column);
    const movesUp = columnIndex % 2 === 0;
    const speedVariance = speedVariances[columnIndex % speedVariances.length];
    if (hasGsap && !prefersReducedMotion) {
      const cycleHeight = column.children[tileSetSize].offsetTop;
      const driftTween = gsap.fromTo(column, { y: movesUp ? 0 : -cycleHeight }, { y: movesUp ? -cycleHeight : 0, duration: 42 / speedVariance, ease: 'none', repeat: -1, delay: columnIndex * -.8, force3D: true });
      column.addEventListener('mouseenter', () => driftTween.pause());
      column.addEventListener('mouseleave', () => driftTween.play());
    }
  }

  introStart.addEventListener('click', () => {
    introStart.disabled = true;
    if (hasGsap) {
      gsap.timeline({ onComplete: () => intro.remove() }).to('.intro-card', { opacity: 0, y: 10, duration: .35, ease: 'power2.in' }).to(intro, { autoAlpha: 0, duration: 1, ease: 'power2.out' });
    } else {
      intro.style.transition = 'opacity .6s ease';
      intro.style.opacity = '0';
      window.setTimeout(() => intro.remove(), 600);
    }
  });

  if (hasGsap) {
    document.querySelectorAll('.parallax-wrap').forEach((wrap) => {
      const image = wrap.querySelector('.parallax-image');
      gsap.fromTo(image, { yPercent: -13, scale: 1.12 }, { yPercent: 8, scale: 1.02, ease: 'none', scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
    });
    gsap.utils.toArray('.reveal-up').forEach((element) => gsap.from(element, { y: 70, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 82%', once: true } }));
    gsap.utils.toArray('.experience-copy h2, .section-heading h2, .tournament-head h2, .booking h2').forEach((heading) => gsap.from(heading, { y: 55, rotateX: -8, clipPath: 'inset(0 0 100% 0)', opacity: 0, duration: 1.15, ease: 'power3.out', scrollTrigger: { trigger: heading, start: 'top 84%', once: true } }));
    gsap.utils.toArray('.feature-list > div, .tournament-row:not(.tournament-row--head)').forEach((item, index) => gsap.from(item, { y: 35, rotateY: index % 2 ? 3 : -3, opacity: 0, duration: .75, delay: (index % 4) * .08, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 90%', once: true } }));
    gsap.from('.hero-content > *', { y: 35, opacity: 0, stagger: .12, duration: 1, delay: 1.2, ease: 'power3.out' });
  }

  const carousel = document.querySelector('.depth-carousel');
  if (carousel) {
    const cards = [...carousel.querySelectorAll('.depth-card')];
    const counter = carousel.querySelector('.depth-counter');
    let centerIndex = 0;
    let wheelLocked = false;

    function renderCarousel() {
      cards.forEach((card, index) => {
        const offset = (index - centerIndex + cards.length) % cards.length;
        card.className = 'depth-card ' + (offset === 0 ? 'is-center' : offset === 1 ? 'is-right' : 'is-left');
      });
      counter.textContent = `${String(centerIndex + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    }

    function moveCarousel(direction) {
      centerIndex = (centerIndex + direction + cards.length) % cards.length;
      renderCarousel();
    }

    carousel.querySelector('[data-carousel-prev]').addEventListener('click', () => moveCarousel(-1));
    carousel.querySelector('[data-carousel-next]').addEventListener('click', () => moveCarousel(1));
    carousel.addEventListener('wheel', (event) => {
      if (Math.abs(event.deltaY) < 12 || wheelLocked) return;
      event.preventDefault();
      wheelLocked = true;
      moveCarousel(event.deltaY > 0 ? 1 : -1);
      window.setTimeout(() => { wheelLocked = false; }, 650);
    }, { passive: false });
    renderCarousel();
  }

  const newsCarousel = document.querySelector('.news-carousel');
  if (newsCarousel) {
    const newsCards = [...newsCarousel.querySelectorAll('.news-card')];
    const newsCounter = newsCarousel.querySelector('[data-news-counter]');
    let newsIndex = Math.max(0, newsCards.findIndex((card) => card.classList.contains('is-active')));

    function renderNewsCarousel() {
      newsCards.forEach((card, index) => card.classList.toggle('is-active', index === newsIndex));
      if (newsCounter) newsCounter.textContent = `${String(newsIndex + 1).padStart(2, '0')} / ${String(newsCards.length).padStart(2, '0')}`;
    }

    function moveNewsCarousel(direction) {
      newsIndex = (newsIndex + direction + newsCards.length) % newsCards.length;
      renderNewsCarousel();
    }

    newsCarousel.querySelector('[data-news-prev]').addEventListener('click', () => moveNewsCarousel(-1));
    newsCarousel.querySelector('[data-news-next]').addEventListener('click', () => moveNewsCarousel(1));
    renderNewsCarousel();
  }

  const newsModal = document.querySelector('#newsModal');
  if (newsModal) {
    const newsOrder = ['ritual', 'identidad'];
    const newsData = {
      ritual: { image: 'imagen3.jpg', alt: 'Pelota de tenis sobre arcilla', meta: '18.09.24 / Comunidad', title: 'El ritual de cada partido empieza antes.', titleHtml: 'El ritual de cada<br>partido empieza antes.', copy: 'Hay partidos que empiezan mucho antes del primer saque: en la preparación, en la conversación y en ese instante en que la cancha vuelve a sentirse propia.' },
      identidad: { image: 'logo.png', alt: 'Logo vectorial de El Pinar', meta: '12.09.24 / Club', title: 'Una identidad con raíces.', titleHtml: 'Una identidad<br>con raíces.', copy: 'El Pinar también se construye en sus gestos: una identidad reconocible, una comunidad cercana y una forma propia de vivir el tenis.' }
    };

    // Repeat the news set a few times so the preview reads as a continuous, looping strip of cards.
    const modalTrack = newsModal.querySelector('#newsModalTrack');
    const modalRepeats = 4;
    if (modalTrack) {
      for (let repeat = 0; repeat < modalRepeats; repeat += 1) {
        newsOrder.forEach((id) => {
          const news = newsData[id];
          const isPrimary = repeat === 0;
          const card = document.createElement('article');
          card.className = 'news-modal__card';
          card.dataset.modalNews = id;
          card.setAttribute('role', 'button');
          card.tabIndex = isPrimary ? 0 : -1;
          if (!isPrimary) card.setAttribute('aria-hidden', 'true');
          const [metaDate, metaCategory] = news.meta.split(' / ');
          card.innerHTML = `<div class="news-modal__media"><img src="${news.image}" alt="${isPrimary ? news.alt : ''}" loading="lazy"></div><div class="news-card__overlay"><p class="mono news-card__meta">${metaDate}</p><p class="news-card__subtitle">${metaCategory}</p><h3>${news.titleHtml}</h3><p class="news-card__copy">${news.copy}</p></div>`;
          modalTrack.append(card);
        });
      }
    }

    function openNewsList() {
      newsModal.hidden = false;
      document.body.classList.add('modal-open');
      requestAnimationFrame(initModalCarousel);
    }

    function closeNews() {
      newsModal.hidden = true;
      document.body.classList.remove('modal-open');
    }

    // Apple-style expandable card: morphs from the clicked card's own position/size into a centered panel.
    const newsExpand = document.createElement('div');
    newsExpand.className = 'news-expand';
    newsExpand.innerHTML = '<div class="news-expand__backdrop" data-expand-close></div><div class="news-expand__card"><button class="news-expand__close" type="button" aria-label="Cerrar" data-expand-close>&times;</button><div class="news-expand__media"><img alt=""></div><div class="news-expand__body"><p class="mono news-expand__meta"></p><h3 class="news-expand__title"></h3><p class="news-expand__copy"></p></div></div>';
    document.body.append(newsExpand);
    const expandCard = newsExpand.querySelector('.news-expand__card');
    const expandBackdrop = newsExpand.querySelector('.news-expand__backdrop');
    const expandBody = newsExpand.querySelector('.news-expand__body');
    const expandMediaBox = newsExpand.querySelector('.news-expand__media');
    const expandMedia = newsExpand.querySelector('.news-expand__media img');
    const expandMeta = newsExpand.querySelector('.news-expand__meta');
    const expandTitle = newsExpand.querySelector('.news-expand__title');
    const expandCopy = newsExpand.querySelector('.news-expand__copy');
    let expandSource = null;

    function openNewsExpand(sourceEl, id) {
      const news = newsData[id];
      if (!news || expandSource) return;
      expandSource = sourceEl;
      expandMedia.src = news.image;
      expandMeta.textContent = news.meta;
      expandTitle.textContent = news.title;
      expandCopy.textContent = news.copy;
      sourceEl.style.visibility = 'hidden';
      newsExpand.classList.add('is-active');
      document.body.classList.add('modal-open');
      const rect = sourceEl.getBoundingClientRect();
      if (hasGsap) {
        const vw = document.documentElement.clientWidth;
        const vh = document.documentElement.clientHeight;
        const isMobile = vw <= 700;
        const margin = 24;
        const targetHeight = Math.min(vh - margin * 2, 680);
        const targetWidth = Math.min(vw - margin * 2, 920);
        const finalTop = (vh - targetHeight) / 2;
        const finalLeft = (vw - targetWidth) / 2;
        const mediaMarginPx = isMobile ? 0 : parseFloat(getComputedStyle(expandMediaBox).marginTop) || 0;
        const mediaHeight = isMobile ? Math.min(vh * .36, 280) : Math.max(0, targetHeight - mediaMarginPx * 2);
        const mediaWidth = isMobile ? targetWidth : mediaHeight * 9 / 16;
        gsap.set(expandCard, { top: rect.top, left: rect.left, width: rect.width, height: rect.height, borderRadius: 22 });
        gsap.set(expandMediaBox, { width: mediaWidth, height: mediaHeight, margin: isMobile ? 0 : undefined });
        gsap.set(expandBody, { opacity: 0, y: 16 });
        gsap.set(expandBackdrop, { opacity: 0 });
        gsap.to(expandCard, { top: finalTop, left: finalLeft, width: targetWidth, height: targetHeight, borderRadius: 26, duration: .55, ease: 'power3.inOut' });
        gsap.to(expandBackdrop, { opacity: 1, duration: .4 });
        gsap.to(expandBody, { opacity: 1, y: 0, duration: .4, delay: .25 });
      } else {
        expandCard.style.top = '8vh';
        expandCard.style.left = '4vw';
        expandCard.style.width = '92vw';
        expandCard.style.height = '84vh';
      }
    }

    function closeNewsExpand() {
      if (!expandSource) return;
      const sourceEl = expandSource;
      const rect = sourceEl.getBoundingClientRect();
      if (hasGsap) {
        gsap.to(expandBody, { opacity: 0, y: 10, duration: .2 });
        gsap.to(expandBackdrop, { opacity: 0, duration: .3 });
        gsap.to(expandCard, {
          top: rect.top, left: rect.left, width: rect.width, height: rect.height, borderRadius: 0, duration: .45, ease: 'power3.inOut',
          onComplete: () => { newsExpand.classList.remove('is-active'); document.body.classList.remove('modal-open'); sourceEl.style.visibility = ''; expandSource = null; }
        });
      } else {
        newsExpand.classList.remove('is-active');
        document.body.classList.remove('modal-open');
        sourceEl.style.visibility = '';
        expandSource = null;
      }
    }

    newsExpand.querySelectorAll('[data-expand-close]').forEach((element) => element.addEventListener('click', closeNewsExpand));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && expandSource) closeNewsExpand(); });
    // Outside click closes the expanded card (equivalent of the useOutsideClick hook).
    ['mousedown', 'touchstart'].forEach((eventName) => document.addEventListener(eventName, (event) => {
      if (!expandSource || !expandCard || expandCard.contains(event.target)) return;
      closeNewsExpand();
    }));

    document.querySelectorAll('.news-open-trigger').forEach((trigger) => trigger.addEventListener('click', (event) => { event.preventDefault(); openNewsList(); }));
    document.querySelector('#mainNav a[href="#noticias"]').addEventListener('click', (event) => { event.preventDefault(); openNewsList(); });
    document.querySelectorAll('.news-card[data-news-id]').forEach((card) => {
      const open = () => openNewsExpand(card, card.dataset.newsId);
      card.addEventListener('click', open);
      card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
    });
    newsModal.querySelectorAll('[data-modal-news]').forEach((item) => {
      const open = () => openNewsExpand(item, item.dataset.modalNews);
      item.addEventListener('click', open);
      item.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
    });
    newsModal.querySelectorAll('[data-news-close]').forEach((element) => element.addEventListener('click', closeNews));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !newsModal.hidden && !expandSource) closeNews(); });

    const modalCarousel = newsModal.querySelector('#newsModalCarousel');
    let modalCarouselReady = false;
    function initModalCarousel() {
      if (modalCarouselReady || !modalTrack) return;
      modalCarouselReady = true;
      const modalCards = [...modalTrack.children];
      const modalCounter = newsModal.querySelector('[data-modal-counter]');
      const modalPrev = newsModal.querySelector('[data-modal-prev]');
      const modalNext = newsModal.querySelector('[data-modal-next]');
      const modalStep = () => {
        const gap = parseFloat(getComputedStyle(modalTrack).columnGap || '0');
        return modalCards[0] ? modalCards[0].getBoundingClientRect().width + gap : 0;
      };
      const updateModalCounter = () => {
        const step = modalStep();
        const index = step ? Math.round(modalTrack.scrollLeft / step) % newsOrder.length : 0;
        if (modalCounter) modalCounter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(newsOrder.length).padStart(2, '0')}`;
      };
      modalPrev?.addEventListener('click', () => modalTrack.scrollBy({ left: -modalStep(), behavior: 'smooth' }));
      modalNext?.addEventListener('click', () => modalTrack.scrollBy({ left: modalStep(), behavior: 'smooth' }));
      modalTrack.addEventListener('scroll', () => window.requestAnimationFrame(updateModalCounter), { passive: true });
      updateModalCounter();

      // Slow, seamless auto-scroll marquee; pauses on hover/touch so users can browse or use the arrows freely.
      if (hasGsap && !prefersReducedMotion) {
        const oneSetWidth = modalStep() * newsOrder.length;
        if (oneSetWidth) {
          const marqueeTween = gsap.to(modalTrack, {
            scrollLeft: `+=${oneSetWidth}`,
            duration: 22,
            ease: 'none',
            repeat: -1,
            modifiers: { scrollLeft: gsap.utils.wrap(0, oneSetWidth) }
          });
          modalCarousel?.addEventListener('mouseenter', () => marqueeTween.pause());
          modalCarousel?.addEventListener('mouseleave', () => marqueeTween.play());
          modalCarousel?.addEventListener('touchstart', () => marqueeTween.pause(), { passive: true });
        }
      }
    }
  }

  const introScreen = document.querySelector('.intro-screen');
  introScreen.addEventListener('pointermove', (event) => {
    if (prefersReducedMotion) return;
    pointerTarget.x = (event.clientX / window.innerWidth - .5);
    pointerTarget.y = (event.clientY / window.innerHeight - .5);
  }, { passive: true });
  introScreen.addEventListener('pointerleave', () => {
    pointerTarget.x = 0;
    pointerTarget.y = 0;
  }, { passive: true });

  document.querySelector('.hero').addEventListener('pointermove', (event) => {
    if (prefersReducedMotion) return;
    pointerTarget.x = (event.clientX / window.innerWidth - .5);
    pointerTarget.y = (event.clientY / window.innerHeight - .5);
  }, { passive: true });
  document.querySelector('.hero').addEventListener('pointerleave', () => {
    pointerTarget.x = 0;
    pointerTarget.y = 0;
  }, { passive: true });

  function updatePointerScene() {
    pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * .08;
    pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * .08;
    document.documentElement.style.setProperty('--mouse-x', pointerCurrent.x.toFixed(4));
    document.documentElement.style.setProperty('--mouse-y', pointerCurrent.y.toFixed(4));
    document.documentElement.style.setProperty('--depth-x', `${(-pointerCurrent.x * 10).toFixed(2)}px`);
    document.documentElement.style.setProperty('--depth-y', `${(-pointerCurrent.y * 7).toFixed(2)}px`);
    document.documentElement.style.setProperty('--layer-x', `${(-pointerCurrent.x * 12).toFixed(2)}px`);
    document.documentElement.style.setProperty('--layer-y', `${(-pointerCurrent.y * 8).toFixed(2)}px`);
    document.documentElement.style.setProperty('--shape-x', `${(pointerCurrent.x * 18).toFixed(2)}px`);
    document.documentElement.style.setProperty('--shape-y', `${(pointerCurrent.y * 12).toFixed(2)}px`);
    document.documentElement.style.setProperty('--light-x', `${50 + pointerCurrent.x * 12}%`);
    document.documentElement.style.setProperty('--light-y', `${35 + pointerCurrent.y * 10}%`);
    document.documentElement.style.setProperty('--intro-tilt-x', `${(pointerCurrent.x * 8).toFixed(3)}deg`);
    document.documentElement.style.setProperty('--intro-tilt-y', `${(pointerCurrent.y * -6).toFixed(3)}deg`);
    document.documentElement.style.setProperty('--hero-tilt-x', `${(pointerCurrent.x * 5).toFixed(3)}deg`);
    document.documentElement.style.setProperty('--hero-tilt-y', `${(pointerCurrent.y * -4).toFixed(3)}deg`);
    requestAnimationFrame(updatePointerScene);
  }
  requestAnimationFrame(updatePointerScene);

  menuToggle.addEventListener('click', () => { const open = nav.classList.toggle('is-open'); menuToggle.setAttribute('aria-expanded', String(open)); });
  nav.querySelectorAll('.jelly-chip').forEach((link) => link.addEventListener('click', () => {
    nav.querySelector('.jelly-chip.is-active')?.classList.remove('is-active');
    nav.querySelector('.jelly-chip[aria-current="page"]')?.removeAttribute('aria-current');
    link.classList.add('is-active');
    link.setAttribute('aria-current', 'page');
    nav.classList.remove('is-open');
  }));
});
