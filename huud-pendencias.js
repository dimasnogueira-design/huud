/* HUUD — Camada de Realidade / Pendências
   Complementa o núcleo atual sem apagar o que já funciona.
   Princípio: problema aberto -> próximo passo -> missão.
*/
(function () {
  'use strict';

  const STORAGE_KEY = 'HUUD_PENDENCIAS_V1';
  const TYPES = ['PENDÊNCIA', 'OBRIGAÇÃO', 'COMPROMISSO', 'ROTINA', 'HÁBITO', 'MISSÃO', 'PROJETO', 'CAMPANHA', 'ESTUDO', 'META', 'PROBLEMA'];
  const AREAS = ['VIDA', 'PESSOAL', 'FAMÍLIA', 'CASA', 'TRABALHO', 'FINANCEIRO', 'ESTUDO', 'TI + IA', 'SAÚDE/CORPO', 'PROJETOS', 'METAS'];

  const seed = [
    { id: 'p1', title: 'Situações abandonadas que podem gerar problema', area: 'PESSOAL', type: 'PENDÊNCIA', risk: 'CRÍTICA', status: 'ABERTA', next: 'Listar cada situação e descobrir qual é o próximo passo concreto.', deadline: '', notes: '' },
    { id: 'p2', title: 'Processos e questões jurídicas em aberto', area: 'PESSOAL', type: 'PENDÊNCIA', risk: 'CRÍTICA', status: 'ABERTA', next: 'Levantar todos os processos, situação atual, prazo e providência necessária.', deadline: '', notes: '' },
    { id: 'p3', title: 'Pendências pessoais e familiares', area: 'FAMÍLIA', type: 'PROBLEMA', risk: 'ALTA', status: 'ABERTA', next: 'Separar fatos, pessoas envolvidas e a próxima conversa ou providência.', deadline: '', notes: '' },
    { id: 'p4', title: 'Faculdade — situação abandonada a resolver', area: 'ESTUDO', type: 'PENDÊNCIA', risk: 'ALTA', status: 'ABERTA', next: 'Descobrir exatamente o que precisa ser regularizado, pago, cancelado ou retomado.', deadline: '', notes: '' }
  ];

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : null;
      return Array.isArray(data) ? data : seed.slice();
    } catch (_) { return seed.slice(); }
  }

  let items = load();
  let filter = 'TODAS';

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    render();
  }

  function esc(v) {
    return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function riskClass(risk) {
    return risk === 'CRÍTICA' ? 'hp-risk-critical' : risk === 'ALTA' ? 'hp-risk-high' : 'hp-risk-normal';
  }

  function ensureStyles() {
    if (document.getElementById('huud-pendencias-styles')) return;
    const s = document.createElement('style');
    s.id = 'huud-pendencias-styles';
    s.textContent = `
      .hp-hero{background:linear-gradient(90deg,rgba(9,12,16,.99),rgba(9,12,16,.84));border:1px solid var(--border);border-radius:12px;padding:22px;margin-bottom:16px;position:relative;overflow:hidden}.hp-hero:after{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--danger)}
      .hp-kicker{font-family:var(--mono);font-size:.65rem;color:var(--danger);font-weight:900;letter-spacing:2px}.hp-title{font-size:1.45rem;font-weight:900;margin-top:5px}.hp-sub{font-size:.82rem;color:var(--text-muted);margin-top:6px;line-height:1.5;max-width:850px}
      .hp-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:12px;margin-bottom:16px}.hp-card{background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:16px}.hp-card h3{font-family:var(--mono);font-size:.72rem;letter-spacing:1.2px;color:var(--neon);margin-bottom:12px}.hp-next{border-left:3px solid var(--neon);padding:10px 12px;background:var(--bg-card-elevated);border-radius:6px}.hp-next small{display:block;color:var(--text-muted);font-family:var(--mono);font-size:.58rem;margin-bottom:4px}.hp-next strong{font-size:.9rem}
      .hp-stat{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--border);font-size:.78rem}.hp-stat:last-child{border-bottom:0}.hp-num{font-family:var(--mono);font-weight:900}.hp-critical{color:var(--danger)}.hp-high{color:var(--warning)}
      .hp-toolbar{display:flex;gap:7px;overflow:auto;margin-bottom:10px}.hp-filter{background:var(--bg-card);border:1px solid var(--border);color:var(--text-muted);padding:7px 10px;border-radius:5px;font-family:var(--mono);font-size:.62rem;font-weight:800;white-space:nowrap;cursor:pointer}.hp-filter.active{background:var(--neon);color:#000;border-color:var(--neon)}
      .hp-item{background:var(--bg-card);border:1px solid var(--border);border-left:4px solid #475569;border-radius:8px;padding:14px;margin-bottom:8px}.hp-item.hp-risk-critical{border-left-color:var(--danger)}.hp-item.hp-risk-high{border-left-color:var(--warning)}.hp-top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.hp-item-title{font-weight:900;font-size:.9rem}.hp-badges{display:flex;gap:5px;flex-wrap:wrap}.hp-badge{font-family:var(--mono);font-size:.56rem;font-weight:900;padding:3px 6px;border-radius:4px;border:1px solid var(--border-focus);color:var(--text-muted)}.hp-badge-risk{color:var(--danger);border-color:var(--danger)}.hp-badge-area{color:var(--blue-inflow);border-color:var(--blue-inflow)}.hp-next-action{font-size:.76rem;color:var(--text-muted);margin-top:9px;line-height:1.45}.hp-next-action b{color:var(--text)}.hp-actions{display:flex;gap:7px;margin-top:10px}.hp-smallbtn{background:#161b24;border:1px solid #252e3d;color:var(--text);padding:6px 9px;border-radius:4px;font-family:var(--mono);font-size:.6rem;font-weight:800;cursor:pointer}.hp-smallbtn.primary{color:var(--neon);border-color:var(--neon)}.hp-smallbtn.danger{color:var(--danger);border-color:var(--danger)}
      .hp-form{display:grid;grid-template-columns:1fr 1fr;gap:8px}.hp-form .full{grid-column:1/-1}.hp-label{font-family:var(--mono);font-size:.58rem;color:var(--text-muted);display:block;margin-bottom:4px}.hp-input,.hp-select,.hp-textarea{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:5px;color:var(--text);padding:10px;font-size:.78rem;outline:none}.hp-textarea{min-height:70px;resize:vertical}.hp-input:focus,.hp-select:focus,.hp-textarea:focus{border-color:var(--neon)}
      @media(max-width:800px){.hp-grid{grid-template-columns:1fr}.hp-form{grid-template-columns:1fr}.hp-form .full{grid-column:auto}.hp-top{flex-direction:column}}
    `;
    document.head.appendChild(s);
  }

  function ensureView() {
    if (document.getElementById('view-pendencias')) return;
    const main = document.querySelector('.main-fluid-wrapper');
    if (!main) return;
    const section = document.createElement('section');
    section.id = 'view-pendencias';
    section.className = 'view';
    section.innerHTML = `
      <div class="hp-hero">
        <div class="hp-kicker">SALA 00 • REALIDADE / SEM ATALHOS</div>
        <div class="hp-title">O que você está evitando resolver?</div>
        <div class="hp-sub">Esta sala não é uma lista de produtividade. Ela guarda problemas abertos, obrigações sérias e coisas abandonadas que podem gerar consequência. O HUUD transforma cada uma em um próximo passo executável.</div>
      </div>
      <div class="hp-grid">
        <div class="hp-card"><h3>PRÓXIMO COMANDO</h3><div id="hp-next"></div></div>
        <div class="hp-card"><h3>ESTADO DA REALIDADE</h3><div id="hp-stats"></div></div>
      </div>
      <div class="hp-card" style="margin-bottom:12px"><h3>REGISTRAR NOVA PENDÊNCIA / PROBLEMA</h3>
        <form id="hp-form" class="hp-form">
          <div><label class="hp-label">O QUE ESTÁ ABERTO?</label><input id="hp-title" class="hp-input" required placeholder="Ex.: processo, documento, conversa, obrigação..."></div>
          <div><label class="hp-label">ÁREA</label><select id="hp-area" class="hp-select">${AREAS.map(x=>`<option>${x}</option>`).join('')}</select></div>
          <div><label class="hp-label">NATUREZA</label><select id="hp-type" class="hp-select">${TYPES.map(x=>`<option>${x}</option>`).join('')}</select></div>
          <div><label class="hp-label">RISCO</label><select id="hp-risk" class="hp-select"><option>CRÍTICA</option><option>ALTA</option><option>NORMAL</option></select></div>
          <div class="full"><label class="hp-label">PRÓXIMO PASSO CONCRETO</label><input id="hp-next-input" class="hp-input" required placeholder="Qual é a menor ação que move isso para frente?"></div>
          <div><label class="hp-label">PRAZO (SE HOUVER)</label><input id="hp-deadline" type="date" class="hp-input"></div>
          <div><label class="hp-label">OBSERVAÇÃO / FATO</label><input id="hp-notes" class="hp-input" placeholder="Sem história longa. Só fatos úteis."></div>
          <div class="full"><button class="btn-action-neon" type="submit">+ REGISTRAR NA REALIDADE</button></div>
        </form>
      </div>
      <div class="hp-card"><h3>MAPA DE PENDÊNCIAS</h3>
        <div class="hp-toolbar" id="hp-toolbar"></div>
        <div id="hp-list"></div>
      </div>`;
    main.appendChild(section);
    document.getElementById('hp-form').addEventListener('submit', addItem);
  }

  function addNav() {
    const sub = document.querySelector('.sub-nav');
    if (sub && !sub.querySelector('[data-huud-pendencias]')) {
      const b = document.createElement('button'); b.className='nav-pill'; b.dataset.huudPendencias='1'; b.textContent='PENDÊNCIAS'; b.onclick=()=>window.HUUD.switchView('pendencias'); sub.appendChild(b);
    }
    const bottom = document.querySelector('.bottom-bar');
    if (bottom && !bottom.querySelector('[data-huud-pendencias]')) {
      const b=document.createElement('button'); b.className='nav-btn'; b.dataset.huudPendencias='1'; b.innerHTML='<span style="font-size:18px;line-height:18px">⚠</span><span>PENDÊNCIAS</span>'; b.onclick=()=>window.HUUD.switchView('pendencias'); bottom.appendChild(b);
    }
  }

  function patchSwitch() {
    if (!window.HUUD || window.HUUD.__pendenciasPatched) return;
    const original = window.HUUD.switchView;
    window.HUUD.switchView = function(viewId) {
      original.call(window.HUUD, viewId);
      if (viewId === 'pendencias') {
        document.querySelectorAll('.nav-pill').forEach(p=>p.classList.toggle('active', p.dataset.huudPendencias==='1'));
        document.querySelectorAll('.nav-btn').forEach(p=>p.classList.toggle('active', p.dataset.huudPendencias==='1'));
        render();
      }
    };
    window.HUUD.__pendenciasPatched = true;
  }

  function addItem(e) {
    e.preventDefault();
    const item={id:'p'+Date.now(),title:document.getElementById('hp-title').value.trim(),area:document.getElementById('hp-area').value,type:document.getElementById('hp-type').value,risk:document.getElementById('hp-risk').value,status:'ABERTA',next:document.getElementById('hp-next-input').value.trim(),deadline:document.getElementById('hp-deadline').value,notes:document.getElementById('hp-notes').value.trim()};
    if(!item.title||!item.next)return;
    items.unshift(item); save(); e.target.reset();
  }

  function execute(id) {
    const item=items.find(x=>x.id===id); if(!item)return;
    const text=prompt('REGISTRO DE EXECUÇÃO\n\nPróximo passo:\n'+item.next+'\n\nEscreva a evidência do que foi feito:');
    if(text===null)return;
    item.status='EM ANDAMENTO'; item.notes=(item.notes?item.notes+' | ':'')+'EVIDÊNCIA: '+text; save();
  }

  function closeItem(id) {
    const item=items.find(x=>x.id===id); if(!item)return;
    const text=prompt('CONFIRMAR RESOLUÇÃO\n\nO que prova que isso foi resolvido?');
    if(text===null)return;
    item.status='RESOLVIDA'; item.notes=(item.notes?item.notes+' | ':'')+'RESOLVIDA: '+text; save();
  }

  function removeItem(id) {
    if(!confirm('Remover esta pendência do mapa?'))return;
    items=items.filter(x=>x.id!==id); save();
  }

  function render() {
    const list=document.getElementById('hp-list'); if(!list)return;
    const active=items.filter(x=>x.status!=='RESOLVIDA');
    const critical=active.filter(x=>x.risk==='CRÍTICA'); const high=active.filter(x=>x.risk==='ALTA');
    const next=active.find(x=>x.risk==='CRÍTICA')||active.find(x=>x.risk==='ALTA')||active[0];
    const n=document.getElementById('hp-next');
    if(n)n.innerHTML=next?`<div class="hp-next"><small>${esc(next.risk)} • ${esc(next.area)} • ${esc(next.type)}</small><strong>${esc(next.title)}</strong><div style="font-size:.76rem;color:var(--text-muted);margin-top:5px">PRÓXIMO PASSO: ${esc(next.next)}</div></div>`:'<div style="color:var(--success);font-family:var(--mono);font-size:.75rem">NENHUMA PENDÊNCIA ABERTA.</div>';
    const st=document.getElementById('hp-stats');
    if(st)st.innerHTML=`<div class="hp-stat"><span>ABERTAS</span><span class="hp-num">${active.length}</span></div><div class="hp-stat"><span>CRÍTICAS</span><span class="hp-num hp-critical">${critical.length}</span></div><div class="hp-stat"><span>ALTAS</span><span class="hp-num hp-high">${high.length}</span></div><div class="hp-stat"><span>RESOLVIDAS</span><span class="hp-num">${items.length-active.length}</span></div>`;
    const toolbar=document.getElementById('hp-toolbar');
    if(toolbar){const fs=['TODAS','ABERTAS','CRÍTICAS','FAMÍLIA','FINANCEIRO','PESSOAL','ESTUDO'];toolbar.innerHTML=fs.map(f=>`<button class="hp-filter ${filter===f?'active':''}" data-f="${f}">${f}</button>`).join('');toolbar.querySelectorAll('button').forEach(b=>b.onclick=()=>{filter=b.dataset.f;render();});}
    let shown=items.slice();
    if(filter==='ABERTAS')shown=shown.filter(x=>x.status!=='RESOLVIDA');
    else if(filter==='CRÍTICAS')shown=shown.filter(x=>x.risk==='CRÍTICA'&&x.status!=='RESOLVIDA');
    else if(AREAS.includes(filter))shown=shown.filter(x=>x.area===filter);
    if(!shown.length){list.innerHTML='<div style="padding:25px;text-align:center;color:var(--text-muted);font-family:var(--mono);font-size:.72rem">NENHUM REGISTRO NESTE FILTRO.</div>';return;}
    list.innerHTML=shown.map(x=>`<div class="hp-item ${riskClass(x.risk)}" style="${x.status==='RESOLVIDA'?'opacity:.45':''}"><div class="hp-top"><div class="item-title hp-item-title">${esc(x.title)}</div><div class="hp-badges"><span class="hp-badge hp-badge-risk">${esc(x.risk)}</span><span class="hp-badge hp-badge-area">${esc(x.area)}</span><span class="hp-badge">${esc(x.type)}</span></div></div><div class="hp-next-action"><b>PRÓXIMO PASSO:</b> ${esc(x.next)}</div>${x.deadline?`<div style="font-family:var(--mono);font-size:.6rem;color:var(--warning);margin-top:7px">PRAZO: ${esc(x.deadline)}</div>`:''}${x.notes?`<div style="font-size:.67rem;color:var(--text-muted);margin-top:6px">${esc(x.notes)}</div>`:''}<div class="hp-actions">${x.status!=='RESOLVIDA'?`<button class="hp-smallbtn primary" data-exec="${x.id}">EXECUTAR PRÓXIMO PASSO</button><button class="hp-smallbtn" data-close="${x.id}">MARCAR RESOLVIDA</button>`:'<span class="hp-badge" style="color:var(--success);border-color:var(--success)">RESOLVIDA</span>'}<button class="hp-smallbtn danger" data-remove="${x.id}">REMOVER</button></div></div>`).join('');
    list.querySelectorAll('[data-exec]').forEach(b=>b.onclick=()=>execute(b.dataset.exec));
    list.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>closeItem(b.dataset.close));
    list.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>removeItem(b.dataset.remove));
  }

  function boot() {
    ensureStyles(); ensureView(); addNav(); patchSwitch(); render();
    // O núcleo atual pode ser inicializado depois desta camada; reaplica a integração por segurança.
    setTimeout(()=>{ensureView();addNav();patchSwitch();render();},300);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
