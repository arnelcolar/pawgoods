// Client-side cart. No server, no API keys, works opened straight from file://.
//
// Scope, stated plainly: this holds items in the browser only. Clearing site
// data, or closing the tab and coming back later on a different machine, loses
// the cart. That is the trade for having no backend — see README.
//
// Prices are read from products.js, which is a local file, so they are not
// authoritative. That is safe for Payment Links: the amount actually charged is
// whatever you configured in the Stripe dashboard, never the number here.

(function () {
  'use strict';

  const KEY = 'pawgoods.cart.v1';
  const MAX_QTY = 10; // Input guard: the UI cannot ask for 999 of one item.

  // Private mode and disabled storage both make localStorage throw on write.
  // Fall back to memory so the cart still works for the current page view.
  let memory = null;
  const available = (() => {
    try {
      const k = '__pg_probe__';
      window.localStorage.setItem(k, '1');
      window.localStorage.removeItem(k);
      return true;
    } catch {
      return false;
    }
  })();

  function readRaw() {
    if (!available) return memory;
    try {
      return window.localStorage.getItem(KEY);
    } catch {
      return memory;
    }
  }

  function writeRaw(value) {
    memory = value;
    if (!available) return;
    try {
      window.localStorage.setItem(KEY, value);
    } catch {
      /* quota or blocked; memory copy already set, so the page still works */
    }
  }

  const catalogue = () => globalThis.PAWGOODS_PRODUCTS ?? [];
  const find = (id) => catalogue().find((p) => p.id === id);

  const clampQty = (n) => {
    const q = Math.trunc(Number(n));
    if (!Number.isFinite(q) || q < 1) return 1;
    return Math.min(q, MAX_QTY);
  };

  // Stored data is untrusted input: it survives across deploys and can be
  // hand-edited, so validate the shape before using any of it.
  function read() {
    const raw = readRaw();
    if (!raw) return [];
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return [];
    }
    if (!Array.isArray(parsed)) return [];

    const out = [];
    for (const row of parsed) {
      if (!row || typeof row.id !== 'string' || !find(row.id)) continue; // drop deleted products
      out.push({ id: row.id, qty: clampQty(row.qty) });
    }
    return out;
  }

  function write(rows) {
    writeRaw(rows.length ? JSON.stringify(rows) : '');
    window.dispatchEvent(new CustomEvent('pawcart:change', { detail: rows }));
  }

  function rows() {
    return read();
  }

  const items = () =>
    rows()
      .map((r) => ({ product: find(r.id), qty: r.qty }))
      .filter((r) => r.product);

  const api = {
    MAX_QTY,
    available,

    items,
    rows,

    count: () => rows().reduce((n, r) => n + r.qty, 0),

    subtotal: () =>
      items().reduce((sum, r) => sum + r.product.price * r.qty, 0),

    add(id, qty = 1) {
      if (!find(id)) return false;
      const next = rows();
      const row = next.find((r) => r.id === id);
      if (row) row.qty = clampQty(row.qty + qty);
      else next.push({ id, qty: clampQty(qty) });
      write(next);
      return true;
    },

    setQty(id, qty) {
      const next = rows();
      const row = next.find((r) => r.id === id);
      if (!row) return false;
      const q = clampQty(qty);
      if (q <= 1) return api.remove(id); // dropping to zero removes, rather than sitting at an invalid 0
      row.qty = q;
      write(next);
      return true;
    },

    remove(id) {
      write(rows().filter((r) => r.id !== id));
      return true;
    },

    clear() {
      write([]);
      return true;
    },
  };

  /*
   * Cross-page handoff.
   *
   * On http(s) every page shares one localStorage, so none of this is needed.
   * On file:// it depends on the browser: Chromium shares one origin, but
   * Firefox gives every file:// document its own storage. A cart added on
   * index.html then looks empty on cart.html. Passing the cart in the URL
   * fragment sidesteps that entirely and needs no server.
   *
   * The fragment (after #) is never sent to a server, so nothing leaks on a
   * hosted deployment.
   */
  function encodeRows() {
    return btoa(unescape(encodeURIComponent(JSON.stringify(read()))));
  }

  function decodeRows(s) {
    return JSON.parse(decodeURIComponent(escape(atob(s))));
  }

  api.stampLink = function (el, target) {
    if (!el) return;
    // Strip whatever fragment is already on the link. This runs on every cart
    // change, so reading the href back after the first stamp would append a
    // second `#c=`, and the receiving page would decode a corrupt payload —
    // which only shows up on browsers that need the handoff at all.
    const base = (target ?? el.getAttribute('href') ?? 'cart.html').split('#')[0];
    const rows = read();
    el.href = rows.length ? `${base}#c=${encodeRows()}` : base;
  };

  // Merge a handed-off cart into storage. Returns true if anything arrived.
  api.receive = function () {
    const m = /^#c=(.+)$/.exec(window.location.hash);
    if (!m) return false;
    try {
      const rows = decodeRows(m[1]);
      if (Array.isArray(rows) && rows.length) write(rows);
    } catch {
      /* corrupt fragment: ignore and carry on with whatever is in storage */
    }
    // Strip the fragment so a refresh doesn't re-apply a stale cart.
    history.replaceState(null, '', window.location.pathname + window.location.search);
    return true;
  };

  globalThis.PawCart = api;
})();