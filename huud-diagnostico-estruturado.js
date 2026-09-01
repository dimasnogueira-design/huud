/* HUUD — DIAGNÓSTICO ESTRUTURADO / MAPA DA REALIDADE
   Camada complementar: diagnóstico -> classificação -> prioridade -> próximo passo.
   Não substitui o núcleo existente.
*/
(function(){
  'use strict';

  const KEY = 'HUUD_REALIDADE_V1';
  const AREAS = ['VIDA','PESSOAL','FAMÍLIA','CASA','TRABALHO','FINANCEIRO','ESTUDO','TI + IA','SAÚDE/CORPO','PROJETOS','METAS'];
  const TYPES = ['PENDÊNCIA','OBRIGAÇÃO','COMPROMISSO','ROTINA','HÁBITO','MISSÃO','PROJETO','CAMPANHA','ESTUDO','META','PROBLEMA'];
  const RISKS = ['CRÍTICA','ALTA','NORMAL'];
  const BLOCKS = [
    ['REALIDADE','O que é verdade?','Fatos, dinheiro, moradia, obrigações e o que já não funciona.'],
    ['EU','Quem estou me tornando?','Identidade, capacidades, perdas, forças e direção.'],
    ['RELACIONAMENTO','Amor ou renúncia?','Reciprocidade, limites, escolhas e consequências.'],
    ['OPORTUNIDADES','Para onde a vida está apontando?','Oportunidades reais, distrações, recursos e aposta de 12 meses.'],
    ['MOVIMENTO','Fuga ou movimento?','O que você espera mudar e qual é o plano concreto.'],
    ['MEDO','O que realmente está me travando?','Pior cenário, melhor cenário, probabilidade e custo da indecisão.'],
    ['RESPONSABILIDADE','O que é meu?','Controle, responsabilidade, culpa e consequências que precisam ser aceitas.'],
    ['LEGADO','O que vai ficar?','Criação, pessoas ajudadas, transformação e a vida que merece ser construída.']
  ];

  const seed = [
    {id:'r1',title:'Diagnóstico financeiro e obrigações críticas',area:'FINANCEIRO',type:'PROBLEMA',risk:'CRÍTICA',status:'ABERTA',next:'Levantar valores, vencimentos, credores e consequências em uma única lista factual.'},
    {id:'r2',title:'Processos e pendências sérias em aberto',area:'PESSOAL',type:'PENDÊNCIA',risk:'CRÍTICA',status:'ABERTA',next:'Listar cada processo ou pendência, situação atual, prazo e próxima providência.'},
    {id:'r3',title:'Empresa / trabalho como ponte',area:'TRABALHO',type:'OBRIGAÇÃO',risk:'ALTA',status:'ABERTA',next:'Separar o que precisa ser mantido para gerar caixa do que pode ser encerrado ou cortado.'},
    {id:'r4',title:'Direção de TI + IA / Disciplina OS',area:'PROJETOS',type:'PROJETO',risk:'ALTA',status:'ABERTA',next:'Definir o próximo incremento executável do produto e terminar antes de abrir outra frente.'}
  ];

  let items = load();
  let activeFilter = 'TODAS';

  function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||'null');return Array.isArray(x)?x:seed.slice();}catch(e){return seed.slice();}}
  function save(){localStorage.setItem(KEY,JSON.stringify(items));render();}
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function active(){return items.filter(x=>x.status!=='RESOLVIDA');}
  function priority(x){return x.risk==='CRÍTICA'?0:x.risk==='ALTA'?1:2;}

  function styles(){
    if(document.getElementById('huud-structured-style'))return;
    const s=document.createElement('style');s.id='huud-structured-style';s.textContent=`
      .hr-hero{background:linear-gradient(90deg,rgba(9,12,16,.99),rgba(9,12,16,.82));border:1px solid var(--border);border-radius:12px;padding:22px;margin-bottom:14px;position:relative;overflow:hidden}.hr-hero:after{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--neon)}
      .hr-k{font-family:var(--mono);font-size:.62rem;color:var(--neon);font-weight:900;letter-spacing:2px}.hr-title{font-size:1.45rem;font-weight:900;margin-top:5px}.hr-sub{color:var(--text-muted);font-size:.8rem;line-height:1.5;margin-top:6px;max-width:900px}
      .hr-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:12px;margin-bottom:12px}.hr-card{background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:16px}.hr-card h3{font-family:var(--mono);font-size:.68rem;letter-spacing:1.4px;color:var(--neon);margin-bottom:11px}.hr-command{border-left:3px solid var(--neon);background:var(--bg-card-elevated);padding:12px;border-radius:5px}.hr-command small{display:block;font-family:var(--mono);color:var(--text-muted);font-size:.58rem;margin-bottom:5px}.hr-command strong{font-size:.92rem}.hr-stats{display:grid;grid-template-columns:1fr 1fr;gap:7px}.hr-stat{padding:10px;background:var(--bg-card-elevated);border:1px solid var(--border);border-radius:6px}.hr-stat b{display:block;font-family:var(--mono);font-size:1.1rem}.hr-stat span{font-size:.6rem;color:var(--text-muted);font-family:var(--mono)}
      .hr-blocks{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.hr-block{padding:10px;border:1px solid var(--border);background:var(--bg-card-elevated);border-radius:6px;cursor:pointer}.hr-block:hover{border-color:var(--border-focus)}.hr-block b{font-family:var(--mono);font-size:.62rem;color:var(--neon)}.hr-block span{display:block;font-size:.68rem;margin-top:4px}.hr-block small{display:block;color:var(--text-muted);font-size:.58rem;margin-top:5px;line-height:1.3}
      .hr-form{display:grid;grid-template-columns:1fr 1fr;gap:8px}.hr-full{grid-column:1/-1}.hr-label{display:block;font-family:var(--mono);font-size:.56rem;color:var(--text-muted);margin-bottom:4px}.hr-input,.hr-select{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:5px;color:var(--text);padding:10px;font-size:.75rem}.hr-input:focus,.hr-select:focus{outline:none;border-color:var(--neon)}
      .hr-toolbar{display:flex;gap:6px;overflow:auto;margin-bottom:9px}.hr-filter{border:1px solid var(--border);background:var(--bg-card);color:var(--text-muted);padding:7px 9px;border-radius:5px;font-family:var(--mono);font-size:.58rem;font-weight:800;white-space:nowrap;cursor:pointer}.hr-filter.active{background:var(--neon);color:#000;border-color:var(--neon)}
      .hr-item{border:1px solid var(--border);border-left:4px solid #475569;background:var(--bg-card);border-radius:7px;padding:13px;margin-bottom:7px}.hr-item.crit{border-left-color:var(--danger)}.hr-item.high{border-left-color:var(--warning)}.hr-top{display:flex;justify-content:space-between;gap:10px}.hr-item strong{font-size:.82rem}.hr-badges{display:flex;gap:5px;flex-wrap:wrap;margin-top:6px}.hr-badge{font-family:var(--mono);font-size:.52rem;padding:3px 5px;border:1px solid var(--border-focus);border-radius:3px;color:var(--text-muted)}.hr-next{font-size:.72rem;color:var(--text-muted);line-height:1.4;margin-top:8px}.hr-next b{color:var(--text)}.hr-actions{display:flex;gap:6px;margin-top:9px}.hr-btn{border:1px solid var(--border-focus);background:#161b24;color:var(--text);border-radius:4px;padding:6px 8px;font-family:var(--mono);font-size:.56rem;font-weight:800;cursor:pointer}.hr-btn.primary{color:var(--neon);border-color:var(--neon)}
      @media(max-width:900px){.hr-grid{grid-template-columns:1fr}.hr-blocks{grid-template-columns:1fr 1fr}}@media(max-width:600px){.hr-form{grid-template-columns:1fr}.hr-full{grid-column:auto}.hr-blocks{grid-template-columns:1fr}}
    `;document.head.appendChild(s);
  }

  function ensureView(){
    if(document.getElementById('view-realidade'))return;
    const main=document.querySelector('.main-fluid-wrapper');if(!main)return;
    const sec=document.createElement('section');sec.id='view-realidade';sec.className='view';
    sec.innerHTML=`
      <div class="hr-hero"><div class="hr-k">HUUD OS • MAPA DA REALIDADE</div><div class="hr-title">VER → DECIDIR → EXECUTAR</div><div class="hr-sub">O HUUD não coloca a vida inteira na tela. Ele organiza a realidade por baixo e traz para hoje aquilo que precisa ser enfrentado. Toda pendência precisa de natureza, risco e próximo passo.</div></div>
      <div class="hr-grid"><div class="hr-card"><h3>COMANDO DE HOJE</h3><div id="hr-command"></div></div><div class="hr-card"><h3>ESTADO DA REALIDADE</h3><div id="hr-stats" class="hr-stats"></div></div></div>
      <div class="hr-card" style="margin-bottom:12px"><h3>8 EIXOS DO DIAGNÓSTICO</h3><div id="hr-blocks" class="hr-blocks"></div></div>
      <div class="hr-card" style="margin-bottom:12px"><h3>REGISTRAR FATO / PENDÊNCIA</h3><form id="hr-form" class="hr-form">
        <div><label class="hr-label">O QUE ESTÁ ABERTO?</label><input id="hr-title" class="hr-input" required placeholder="Problema, pendência, obrigação ou projeto..."></div>
        <div><label class="hr-label">ÁREA DA VIDA</label><select id="hr-area" class="hr-select">${AREAS.map(x=>`<option>${x}</option>`).join('')}</select></div>
        <div><label class="hr-label">NATUREZA</label><select id="hr-type" class="hr-select">${TYPES.map(x=>`<option>${x}</option>`).join('')}</select></div>
        <div><label class="hr-label">RISCO</label><select id="hr-risk" class="hr-select"><option>CRÍTICA</option><option>ALTA</option><option>NORMAL</option></select></div>
        <div class="hr-full"><label class="hr-label">PRÓXIMO PASSO EXECUTÁVEL</label><input id="hr-next" class="hr-input" required placeholder="A menor ação concreta que move isso para frente."></div>
        <div class="hr-full"><button class="btn-action-neon" type="submit">+ COLOCAR NA MESA</button></div>
      </form></div>
      <div class="hr-card"><h3>REALIDADE ORGANIZADA</h3><div id="hr-toolbar" class="hr-toolbar"></div><div id="hr-list"></div></div>`;
    main.appendChild(sec);document.getElementById('hr-form').addEventListener('submit',add);
  }

  function addNav(){
    const sub=document.querySelector('.sub-nav');
    if(sub&&!sub.querySelector('[data-huud-realidade]')){const b=document.createElement('button');b.className='nav-pill';b.dataset.huudRealidade='1';b.textContent='MAPA DA REALIDADE';b.onclick=()=>open();sub.appendChild(b);}
    const bottom=document.querySelector('.bottom-bar');
    if(bottom&&!bottom.querySelector('[data-huud-realidade]')){const b=document.createElement('button');b.className='nav-btn';b.dataset.huudRealidade='1';b.innerHTML='<span style="font-size:18px">⌘</span><span>REALIDADE</span>';b.onclick=()=>open();bottom.appendChild(b);}
  }

  function patch(){
    if(!window.HUUD||window.HUUD.__realidadePatched)return;
    const old=window.HUUD.switchView;
    window.HUUD.switchView=function(id){old.call(window.HUUD,id);if(id==='realidade')setTimeout(render,0);};
    window.HUUD.__realidadePatched=true;
  }

  function open(){
    if(window.HUUD&&typeof window.HUUD.switchView==='function')window.HUUD.switchView('realidade');
    else {document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));const v=document.getElementById('view-realidade');if(v)v.classList.add('active');}
    document.querySelectorAll('.nav-pill').forEach(x=>x.classList.toggle('active',x.dataset.huudRealidade==='1'));
    document.querySelectorAll('.nav-btn').forEach(x=>x.classList.toggle('active',x.dataset.huudRealidade==='1'));
    render();window.scrollTo({top:0,behavior:'smooth'});
  }

  function add(e){e.preventDefault();const x={id:'r'+Date.now(),title:document.getElementById('hr-title').value.trim(),area:document.getElementById('hr-area').value,type:document.getElementById('hr-type').value,risk:document.getElementById('hr-risk').value,status:'ABERTA',next:document.getElementById('hr-next').value.trim()};if(!x.title||!x.next)return;items.unshift(x);save();e.target.reset();}
  function execute(id){const x=items.find(a=>a.id===id);if(!x)return;const ev=prompt('REGISTRE A EVIDÊNCIA DO QUE FOI FEITO:\n\n'+x.next);if(ev===null)return;x.status='EM ANDAMENTO';x.evidence=(x.evidence?x.evidence+' | ':'')+ev;save();}
  function resolve(id){const x=items.find(a=>a.id===id);if(!x)return;const ev=prompt('O que prova que isso foi resolvido?');if(ev===null)return;x.status='RESOLVIDA';x.evidence=(x.evidence?x.evidence+' | ':'')+ev;save();}

  function render(){
    const list=document.getElementById('hr-list');if(!list)return;const a=active().slice().sort((x,y)=>priority(x)-priority(y));const critical=a.filter(x=>x.risk==='CRÍTICA').length,high=a.filter(x=>x.risk==='ALTA').length;
    const cmd=document.getElementById('hr-command');const next=a[0];if(cmd)cmd.innerHTML=next?`<div class="hr-command"><small>${esc(next.risk)} • ${esc(next.area)} • ${esc(next.type)}</small><strong>${esc(next.title)}</strong><div class="hr-next">PRÓXIMO PASSO: ${esc(next.next)}</div><div class="hr-actions"><button class="hr-btn primary" onclick="HUUD_REALIDADE.execute('${next.id}')">EXECUTAR AGORA</button></div></div>`:'<div class="hr-command"><strong>REALIDADE LIMPA.</strong><div class="hr-next">Não há itens abertos.</div></div>';
    const st=document.getElementById('hr-stats');if(st)st.innerHTML=`<div class="hr-stat"><b>${a.length}</b><span>ABERTAS</span></div><div class="hr-stat"><b style="color:var(--danger)">${critical}</b><span>CRÍTICAS</span></div><div class="hr-stat"><b style="color:var(--warning)">${high}</b><span>ALTAS</span></div><div class="hr-stat"><b>${items.length-a.length}</b><span>RESOLVIDAS</span></div>`;
    const blocks=document.getElementById('hr-blocks');if(blocks)blocks.innerHTML=BLOCKS.map((b,i)=>`<div class="hr-block" onclick="HUUD_REALIDADE.block('${esc(b[0])}')"><b>0${i+1}</b><span>${esc(b[1])}</span><small>${esc(b[2])}</small></div>`).join('');
    const toolbar=document.getElementById('hr-toolbar');const filters=['TODAS','ABERTAS','CRÍTICAS','PESSOAL','FAMÍLIA','FINANCEIRO','TRABALHO','PROJETOS'];if(toolbar)toolbar.innerHTML=filters.map(f=>`<button class="hr-filter ${activeFilter===f?'active':''}" onclick="HUUD_REALIDADE.filter('${f}')">${f}</button>`).join('');
    let filtered=a;if(activeFilter==='ABERTAS')filtered=a;if(activeFilter==='CRÍTICAS')filtered=a.filter(x=>x.risk==='CRÍTICA');else if(AREAS.includes(activeFilter))filtered=a.filter(x=>x.area===activeFilter);
    if(!filtered.length){list.innerHTML='<div style="color:var(--text-muted);font-family:var(--mono);font-size:.7rem;padding:8px">NENHUM REGISTRO NESTE FILTRO.</div>';return;}
    list.innerHTML=filtered.map(x=>`<article class="hr-item ${x.risk==='CRÍTICA'?'crit':x.risk==='ALTA'?'high':''}"><div class="hr-top"><strong>${esc(x.title)}</strong><span class="hr-badge">${esc(x.status)}</span></div><div class="hr-badges"><span class="hr-badge">${esc(x.area)}</span><span class="hr-badge">${esc(x.type)}</span><span class="hr-badge">${esc(x.risk)}</span></div><div class="hr-next"><b>PRÓXIMO PASSO:</b> ${esc(x.next)}</div><div class="hr-actions"><button class="hr-btn primary" onclick="HUUD_REALIDADE.execute('${x.id}')">EXECUTAR</button><button class="hr-btn" onclick="HUUD_REALIDADE.resolve('${x.id}')">RESOLVIDA</button></div></article>`).join('');
  }

  window.HUUD_REALIDADE={execute,resolve,filter:function(f){activeFilter=f;render();},block:function(name){activeFilter='TODAS';alert('EIXO '+name+'\n\nEste eixo pertence ao diagnóstico HUUD. O mapa abaixo deve receber fatos, pendências e próximos passos; não uma lista infinita de tarefas.');}};

  function boot(){styles();ensureView();addNav();patch();setTimeout(function(){styles();ensureView();addNav();patch();},300);setTimeout(function(){addNav();patch();},1000);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
