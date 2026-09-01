/* HUUD OS — HOME V5
   QG PRINCIPAL: realidade -> decisão -> execução.
   Não inventa métricas. Cada módulo tem uma entrada clara.
*/
(function(){
  'use strict';

  const modules = [
    ['01','REALIDADE','Mapa da Realidade','A síntese do diagnóstico: fatos, direção, riscos, forças e o que precisa ser enfrentado.','realidade-v2','ABRIR MAPA →'],
    ['02','RESPONSABILIDADES','Pendências & Processos','Obrigações abertas, processos, faculdade, documentos e assuntos pessoais que não podem continuar esquecidos.','realidade-v2','VER PENDÊNCIAS →'],
    ['03','FINANÇAS','Sala de Guerra Financeira','Dívidas, entradas, compromissos e decisões de caixa. Sem maquiagem.','debts','ABRIR →'],
    ['04','TERRENO','Mar Verde / Operação','Negócio, imóveis, clientes e ações comerciais que sustentam o presente.','land','ABRIR →'],
    ['05','TI + IA','Sala de Aula','Construção de autonomia técnica enquanto o próprio HUUD é desenvolvido.','tech','ESTUDAR →'],
    ['06','GO PARAGUAY GO','Operação Paraguai','Pesquisa, inteligência comercial, produtos, margem e construção do projeto.','py','ABRIR →'],
    ['07','ORIGEM','56 Perguntas','Diagnóstico profundo. Não são tarefas: são a origem que orienta o sistema.','diag','REVISAR →']
  ];

  function addStyles(){
    if(document.getElementById('huud-home-v5-css')) return;
    const s=document.createElement('style');
    s.id='huud-home-v5-css';
    s.textContent=`
      #view-flow .dashboard-tactical-grid,#view-flow .room-header-banner{display:none!important}
      .h5{display:grid;gap:14px;padding-bottom:24px}
      .h5-hero{position:relative;min-height:455px;overflow:hidden;border:1px solid #202733;border-radius:16px;background:#07090c;padding:34px;display:flex;align-items:flex-end}
      .h5-hero:before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(7,9,12,.99) 0%,rgba(7,9,12,.92) 42%,rgba(7,9,12,.28) 76%,rgba(7,9,12,.08) 100%),url('comandante.png') 88% 50%/auto 96% no-repeat;filter:contrast(1.08);pointer-events:none}
      .h5-hero:after{content:'';position:absolute;left:0;right:0;bottom:0;height:2px;background:linear-gradient(90deg,var(--neon),transparent 72%);box-shadow:0 0 18px var(--neon-glow)}
      .h5-copy{position:relative;z-index:2;max-width:720px}.h5-k{font:900 .62rem var(--mono);letter-spacing:2px;color:var(--neon)}
      .h5-title{font-size:clamp(2.55rem,6vw,5.9rem);font-weight:900;line-height:.84;letter-spacing:-4px;margin:13px 0}.h5-title em{font-style:normal;color:var(--neon)}
      .h5-sub{font-size:.9rem;color:#a5afbd;line-height:1.55;max-width:650px}.h5-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:20px}
      .h5-btn{border:1px solid var(--neon);background:var(--neon);color:#000;padding:12px 16px;border-radius:5px;font:900 .62rem var(--mono);letter-spacing:1px;cursor:pointer}.h5-btn.alt{background:rgba(0,0,0,.68);color:var(--neon)}
      .h5-reality{display:flex;flex-wrap:wrap;gap:7px;margin-top:20px}.h5-chip{border:1px solid #29313e;background:rgba(4,5,7,.76);padding:8px 10px;border-radius:4px;font:800 .56rem var(--mono);letter-spacing:.7px}.h5-chip strong{color:var(--neon)}.h5-chip.warn strong{color:var(--warning)}.h5-chip.danger strong{color:var(--danger)}
      .h5-command{display:grid;grid-template-columns:1fr auto;align-items:center;gap:16px;padding:18px;border:1px solid #242b37;border-left:4px solid var(--danger);border-radius:11px;background:#080b0f}.h5-command small{font:900 .57rem var(--mono);color:var(--danger);letter-spacing:1.5px}.h5-command h2{font-size:1.05rem;margin:5px 0}.h5-command p{font-size:.68rem;color:var(--text-muted);line-height:1.45}
      .h5-section{display:grid;gap:9px}.h5-label{font:900 .6rem var(--mono);letter-spacing:2px;color:var(--text-muted)}.h5-heading{font-size:1.35rem;font-weight:900}.h5-modules{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
      .h5-module{position:relative;min-height:172px;padding:17px;border:1px solid #1b222c;border-radius:11px;background:linear-gradient(145deg,#0a0d12,#07090c);cursor:pointer;transition:.2s}.h5-module:hover{transform:translateY(-2px);border-color:#303a49}.h5-module:after{content:'↗';position:absolute;right:14px;top:12px;color:#3c4655;font:900 .8rem var(--mono)}
      .h5-num{font:900 .58rem var(--mono);color:var(--neon);letter-spacing:1px}.h5-module h3{font-size:1rem;margin:10px 0 7px}.h5-module p{font-size:.67rem;color:var(--text-muted);line-height:1.45;max-width:330px}.h5-link{position:absolute;bottom:14px;left:17px;font:900 .56rem var(--mono);color:var(--text);letter-spacing:1px}
      .h5-origin{display:grid;grid-template-columns:1.4fr .6fr;gap:10px}.h5-card{border:1px solid #1b222c;border-radius:11px;background:#080b0f;padding:18px}.h5-card h3{font-size:1rem;margin:6px 0}.h5-card p{font-size:.7rem;color:var(--text-muted);line-height:1.5}.h5-method{font:900 2.45rem var(--mono);color:var(--neon);text-align:right;line-height:1.15}.h5-footer{color:#465162;font:700 .55rem var(--mono);letter-spacing:1px}
      @media(max-width:1000px){.h5-modules{grid-template-columns:repeat(2,1fr)}.h5-origin{grid-template-columns:1fr}.h5-hero:before{background-position:100% 50%;opacity:.9}}
      @media(max-width:650px){.h5-hero{min-height:570px;padding:22px}.h5-hero:before{background-position:100% 5%;background-size:auto 66%;opacity:.72}.h5-title{letter-spacing:-2px}.h5-modules{grid-template-columns:1fr}.h5-command{grid-template-columns:1fr}}
    `;
    document.head.appendChild(s);
  }

  function getOpenItems(){
    const out=[];
    try{const a=JSON.parse(localStorage.getItem('HUUD_REALIDADE_V1')||'[]');if(Array.isArray(a))out.push(...a)}catch(e){}
    try{const a=JSON.parse(localStorage.getItem('HUUD_PENDENCIAS_V1')||'[]');if(Array.isArray(a))out.push(...a)}catch(e){}
    const seen=new Set();
    return out.filter(x=>{
      const key=String(x.id||x.title||x.name||Math.random());
      if(seen.has(key)||x.status==='RESOLVIDA') return false;
      seen.add(key);return true;
    });
  }

  function renderCommand(){
    const title=document.getElementById('h5-command-title');
    const copy=document.getElementById('h5-command-copy');
    if(!title||!copy)return;
    const items=getOpenItems();
    const rank=x=>x.risk==='CRÍTICA'?0:x.risk==='ALTA'?1:2;
    const x=items.slice().sort((a,b)=>rank(a)-rank(b))[0];
    if(x){
      title.textContent=x.title||x.name||'Situação em aberto';
      copy.textContent=x.next||x.plan||'Defina o próximo passo concreto e execute.';
    }else{
      title.textContent='NENHUMA PENDÊNCIA CRÍTICA IDENTIFICADA';
      copy.textContent='Quando não houver incêndio, o HUUD puxa construção, projeto e evolução.';
    }
  }

  function openView(id){
    if(id==='realidade-v2' && window.HUUD_R2){window.HUUD_R2.open();return}
    if(window.HUUD&&typeof window.HUUD.switchView==='function')window.HUUD.switchView(id);
  }

  function render(){
    const v=document.getElementById('view-flow');
    if(!v)return;
    v.dataset.h5ready='1';
    v.innerHTML=`<div class="h5">
      <section class="h5-hero">
        <div class="h5-copy">
          <div class="h5-k">DISCIPLINA OS // QG PRINCIPAL</div>
          <div class="h5-title">ENCARAR.<br><em>DECIDIR.</em><br>EXECUTAR.</div>
          <div class="h5-sub">O HUUD não existe para esconder a realidade em um painel. Ele existe para colocar a realidade na sua frente, decidir o que realmente importa e transformar decisão em movimento.</div>
          <div class="h5-reality">
            <span class="h5-chip"><strong>REALIDADE</strong> // SEM ATALHOS</span>
            <span class="h5-chip warn"><strong>DIREÇÃO</strong> // CONSTRUÇÃO</span>
            <span class="h5-chip danger"><strong>FOCO</strong> // ENFRENTAR</span>
          </div>
          <div class="h5-actions">
            <button class="h5-btn" onclick="HUUD.openCommander()">ENTRAR NO MODO COMANDANTE →</button>
            <button class="h5-btn alt" onclick="window.HUUD_R2&&HUUD_R2.open()">VER MAPA DA REALIDADE</button>
          </div>
        </div>
      </section>

      <section class="h5-command">
        <div><small>COMANDO DE HOJE // PRÓXIMO MOVIMENTO</small><h2 id="h5-command-title">CARREGANDO...</h2><p id="h5-command-copy">O HUUD está lendo as pendências abertas.</p></div>
        <button class="h5-btn" onclick="HUUD.openCommander()">EXECUTAR</button>
      </section>

      <section class="h5-section">
        <div><div class="h5-label">SISTEMAS DO HUUD</div><div class="h5-heading">Cada sala tem uma função. Nenhuma realidade fica sem entrada.</div></div>
        <div class="h5-modules">${modules.map(m=>`<article class="h5-module" onclick="window.__HUUD_H5_OPEN('${m[4]}')"><div class="h5-num">${m[0]} // ${m[1]}</div><h3>${m[2]}</h3><p>${m[3]}</p><span class="h5-link">${m[5]}</span></article>`).join('')}</div>
      </section>

      <section class="h5-origin">
        <div class="h5-card"><div class="h5-label">ORIGEM // DIAGNÓSTICO PROFUNDO</div><h3>As 56 perguntas não são tarefas.</h3><p>Elas registram trajetória, escolhas, medos, forças, direção e aquilo que precisa ser encarado. O diagnóstico é a origem. O mapa é a síntese. A missão é a execução.</p><button class="h5-btn alt" style="margin-top:13px" onclick="window.__HUUD_H5_OPEN('diag')">REVISAR DIAGNÓSTICO →</button></div>
        <div class="h5-card"><div class="h5-label">MÉTODO OPERACIONAL</div><div class="h5-method">VER →<br>DECIDIR →<br>FAZER</div></div>
      </section>
      <div class="h5-footer">HUUD OS // CONTEÚDO SEM AÇÃO É RUÍDO // A TELA NÃO É A MISSÃO</div>
    </div>`;
    renderCommand();
  }

  window.__HUUD_H5_OPEN=openView;

  function boot(){
    addStyles();
    render();
    setTimeout(renderCommand,300);
    setTimeout(renderCommand,1200);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
