/* HUUD — Fix de navegação da Sala 00
   Não substitui o núcleo. Apenas garante que a Sala 00 possa ser aberta diretamente.
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

  // HOME V5: entra por último para que a nova Home prevaleça sobre as versões anteriores.
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
})();
