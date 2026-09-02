/* HUUD — Fix de navegação da Sala 00 + separação de salas
   Não substitui o núcleo. Apenas garante que a Sala 00 possa ser aberta diretamente
   e que itens pessoais do Terreno não apareçam dentro do QG MV.
*/
(function () {
  'use strict';

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
    wire();
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

  /*
   * O problema real identificado: os quatro itens também estavam no HTML
   * legado da própria sala view-land. Portanto não basta limpar localStorage.
   * Esta rotina remove somente esses quatro nós do QG MV, sem tocar no restante.
   */
  function removeTerrainFromMVRoom() {
    const room = document.getElementById('view-land');
    if (!room) return;

    room.querySelectorAll('*').forEach(function (el) {
      if (el.children.length) return;
      const text = String(el.textContent || '').trim();
      if (!TERRAIN_TITLES.has(text)) return;

      // Remove o card/item inteiro quando houver um contêiner próprio.
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
