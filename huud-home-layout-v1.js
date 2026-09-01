/* HUUD OS — HOME LAYOUT V1
   Ajustes de hierarquia visual:
   - Agenda fica imediatamente abaixo do banner inicial.
   - 56 Perguntas sai da Home.
   - Mar Verde ganha módulo próprio e entrada operacional.
*/
(function(){
  'use strict';

  function openMarVerde(){
    if(typeof window.__HUUD_HOME_OPEN_MV==='function') return window.__HUUD_HOME_OPEN_MV();
    if(typeof window.__MVA_OPEN==='function') return window.__MVA_OPEN();
  }

  function fixHome(){
    var flow=document.getElementById('view-flow');
    if(!flow) return;

    // 1. A agenda é o segundo elemento: logo abaixo do banner/hero.
    var agenda=document.getElementById('huud-home-command-agenda');
    var hero=flow.querySelector('.h41-hero');
    if(agenda && hero){
      hero.parentNode.insertBefore(agenda, hero.nextSibling);
    }

    // 2. As 56 perguntas deixam de ocupar espaço na Home.
    flow.querySelectorAll('.h41-module').forEach(function(card){
      var text=(card.textContent||'').toUpperCase();
      if(text.includes('56 PERGUNTAS')) card.remove();
    });

    // 3. Garante um módulo próprio da Mar Verde na Home.
    var modules=flow.querySelector('.h41-modules');
    if(modules && !Array.from(modules.querySelectorAll('.h41-module')).some(function(card){
      return (card.textContent||'').toUpperCase().includes('MAR VERDE');
    })){
      var card=document.createElement('article');
      card.className='h41-module';
      card.innerHTML='<div class="h41-num">03 // OPERAÇÃO</div><h3>MAR VERDE</h3><p>Agenda operacional da imobiliária. Captação, atendimento, visitas, negociação, fechamento e próximos passos.</p><span class="h41-link">OPERAR →</span>';
      card.addEventListener('click',openMarVerde);
      modules.appendChild(card);
    }

    // 4. Mantém a entrada inferior da Mar Verde sempre visível.
    var nav=document.querySelector('.sub-nav');
    if(nav){
      var pills=Array.from(nav.querySelectorAll('.nav-pill'));
      var mv=pills.find(function(btn){return (btn.textContent||'').toUpperCase().includes('MAR VERDE');});
      if(!mv){
        mv=pills.find(function(btn){return (btn.textContent||'').toUpperCase().includes('TERRENO');});
        if(mv){
          mv.textContent='MAR VERDE';
          mv.onclick=openMarVerde;
        }
      }
    }
  }

  function boot(){
    fixHome();
    setTimeout(fixHome,300);
    setTimeout(fixHome,900);
    setTimeout(fixHome,1800);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
