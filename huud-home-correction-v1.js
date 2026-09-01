/* HUUD OS — CORREÇÃO HOME V2.0
   Ordem oficial da Home:
   BANNER → AGENDA DO DIA → MAR VERDE → SISTEMAS.
   56 perguntas ficam fora da navegação principal.
   Navegação inferior prioriza QG, Mar Verde, Comandante e Responsabilidades.
*/
(function(){
  'use strict';

  function navButtons(){return Array.from(document.querySelectorAll('.sub-nav .nav-pill'));}

  function setActiveButton(btn){
    navButtons().forEach(function(b){b.classList.remove('active');b.removeAttribute('aria-current');});
    if(btn){btn.classList.add('active');btn.setAttribute('aria-current','page');}
  }

  function setActiveMenu(target){
    const btn=navButtons().find(function(b){
      const t=(b.textContent||'').trim().toUpperCase();
      if(target==='mar-verde') return t.includes('MAR VERDE');
      if(target==='qg') return t==='QG'||t.includes('PRINCIPAL')||t.includes('HOJE');
      return t.includes(String(target||'').toUpperCase());
    });
    if(btn)setActiveButton(btn);
  }

  function openMarVerde(){
    const flow=document.getElementById('view-flow');if(!flow)return;
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));flow.classList.add('active');
    let v=document.getElementById('huud-mar-verde-view');
    if(!v){v=document.createElement('div');v.id='huud-mar-verde-view';flow.innerHTML='';flow.appendChild(v);}
    if(typeof window.__MVA_RENDER==='function')window.__MVA_RENDER();
    else v.innerHTML='<section style="padding:30px;border:1px solid var(--border);border-left:4px solid var(--neon);border-radius:10px;background:var(--bg-card)"><div style="color:var(--neon);font:900 .65rem var(--mono);letter-spacing:2px">MAR VERDE</div><h2 style="margin:8px 0">Agenda operacional indisponível</h2><p style="color:var(--text-muted)">Recarregue o HUUD.</p></section>';
    setActiveMenu('mar-verde');window.scrollTo({top:0,behavior:'smooth'});
  }

  function openQG(){
    try{if(typeof window.__HUUD_H41_OPEN==='function')window.__HUUD_H41_OPEN('flow');else if(window.HUUD?.switchView)window.HUUD.switchView('flow');}
    catch(e){if(window.HUUD?.switchView)window.HUUD.switchView('flow');}
    setTimeout(()=>setActiveMenu('qg'),80);
  }

  window.__MVA_OPEN=openMarVerde;
  window.__HUUD_HOME_OPEN_MV=openMarVerde;
  window.__HUUD_HOME_OPEN_QG=openQG;

  function patchNav(){
    navButtons().forEach(btn=>{
      const t=(btn.textContent||'').trim().toUpperCase();
      if(t.includes('TERRENO')){btn.textContent='MAR VERDE';btn.onclick=openMarVerde;}
      if(t.includes('56 PERGUNTAS')||t.includes('56 PERGUNTA')){btn.style.display='none';btn.setAttribute('aria-hidden','true');}
      if(btn.__HUUD_ACTIVE_PATCHED)return;
      btn.__HUUD_ACTIVE_PATCHED=true;
      // NÃO usa capture e NÃO transforma todos os menus em QG.
      btn.addEventListener('click',function(){
        if((btn.textContent||'').trim().toUpperCase().includes('MAR VERDE')){
          setTimeout(openMarVerde,0);
          return;
        }
        // Deixa o handler original trocar a view. Só sincroniza o estado visual com o botão clicado.
        setTimeout(function(){setActiveButton(btn);},70);
      },false);
    });
  }

  function marVerdeHTML(){return '<div class="card-header-row"><span class="card-tag">● MAR VERDE // OPERAÇÃO</span><span class="card-action-link" id="huud-home-mv-link">AGENDA →</span></div><div style="font-size:1.05rem;font-weight:900;margin:5px 0 7px;">Agenda Operacional</div><div style="font-size:0.74rem;line-height:1.55;color:var(--text-muted);"><strong style="color:var(--text);">RAFAELLA</strong> — captação + atendimento + reativação de leads.<br><strong style="color:var(--text);">DIMAS</strong> — comando + gestão + negociação + fechamento.</div><div style="margin-top:12px;padding:9px;border-left:3px solid var(--neon);background:rgba(212,255,0,.04);font-size:.64rem;line-height:1.45;color:#aeb8c5;">MISSÃO → EXECUÇÃO → RESULTADO → PRÓXIMO PASSO</div><button class="btn-action-neon" id="huud-home-mv-btn" style="margin-top:12px;padding:10px;font-size:.65rem;">ABRIR AGENDA MAR VERDE →</button>'}

  function bindMarVerde(card){
    card.querySelector('#huud-home-mv-link')?.addEventListener('click',openMarVerde);
    card.querySelector('#huud-home-mv-btn')?.addEventListener('click',openMarVerde);
  }

  function mountMarVerdeAfterAgenda(){
    const flow=document.getElementById('view-flow');
    if(!flow)return;
    const agenda=document.getElementById('huud-home-command-agenda');
    if(!agenda)return;

    // Remove versões antigas do bloco que possam ter sido deixadas acima do banner.
    document.querySelectorAll('#huud-home-mar-verde-card').forEach(el=>el.remove());
    document.querySelectorAll('.huud-home-mar-verde-block').forEach(el=>el.remove());

    const block=document.createElement('section');
    block.id='huud-home-mar-verde-card';
    block.className='tactical-module-card huud-home-mar-verde-block';
    block.style.marginBottom='18px';
    block.innerHTML=marVerdeHTML();
    agenda.insertAdjacentElement('afterend',block);
    bindMarVerde(block);
  }

  function fixAgendaOrder(){
    const flow=document.getElementById('view-flow');
    const agenda=document.getElementById('huud-home-command-agenda');
    if(!flow||!agenda)return;

    // O Command Center antigo usava insertBefore(..., firstChild), colocando a agenda acima do banner.
    // A regra correta é: banner primeiro, agenda imediatamente depois.
    const hero=flow.querySelector('.h5-hero, .f1-hero, .room-header-banner');
    if(hero && hero.parentElement){
      const parent=hero.parentElement;
      if(agenda.parentElement!==parent || agenda.previousElementSibling!==hero){
        hero.insertAdjacentElement('afterend',agenda);
      }
    }else if(flow.firstElementChild!==agenda){
      flow.insertBefore(agenda,flow.firstElementChild);
    }
    mountMarVerdeAfterAgenda();
  }

  function addResponsibilities(){
    const flow=document.querySelector('#view-flow');if(!flow||document.getElementById('huud-home-responsabilidades'))return;
    const block=flow.querySelector('.h5-modules');
    if(!block)return;
    const card=document.createElement('article');
    card.id='huud-home-responsabilidades';card.className='h5-module';
    card.innerHTML='<div class="h5-num">08 // RESPONSABILIDADES</div><h3>Pendências & Processos</h3><p>Processos, faculdade, documentos, compromissos e assuntos pessoais ou familiares que exigem ação real.</p><span class="h5-link">ABRIR →</span>';
    card.addEventListener('click',()=>{if(window.HUUD?.switchView)window.HUUD.switchView('pendencias');});
    block.appendChild(card);
  }

  function addBottomNav(){
    if(document.getElementById('huud-command-bottom-nav'))return;
    const style=document.createElement('style');style.id='huud-bottom-nav-style';style.textContent=`
      #huud-command-bottom-nav{position:fixed;left:0;right:0;bottom:0;height:66px;z-index:999;background:rgba(4,5,7,.97);backdrop-filter:blur(14px);border-top:1px solid var(--border);display:grid;grid-template-columns:repeat(4,1fr);padding:5px 8px calc(5px + env(safe-area-inset-bottom));gap:4px}
      #huud-command-bottom-nav button{border:0;background:transparent;color:var(--text-muted);font:800 .53rem var(--mono);letter-spacing:.6px;border-radius:7px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;cursor:pointer}
      #huud-command-bottom-nav button .bn-icon{font-size:1.15rem;line-height:1}
      #huud-command-bottom-nav button.active{background:var(--neon);color:#000;box-shadow:0 0 12px var(--neon-glow)}
    `;document.head.appendChild(style);
    const nav=document.createElement('nav');nav.id='huud-command-bottom-nav';
    nav.innerHTML='<button data-bn="qg"><span class="bn-icon">⌂</span><span>QG</span></button><button data-bn="mar-verde"><span class="bn-icon">▣</span><span>MAR VERDE</span></button><button data-bn="comandante"><span class="bn-icon">⚔</span><span>COMANDANTE</span></button><button data-bn="responsabilidades"><span class="bn-icon">!</span><span>RESPONS.</span></button>';
    document.body.appendChild(nav);
    nav.querySelector('[data-bn="qg"]').onclick=openQG;
    nav.querySelector('[data-bn="mar-verde"]').onclick=openMarVerde;
    nav.querySelector('[data-bn="comandante"]').onclick=()=>{if(window.HUUD_CC2?.openCommander)window.HUUD_CC2.openCommander();else if(window.HUUD?.openCommander)window.HUUD.openCommander();};
    nav.querySelector('[data-bn="responsabilidades"]').onclick=()=>{if(window.HUUD?.switchView)window.HUUD.switchView('pendencias');};
  }

  function syncBottomActive(){
    const active=navButtons().find(b=>b.classList.contains('active'));
    const t=(active?.textContent||'').toUpperCase();
    document.querySelectorAll('#huud-command-bottom-nav button').forEach(b=>b.classList.remove('active'));
    const key=t.includes('MAR VERDE')?'mar-verde':t.includes('PEND')||t.includes('RESP')?'responsabilidades':'qg';
    document.querySelector(`#huud-command-bottom-nav [data-bn="${key}"]`)?.classList.add('active');
  }

  function run(){
    patchNav();
    fixAgendaOrder();
    addResponsibilities();
    addBottomNav();
    syncBottomActive();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,180));else setTimeout(run,180);
  [500,1000,1800,3000].forEach(ms=>setTimeout(run,ms));
})();
