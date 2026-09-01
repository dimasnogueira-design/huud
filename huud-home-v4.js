/* HUUD OS — HOME V4.1
   MAR VERDE: operação comercial conjunta.
   Agenda operacional focada exclusivamente em imobiliária + vendas.
   Limpeza de linguagem pessoal/relacional inadequada para o sistema.
*/
(function(){
  'use strict';

  const modules = [
    ['REALIDADE','Mapa da Realidade','A síntese do diagnóstico: fatos, direção, riscos, forças e o que precisa ser enfrentado.','realidade-v2','MAPA →'],
    ['FINANÇAS','Sala de Guerra Financeira','Caixa, dívidas, entradas e obrigações. Ver a situação sem maquiagem e decidir o próximo movimento.','debts','ABRIR →'],
    ['MAR VERDE','Operação Comercial','A imobiliária. Captação, estoque, atendimento, visitas, propostas, negociação e fechamento.','mar-verde','OPERAR →'],
    ['TI + IA','Sala de Aula','Construção de autonomia técnica enquanto o próprio HUUD é desenvolvido.','tech','ESTUDAR →'],
    ['GO PARAGUAY GO','Operação Paraguai','Pesquisa, inteligência comercial, produtos, margem e construção do projeto.','py','ABRIR →'],
    ['ORIGEM','56 Perguntas','Diagnóstico profundo. Não são tarefas: são a origem que orienta o sistema.','diag','REVISAR →']
  ];

  const agendaDefault = [
    {day:'SEGUNDA',focus:'ATAQUE COMERCIAL',dimas:'Revisar estoque + definir 10 leads prioritários + contatos ativos.',rafa:'Atualizar atendimento + confirmar visitas + organizar retornos.',target:'10 contatos / 3 conversas qualificadas'},
    {day:'TERÇA',focus:'CAPTAÇÃO + ESTOQUE',dimas:'Captação de imóveis e relacionamento com proprietários.',rafa:'Atualizar anúncios, fotos, informações e documentação.',target:'2 novas oportunidades de captação'},
    {day:'QUARTA',focus:'FOLLOW-UP',dimas:'Atacar todos os leads quentes e propostas abertas.',rafa:'Reativar leads sem resposta e confirmar próximos passos.',target:'100% dos leads quentes trabalhados'},
    {day:'QUINTA',focus:'VISITAS + PROPOSTAS',dimas:'Visitas, negociação e construção de proposta.',rafa:'Agenda, confirmação, documentação e pós-visita.',target:'Visitas realizadas + propostas emitidas'},
    {day:'SEXTA',focus:'FECHAMENTO',dimas:'Negociar objeções, cobrar decisões e buscar assinatura.',rafa:'Organizar documentos e garantir avanço de cada negociação.',target:'Nenhuma negociação quente sem próximo passo'},
    {day:'SÁBADO',focus:'BALANÇO + PRÓXIMA SEMANA',dimas:'Revisar vendas, caixa, pipeline e gargalos.',rafa:'Revisar agenda, leads e tarefas pendentes.',target:'Próxima semana definida antes de encerrar'}
  ];

  const missionDefault = [
    ['01','CAPTAR','Colocar novos imóveis qualificados no estoque.','2 oportunidades de captação / semana'],
    ['02','ATENDER','Nenhum lead quente sem resposta ou próximo passo definido.','100% dos leads quentes trabalhados'],
    ['03','VISITAR','Transformar conversa em visita e visita em decisão.','Agenda de visitas ativa'],
    ['04','PROPOR','Toda oportunidade madura recebe proposta clara.','Propostas com prazo e próximo passo'],
    ['05','NEGOCIAR','Remover objeções e conduzir a decisão.','Nenhuma negociação parada'],
    ['06','FECHAR','Assinatura, documentação e recebimento.','Venda concluída'],
    ['07','REINVESTIR','Usar resultado para fortalecer a operação.','Caixa + próxima venda']
  ];

  function addStyles(){
    if(document.getElementById('huud-home-v41-css'))return;
    const s=document.createElement('style');s.id='huud-home-v41-css';s.textContent=`
      #view-flow .dashboard-tactical-grid,#view-flow .room-header-banner{display:none!important}
      .h41{display:grid;gap:14px;padding-bottom:24px}.h41-hero{position:relative;min-height:410px;overflow:hidden;border:1px solid #202733;border-radius:16px;background:#07090c;padding:34px;display:flex;align-items:flex-end}.h41-hero:before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(7,9,12,.99),rgba(7,9,12,.91) 42%,rgba(7,9,12,.24) 78%),url('comandante.png') 88% 50%/auto 96% no-repeat;filter:contrast(1.08);pointer-events:none}.h41-hero:after{content:'';position:absolute;left:0;right:0;bottom:0;height:2px;background:linear-gradient(90deg,var(--neon),transparent 72%);box-shadow:0 0 18px var(--neon-glow)}
      .h41-copy{position:relative;z-index:2;max-width:730px}.h41-k,.h41-label{font:900 .6rem var(--mono);letter-spacing:2px;color:var(--neon)}.h41-title{font-size:clamp(2.5rem,6vw,5.8rem);font-weight:900;line-height:.84;letter-spacing:-4px;margin:13px 0}.h41-title em{font-style:normal;color:var(--neon)}.h41-sub{font-size:.88rem;color:#a5afbd;line-height:1.55;max-width:650px}.h41-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:20px}.h41-btn{border:1px solid var(--neon);background:var(--neon);color:#000;padding:12px 16px;border-radius:5px;font:900 .62rem var(--mono);letter-spacing:1px;cursor:pointer}.h41-btn.alt{background:rgba(0,0,0,.68);color:var(--neon)}
      .h41-command{display:grid;grid-template-columns:1fr auto;align-items:center;gap:16px;padding:18px;border:1px solid #242b37;border-left:4px solid var(--danger);border-radius:11px;background:#080b0f}.h41-command small{font:900 .57rem var(--mono);color:var(--danger);letter-spacing:1.5px}.h41-command h2{font-size:1.05rem;margin:5px 0}.h41-command p{font-size:.68rem;color:var(--text-muted);line-height:1.45}
      .h41-modules{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.h41-module{position:relative;min-height:170px;padding:17px;border:1px solid #1b222c;border-radius:11px;background:linear-gradient(145deg,#0a0d12,#07090c);cursor:pointer;transition:.2s}.h41-module:hover{transform:translateY(-2px);border-color:#303a49}.h41-module:after{content:'↗';position:absolute;right:14px;top:12px;color:#3c4655;font:900 .8rem var(--mono)}.h41-num{font:900 .58rem var(--mono);color:var(--neon);letter-spacing:1px}.h41-module h3{font-size:1rem;margin:10px 0 7px}.h41-module p{font-size:.67rem;color:var(--text-muted);line-height:1.45}.h41-link{position:absolute;bottom:14px;left:17px;font:900 .56rem var(--mono);color:var(--text);letter-spacing:1px}
      .mv{display:none;gap:12px}.mv.active{display:grid}.mv-head{border:1px solid #202733;border-left:4px solid var(--neon);border-radius:12px;background:#080b0f;padding:20px}.mv-title{font-size:1.65rem;font-weight:900;margin-top:5px}.mv-sub{color:var(--text-muted);font-size:.75rem;line-height:1.5;margin-top:5px}.mv-grid{display:grid;grid-template-columns:1.25fr .75fr;gap:12px}.mv-card{border:1px solid var(--border);background:var(--bg-card);border-radius:10px;padding:16px}.mv-card h3{font-size:.9rem;margin:4px 0 10px}.mv-mission{display:grid;grid-template-columns:repeat(2,1fr);gap:7px}.mv-mission-item{padding:11px;border:1px solid var(--border);border-left:3px solid var(--neon);background:var(--bg-card-elevated);border-radius:6px}.mv-mission-item b{font:900 .58rem var(--mono);color:var(--neon)}.mv-mission-item strong{display:block;font-size:.75rem;margin-top:3px}.mv-mission-item span{display:block;color:var(--text-muted);font-size:.62rem;line-height:1.35;margin-top:4px}.mv-agenda{display:grid;gap:7px}.mv-day{display:grid;grid-template-columns:90px 1fr 1fr 190px;gap:8px;align-items:center;padding:10px;border:1px solid var(--border);background:var(--bg-card-elevated);border-radius:6px}.mv-day b{font:900 .58rem var(--mono);color:var(--neon)}.mv-day strong{font-size:.68rem}.mv-day span{font-size:.62rem;color:var(--text-muted);line-height:1.35}.mv-target{font:800 .57rem var(--mono);color:#d8e0ea}.mv-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.mv-share{border:1px solid #25d366;background:#25d366;color:#001b08;padding:9px 12px;border-radius:5px;font:900 .58rem var(--mono);cursor:pointer}.mv-check{display:flex;gap:8px;align-items:flex-start;padding:8px;border-top:1px solid var(--border);font-size:.67rem}.mv-check input{accent-color:var(--neon);margin-top:2px}.mv-note{font-size:.62rem;color:var(--text-muted);line-height:1.45}.mv-together{border-left:3px solid var(--neon);padding:11px;background:rgba(212,255,0,.04);font-size:.7rem;line-height:1.45}.h41-footer{color:#465162;font:700 .55rem var(--mono);letter-spacing:1px}
      @media(max-width:1000px){.h41-modules{grid-template-columns:repeat(2,1fr)}.mv-grid{grid-template-columns:1fr}.mv-day{grid-template-columns:75px 1fr}.mv-target{grid-column:2}}@media(max-width:650px){.h41-hero{min-height:520px;padding:22px}.h41-hero:before{background-position:100% 5%;background-size:auto 66%;opacity:.72}.h41-title{letter-spacing:-2px}.h41-modules{grid-template-columns:1fr}.h41-command{grid-template-columns:1fr}.mv-mission{grid-template-columns:1fr}.mv-day{grid-template-columns:1fr}.mv-target{grid-column:auto}}
    `;document.head.appendChild(s);
  }

  function getOpenItems(){
    const out=[];try{const a=JSON.parse(localStorage.getItem('HUUD_REALIDADE_V1')||'[]');if(Array.isArray(a))out.push(...a)}catch(e){}try{const a=JSON.parse(localStorage.getItem('HUUD_PENDENCIAS_V1')||'[]');if(Array.isArray(a))out.push(...a)}catch(e){}
    const seen=new Set();return out.filter(x=>{const k=String(x.id||x.title||x.name||Math.random());if(seen.has(k)||x.status==='RESOLVIDA')return false;seen.add(k);return true});
  }

  function open(id){
    if(id==='mar-verde'){showMarVerde();return}
    try{if(window.HUUD&&typeof window.HUUD.switchView==='function')window.HUUD.switchView(id);else{document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));const v=document.getElementById('view-'+id);if(v)v.classList.add('active')}}catch(e){}
  }

  function showMarVerde(){
    const flow=document.getElementById('view-flow');if(!flow)return;
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));flow.classList.add('active');
    let v=document.getElementById('huud-mar-verde-view');
    if(!v){v=document.createElement('div');v.id='huud-mar-verde-view';v.className='mv';flow.innerHTML='';flow.appendChild(v)}
    renderMarVerde(v);
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function renderMarVerde(v){
    const checks=JSON.parse(localStorage.getItem('HUUD_MAR_VERDE_CHECKS')||'{}');
    v.innerHTML=`<section class="mv-head"><div class="mv-label">MAR VERDE // OPERAÇÃO COMERCIAL</div><div class="mv-title">NOSSA MISSÃO É VENDER.</div><div class="mv-sub">A imobiliária deixa de ser um módulo genérico e vira uma operação conjunta: captar, atender, visitar, propor, negociar e fechar.</div><div class="mv-actions"><button class="h41-btn" onclick="window.__HUUD_MV_HOME()">← VOLTAR AO QG</button><button class="mv-share" onclick="window.__HUUD_MV_SHARE()">COMPARTILHAR AGENDA COM A RAFA →</button></div></section>
      <div class="mv-grid"><div class="mv-card"><div class="mv-label">MODO MISSÃO // IMOBILIÁRIA</div><h3>O ciclo da venda</h3><div class="mv-mission">${missionDefault.map(m=>`<div class="mv-mission-item"><b>${m[0]} // ${m[1]}</b><strong>${m[2]}</strong><span>${m[3]}</span></div>`).join('')}</div></div><div class="mv-card"><div class="mv-label">PACTO OPERACIONAL</div><h3>Construção em conjunto</h3><div class="mv-together">Nós dois não precisamos fazer a mesma coisa. Precisamos fazer a nossa parte, comunicar o que está acontecendo e empurrar a operação para frente. O objetivo é simples: <strong>vender, gerar caixa e fortalecer a Mar Verde.</strong></div><p class="mv-note" style="margin-top:10px">Regra: nenhuma negociação quente termina o dia sem responsável e próximo passo.</p></div></div>
      <section class="mv-card"><div class="mv-label">AGENDA OPERACIONAL // SEMANA DE VENDAS</div><h3>Rotina compartilhada</h3><div class="mv-agenda">${agendaDefault.map((a,i)=>`<div class="mv-day"><b>${a.day}</b><strong>${a.focus}</strong><span><b>DIMAS:</b> ${a.dimas}<br><b>RAFA:</b> ${a.rafa}</span><span class="mv-target">ALVO: ${a.target}</span></div>`).join('')}</div></section>
      <section class="mv-card"><div class="mv-label">CHECK-IN // HOJE</div><h3>Marcar o que foi executado</h3>${['Leads quentes trabalhados','Follow-ups realizados','Visitas confirmadas/realizadas','Propostas ou negociações avançadas','Próximo passo de cada negociação definido'].map((x,i)=>`<label class="mv-check"><input type="checkbox" ${checks[i]?'checked':''} onchange="window.__HUUD_MV_CHECK(${i},this.checked)"><span>${x}</span></label>`).join('')}</section>
      <div class="h41-footer">MAR VERDE // OPERAÇÃO CONJUNTA // CAPTAR • ATENDER • VISITAR • PROPOR • NEGOCIAR • FECHAR</div>`;
  }

  function shareMarVerde(){
    const text=`MAR VERDE // AGENDA OPERACIONAL DE VENDAS\n\nNOSSA MISSÃO: vender, gerar caixa e fortalecer a operação.\n\nSEGUNDA — Ataque comercial\n• Dimas: 10 leads prioritários + contatos ativos.\n• Rafa: atendimento + confirmação de visitas + retornos.\n\nTERÇA — Captação + estoque\n• Dimas: captação e proprietários.\n• Rafa: anúncios, informações e documentação.\n\nQUARTA — Follow-up\n• Dimas: leads quentes e propostas.\n• Rafa: reativação e próximos passos.\n\nQUINTA — Visitas + propostas\n• Dimas: visitas e negociação.\n• Rafa: agenda, confirmação e pós-visita.\n\nSEXTA — Fechamento\n• Dimas: objeções, decisão e assinatura.\n• Rafa: documentos e avanço das negociações.\n\nSÁBADO — Balanço\n• Revisar vendas, pipeline, caixa e próxima semana.\n\nREGRA: nenhuma negociação quente termina o dia sem responsável e próximo passo.\n\nVamos empurrar isso juntos.`;
    window.open('https://api.whatsapp.com/send?text='+encodeURIComponent(text),'_blank');
  }

  function home(){
    const flow=document.getElementById('view-flow');if(!flow)return;flow.innerHTML='';flow.dataset.h41ready='';renderHome();
  }

  function renderHome(){
    const v=document.getElementById('view-flow');if(!v)return;v.innerHTML=`<div class="h41"><section class="h41-hero"><div class="h41-copy"><div class="h41-k">DISCIPLINA OS // QG PRINCIPAL</div><div class="h41-title">ENCARAR.<br><em>DECIDIR.</em><br>EXECUTAR.</div><div class="h41-sub">O HUUD existe para colocar a realidade na sua frente, decidir o que realmente importa e transformar decisão em movimento.</div><div class="h41-actions"><button class="h41-btn" onclick="HUUD.openCommander()">ENTRAR NO MODO COMANDANTE →</button><button class="h41-btn alt" onclick="window.HUUD_R2&&HUUD_R2.open()">VER MAPA DA REALIDADE</button></div></div></section><section class="h41-command"><div><small>COMANDO DE HOJE // PRÓXIMO MOVIMENTO</small><h2 id="h41-command-title">CARREGANDO...</h2><p id="h41-command-copy">O HUUD está lendo as pendências abertas.</p></div><button class="h41-btn" onclick="HUUD.openCommander()">EXECUTAR</button></section><section><div class="h41-label">SISTEMAS DO HUUD</div><div class="h41-modules">${modules.map(m=>`<article class="h41-module" onclick="window.__HUUD_H41_OPEN('${m[3]}')"><div class="h41-num">${m[0]} // ${m[1]}</div><h3>${m[2]}</h3><p>${m[3]}</p><span class="h41-link">${m[4]}</span></article>`).join('')}</div></section><div class="h41-footer">HUUD OS // CONTEÚDO SEM AÇÃO É RUÍDO // A TELA NÃO É A MISSÃO</div></div>`;renderCommand();
  }

  function renderCommand(){
    const t=document.getElementById('h41-command-title'),c=document.getElementById('h41-command-copy');if(!t||!c)return;const items=getOpenItems();const rank=x=>x.risk==='CRÍTICA'?0:x.risk==='ALTA'?1:2;const x=items.slice().sort((a,b)=>rank(a)-rank(b))[0];if(x){t.textContent=x.title||x.name||'Situação em aberto';c.textContent=x.next||x.plan||'Defina o próximo passo concreto e execute.'}else{t.textContent='NENHUMA PENDÊNCIA CRÍTICA IDENTIFICADA';c.textContent='Quando não houver incêndio, o HUUD puxa construção, projeto e evolução.'}}

  function cleanPersonalLanguage(){
    try{
      if(typeof DIAGNOSTIC_DATA!=='undefined' && Array.isArray(DIAGNOSTIC_DATA)){
        DIAGNOSTIC_DATA[2]={block:'3. UNIÃO E RESPONSABILIDADE — Construção em conjunto',content:'<div class="diag-q">Diretriz:</div><div class="diag-a">Construir com responsabilidade, transparência e ação conjunta. Cada pessoa cuida da sua parte e o objetivo é fazer a vida avançar sem abandonar o que precisa ser resolvido.</div>'};
        DIAGNOSTIC_DATA[3]={block:'4. OPORTUNIDADES — Para onde aponta?',content:'<div class="diag-q">Vetor de construção:</div><div class="diag-a">Mar Verde como frente operacional de vendas e geração de caixa, enquanto TI + IA e os projetos digitais ampliam as possibilidades de crescimento.</div>'};
      }
    }catch(e){}
    const forbidden=[/viper/gi,/terminar relacionamento/gi,/terminar a relação/gi,/romper o relacionamento/gi,/romper com ela/gi,/relacionamento\s*—\s*viper/gi];
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(n=>{let s=n.nodeValue;for(const r of forbidden)s=s.replace(r,'CONSTRUÇÃO EM CONJUNTO');if(s!==n.nodeValue)n.nodeValue=s});
  }

  window.__HUUD_H41_OPEN=open;window.__HUUD_MV_HOME=home;window.__HUUD_MV_SHARE=shareMarVerde;window.__HUUD_MV_CHECK=function(i,v){const x=JSON.parse(localStorage.getItem('HUUD_MAR_VERDE_CHECKS')||'{}');x[i]=v;localStorage.setItem('HUUD_MAR_VERDE_CHECKS',JSON.stringify(x))};

  function boot(){addStyles();renderHome();cleanPersonalLanguage();setTimeout(cleanPersonalLanguage,500);setTimeout(cleanPersonalLanguage,1400);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();