/* HUUD — Fix de navegação da Sala 00 + separação de salas
   Não substitui o núcleo. Apenas garante que a Sala 00 possa ser aberta diretamente
   e que itens pessoais do Terreno não apareçam dentro do QG MV.
*/
(function () {
  'use strict';

  function loadNavigationRouter(next) {
    if (window.__HUUD_ROUTER_V1) {
      if (typeof next === 'function') next();
      return;
    }
    const existing = document.querySelector('script[data-huud-navigation-router]');
    if (existing) {
      existing.addEventListener('load', function () { if (typeof next === 'function') next(); }, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'huud-navigation-router-v1.js';
    script.dataset.huudNavigationRouter = '1';
    script.onload = function () { if (typeof next === 'function') next(); };
    script.onerror = function () { if (typeof next === 'function') next(); };
    document.head.appendChild(script);
  }

  function openPendencias() {
    const target = document.getElementById('view-pendencias');
    if (!target) {
      setTimeout(openPendencias, 150);
      return;
    }

    document.querySelectorAll('.view').forEach(function (view) {
      view.style.display = 'none';
      view.classList.remove('active');
    });
    target.style.display = 'block';
    target.classList.add('active');

    document.querySelectorAll('.nav-pill, .nav-btn').forEach(function (el) {
      el.classList.toggle('active', el.dataset.huudPendencias === '1');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function wire() {
    const buttons = document.querySelectorAll('[data-huud-pendencias]');
    if (!buttons.length) {
      setTimeout(wire, 150);
      return;
    }
    buttons.forEach(function (button) {
      button.onclick = openPendencias;
      button.title = 'Abrir Sala 00 • Realidade';
    });
  }

  function boot() {
    loadNavigationRouter(wire);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  function loadHomeV5() {
    if (document.querySelector('script[data-huud-home-v5]')) return;
    const script = document.createElement('script');
    script.src = 'huud-home-v5.js';
    script.dataset.huudHomeV5 = '1';
    document.body.appendChild(script);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHomeV5);
  } else {
    setTimeout(loadHomeV5, 0);
  }

  /* REGRA DE SALAS — TERRENO NÃO É QG MV. */
  const TERRAIN_TITLES = new Set([
    'Levantar R$ 1.500 para pagamento da taxa de transferência',
    'Conferir documentação final com o comprador do terreno',
    'Agendar assinatura em cartório para liberação dos recursos',
    'Destinar valor da venda diretamente para amortizar dívida crítica'
  ]);
  const TERRAIN_STORE = 'HUUD_TERRENO_PENDENCIAS_V1';
  const SOURCES = ['HUUD_PENDENCIAS_V1', 'HUUD_REALIDADE_V1'];

  function read(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value == null ? fallback : value;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  function isolateTerrain() {
    const moved = read(TERRAIN_STORE, []);
    const preserved = Array.isArray(moved) ? moved.slice() : [];
    const known = new Set(preserved.map(function (item) {
      return String(item && (item.title || item.name) || '').trim();
    }));

    SOURCES.forEach(function (key) {
      const list = read(key, null);
      if (!Array.isArray(list)) return;

      const keep = [];
      list.forEach(function (item) {
        const title = String(item && (item.title || item.name) || '').trim();
        if (TERRAIN_TITLES.has(title)) {
          if (!known.has(title)) {
            preserved.push(item);
            known.add(title);
          }
        } else {
          keep.push(item);
        }
      });

      if (keep.length !== list.length) write(key, keep);
    });

    if (preserved.length) write(TERRAIN_STORE, preserved);
  }

  function removeTerrainFromMVRoom() {
    const room = document.getElementById('view-land');
    if (!room) return;

    room.querySelectorAll('*').forEach(function (el) {
      if (el.children.length) return;
      const text = String(el.textContent || '').trim();
      if (!TERRAIN_TITLES.has(text)) return;

      const item = el.closest('.home-task-item, .cc2-ob, .mvop-attack, .task-item, li');
      if (item && item !== room) {
        item.remove();
      } else {
        el.remove();
      }
    });
  }

  function removeTerrainFromCommandCenter() {
    const terrain = function (text) {
      return TERRAIN_TITLES.has(String(text || '').trim());
    };

    function clean(root) {
      if (!root) return;

      root.querySelectorAll('.cc2-ob').forEach(function (card) {
        const title = card.querySelector('strong');
        if (title && terrain(title.textContent)) card.remove();
      });

      root.querySelectorAll('.cc2-command').forEach(function (command) {
        const title = command.querySelector('strong');
        if (title && terrain(title.textContent)) command.remove();
      });

      removeTerrainFromMVRoom();
    }

    clean(document);

    if (window.MutationObserver) {
      const old = window.__HUUD_TERRAIN_ISOLATION_OBSERVER;
      if (old) {
        try { old.disconnect(); } catch (e) {}
      }
      const observer = new MutationObserver(function () { clean(document); });
      observer.observe(document.body, { childList: true, subtree: true });
      window.__HUUD_TERRAIN_ISOLATION_OBSERVER = observer;
    }
  }

  const ROOM_MAP = {
    'realidade-v2': 'realidade-v2',
    'pendencias': 'pendencias',
    'debts': 'debts',
    'land': 'land',
    'tech': 'tech',
    'py': 'py'
  };

  function openRoom(roomId) {
    if (window.HUUD && typeof window.HUUD.navigate === 'function') {
      return window.HUUD.navigate(roomId);
    }

    const room = ROOM_MAP[String(roomId || '')] || String(roomId || '');

    if (room === 'realidade-v2' && window.HUUD_R2 && typeof window.HUUD_R2.open === 'function') {
      return window.HUUD_R2.open();
    }

    if (room === 'land' && typeof window.__MVA_OPEN === 'function') {
      return window.__MVA_OPEN();
    }

    if (window.HUUD && typeof window.HUUD.switchView === 'function') {
      return window.HUUD.switchView(room);
    }

    const target = document.getElementById('view-' + room);
    if (target) {
      document.querySelectorAll('.view').forEach(function (view) {
        view.style.display = 'none';
        view.classList.remove('active');
      });
      target.style.display = 'block';
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function wireHomeRooms() {
    document.querySelectorAll('.h5-module').forEach(function (card) {
      const onclick = card.getAttribute('onclick') || '';
      const match = onclick.match(/__HUUD_H5_OPEN\(['"]([^'"]+)['"]\)/);
      if (!match) return;
      const roomId = match[1];

      card.onclick = function () {
        openRoom(roomId);
      };
      card.dataset.huudRoom = roomId;
    });

    if (!document.getElementById('huud-tactical-room-hover')) {
      const style = document.createElement('style');
      style.id = 'huud-tactical-room-hover';
      style.textContent = `
        .h5-module {
          transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease, background .18s ease;
          will-change: transform;
        }
        .h5-module:hover,
        .h5-module:focus-visible {
          transform: translateY(-5px);
          border-color: var(--neon) !important;
          box-shadow: 0 0 0 1px rgba(170,255,0,.18), 0 0 18px rgba(170,255,0,.12);
          background: linear-gradient(145deg,#0d1210,#07090c);
        }
        .h5-module:hover .h5-link,
        .h5-module:focus-visible .h5-link {
          color: var(--neon);
        }
      `;
      document.head.appendChild(style);
    }
  }

  function bootHomeRoomFix() {
    wireHomeRooms();
    setTimeout(wireHomeRooms, 300);
    setTimeout(wireHomeRooms, 900);
    setTimeout(wireHomeRooms, 1800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootHomeRoomFix);
  } else {
    bootHomeRoomFix();
  }

  function enforceRoomSeparation() {
    isolateTerrain();
    removeTerrainFromCommandCenter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(enforceRoomSeparation, 0);
      setTimeout(enforceRoomSeparation, 700);
      setTimeout(enforceRoomSeparation, 1800);
    });
  } else {
    setTimeout(enforceRoomSeparation, 0);
    setTimeout(enforceRoomSeparation, 700);
    setTimeout(enforceRoomSeparation, 1800);
  }
})();
