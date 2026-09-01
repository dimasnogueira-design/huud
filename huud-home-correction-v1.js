/* HUUD OS — CORREÇÃO HOME V1
   A HOME precisa refletir a arquitetura atual:
   - MAR VERDE é operação própria, não "Terreno & Caixa".
   - A agenda é comando operacional compartilhado, não CRM/pipeline.
   - RESPONSABILIDADES abriga processos, faculdade, documentos e pendências sérias.
*/
(function(){
  'use strict';

  function openMarVerde(){
    if(typeof window.__MVA_OPEN==='function') return window.__MVA_OPEN();
    if(typeof window.__HUUD_H41_OPEN==='function') return window.__HUUD_H41_OPEN('mar-verde');
    if(window.HUUD && typeof window.HUUD.switchView==='function') return window.HUUD.switchView('land');
  }

  function patchNav(){
    document.querySelectorAll('.sub-nav .nav-pill').forEach(function(btn){
      const t=(btn.textContent||'').trim();
      if(t.includes('TERRENO')){
        btn.textContent='MAR VERDE';
        btn.onclick=openMarVerde;
      }
    });
  }

  function patchHome(){
    const grid=document.querySelector('#view-flow .dashboard-tactical-grid');
    if(!grid) return;

    // O bloco antigo de Terreno deixa de representar o HUUD atual.
    const cards=[...grid.children];
    const oldLand=cards.find(function(card){return (card.textContent||'').includes('OPERAÇÃO TERRENO & CAIXA') || (card.textContent||'').includes('Terreno & Caixa') || (card.textContent||'').includes('liberar a comissão')});
    if(oldLand){
      oldLand.innerHTML=`
        <div class="card-header-row">
          <span class="card-tag">● MAR VERDE // OPERAÇÃO</span>
          <span class="card-action-link" id="huud-home-mv-link">AGENDA →</span>
        </div>
        <div style="font-size:1.05rem;font-weight:900;margin:5px 0 7px;">Agenda Operacional</div>
        <div style="font-size:0.74rem;line-height:1.55;color:var(--text-muted);">
          <strong style="color:var(--text);">RAFAELLA</strong> — captação + atendimento + reativação de leads.<br>
          <strong style="color:var(--text);">DIMAS</strong> — comando + gestão + negociação + fechamento.
        </div>
        <div style="margin-top:12px;padding:9px;border-left:3px solid var(--neon);background:rgba(212,255,0,.04);font-size:.64rem;line-height:1.45;color:#aeb8c5;">
          MISSÃO → EXECUÇÃO → RESULTADO → PRÓXIMO PASSO
        </div>
        <button class="btn-action-neon" id="huud-home-mv-btn" style="margin-top:12px;padding:10px;font-size:.65rem;">ABRIR AGENDA MAR VERDE →</button>`;
      const link=document.getElementById('huud-home-mv-link');
      const button=document.getElementById('huud-home-mv-btn');
      if(link) link.onclick=openMarVerde;
      if(button) button.onclick=openMarVerde;
    }

    // Identidade da sala na navegação antiga.
    document.querySelectorAll('#view-flow .card-tag').forEach(function(el){
      const t=(el.textContent||'').trim();
      if(t.includes('TERRENO')) el.textContent='● MAR VERDE // OPERAÇÃO';
    });
  }

  function addResponsibilities(){
    const grid=document.querySelector('#view-flow .dashboard-tactical-grid');
    if(!grid || document.getElementById('huud-home-responsabilidades')) return;
    const card=document.createElement('div');
    card.id='huud-home-responsabilidades';
    card.className='tactical-module-card';
    card.innerHTML=`
      <div class="card-header-row">
        <span class="card-tag">● RESPONSABILIDADES</span>
        <span class="card-action-link" onclick="HUUD.switchView('pendencias')">ABRIR →</span>
      </div>
      <div style="font-size:1.05rem;font-weight:900;margin:5px 0 7px;">Pendências & Processos</div>
      <div style="font-size:.74rem;line-height:1.55;color:var(--text-muted);">
        Processos, faculdade, documentos, compromissos e assuntos pessoais ou familiares que exigem ação real.
      </div>
      <div style="margin-top:12px;padding:9px;border-left:3px solid var(--danger);background:rgba(255,42,75,.04);font-size:.64rem;line-height:1.45;color:#aeb8c5;">
        NÃO ESQUECER. NÃO ADIAR. DAR PRÓXIMO PASSO.
      </div>
      <button class="btn-action-neon" style="margin-top:12px;padding:10px;font-size:.65rem;" onclick="HUUD.switchView('pendencias')">VER RESPONSABILIDADES →</button>`;
    grid.appendChild(card);
  }

  function run(){
    patchNav();
    patchHome();
    addResponsibilities();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(run,120);});
  else setTimeout(run,120);
  setTimeout(run,700);
  setTimeout(run,1600);
})();
