/* HUUD OS — HOME / FIELD RECONCILIATION V4
   TERRENO ≠ MAR VERDE.
   FINANÇAS = liquidez, terreno, dívidas e amortização.
   QG MV = somente Mar Verde Imóveis.
   BLOCO = movimento essencial com hora + resultado + área de ataque.
   ÍCONES/NAVEGAÇÃO INFERIOR: NÃO ALTERAR NESTA ETAPA.
*/
(function(){
  'use strict';
  const FIN_KEY='HUUD_TERRENO_OP_V1', BLOCK_KEY='HUUD_MAR_VERDE_BLOCOS_V1', AGENDA_KEY='HUUD_MAR_VERDE_AGENDA_V1';
  const terrain=[
    ['t1','Levantar R$ 1.500 para pagamento da taxa de transferência'],
    ['t2','Conferir documentação final com o comprador do terreno'],
    ['t3','Agendar assinatura em cartório para liberação dos recursos'],
    ['t4','Destinar valor da venda diretamente para amortizar dívida crítica']
  ];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read=(k,f)=>{try{const x=JSON.parse(localStorage.getItem(k)||'null');return x??f}catch(e){return f}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

  function renameNavigation(){
    document.querySelectorAll('.nav-pill,.nav-btn').forEach(el=>{
      const text=(el.textContent||'').trim().toUpperCase();
      if(text.includes('TERRENO')&&text.includes('MAR VERDE'))el.textContent='QG MV';
      if(text.includes('56 PERGUNTAS'))el.style.display='none';
    });
  }

  function renameLandRoom(){
    const v=document.getElementById('view-land'); if(!v)return;
    v.querySelectorAll('*').forEach(el=>{
      if(el.children.length)return;
      const t=(el.textContent||'').trim(); if(!t)return;
      if(/TERRENO\s*&\s*MAR\s*VERDE/i.test(t))el.textContent='QG MV';
      if(/^TERRENO\s*&\s*CAIXA$/i.test(t))el.textContent='MAR VERDE // OPERAÇÃO';
      if(/PONTE DE LIQUIDEZ/i.test(t))el.textContent='QG MV // COMANDO OPERACIONAL';
      if(/A imobiliária é uma máquina de gerar liquidez/i.test(t))el.textContent='A imobiliária é uma máquina de execução comercial.';
    });
  }

  function moveAttackBelowHero(){
    const flow=document.getElementById('view-flow'); if(!flow)return;
    const agenda=document.getElementById('huud-home-command-agenda'); if(!agenda)return;
    const hero=flow.querySelector('.h5-hero,.f1-hero,.room-header-banner');
    if(hero && agenda.previousElementSibling!==hero)hero.parentNode.insertBefore(agenda,hero.nextSibling);
  }

  function migrateBlocks(){
    const current=read(BLOCK_KEY,null);
    if(!current||typeof current!=='object'||!Object.keys(current).length)return;
    const all=Object.values(current).flat().filter(Boolean);
    const agenda=read(AGENDA_KEY,[]),targets={};
    if(Array.isArray(agenda))agenda.forEach(d=>{targets[d.day]=d.target||''});
    const migrated={};
    Object.keys(current).forEach(day=>{
      const arr=Array.isArray(current[day])?current[day]:[];
      migrated[day]=arr.slice(0,3).map((b,i)=>({
        ...b,
        id:b.id||('essential_'+day+'_'+i),
        essential:true,
        priority:'ESSENCIAL',
        result:b.result||targets[day]||'Resultado definido ao concluir o movimento.',
        area:b.area||'land'
      }));
    });
    write(BLOCK_KEY,migrated);
  }

  function blockArea(b){
    if(b&&b.area)return b.area;
    const t=String((b&&b.title)||'').toUpperCase();
    if(/TERRENO|CARTÓRIO|TRANSFERÊNCIA|AMORTIZAR|DÍVIDA|PAGAMENTO|CAIXA|LIQUIDEZ/.test(t))return 'debts';
    if(/FACULDADE|ESTUDO|CÓDIGO|CODIGO|SUPABASE|IA|TECNOLOGIA/.test(t))return 'tech';
    if(/PARAGUAI/.test(t))return 'py';
    if(/PROCESSO|PENDÊNCIA|PENDENCIA|FAMÍLIA|FAMILIA|DOCUMENTO PESSOAL/.test(t))return 'realidade';
    return 'land';
  }

  function openBlockArea(block){
    const area=blockArea(block||{});
    try{if(typeof window.HUUD?.switchView==='function')window.HUUD.switchView(area);else return;}catch(e){return;}
    window.scrollTo(0,0);
    if(area==='land' && typeof window.__MVA_OPEN==='function'){
      try{window.__MVA_OPEN()}catch(e){}
    }
  }

  function installBlockRouting(){
    if(window.__HUUD_BLOCK_ROUTING_V4)return;
    window.__HUUD_BLOCK_ROUTING_V4=true;
    document.addEventListener('click',function(e){
      const block=e.target.closest&&e.target.closest('.cc2-block');
      if(!block)return;
      if(e.target.closest('input,button,a,select,textarea'))return;
      e.preventDefault();
      const id=block.querySelector('.cc2-check')?.getAttribute('onchange')?.match(/check\('([^']+)'/)?.[1];
      if(!id)return;
      const data=read(BLOCK_KEY,{}),all=Object.values(data).flat();
      const b=all.find(x=>String(x?.id)===String(id));
      if(b)openBlockArea(b);
    });
  }

  function terrainState(){return read(FIN_KEY,{})}
  function saveTerrain(id,value){const s=terrainState();s[id]=!!value;write(FIN_KEY,s);renderTerrain()}
  function terrainHTML(){
    const s=terrainState();
    return `<section id="huud-terreno-finance" class="huud-fin-op"><div class="huud-fin-op-head"><div><div class="huud-fin-k">FINANÇAS & DÍVIDAS // ENTRADA</div><h2>OPERAÇÃO TERRENO & CAIXA</h2><p>Venda do terreno pessoal. Operação de liquidez independente da Mar Verde Imóveis.</p></div><div class="huud-fin-badge">TERRENO ≠ QG MV</div></div><div class="huud-fin-list">${terrain.map(([id,text])=>`<label class="huud-fin-item ${s[id]?'done':''}"><input type="checkbox" ${s[id]?'checked':''} data-terrain="${id}"><span>${esc(text)}</span></label>`).join('')}</div></section>`;
  }
  function renderTerrain(){
    const view=document.getElementById('view-debts');if(!view)return;
    let box=document.getElementById('huud-terreno-finance');if(!box){box=document.createElement('div');box.id='huud-terreno-finance';view.insertBefore(box,view.firstChild)}
    box.outerHTML=terrainHTML();
    document.querySelectorAll('[data-terrain]').forEach(el=>el.addEventListener('change',()=>saveTerrain(el.dataset.terrain,el.checked)));
  }

  function fixHomeModules(){
    const flow=document.getElementById('view-flow');if(!flow)return;
    flow.querySelectorAll('.h5-module,.tactical-module-card').forEach(card=>{
      const text=(card.textContent||'').toUpperCase();
      if(text.includes('MAR VERDE')||text.includes('TERRENO')){
        const h=card.querySelector('h3,.card-title');if(h)h.textContent='QG MV';card.dataset.huudRoom='land';
      }
    });
    flow.querySelectorAll('*').forEach(el=>{if(el.children.length)return;const t=(el.textContent||'').trim();if(/^MAR VERDE$/i.test(t))el.textContent='QG MV';});
  }

  function addStyles(){
    if(document.getElementById('huud-reconcile-v4-css'))return;
    const s=document.createElement('style');s.id='huud-reconcile-v4-css';s.textContent=`
      .huud-fin-op{margin:0 0 16px;border:1px solid #26303d;border-left:4px solid var(--blue-inflow);border-radius:13px;background:linear-gradient(135deg,#090c10,#07090c);padding:18px;box-shadow:0 8px 30px rgba(0,0,0,.18)}
      .huud-fin-op-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start}.huud-fin-k{font:900 .58rem var(--mono);letter-spacing:2px;color:var(--blue-inflow)}.huud-fin-op h2{font-size:1.35rem;margin:5px 0}.huud-fin-op p{font-size:.68rem;color:var(--text-muted);line-height:1.45}.huud-fin-badge{font:900 .52rem var(--mono);color:var(--blue-inflow);border:1px solid var(--blue-inflow);padding:7px 9px;border-radius:5px;white-space:nowrap}.huud-fin-list{display:grid;gap:7px;margin-top:14px}.huud-fin-item{display:flex;align-items:center;gap:9px;padding:10px;border:1px solid var(--border);background:var(--bg-card-elevated);border-radius:7px;font-size:.7rem;cursor:pointer}.huud-fin-item input{accent-color:var(--blue-inflow)}.huud-fin-item.done{opacity:.45;text-decoration:line-through}
      .cc2-block{cursor:pointer}.cc2-block:hover{background:rgba(212,255,0,.035)}.cc2-block::after{content:'ABRIR →';font:900 .48rem var(--mono);color:var(--text-muted);white-space:nowrap;margin-left:4px}.cc2-block:hover::after{color:var(--neon)}
      @media(max-width:650px){.huud-fin-op-head{flex-direction:column}.huud-fin-badge{align-self:flex-start}}
    `;document.head.appendChild(s);
  }

  function reconcile(){
    addStyles();
    migrateBlocks();
    renameNavigation();
    fixHomeModules();
    moveAttackBelowHero();
    renameLandRoom();
    installBlockRouting();
    renderTerrain();
  }
  document.addEventListener('DOMContentLoaded',()=>{setTimeout(reconcile,0);setTimeout(reconcile,500);setTimeout(reconcile,1500);});
})();
