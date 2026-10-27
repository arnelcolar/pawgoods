









(function () {
  'use strict';

  const KEY = 'pawgoods.cart.v1';
  const MAX_QTY = 10; 

  
  
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
      
    }
  }

  const catalogue = () => globalThis.PAWGOODS_PRODUCTS ?? [];
  const find = (id) => catalogue().find((p) => p.id === id);

  const clampQty = (n) => {
    const q = Math.trunc(Number(n));
    if (!Number.isFinite(q) || q < 1) return 1;
    return Math.min(q, MAX_QTY);
  };

  
  
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
      if (!row || typeof row.id !== 'string' || !find(row.id)) continue; 
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
      if (q <= 1) return api.remove(id); 
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

  
  function encodeRows() {
    return btoa(unescape(encodeURIComponent(JSON.stringify(read()))));
  }

  function decodeRows(s) {
    return JSON.parse(decodeURIComponent(escape(atob(s))));
  }

  api.stampLink = function (el, target) {
    if (!el) return;
    
    
    
    
    const base = (target ?? el.getAttribute('href') ?? 'cart.html').split('#')[0];
    const rows = read();
    el.href = rows.length ? `${base}#c=${encodeRows()}` : base;
  };

  
  api.receive = function () {
    const m = /^#c=(.+)$/.exec(window.location.hash);
    if (!m) return false;
    try {
      const rows = decodeRows(m[1]);
      if (Array.isArray(rows) && rows.length) write(rows);
    } catch {
      
    }
    
    history.replaceState(null, '', window.location.pathname + window.location.search);
    return true;
  };

  globalThis.PawCart = api;
})();