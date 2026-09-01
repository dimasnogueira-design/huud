/* HUUD — REALIDADE V2
   UX: diagnóstico como origem; mapa como síntese; hoje como execução.
   Não cria CRM. Usa o diagnóstico para orientar a realidade e o comando.
*/
(function(){
  'use strict';
  const AXES = [
    ['REALIDADE','O que é verdade?','Fatos, dinheiro, moradia e obrigações.'],
    ['EU','Quem estou me tornando?','Identidade, forças, perdas e capacidade.'],
    ['RELACIONAMENTOS','Amor ou renúncia?','Reciprocidade, limites e escolhas.'],
    ['DIREÇÃO','Para onde a vida aponta?','Oportunidades e aposta principal.'],
    ['MOVIMENTO','Fuga ou movimento?','Mudança com plano e consequência.'],
    ['MEDO','O que está travando?','Custo da indecisão e do adiamento.'],
    ['RESPONSABILIDADE','O que é meu?','Controle, ação e consequência.'],
    ['LEGADO','O que vai ficar?','Construção, pessoas e visão de futuro.']
  ];
  const DNA = [
    ['REALIDADE ATUAL','Pressão financeira, obrigações abertas e necessidade de recuperar controle.','ATENÇÃO'],
    ['DIREÇÃO','TI + IA, Disciplina OS e negócios digitais como vetor de construção.','DIREÇÃO'],
    ['TRABALHO','Imobiliária tratada como ponte de caixa, não como destino final.','PONTE'],
    ['FORÇA','Capacidade de criar, trabalhar, aprender e reconstruir.','RECURSO'],
    ['RISCO','Adiar o que precisa ser enfrentado e permanecer parado.','RISCO'],
    ['PRINCÍPIO','Sem atalhos: responsabilidade, execução e correção.','PRINCÍPIO']
  ];
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function getItems(){
    const out=[];
    try{const a=JSON.parse(localStorage.getItem('HUUD_REALIDADE_V1')||'[]');if(Array.isArray(a))out.push(...a);}catch(e){}
    try{const a=JSON.parse(localStorage.getItem('HUUD_PENDENCIAS_V1')||'[]');if(Array.isArray(a))out.push(...a);}catch(e){}
    const seen=new Set();return out.filter(x=>{const k=x.id||x.title;if(seen.has(k))return false;seen.add(k);return x.status!=='RESOLVIDA';});
  }
  function styles(){
    if(document.getElementById('huud-r2-style'))return;
    const s=document.createElement('style');s.id='huud-r2-style';s.textContent=`
      #view-realidade-v2{padding-bottom:30px}.r2-hero{background:linear-gradient(100deg,rgba(9,12,16,.99),rgba(9,12,16,.82));border:1px solid var(--border);border-radius:12px;padding:24px;margin-bottom:14px;border-left:4px solid var(--neon)}.r2-k{font:900 .62rem var(--mono);letter-spacing:2px;color:var(--neon)}.r2-title{font-size:1.55rem;font-weight:900;margin-top:6px}.r2-sub{color:var(--text-muted);font-size:.82rem;line-height:1.55;max-width:900px;margin-top:6px}.r2-grid{display:grid;grid-template-columns:1.35fr .65fr;gap:12px;margin-bottom:12px}.r2-card{background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:16px}.r2-h{font:900 .66rem var(--mono);letter-spacing:1.5px;color:var(--neon);margin-bottom:11px}.r2-command{border-left:3px solid var(--danger);background:var(--bg-card-elevated);padding:13px;border-radius:5px}.r2-command small{font:700 .58rem var(--mono);color:var(--danger)}.r2-command strong{display:block;font-size:.95rem;margin:5px 0}.r2-command p{margin:0;color:var(--text-muted);font-size:.74rem;line-height:1.45}.r2-btn{margin-top:10px;border:1px solid var(--neon);background:var(--neon);color:#000;border-radius:4px;padding:8px 10px;font:900 .58rem var(--mono);cursor:pointer}.r2-dna{display:grid;grid-template-columns:1fr 1fr;gap:7px}.r2-dna div{padding:10px;background:var(--bg-card-elevated);border:1px solid var(--border);border-radius:6px}.r2-dna b{display:block;font:900 .57rem var(--mono);color:var(--neon)}.r2-dna span{display:block;font-size:.68rem;line-height:1.35;margin-top:4px;color:var(--text-muted)}.r2-axes{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.r2-axis{padding:11px;background:var(--bg-card-elevated);border:1px solid var(--border);border-radius:6px}.r2-axis b{font:900 .58rem var(--mono);color:var(--neon)}.r2-axis strong{display:block;font-size:.72rem;margin-top:4px}.r2-axis span{display:block;color:var(--text-muted);font-size:.6rem;line-height:1.35;margin-top:4px}.r2-items{display:grid;gap:7px}.r2-item{padding:11px;background:var(--bg-card-elevated);border:1px solid var(--border);border-left:3px solid #475569;border-radius:6px}.r2-item.crit{border-left-color:var(--danger)}.r2-item.high{border-left-color:var(--warning)}.r2-item b{font-size:.76rem}.r2-item small{display:block;font:600 .55rem var(--mono);color:var(--text-muted);margin-top:4px}.r2-next{font-size:.68rem;color:var(--text-muted);margin-top:6px;line-height:1.4}.r2-next strong{color:var(--text)}.r2-empty{color:var(--success);font:700 .68rem var(--mono)}
      /* V2 é a interface humana; as telas antigas continuam no código como legado. */
      [data-huud-realidade],[data-huud-pendencias]{display:none!important}.bottom-bar .nav-btn:has(span:last-child){ }
      @media(max-width:900px){.r2-grid{grid-template-columns:1fr}.r2-axes{grid-template-columns:1fr 1fr}}@media(max-width:600px){.r2-dna{grid-template-columns:1fr}.r2-axes{grid-template-columns:1fr}}
    `;document.head.appendChild(s);
  }
  function ensure(){
    if(document.getElementById('view-realidade-v2'))return;
    const main=document.querySelector('.main-fluid-wrapper');if(!main)return;
    const sec=document.createElement('section');sec.id='view-realidade-v2';sec.className='view';
    sec.innerHTML=`<div class="r2-hero"><div class="r2-k">HUUD OS • SÍNTESE DO DIAGNÓSTICO</div><div class="r2-title">MAPA DA REALIDADE</div><div class="r2-sub">As 56 perguntas não são uma lista para você administrar. Elas servem para o HUUD entender sua realidade. Este mapa é a síntese: o que está acontecendo, para onde você está indo e o que precisa ser enfrentado agora.</div></div>
      <div class="r2-grid"><div class="r2-card"><div class="r2-h">COMANDO DE HOJE</div><div id="r2-command"></div></div><div class="r2-card"><div class="r2-h">DNA DO HUUD</div><div id="r2-dna" class="r2-dna"></div></div></div>
      <div class="r2-card" style="margin-bottom:12px"><div class="r2-h">O QUE O DIAGNÓSTICO DESCOBRIU</div><div id="r2-axes" class="r2-axes"></div></div>
      <div class="r2-card"><div class="r2-h">O QUE PRECISA SER ENFRENTADO</div><div id="r2-items" class="r2-items"></div></div>`;
    main.appendChild(sec);
  }
  function command(items){
    if(!items.length)return '<div class="r2-command"><strong>NENHUM COMANDO CRÍTICO.</strong><p>Quando a realidade estiver limpa, o HUUD pode puxar evolução, projeto e meta.</p></div>';
    const rank=x=>x.risk==='CRÍTICA'?0:x.risk==='ALTA'?1:2;const x=items.slice().sort((a,b)=>rank(a)-rank(b))[0];
    return `<div class="r2-command"><small>${esc(x.risk||'ATENÇÃO')} • ${esc(x.area||'VIDA')} • ${esc(x.type||'PENDÊNCIA')}</small><strong>${esc(x.title||x.name||'Situação em aberto')}</strong><p>${esc(x.next||x.plan||'Definir o próximo passo concreto.')}</p><button class="r2-btn" onclick="HUUD_R2.execute('${esc(x.id)}')">EXECUTAR AGORA</button></div>`;
  }
  function render(){
    const items=getItems();const c=document.getElementById('r2-command');if(c)c.innerHTML=command(items);
    const d=document.getElementById('r2-dna');if(d)d.innerHTML=DNA.map(x=>`<div><b>${x[0]} • ${x[2]}</b><span>${x[1]}</span></div>`).join('');
    const a=document.getElementById('r2-axes');if(a)a.innerHTML=AXES.map(x=>`<div class="r2-axis"><b>${x[0]}</b><strong>${x[1]}</strong><span>${x[2]}</span></div>`).join('');
    const l=document.getElementById('r2-items');if(l)l.innerHTML=items.length?items.slice().sort((a,b)=>(a.risk==='CRÍTICA'?0:a.risk==='ALTA'?1:2)-(b.risk==='CRÍTICA'?0:b.risk==='ALTA'?1:2)).map(x=>`<div class="r2-item ${x.risk==='CRÍTICA'?'crit':x.risk==='ALTA'?'high':''}"><b>${esc(x.title||x.name)}</b><small>${esc(x.area||'VIDA')} • ${esc(x.type||'PENDÊNCIA')} • ${esc(x.risk||'NORMAL')}</small><div class="r2-next"><strong>PRÓXIMO PASSO:</strong> ${esc(x.next||x.plan||'Definir ação concreta.')}</div></div>`).join(''):'<div class="r2-empty">REALIDADE SEM PENDÊNCIAS ABERTAS.</div>';
  }
  function execute(id){
    const items=getItems();const x=items.find(a=>String(a.id)===String(id));if(!x)return;
    const ev=prompt('EXECUÇÃO\n\n'+(x.next||x.plan||'Próximo passo')+'\n\nQual foi a evidência concreta do que você fez?');if(ev===null)return;
    try{const a=JSON.parse(localStorage.getItem('HUUD_REALIDADE_V1')||'[]');const z=a.find(a=>String(a.id)===String(id));if(z){z.status='EM ANDAMENTO';z.evidence=(z.evidence?z.evidence+' | ':'')+ev;localStorage.setItem('HUUD_REALIDADE_V1',JSON.stringify(a));}}catch(e){}
    try{const a=JSON.parse(localStorage.getItem('HUUD_PENDENCIAS_V1')||'[]');const z=a.find(a=>String(a.id)===String(id));if(z){z.status='EM ANDAMENTO';z.evidence=(z.evidence?z.evidence+' | ':'')+ev;localStorage.setItem('HUUD_PENDENCIAS_V1',JSON.stringify(a));}}catch(e){}
    render();
  }
  function nav(){
    const sub=document.querySelector('.sub-nav');if(sub&&!sub.querySelector('[data-huud-r2]')){const b=document.createElement('button');b.className='nav-pill';b.dataset.huudR2='1';b.textContent='REALIDADE';b.onclick=open;sub.appendChild(b);}
  }
  function open(){
    ensure();if(window.HUUD&&typeof window.HUUD.switchView==='function')window.HUUD.switchView('realidade-v2');
    else{document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));document.getElementById('view-realidade-v2')?.classList.add('active');}
    document.querySelectorAll('.nav-pill').forEach(x=>x.classList.toggle('active',x.dataset.huudR2==='1'));document.querySelectorAll('.nav-btn').forEach(x=>x.classList.remove('active'));render();window.scrollTo({top:0,behavior:'smooth'});
  }
  window.HUUD_R2={open,execute,render};
  function patch(){if(!window.HUUD||window.HUUD.__r2)return;const old=window.HUUD.switchView;window.HUUD.switchView=function(id){old.call(window.HUUD,id);if(id==='realidade-v2')setTimeout(render,0);};window.HUUD.__r2=true;}
  function boot(){styles();ensure();nav();patch();setTimeout(()=>{styles();ensure();nav();patch();},400);setTimeout(()=>{styles();ensure();nav();patch();},1200);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
