/* HUUD — Fix de navegação da Sala 00
   Não substitui o núcleo. Apenas garante que a Sala 00 possa ser aberta diretamente.
*/
(function () {
  'use strict';

  function openPendencias() {
    const target = document.getElementById('view-pendencias');
    if (!target) { setTimeout(openPendencias, 150); return; }
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
    if (!buttons.length) { setTimeout(wire, 150); return; }
    buttons.forEach(function (button) {
      button.onclick = openPendencias;
      button.title = 'Abrir Sala 00 • Realidade';
    });
  }

  function boot() { wire(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  function loadHomeV5() {
    if (document.querySelector('script[data-huud-home-v5]')) return;
    const script = document.createElement('script');
    script.src = 'huud-home-v5.js';
    script.dataset.huudHomeV5 = '1';
    document.body.appendChild(script);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadHomeV5);
  else setTimeout(loadHomeV5, 0);

  /* REGRA DE SALAS — TERRENO NÃO É QG MV. */
  const TERRAIN_TITLES = new Set([
    'Levantar R$ 1.500 para pagamento da taxa de transferência',
    'Conferir documentação final com o comprador do terreno',
    'Agendar assinatura em cartório para liberação dos recursos',
    'Destinar valor da venda diretamente para amortizar dívida crítica'
  ]);
  const TERRAIN_STORE = 'HUUD_TERRENO_PENDENCIAS_V1';
  const SOURCES = ['HUUD_PENDENCIAS_V1', 'HUUD_REALIDADE_V1'];
  const BLOCK_KEY = 'HUUD_MAR_VERDE_BLOCOS_V1';
  const AGENDA_KEY = 'HUUD_MAR_VERDE_AGENDA_V1';

  function read(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value == null ? fallback : value;
    } catch (e) { return fallback; }
  }

  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function titleOf(item) {
    return String(item && (item.title || item.name) || '').trim();
  }

  function isTerrain(item) {
    return TERRAIN_TITLES.has(titleOf(item));
  }

  function saveTerrain(item, preserved, known) {
    const title = titleOf(item);
    if (!title || known.has(title)) return;
    preserved.push(item);
    known.add(title);
  }

  function isolateTerrain() {
    const moved = read(TERRAIN_STORE, []);
    const preserved = Array.isArray(moved) ? moved.slice() : [];
    const known = new Set(preserved.map(titleOf));

    // 1. Retira os quatro itens das pendências gerais.
    SOURCES.forEach(function (key) {
      const list = read(key, null);
      if (!Array.isArray(list)) return;
      const keep = [];
      list.forEach(function (item) {
        if (isTerrain(item)) saveTerrain(item, preserved, known);
        else keep.push(item);
      });
      if (keep.length !== list.length) write(key, keep);
    });

    // 2. Retira os quatro itens dos BLOCOS OPERACIONAIS do QG MV.
    //    Este era o vazamento que fazia eles continuarem aparecendo mesmo
    //    depois de removidos de PENDÊNCIAS/REALIDADE.
    const blocks = read(BLOCK_KEY, null);
    if (blocks && typeof blocks === 'object' && !Array.isArray(blocks)) {
      let changed = false;
      Object.keys(blocks).forEach(function (day) {
        if (!Array.isArray(blocks[day])) return;
        const keep = [];
        blocks[day].forEach(function (item) {
          if (isTerrain(item)) {
            saveTerrain(item, preserved, known);
            changed = true;
          } else keep.push(item);
        });
        blocks[day] = keep;
      });
      if (changed) write(BLOCK_KEY, blocks);
    }

    // 3. Limpa a agenda legada somente dos quatro itens do Terreno.
    //    Assim o Command Center não consegue recriá-los caso os blocos sejam
    //    reconstruídos a partir da agenda.
    const agenda = read(AGENDA_KEY, null);
    if (Array.isArray(agenda)) {
      let changed = false;
      agenda.forEach(function (day) {
        ['dimas', 'rafa'].forEach(function (who) {
          if (!Array.isArray(day && day[who])) return;
          const keep = [];
          day[who].forEach(function (item) {
            const obj = typeof item === 'object' ? item : { title: item };
            if (isTerrain(obj)) {
              saveTerrain(obj, preserved, known);
              changed = true;
            } else keep.push(item);
          });
          day[who] = keep;
        });
      });
      if (changed) write(AGENDA_KEY, agenda);
    }

    if (preserved.length) write(TERRAIN_STORE, preserved);
  }

  function removeTerrainFromCommandCenter() {
    function clean(root) {
      if (!root) return;
      root.querySelectorAll('.cc2-ob').forEach(function (card) {
        const title = card.querySelector('strong');
        if (title && TERRAIN_TITLES.has(String(title.textContent || '').trim())) card.remove();
      });
      root.querySelectorAll('.cc2-command').forEach(function (command) {
        const title = command.querySelector('strong');
        if (title && TERRAIN_TITLES.has(String(title.textContent || '').trim())) command.remove();
      });
      // Fallback: remove qualquer bloco operacional que ainda contenha um
      // dos quatro títulos, mesmo que outra versão do Command Center use
      // uma classe diferente.
      root.querySelectorAll('.cc2-block').forEach(function (block) {
        const text = String(block.textContent || '').trim();
        for (const title of TERRAIN_TITLES) {
          if (text.includes(title)) { block.remove(); break; }
        }
      });
    }
    clean(document);
    if (window.MutationObserver) {
      const old = window.__HUUD_TERRAIN_ISOLATION_OBSERVER;
      if (old) try { old.disconnect(); } catch (e) {}
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
      setTimeout(enforceRoomSeparation, 500);
      setTimeout(enforceRoomSeparation, 1200);
      setTimeout(enforceRoomSeparation, 2500);
    });
  } else {
    setTimeout(enforceRoomSeparation, 0);
    setTimeout(enforceRoomSeparation, 500);
    setTimeout(enforceRoomSeparation, 1200);
    setTimeout(enforceRoomSeparation, 2500);
  }
})();
