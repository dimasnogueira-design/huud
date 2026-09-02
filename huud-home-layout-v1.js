/* HUUD OS — HOME / FIELD RECONCILIATION V7
   QG MV = sala operacional completa da Mar Verde.
   TERRENO = operação financeira pessoal.
   BLOCO = movimento essencial com hora + resultado + sala de ataque.
*/
(function(){
  'use strict';
  const FIN_KEY='HUUD_TERRENO_OP_V1', BLOCK_KEY='HUUD_MAR_VERDE_BLOCOS_V1', AGENDA_KEY='HUUD_MAR_VERDE_AGENDA_V1';
  const TERRAIN_TITLES=new Set([
    'Levantar R$ 1.500 para pagamento da taxa de transferência',
    'Conferir documentação final com o comprador do terreno',
    'Agendar assinatura em cartório para liberação dos recursos',
    'Destinar valor da venda diretamente para amortizar dívida crítica'
  ]);
  const terrain=[
    ['t1','Levantar R$ 1.500 para pagamento da taxa de transferência'],
    ['t2','Conferir documentação final com o comprador do terreno'],
    ['t3','Agendar assinatura em cartório para liberação dos recursos'],
    ['t4','Destinar valor da venda diretamente para amortizar dívida crítica']
  ];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read=(k,f)=>{try{const x=JSON.parse(localStorage.getItem(k)||'null');return x??f}catch(e){return f}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
  const isTerrainTitle=t=>TERRAIN_TITLES.has(String(t||'').trim());

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

  function classifyArea(b){
    const explicit=String(b?.area||b?.room||b?.view||'').toLowerCase();
    if(explicit.includes('debts')||explicit.includes('finan'))return 'debts';
    if(explicit.includes('tech')||explicit.includes('ia'))return 'tech';
    if(explicit.includes('py')||explicit.includes('paragu'))return 'py';
    if(explicit.includes('realidade')||explicit.includes('respons')||explicit.includes('pend'))return 'realidade';
    if(explicit.includes('mar-verde')||explicit.includes('mar verde')||explicit==='land')return 'mar-verde';
    const t=norm(b&&b.title);
    if(/TERRENO|CARTORIO|TRANSFERENCIA|AMORTIZAR|DIVIDA|PAGAMENTO|CAIXA|LIQUIDEZ/.test(t))return 'debts';
    if(/FACULDADE|ESTUDO|CODIGO|SUPABASE|\bIA\b|TECNOLOGIA/.test(t))return 'tech';
    if(/PARAGUAI/.test(t))return 'py';
    if(/PROCESSO|PENDENCIA|FAMILIA|DOCUMENTO PESSOAL|RESPONSABILIDADE/.test(t))return 'realidade';
    if(/REALIDADE|MAPA DA REALIDADE/.test(t))return 'realidade';
    if(/MAR VERDE|QG MV|LEAD|CAPTACAO|ATENDIMENTO|REATIVACAO|VISITA|IMOVEL|IMOBILIARIA|PROSPECCAO|NEGOCIACAO|VENDA/.test(t))return 'mar-verde';
    return 'mar-verde';
  }

  function migrateBlocks(){
    const current=read(BLOCK_KEY,null);
    if(!current||typeof current!=='object'||!Object.keys(current).length)return;
    const agenda=read(AGENDA_KEY,[]),targets={};
    if(Array.isArray(agenda))agenda.forEach(d=>{targets[d.day]=d.target||''});
    const migrated={};
    Object.keys(current).forEach(day=>{
      const arr=Array.isArray(current[day])?current[day]:[];
      migrated[day]=arr.filter(b=>b&&!isTerrainTitle(b.title)).slice(0,3).map((b,i)=>({
        ...b,
        id:b.id||('essential_'+day+'_'+i),
        essential:true,
        priority:'ESSENCIAL',
        result:b.result||targets[day]||'Resultado definido ao concluir o movimento.',
        area:classifyArea(b)
      }));
    });
    write(BLOCK_KEY,migrated);
  }

  function ensureMVAgendaView(){
    const land=document.getElementById('view-land');
    if(!land)return null;
    let v=document.getElementById('huud-mar-verde-view');
    if(!v){v=document.createElement('div');v.id='huud-mar-verde-view';land.appendChild(v)}
    return v;
  }

  function openMVAgenda(){
    try{
      if(typeof window.HUUD?.switchView==='function')window.HUUD.switchView('land');
    }catch(e){}
    const v=ensureMVAgendaView();
    if(v&&typeof window.__MVA_RENDER==='function'){
      try{window.__MVA_RENDER()}catch(e){}
    }
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function installMVNavigation(){
    if(window.__HUUD_MV_NAV_V7)return;
    const original=window.HUUD?.switchView;
    if(typeof original!=='function')return;
    window.__HUUD_MV_NAV_V7=true;
    window.HUUD.switchView=function(id){
      const result=original.apply(this,arguments);
      if(id==='land')setTimeout(openMVAgenda,0);
      return result;
    };
  }

  function fixHomeModules(){
    const flow=document.getElementById('view-flow');if(!flow)return;
    flow.querySelectorAll('.h5-module,.tactical-module-card').forEach(card=>{
      const text=(card.textContent||'').toUpperCase();
      if(text.includes('MAR VERDE')){
        const h=card.querySelector('h3,.card-title');if(h)h.textContent='QG MV // AGENDA OPERACIONAL';
        const p=card.querySelector('p');if(p)p.textContent='Mar Verde Imóveis. Agenda semanal, missões da Rafaella, comando do Dimas, execução e prestação de contas.';
        card.dataset.huudRoom='mar-verde';
        card.onclick=function(e){e.preventDefault();e.stopPropagation();openMVAgenda()};
      }else if(text.includes('TERRENO')){
        const h=card.querySelector('h3,.card-title');if(h)h.textContent='TERRENO // FINANÇAS';
        card.dataset.huudRoom='debts';
        card.onclick=function(e){e.preventDefault();e.stopPropagation();if(typeof window.HUUD?.switchView==='function')window.HUUD.switchView('debts')};
      }
    });
    flow.querySelectorAll('*').forEach(el=>{if(el.children.length)return;const t=(el.textContent||'').trim();if(/^MAR VERDE$/i.test(t))el.textContent='QG MV'});
  }

  function openBlockArea(block){
    const area=classifyArea(block||{});
    if(area==='mar-verde'){openMVAgenda();return}
    try{if(typeof window.HUUD?.switchView==='function')window.HUUD.switchView(area);else return}catch(e){return}
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function installBlockRouting(){
    if(window.__HUUD_BLOCK_ROUTING_V7)return;
    window.__HUUD_BLOCK_ROUTING_V7=true;
    document.addEventListener('click',function(e){
      const block=e.target.closest&&e.target.closest('.cc2-block,.h5-block');
      if(!block)return;
      if(e.target.closest('input,button,a,select,textarea'))return;
      e.preventDefault();
      const id=block.dataset.blockId||block.querySelector('.cc2-check')?.getAttribute('onchange')?.match(/check\('([^']+)'/)?.[1];
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

  function addStyles(){
    if(document.getElementById('huud-reconcile-v7-css'))return;
    const s=document.createElement('style');s.id='huud-reconcile-v7-css';s.textContent=`
      .huud-fin-op{margin:0 0 16px;border:1px solid #26303d;border-left:4px solid var(--blue-inflow);border-radius:13px;background:linear-gradient(135deg,#090c10,#07090c);padding:18px;box-shadow:0 8px 30px rgba(0,0,0,.18)}
      .huud-fin-op-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start}.huud-fin-k{font:900 .58rem var(--mono);letter-spacing:2px;color:var(--blue-inflow)}.huud-fin-op h2{font-size:1.35rem;margin:5px 0}.huud-fin-op p{font-size:.68rem;color:var(--text-muted);line-height:1.45}.huud-fin-badge{font:900 .52rem var(--mono);color:var(--blue-inflow);border:1px solid var(--blue-inflow);padding:7px 9px;border-radius:5px;white-space:nowrap}.huud-fin-list{display:grid;gap:7px;margin-top:14px}.huud-fin-item{display:flex;align-items:center;gap:9px;padding:10px;border:1px solid var(--border);background:var(--bg-card-elevated);border-radius:7px;font-size:.7rem;cursor:pointer}.huud-fin-item input{accent-color:var(--blue-inflow)}.huud-fin-item.done{opacity:.45;text-decoration:line-through}
      .cc2-block,.h5-block{cursor:pointer}.cc2-block:hover,.h5-block:hover{background:rgba(212,255,0,.035)}
      #huud-mar-verde-view{margin-top:0}
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
    ensureMVAgendaView();
    installMVNavigation();
    installBlockRouting();
    renderTerrain();
  }
  document.addEventListener('DOMContentLoaded',()=>{setTimeout(reconcile,0);setTimeout(reconcile,500);setTimeout(reconcile,1500);});
})();

/* HUUD OS — QG MV // OPERAÇÃO V2 HARDENING
   Mantém a operação semanal viva sem destruir a estrutura legada.
   IDs dos ataques são preservados em edição/movimentação para manter checks.
*/
(function(){
  'use strict';
  const KEY='HUUD_MAR_VERDE_OPERACAO_V1';
  const CHECK='HUUD_MAR_VERDE_AGENDA_V1_CHECKS';
  const REPORT='HUUD_MAR_VERDE_AGENDA_V1_REPORTS';
  const DAYS=['SEGUNDA','TERÇA','QUARTA','QUINTA','SEXTA','SÁBADO'];
  let selected=0;
  const read=(k,f)=>{try{const x=JSON.parse(localStorage.getItem(k)||'null');return x??f}catch(e){return f}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uid=()=>Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,7);
  const root=()=>document.getElementById('huud-mar-verde-view');
  const operation=()=>read(KEY,null);
  const checks=()=>read(CHECK,{});
  const reports=()=>read(REPORT,{});
  const ensure=()=>{const o=operation();if(!o||!Array.isArray(o.days)||o.days.length!==6)return null;o.days.forEach(d=>{if(!Array.isArray(d.attacks))d.attacks=[];d.attacks.forEach(a=>{if(!a.id)a.id=uid();if(!a.status)a.status='OPEN'})});write(KEY,o);return o};

  function styles(){
    if(document.getElementById('mvop-v2-css'))return;
    const s=document.createElement('style');s.id='mvop-v2-css';s.textContent=`
      #huud-mar-verde-view.mvop2{display:grid;gap:12px;padding:4px 0 38px}
      .mv2-head{border:1px solid #252d38;border-left:4px solid var(--neon);border-radius:14px;background:linear-gradient(135deg,#090c10,#05070a);padding:20px}.mv2-k{font:900 .56rem var(--mono);letter-spacing:2px;color:var(--neon)}.mv2-title{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;line-height:1;margin:7px 0}.mv2-title em{color:var(--neon);font-style:normal}.mv2-sub{max-width:900px;color:#8d99a9;font-size:.7rem;line-height:1.5}.mv2-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:14px}.mv2-btn{border:1px solid var(--neon);background:var(--neon);color:#000;border-radius:5px;padding:9px 12px;font:900 .54rem var(--mono);letter-spacing:1px;cursor:pointer}.mv2-btn.alt{background:transparent;color:var(--neon)}
      .mv2-week{display:grid;grid-template-columns:repeat(6,minmax(135px,1fr));gap:7px;overflow-x:auto}.mv2-day{min-width:135px;text-align:left;border:1px solid var(--border);background:var(--bg-card);border-radius:8px;padding:10px;cursor:pointer}.mv2-day.active{border-color:var(--neon);background:#0d1208;box-shadow:0 0 12px var(--neon-glow)}.mv2-day b{display:block;color:var(--neon);font:900 .53rem var(--mono);letter-spacing:1px}.mv2-day strong{display:block;font-size:.68rem;margin-top:4px}.mv2-day small{display:block;color:#687587;font:700 .48rem var(--mono);margin-top:5px}
      .mv2-grid{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(270px,.75fr);gap:12px}.mv2-panel{border:1px solid var(--border);border-radius:11px;background:var(--bg-card);overflow:hidden}.mv2-ph{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px;border-bottom:1px solid var(--border)}.mv2-ph strong{font-size:.82rem}.mv2-label{color:var(--neon);font:900 .52rem var(--mono);letter-spacing:1.4px}.mv2-target{padding:12px 16px;background:#0a0e13;border-bottom:1px solid var(--border);font-size:.68rem;color:#aeb7c3}.mv2-target b{display:block;color:#697789;font:900 .49rem var(--mono);margin-bottom:4px}.mv2-attacks{padding:9px;display:grid;gap:7px}.mv2-attack{display:grid;grid-template-columns:auto 1fr auto;gap:9px;align-items:center;border:1px solid var(--border);border-radius:8px;background:var(--bg-card-elevated);padding:10px}.mv2-attack.done{opacity:.45}.mv2-attack.done .mv2-atitle{text-decoration:line-through}.mv2-check{width:17px;height:17px;accent-color:var(--neon);cursor:pointer}.mv2-who{font:900 .48rem var(--mono);letter-spacing:1px;color:var(--neon);margin-bottom:3px}.mv2-atitle{font-size:.69rem;font-weight:750;line-height:1.35}.mv2-result{color:#687587;font:700 .49rem var(--mono);margin-top:4px}.mv2-move{border:1px solid #344052;background:transparent;color:#9ba5b4;border-radius:4px;padding:6px 7px;font:800 .47rem var(--mono);cursor:pointer}.mv2-add{margin:0 9px 9px;width:calc(100% - 18px);border:1px dashed #344052;background:transparent;color:#8d99a9;border-radius:7px;padding:9px;font:800 .5rem var(--mono);cursor:pointer}.mv2-score{display:grid;grid-template-columns:1fr 1fr;gap:7px;padding:9px}.mv2-stat{border:1px solid var(--border);border-radius:7px;padding:11px;background:var(--bg-card-elevated)}.mv2-stat b{display:block;color:#687587;font:900 .47rem var(--mono)}.mv2-stat strong{display:block;font:900 1.2rem var(--mono);margin-top:4px}.mv2-report{padding:10px 12px;border-top:1px solid var(--border)}.mv2-report label{display:block;color:#687587;font:900 .48rem var(--mono);letter-spacing:1px;margin:7px 0 4px}.mv2-report textarea{width:100%;box-sizing:border-box;min-height:72px;background:#080b0f;color:var(--text);border:1px solid var(--border);border-radius:6px;padding:8px;font:600 .6rem var(--mono);resize:vertical}
      .mv2-modal{position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:9999;display:grid;place-items:center;padding:18px}.mv2-dialog{width:min(520px,100%);border:1px solid #2b3542;border-radius:12px;background:#080b0f;padding:17px;box-shadow:0 20px 70px rgba(0,0,0,.55)}.mv2-dialog h3{margin:0 0 5px;font-size:1rem}.mv2-dialog p{color:#768294;font-size:.62rem}.mv2-select{width:100%;box-sizing:border-box;background:#05070a;color:var(--text);border:1px solid #303b49;border-radius:6px;padding:10px;font:700 .62rem var(--mono);margin:6px 0}.mv2-dialog-actions{display:flex;justify-content:flex-end;gap:7px;margin-top:12px}
      .mv2-edit{padding:10px;display:grid;gap:9px}.mv2-edit-day{border:1px solid var(--border);border-radius:8px;padding:12px;background:var(--bg-card-elevated)}.mv2-edit-day h4{margin:0 0 8px;color:var(--neon);font:900 .55rem var(--mono);letter-spacing:1px}.mv2-edit-day label{display:block;color:#758194;font:900 .48rem var(--mono);letter-spacing:1px;margin:7px 0 4px}.mv2-edit-day input,.mv2-edit-day textarea{width:100%;box-sizing:border-box;background:#080b0f;color:var(--text);border:1px solid var(--border);border-radius:5px;padding:8px;font:600 .6rem var(--mono)}.mv2-edit-day textarea{min-height:105px;resize:vertical}.mv2-note{padding:10px;color:#687587;font:600 .55rem var(--mono);line-height:1.45}
      @media(max-width:900px){.mv2-grid{grid-template-columns:1fr}.mv2-week{grid-template-columns:repeat(6,135px)}}
    `;document.head.appendChild(s);
  }

  function saveEdit(){
    const o=ensure();if(!o)return;
    for(let i=0;i<6;i++){
      const d=o.days[i];
      d.focus=document.getElementById('mv2_focus_'+i).value.trim();
      d.target=document.getElementById('mv2_target_'+i).value.trim();
      const old=d.attacks||[];
      const lines=document.getElementById('mv2_attacks_'+i).value.split('\n').map(x=>x.trim()).filter(Boolean);
      d.attacks=lines.map(line=>{
        const p=line.split('|').map(x=>x.trim());
        const who=(p[0]||'DIMAS').toUpperCase().includes('RAFA')?'RAFAELLA':'DIMAS';
        const title=p[1]||p[0]||'Ataque operacional';
        const prev=old.find(a=>a.who===who&&a.title===title);
        return {id:prev?.id||uid(),who,title,result:p[2]||prev?.result||'',status:prev?.status||'OPEN'};
      });
    }
    write(KEY,o);render();
  }

  function edit(){
    const o=ensure(),v=root();if(!o||!v)return;styles();
    v.className='mvop2';
    v.innerHTML=`<section class="mv2-head"><div class="mv2-k">QG MV // CONFIGURAÇÃO DA OPERAÇÃO</div><div class="mv2-title">EDITAR <em>OPERAÇÃO</em></div><div class="mv2-sub">Mude foco, alvo e ataques sem perder os IDs dos movimentos que continuam iguais. A estrutura legada permanece preservada.</div><div class="mv2-actions"><button class="mv2-btn" onclick="window.__MVO2_SAVE()">SALVAR OPERAÇÃO</button><button class="mv2-btn alt" onclick="window.__MVO2_RENDER()">CANCELAR</button></div></section><section class="mv2-panel mv2-edit">${o.days.map((d,i)=>`<div class="mv2-edit-day"><h4>${d.day}</h4><label>FOCO</label><input id="mv2_focus_${i}" value="${esc(d.focus)}"><label>ALVO / RESULTADO ESPERADO</label><input id="mv2_target_${i}" value="${esc(d.target)}"><label>ATAQUES — RESPONSÁVEL | ATAQUE | RESULTADO</label><textarea id="mv2_attacks_${i}">${esc((d.attacks||[]).map(a=>a.who+' | '+a.title+' | '+(a.result||'')).join('\n'))}</textarea></div>`).join('')}</section>`;
  }

  function addAttack(){
    const o=ensure(),d=o?.days[selected];if(!d)return;
    d.attacks.push({id:uid(),who:'DIMAS',title:'Novo ataque operacional',result:'Defina o resultado esperado.',status:'OPEN'});
    write(KEY,o);render();
  }

  function move(id){
    const o=ensure();let attack=null,from=-1;
    o.days.forEach((d,i)=>{const a=d.attacks.find(x=>x.id===id);if(a){attack=a;from=i}});
    if(!attack)return;
    const modal=document.createElement('div');modal.className='mv2-modal';
    modal.innerHTML=`<div class="mv2-dialog"><h3>MOVER ATAQUE</h3><p>Escolha o novo dia. O ataque e seu ID permanecem intactos.</p><select class="mv2-select" id="mv2_dest">${DAYS.map((d,i)=>`<option value="${d}" ${i===from?'selected':''}>${d}</option>`).join('')}</select><div class="mv2-dialog-actions"><button class="mv2-btn alt" id="mv2_cancel">CANCELAR</button><button class="mv2-btn" id="mv2_confirm">MOVER ATAQUE</button></div></div>`;
    document.body.appendChild(modal);
    modal.querySelector('#mv2_cancel').onclick=()=>modal.remove();
    modal.querySelector('#mv2_confirm').onclick=()=>{
      const dest=modal.querySelector('#mv2_dest').value,to=o.days.findIndex(d=>d.day===dest);
      if(to<0){modal.remove();return}
      o.days[from].attacks=o.days[from].attacks.filter(x=>x.id!==id);
      o.days[to].attacks.push(attack);write(KEY,o);selected=to;modal.remove();render();
    };
  }

  function toggle(id,val){const c=checks();c[id]=!!val;write(CHECK,c);render()}
  function report(day,who,val){const r=reports();r[day+'_'+who]=val;write(REPORT,r)}

  function render(){
    const o=ensure(),v=root();if(!o||!v)return;styles();
    const d=o.days[selected]||o.days[0],c=checks(),r=reports(),att=d.attacks||[],done=att.filter(a=>c[a.id]).length,total=att.length;
    v.className='mvop2';
    v.innerHTML=`<section class="mv2-head"><div class="mv2-k">QG MV // OPERAÇÃO DE ATAQUE</div><div class="mv2-title">MAR VERDE <em>OPERAÇÃO</em></div><div class="mv2-sub"><b>MISSÃO:</b> ${esc(o.mission)} &nbsp; <b>ALVO DA SEMANA:</b> ${esc(o.weeklyTarget)}</div><div class="mv2-actions"><button class="mv2-btn" onclick="window.__MVO2_EDIT()">EDITAR OPERAÇÃO</button><button class="mv2-btn alt" onclick="window.__MVO2_ADD()">+ NOVO ATAQUE</button></div></section><section class="mv2-week">${o.days.map((x,i)=>{const n=(x.attacks||[]).length,dc=(x.attacks||[]).filter(a=>c[a.id]).length;return `<button class="mv2-day ${i===selected?'active':''}" onclick="window.__MVO2_DAY(${i})"><b>${x.day}</b><strong>${esc(x.focus)}</strong><small>${dc}/${n} ATAQUES EXECUTADOS</small></button>`}).join('')}</section><section class="mv2-grid"><div class="mv2-panel"><div class="mv2-ph"><div><div class="mv2-label">${d.day}</div><strong>ATAQUES DO DIA</strong></div><span class="mv2-label">${done}/${total}</span></div><div class="mv2-target"><b>RESULTADO ESPERADO</b>${esc(d.target)}</div><div class="mv2-attacks">${att.length?att.map(a=>`<div class="mv2-attack ${c[a.id]?'done':''}"><input class="mv2-check" type="checkbox" ${c[a.id]?'checked':''} onchange="window.__MVO2_TOGGLE('${esc(a.id)}',this.checked)"><div><div class="mv2-who">${a.who}</div><div class="mv2-atitle">${esc(a.title)}</div>${a.result?`<div class="mv2-result">RESULTADO: ${esc(a.result)}</div>`:''}</div><button class="mv2-move" onclick="window.__MVO2_MOVE('${esc(a.id)}')">MOVER</button></div>`).join(''):'<div class="mv2-note">Nenhum ataque definido para este dia.</div>'}</div><button class="mv2-add" onclick="window.__MVO2_ADD()">+ ADICIONAR ATAQUE NESTE DIA</button></div><aside class="mv2-panel"><div class="mv2-ph"><div><div class="mv2-label">PLACAR</div><strong>OPERAÇÃO MV</strong></div></div><div class="mv2-score"><div class="mv2-stat"><b>EXECUTADOS</b><strong>${done}</strong></div><div class="mv2-stat"><b>RESTANTES</b><strong>${Math.max(0,total-done)}</strong></div><div class="mv2-stat"><b>RAFAELLA</b><strong>${att.filter(a=>a.who==='RAFAELLA').length}</strong></div><div class="mv2-stat"><b>DIMAS</b><strong>${att.filter(a=>a.who==='DIMAS').length}</strong></div></div><div class="mv2-report"><label>RELATÓRIO RAFAELLA // EXECUÇÃO</label><textarea oninput="window.__MVO2_REPORT('${esc(d.day)}','RAFAELLA',this.value)">${esc(r[d.day+'_RAFAELLA']||'')}</textarea><label>RELATÓRIO DIMAS // COMANDO</label><textarea oninput="window.__MVO2_REPORT('${esc(d.day)}','DIMAS',this.value)">${esc(r[d.day+'_DIMAS']||'')}</textarea></div></aside></section>`;
  }

  window.__MVO2_RENDER=render;window.__MVO2_EDIT=edit;window.__MVO2_SAVE=saveEdit;window.__MVO2_DAY=i=>{selected=Math.max(0,Math.min(5,Number(i)||0));render()};window.__MVO2_ADD=addAttack;window.__MVO2_MOVE=move;window.__MVO2_TOGGLE=toggle;window.__MVO2_REPORT=report;
  window.__MVO2_OPEN=()=>{try{window.HUUD?.switchView?.('land')}catch(e){}setTimeout(()=>{const v=root();if(v){render();window.scrollTo({top:0,behavior:'smooth'})}},0)};

  function hook(){
    if(!operation())return;
    window.__HUUD_MV_OPERATION_V2=true;
    window.__MVA_RENDER=render;
    window.__MVA_OPEN=window.__MVO2_OPEN;
    if(root())render();
  }
  document.addEventListener('DOMContentLoaded',()=>{setTimeout(hook,700);setTimeout(hook,1800);setTimeout(hook,3000)});
})();
