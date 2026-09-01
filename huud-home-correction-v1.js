/* HUUD OS — CORREÇÃO HOME V1.4
   Home/QG: banner primeiro, agenda imediatamente abaixo, Mar Verde depois.
   56 perguntas não fazem parte da navegação principal.
*/
(function(){
  'use strict';
  function navButtons(){return Array.from(document.querySelectorAll('.sub-nav .nav-pill'));}
  function setActiveMenu(target){
    navButtons().forEach(function(btn){btn.classList.remove('active');btn.removeAttribute('aria-current');});
    navButtons().forEach(function(btn){
      var text=(btn.textContent||'').trim().toUpperCase();
      if((target==='mar-verde'&&text.includes('MAR VERDE'))||(target==='qg'&&(text==='QG'||text.includes('PRINCIPAL')||text.includes('HOJE')))){btn.classList.add('active');btn.setAttribute('aria-current','page');}
    });
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
  function openQG(){try{if(typeof window.__HUUD_H41_OPEN==='function')window.__HUUD_H41_OPEN('flow');else if(window.HUUD?.switchView)window.HUUD.switchView('flow');}catch(e){if(window.HUUD?.switchView)window.HUUD.switchView('flow');}setTimeout(()=>setActiveMenu('qg'),60);}
  window.__MVA_OPEN=openMarVerde;window.__HUUD_HOME_OPEN_MV=openMarVerde;window.__HUUD_HOME_OPEN_QG=openQG;
  function patchNav(){
    navButtons().forEach(btn=>{const t=(btn.textContent||'').trim();if(t.includes('TERRENO')){btn.textContent='MAR VERDE';btn.onclick=openMarVerde;}});
    navButtons().forEach(btn=>{if(btn.__HUUD_ACTIVE_PATCHED)return;btn.__HUUD_ACTIVE_PATCHED=true;btn.addEventListener('click',()=>setTimeout(()=>{const text=(btn.textContent||'').trim().toUpperCase();setActiveMenu(text.includes('MAR VERDE')?'mar-verde':'qg');},30),true);});
    navButtons().forEach(btn=>{const t=(btn.textContent||'').toUpperCase();if(t.includes('56 PERGUNTAS')||t.includes('56 PERGUNTA')){btn.style.display='none';btn.setAttribute('aria-hidden','true');}});
  }
  function marVerdeHTML(){return '<div class="card-header-row"><span class="card-tag">● MAR VERDE // OPERAÇÃO</span><span class="card-action-link" id="huud-home-mv-link">AGENDA →</span></div><div style="font-size:1.05rem;font-weight:900;margin:5px 0 7px;">Agenda Operacional</div><div style="font-size:0.74rem;line-height:1.55;color:var(--text-muted);"><strong style="color:var(--text);">RAFAELLA</strong> — captação + atendimento + reativação de leads.<br><strong style="color:var(--text);">DIMAS</strong> — comando + gestão + negociação + fechamento.</div><div style="margin-top:12px;padding:9px;border-left:3px solid var(--neon);background:rgba(212,255,0,.04);font-size:.64rem;line-height:1.45;color:#aeb8c5;">MISSÃO → EXECUÇÃO → RESULTADO → PRÓXIMO PASSO</div><button class="btn-action-neon" id="huud-home-mv-btn" style="margin-top:12px;padding:10px;font-size:.65rem;">ABRIR AGENDA MAR VERDE →</button>'}
  function bindMarVerde(card){
    card.querySelector('#huud-home-mv-link')?.addEventListener('click',openMarVerde);
    card.querySelector('#huud-home-mv-btn')?.addEventListener('click',openMarVerde);
  }
  function patchHome(){
    const flow=document.getElementById('view-flow');const grid=flow?.querySelector('.dashboard-tactical-grid');if(!flow||!grid)return;
    const agenda=document.getElementById('huud-home-command-agenda');
    let oldLand=Array.from(grid.children).find(card=>{const t=card.textContent||'';return t.includes('OPERAÇÃO TERRENO & CAIXA')||t.includes('Terreno & Caixa')||t.includes('liberar a comissão')||t.includes('MAR VERDE // OPERAÇÃO');});
    if(!oldLand){
      oldLand=document.createElement('div');oldLand.className='tactical-module-card';oldLand.id='huud-home-mar-verde-card';oldLand.innerHTML=marVerdeHTML();
      grid.appendChild(oldLand);
    }else{
      oldLand.innerHTML=marVerdeHTML();
    }
    bindMarVerde(oldLand);
    if(agenda){
      // REGRA FIXA: o bloco Mar Verde fica imediatamente abaixo do COMANDO DE HOJE.
      agenda.insertAdjacentElement('afterend',oldLand);
    }
    document.querySelectorAll('#view-flow .card-tag').forEach(el=>{if((el.textContent||'').trim().includes('TERRENO'))el.textContent='● MAR VERDE // OPERAÇÃO';});
  }
  function addResponsibilities(){
    const grid=document.querySelector('#view-flow .dashboard-tactical-grid');if(!grid||document.getElementById('huud-home-responsabilidades'))return;
    const card=document.createElement('div');card.id='huud-home-responsabilidades';card.className='tactical-module-card';card.innerHTML='<div class="card-header-row"><span class="card-tag">● RESPONSABILIDADES</span><span class="card-action-link">ABRIR →</span></div><div style="font-size:1.05rem;font-weight:900;margin:5px 0 7px;">Pendências & Processos</div><div style="font-size:.74rem;line-height:1.55;color:var(--text-muted);">Processos, faculdade, documentos, compromissos e assuntos pessoais ou familiares que exigem ação real.</div><div style="margin-top:12px;padding:9px;border-left:3px solid var(--danger);background:rgba(255,42,75,.04);font-size:.64rem;line-height:1.45;color:#aeb8c5;">NÃO ESQUECER. NÃO ADIAR. DAR PRÓXIMO PASSO.</div><button class="btn-action-neon" style="margin-top:12px;padding:10px;font-size:.65rem;">VER RESPONSABILIDADES →</button>';
    grid.appendChild(card);const open=()=>{if(window.HUUD?.switchView)window.HUUD.switchView('pendencias');};card.querySelector('.card-action-link').onclick=open;card.querySelector('button').onclick=open;
  }
  function run(){patchNav();patchHome();addResponsibilities();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,120));else setTimeout(run,120);
  setTimeout(run,700);setTimeout(run,1600);setTimeout(run,3000);
})();