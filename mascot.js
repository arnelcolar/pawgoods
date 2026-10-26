// Mascot, ported to vanilla JS from nilbuild/page-mascot (MIT).
//
// Why a port and not the package: page-mascot is a React component and this
// template has no build step and no framework. The behaviour is self-contained —
// nine sprite cells for head directions, nine for expressions, pointer angle →
// sector, click → reaction — so it ports directly. See mascot.tsx upstream for
// the original; the constants below match it.
//
// Usage: <span class="mascot" data-directions="…" data-reactions="…"></span>
// The element watches the pointer, and blinks / reacts when clicked.

(function () {
  const DIRECTIONS = [
    'up-left', 'up', 'up-right', 'left', 'center', 'right', 'down-left', 'down', 'down-right',
  ];
  const REACTIONS = [
    'blink', 'heart', 'sparkle', 'surprised', 'wink', 'bashful', 'sleepy', 'dizzy', 'delighted',
  ];

  const CLOCKWISE = ['right', 'down-right', 'down', 'down-left', 'left', 'up-left', 'up', 'up-right'];
  const SECTOR = (Math.PI * 2) / CLOCKWISE.length;
  const HYSTERESIS = 0.12;
  const DEAD_ZONE = 70;

  const PAYOFFS = ['heart', 'sparkle', 'delighted'];
  const BOOP_PAYOFF = 120;
  const BOOP_END = 560;
  const SQUASH_MS = 420;
  const DIZZY_AFTER = 4;
  const DIZZY_WINDOW = 1600;
  const DIZZY_END = 1100;

  const SQUASH = [
    { transform: 'scale(1, 1)', easing: 'ease-in' },
    { transform: 'scale(1.10, 0.86)', offset: 0.18, easing: 'ease-out' },
    { transform: 'scale(0.95, 1.08)', offset: 0.45, easing: 'ease-in-out' },
    { transform: 'scale(1.03, 0.97)', offset: 0.72, easing: 'ease-in-out' },
    { transform: 'scale(1, 1)' },
  ];

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function cell(index) {
    return `${(index % 3) * 50}% ${Math.floor(index / 3) * 50}%`;
  }

  function wrap(angle) {
    return Math.atan2(Math.sin(angle), Math.cos(angle));
  }

  function init(el) {
    const directions = el.dataset.directions;
    const reactions = el.dataset.reactions;
    if (!directions || !reactions) return;

    // Position must come from CSS: the logo version sets this element
    // `position: absolute`, which an inline style would override.
    el.style.display = 'block';

    const inner = document.createElement('span');
    inner.style.cssText = 'position:relative;display:block;width:100%;height:100%;transform-origin:50% 78%';

    const dirLayer = document.createElement('span');
    dirLayer.style.cssText = `position:absolute;inset:0;background:url(${directions}) no-repeat 0 0 / 300% 300%;background-position:0% 0%`;

    const reactLayer = document.createElement('span');
    reactLayer.style.cssText = `position:absolute;inset:0;background:url(${reactions}) no-repeat 0 0 / 300% 300%;background-position:0% 0%;opacity:0`;

    inner.append(dirLayer, reactLayer);
    el.append(inner);

    let direction = 'center';
    let reaction = null;
    let timers = [];
    let boops = { count: 0, at: 0 };

    const paint = () => {
      dirLayer.style.backgroundPosition = cell(DIRECTIONS.indexOf(direction));
      dirLayer.style.opacity = reaction ? '0' : '1';
      reactLayer.style.backgroundPosition = cell(REACTIONS.indexOf(reaction ?? 'blink'));
      reactLayer.style.opacity = reaction ? '1' : '0';
    };

    const clearTimers = () => timers.forEach(clearTimeout);

    function boop() {
      clearTimers();
      timers = [];

      const later = (ms, next) => {
        timers.push(setTimeout(() => { reaction = next; paint(); }, ms));
      };

      const now = Date.now();
      boops.count = now - boops.at < DIZZY_WINDOW ? boops.count + 1 : 1;
      boops.at = now;

      if (boops.count >= DIZZY_AFTER) {
        boops.count = 0;
        reaction = 'dizzy';
        later(DIZZY_END, null);
      } else {
        reaction = 'blink';
        later(BOOP_PAYOFF, PAYOFFS[(boops.count - 1) % PAYOFFS.length]);
        later(BOOP_END, null);
      }
      paint();

      if (reducedMotion.matches) return;
      inner.animate(SQUASH, { duration: SQUASH_MS, easing: 'linear' });
    }

    el.addEventListener('click', (e) => {
      // The mascot sits inside the logo link. Without this a boop would bubble
      // into the anchor and navigate to the homepage.
      e.preventDefault();
      e.stopPropagation();
      boop();
    });
    el.style.cursor = 'pointer';
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', 'Boop the pug');
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        boop();
      }
    });

    if (!finePointer.matches) return;

    let sector = -1;
    let pointer = null;

    const aim = () => {
      const rect = el.getBoundingClientRect();
      const dx = pointer.x - (rect.left + rect.width / 2);
      const dy = pointer.y - (rect.top + rect.height / 2);

      if (Math.hypot(dx, dy) < DEAD_ZONE) {
        sector = -1;
        direction = 'center';
        paint();
        return;
      }

      const angle = Math.atan2(dy, dx);
      if (sector !== -1 && Math.abs(wrap(angle - sector * SECTOR)) < SECTOR / 2 + HYSTERESIS) return;

      sector = (Math.round(angle / SECTOR) + CLOCKWISE.length) % CLOCKWISE.length;
      const next = CLOCKWISE[sector];
      if (next !== direction) { direction = next; paint(); }
    };

    window.addEventListener('pointermove', (e) => {
      pointer = { x: e.clientX, y: e.clientY };
      aim();
    }, { passive: true });

    window.addEventListener('scroll', () => { if (pointer) aim(); }, { passive: true });
  }

  document.querySelectorAll('.mascot').forEach(init);
})();
