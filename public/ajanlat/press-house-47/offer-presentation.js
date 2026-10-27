/* Recreate stale native media elements; the original media files remain unchanged. */
(() => {
  const IDLE_MS = 60000;
  const players = [];
  document.querySelectorAll('video').forEach((initial) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'offer-player';
    initial.before(wrapper);
    wrapper.append(initial);
    const help = document.createElement('div');
    help.className = 'player-help';
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = 'Nincs kép? Újratöltés';
    const direct = document.createElement('a');
    direct.href = initial.getAttribute('src');
    direct.target = '_blank';
    direct.rel = 'noopener';
    direct.textContent = 'Videó külön lapon';
    help.append(retry, direct);
    const message = document.createElement('span');
    message.className = 'player-message';
    message.setAttribute('role', 'status');
    wrapper.append(help, message);
    let video = initial;
    let inactiveSince = Date.now();
    let generation = 0;

    function renew(resume = false) {
      const previous = video;
      const position = previous.ended ? 0 : previous.currentTime;
      const fresh = previous.cloneNode(true);
      fresh.volume = previous.volume;
      fresh.muted = previous.muted;
      fresh.playbackRate = previous.playbackRate;
      const tracks = Array.from(previous.textTracks, (track) => track.mode);
      previous.pause();
      video = fresh;
      inactiveSince = Date.now();
      wrapper.dataset.playerGeneration = String(++generation);
      bind();
      fresh.addEventListener('loadedmetadata', () => {
        if (position > 0 && Number.isFinite(fresh.duration)) {
          fresh.currentTime = Math.min(position, Math.max(0, fresh.duration - 0.05));
        }
        Array.from(fresh.textTracks).forEach((track, i) => {
          if (tracks[i]) track.mode = tracks[i];
        });
      }, { once: true });
      previous.replaceWith(fresh);
      // Release the old decoder after preserving the complete source/track markup.
      previous.removeAttribute('src');
      previous.querySelectorAll('source').forEach((source) => source.remove());
      previous.load();
      fresh.load();
      message.textContent = '';
      if (resume) fresh.play().catch(() => {
        message.textContent = 'A folytatáshoz nyomjátok meg a lejátszás gombot.';
      });
    }

    function bind() {
      const bound = video;
      bound.addEventListener('pause', () => { inactiveSince = Date.now(); });
      bound.addEventListener('ended', () => { inactiveSince = Date.now(); });
      bound.addEventListener('play', () => {
        if (bound !== video) return;
        if (Date.now() - inactiveSince > IDLE_MS) renew(true);
        else message.textContent = '';
      });
      bound.addEventListener('error', () => {
        if (bound === video) message.textContent = 'A videó nem töltődött be. Próbáljátok az újratöltést vagy a külön lapot.';
      });
    }
    bind();
    retry.addEventListener('click', () => renew(!video.paused));
    players.push({ renew, get video() { return video; } });
  });

  let hiddenAt = null;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hiddenAt = Date.now();
    else if (hiddenAt !== null) {
      if (Date.now() - hiddenAt > IDLE_MS) {
        players.filter((p) => p.video.paused && p.video.getClientRects().length && !p.video.closest('details:not([open])'))
          .forEach((p) => p.renew(false));
      }
      hiddenAt = null;
    }
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) players.filter((p) => p.video.readyState > 0).forEach((p) => p.renew(false));
  });
  document.querySelectorAll('details').forEach((details) => {
    details.addEventListener('toggle', () => {
      if (!details.open) details.querySelectorAll('video').forEach((video) => video.pause());
    });
  });

  const links = Array.from(document.querySelectorAll('[data-gallery-image]'));
  if (!links.length || !window.HTMLDialogElement) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'social-dialog';
  dialog.setAttribute('aria-label', 'Közösségi látványtervek');
  dialog.innerHTML = '<button type="button" class="gallery-close">Bezárás ✕</button><img alt=""><nav><button type="button" aria-label="Előző kép">‹</button><span class="gallery-caption" aria-live="polite"></span><button type="button" aria-label="Következő kép">›</button></nav>';
  document.body.append(dialog);
  let index = 0;
  let activeLinks = links;
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('.gallery-caption');
  function show(next) {
    index = (next + activeLinks.length) % activeLinks.length;
    const link = activeLinks[index];
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    const label = link.closest('figure').querySelector('figcaption').textContent.replace(/^\d+\s*\/\s*\d+\s*·\s*/, '');
    caption.textContent = `${index + 1} / ${activeLinks.length} · ${label}`;
  }
  links.forEach((link) => link.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    activeLinks = links.filter((candidate) => candidate.dataset.galleryGroup === link.dataset.galleryGroup);
    show(activeLinks.indexOf(link));
    dialog.showModal();
  }));
  dialog.querySelector('.gallery-close').onclick = () => dialog.close();
  dialog.querySelector('[aria-label="Előző kép"]').onclick = () => show(index - 1);
  dialog.querySelector('[aria-label="Következő kép"]').onclick = () => show(index + 1);
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); show(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
})();
