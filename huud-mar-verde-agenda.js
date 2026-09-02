/* HUUD OS — QG MV // OPERAÇÃO DE ATAQUE V1
   A agenda antiga permanece preservada em HUUD_MAR_VERDE_AGENDA_V1.
   Esta camada transforma a experiência em uma operação semanal editável,
   mantendo missões, checks e relatórios existentes.
*/
(function(){
  'use strict';

  const LEGACY_KEY='HUUD_MAR_VERDE_AGENDA_V1';
  const OP_KEY='HUUD_MAR_VERDE_OPERACAO_V1';
  const CHECK_KEY=LEGACY_KEY+'_CHECKS';
  const REPORT_KEY=LEGACY_KEY+'_REPORTS';
  const DAYS=['SEGUNDA','TERÇA','QUARTA','QUINTA','SEXTA','SÁBADO'];
  const DEFAULTS=[
    {day:'SEGUNDA',focus:'ATAQUE À BASE',target:'Base organizada e todos os leads prioritários com próximo passo.',rafa:['Revisar todos os leads novos recebidos pela Laís.','Separar leads quentes, mornos e sem resposta.','Fazer contato com os leads que precisam de ação humana.','Reativar leads parados com abordagem direta.','Registrar no CRM o resultado e o próximo passo.'],dimas:['Revisar estoque disponível e prioridades comerciais.','Definir imóveis prioritários para venda na semana.','Assumir negociações que exigem comando.','Revisar oportunidades de fechamento.']},
    {day:'TERÇA',focus:'DIA DE CAPTAÇÃO',target:'Novas oportunidades de captação qualificadas.',rafa:['Prospectar proprietários para novos imóveis.','Fazer follow-up de proprietários já contatados.','Qualificar preço, localização, condição e intenção de venda/locação.','Agendar visita de captação quando houver oportunidade real.','Registrar cada contato e resultado no CRM.'],dimas:['Apoiar captações qualificadas.','Avaliar imóveis com potencial comercial.','Conduzir proprietários que exigirem negociação.']},
    {day:'QUARTA',focus:'REATIVAÇÃO E FOLLOW-UP',target:'Nenhum lead quente ou oportunidade relevante abandonada.',rafa:['Trabalhar leads parados do CRM.','Retomar clientes que demonstraram interesse e sumiram.','Confirmar visitas futuras.','Cobrar retorno de clientes que ficaram de decidir.','Registrar tudo no CRM.'],dimas:['Entrar nas oportunidades quentes.','Resolver objeções e negociações travadas.','Conduzir clientes próximos de proposta.']},
    {day:'QUINTA',focus:'VISITAS E CONVERSÃO',target:'Visitas realizadas com resultado definido.',rafa:['Confirmar todas as visitas do dia seguinte.','Organizar horários e informações dos clientes.','Fazer pós-visita dos clientes atendidos.','Identificar quem avançou e quem precisa de novo contato.','Atualizar o CRM.'],dimas:['Realizar/conduzir visitas prioritárias.','Apresentar imóveis e trabalhar objeções.','Transformar interesse em proposta ou próximo passo.']},
    {day:'SEXTA',focus:'FECHAMENTO',target:'Nenhuma oportunidade quente termina a semana sem responsável e próximo passo.',rafa:['Revisar todas as oportunidades quentes.','Cobrar retornos pendentes.','Organizar documentos das negociações em avanço.','Confirmar próximos passos com clientes e proprietários.','Atualizar o CRM antes de encerrar o dia.'],dimas:['Conduzir negociações.','Trabalhar objeções finais.','Buscar proposta, aceite e assinatura.','Definir o que precisa ser resolvido na próxima semana.']},
    {day:'SÁBADO',focus:'PRESTAÇÃO DE CONTAS',target:'Semana encerrada com números, fatos e próxima ação definida.',rafa:['Fechar o relatório da semana.','Informar contatos realizados e resultados.','Listar captações geradas.','Listar leads reativados e visitas geradas.','Listar pendências que passam para a próxima semana.'],dimas:['Revisar resultado comercial da semana.','Identificar gargalos.','Definir prioridades da próxima semana.']}
  ];

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read=(k,f)=>{try{const x=JSON.parse(localStorage.getItem(k)||'null');return x??f}catch(e){return f}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const uid=()=>Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,7);

  function legacy(){
    const x=read(LEGACY_KEY,null);
    return Array.isArray(x)&&x.length?x:DEFAULTS.map(x=>JSON.parse(JSON.stringify(x)));
  }

  function operation(){
    const existing=read(OP_KEY,null);
    if(existing&&Array.isArray(existing.days)&&existing.days.length===6)return existing;
    const src=legacy();
    const out={version:1,name:'OPERAÇÃO DE ATAQUE',mission:'Gerar receita através da operação Mar Verde Imóveis.',weeklyTarget:'Definir resultado comercial da semana.',days:DAYS.map((day,i)=>{
      const d=src[i]||DEFAULTS[i];
      return {day,focus:d.focus||day,target:d.target||'',attacks:[...(d.rafa||[]).map(t=>({id:uid(),who:'RAFAELLA',title:t,result:'',status:'OPEN'})),...(d.dimas||[]).map(t=>({id:uid(),who:'DIMAS',title:t,result:'',status:'OPEN'}))]};
    })};
    write(OP_KEY,out);return out;
  }

  function checks(){return read(CHECK_KEY,{});} 
  function reports(){return read(REPORT_KEY,{});} 
  function setCheck(id,val){const x=checks();x[id]=!!val;write(CHECK_KEY,x);render();}
  function setReport(day,who,val){const x=reports();x[day+'_'+who]=val;write(REPORT_KEY,x);}

  function css(){
    if(document.getElementById('mv-op-css'))return;
    const s=document.createElement('style');s.id='mv-op-css';s.textContent=`
      #huud-mar-verde-view.mvop{display:grid;gap:14px;padding-bottom:34px}
      .mvop-head{border:1px solid #222b36;border-left:4px solid var(--neon);border-radius:13px;background:linear-gradient(135deg,#090c10,#05070a);padding:22px;position:relative;overflow:hidden}
      .mvop-k{font:900 .58rem var(--mono);letter-spacing:2px;color:var(--neon)}
      .mvop-title{font-size:clamp(1.8rem,4vw,3rem);font-weight:900;letter-spacing:-1px;margin:7px 0;line-height:1}
      .mvop-title span{color:var(--neon)}
      .mvop-sub{max-width:850px;color:#8d99a9;font-size:.7rem;line-height:1.55}
      .mvop-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
      .mvop-btn{border:1px solid var(--neon);background:var(--neon);color:#000;border-radius:5px;padding:10px 13px;font:900 .57rem var(--mono);letter-spacing:1px;cursor:pointer}
      .mvop-btn.alt{background:transparent;color:var(--neon)}
      .mvop-week{display:grid;grid-template-columns:repeat(6,minmax(145px,1fr));gap:7px;overflow-x:auto;padding-bottom:3px}
      .mvop-daytab{border:1px solid var(--border);background:var(--bg-card);border-radius:8px;padding:11px;cursor:pointer;min-width:145px;text-align:left}
      .mvop-daytab.active{border-color:var(--neon);box-shadow:0 0 14px var(--neon-glow);background:#0d1208}
      .mvop-daytab b{display:block;font:900 .58rem var(--mono);color:var(--neon);letter-spacing:1px}.mvop-daytab span{display:block;margin-top:5px;font-size:.68rem;font-weight:800}.mvop-daytab small{display:block;margin-top:5px;color:#657184;font:700 .5rem var(--mono)}
      .mvop-grid{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(280px,.8fr);gap:14px}
      .mvop-panel{border:1px solid var(--border);border-radius:11px;background:var(--bg-card);overflow:hidden}
      .mvop-panel-head{padding:15px 17px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;gap:10px;align-items:center}.mvop-panel-head strong{font-size:.85rem}.mvop-label{font:900 .54rem var(--mono);letter-spacing:1.5px;color:var(--neon)}
      .mvop-target{padding:12px 17px;background:#0b0f14;border-bottom:1px solid var(--border);font-size:.68rem;color:#aab4c2}.mvop-target b{font:900 .54rem var(--mono);color:#697789;display:block;margin-bottom:4px}
      .mvop-attacks{padding:10px;display:grid;gap:7px}.mvop-attack{border:1px solid var(--border);background:var(--bg-card-elevated);border-radius:8px;padding:11px;display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center}.mvop-attack.done{opacity:.46}.mvop-attack.done .mvop-attack-title{text-decoration:line-through}.mvop-check{width:18px;height:18px;accent-color:var(--neon);cursor:pointer}.mvop-attack-who{font:900 .5rem var(--mono);letter-spacing:1px;color:var(--neon);margin-bottom:3px}.mvop-attack-title{font-size:.72rem;font-weight:700;line-height:1.35}.mvop-attack-result{font:700 .52rem var(--mono);color:#677487;margin-top:5px}.mvop-move{border:1px solid #303b4b;background:transparent;color:#8f9bad;border-radius:4px;padding:6px;font:700 .5rem var(--mono);cursor:pointer}.mvop-score{display:grid;grid-template-columns:1fr 1fr;gap:7px;padding:10px}.mvop-stat{padding:12px;border:1px solid var(--border);background:var(--bg-card-elevated);border-radius:7px}.mvop-stat b{display:block;font:900 .52rem var(--mono);color:#687587}.mvop-stat strong{display:block;font:900 1.3rem var(--mono);margin-top:4px}.mvop-report{padding:12px;border-top:1px solid var(--border)}.mvop-report label{display:block;font:900 .5rem var(--mono);letter-spacing:1px;color:#687587;margin:8px 0 5px}.mvop-report textarea{width:100%;min-height:76px;box-sizing:border-box;background:#080b0f;color:var(--text);border:1px solid var(--border);border-radius:6px;padding:9px;font:600 .62rem var(--mono);resize:vertical}
      .mvop-edit{display:grid;gap:10px;padding:12px}.mvop-edit-day{border:1px solid var(--border);border-radius:8px;padding:13px;background:var(--bg-card)}.mvop-edit-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.mvop-edit label{display:block;font:900 .52rem var(--mono);letter-spacing:1px;color:var(--neon);margin:6px 0 4px}.mvop-edit input,.mvop-edit textarea{width:100%;box-sizing:border-box;background:#080b0f;border:1px solid var(--border);color:var(--text);border-radius:5px;padding:8px;font:600 .62rem var(--mono)}.mvop-edit textarea{min-height:120px;resize:vertical}.mvop-note{padding:12px 15px;color:#5d6979;font:600 .52rem var(--mono);line-height:1.5;border-top:1px solid var(--border)}
      @media(max-width:900px){.mvop-grid{grid-template-columns:1fr}.mvop-week{grid-template-columns:repeat(6,145px)}}@media(max-width:620px){.mvop-edit-grid{grid-template-columns:1fr}.mvop-title{font-size:1.8rem}}
    `;document.head.appendChild(s);
  }

  let selected=0;

  function migrateLegacyIntoOperation(){
    const op=read(OP_KEY,null);if(op&&Array.isArray(op.days)&&op.days.length===6)return op;
    return operation();
  }

  function moveAttack(id){
    const op=operation();let found=null,from=-1;
    op.days.forEach((d,i)=>{const a=d.attacks.find(x=>x.id===id);if(a){found=a;from=i}});
    if(!found)return;
    const dest=prompt('Mover ataque para: SEGUNDA, TERÇA, QUARTA, QUINTA, SEXTA ou SÁBADO',op.days[from].day);
    if(!dest)return;const idx=op.days.findIndex(d=>d.day===dest.trim().toUpperCase());if(idx<0){alert('Dia inválido.');return}
    op.days[from].attacks=op.days[from].attacks.filter(x=>x.id!==id);op.days[idx].attacks.push(found);write(OP_KEY,op);selected=idx;render();
  }

  function editOperation(){
    const op=operation();const v=document.getElementById('huud-mar-verde-view');if(!v)return;css();
    v.className='mvop';v.innerHTML=`<section class="mvop-head"><div class="mvop-k">QG MV // CONFIGURAÇÃO DA OPERAÇÃO</div><div class="mvop-title">EDITAR <span>OPERAÇÃO</span></div><div class="mvop-sub">A operação é semanal e editável. Você pode mudar missão, alvo, foco e ataques sem apagar o histórico antigo. A estrutura original continua preservada em ${LEGACY_KEY}.</div><div class="mvop-actions"><button class="mvop-btn" onclick="window.__MVO_SAVE()">SALVAR OPERAÇÃO</button><button class="mvop-btn alt" onclick="window.__MVO_RENDER()">CANCELAR</button></div></section><section class="mvop-panel mvop-edit">${op.days.map((d,i)=>`<div class="mvop-edit-day"><div class="mvop-label">${d.day}</div><label>FOCO DA OPERAÇÃO</label><input id="mvo_focus_${i}" value="${esc(d.focus)}"><label>ALVO / RESULTADO ESPERADO</label><input id="mvo_target_${i}" value="${esc(d.target)}"><label>ATAQUES — uma linha por ataque. Formato: RESPONSÁVEL | ATAQUE | RESULTADO</label><textarea id="mvo_attacks_${i}">${esc(d.attacks.map(a=>a.who+' | '+a.title+' | '+(a.result||'')).join('\n'))}</textarea></div>`).join('')}</section>`;
  }

  function saveOperation(){
    const op=operation();for(let i=0;i<6;i++){op.days[i].focus=document.getElementById('mvo_focus_'+i).value.trim();op.days[i].target=document.getElementById('mvo_target_'+i).value.trim();const lines=document.getElementById('mvo_attacks_'+i).value.split('\n').map(x=>x.trim()).filter(Boolean);op.days[i].attacks=lines.map(line=>{const p=line.split('|').map(x=>x.trim());return{id:uid(),who:(p[0]||'DIMAS').toUpperCase().includes('RAFA')?'RAFAELLA':'DIMAS',title:p[1]||p[0]||'Ataque operacional',result:p[2]||'',status:'OPEN'}})}write(OP_KEY,op);render();
  }

  function render(){
    const v=document.getElementById('huud-mar-verde-view');if(!v)return;css();
    const op=migrateLegacyIntoOperation(),day=op.days[selected]||op.days[0],ch=checks(),rp=reports();
    const attacks=day.attacks||[],done=attacks.filter(a=>ch[a.id]).length,rafa=attacks.filter(a=>a.who==='RAFAELLA').length,dimas=attacks.filter(a=>a.who==='DIMAS').length;
    v.className='mvop';v.innerHTML=`<section class="mvop-head"><div class="mvop-k">QG MV // OPERAÇÃO DE ATAQUE</div><div class="mvop-title">MAR VERDE <span>OPERAÇÃO</span></div><div class="mvop-sub"><strong>MISSÃO:</strong> ${esc(op.mission)}<br>O QG MV é a operação que transforma trabalho comercial em receita. Não é calendário: é comando, ataque, resultado e correção.</div><div class="mvop-actions"><button class="mvop-btn" onclick="window.__MVO_EDIT()">EDITAR OPERAÇÃO</button><button class="mvop-btn alt" onclick="window.__MVO_NEW_ATTACK()">+ NOVO ATAQUE</button><button class="mvop-btn alt" onclick="window.__HUUD_MV_HOME&&window.__HUUD_MV_HOME()">← VOLTAR AO QG</button></div></section><section class="mvop-week">${op.days.map((d,i)=>{const total=d.attacks.length,dd=d.attacks.filter(a=>ch[a.id]).length;return `<button class="mvop-daytab ${i===selected?'active':''}" onclick="window.__MVO_DAY(${i})"><b>${d.day}</b><span>${esc(d.focus)}</span><small>${dd}/${total} ATAQUES EXECUTADOS</small></button>`}).join('')}</section><section class="mvop-grid"><div class="mvop-panel"><div class="mvop-panel-head"><div><div class="mvop-label">DIA ${selected+1} // ATAQUE</div><strong>${day.day} — ${esc(day.focus)}</strong></div><div class="mvop-label">${done}/${attacks.length} FEITOS</div></div><div class="mvop-target"><b>ALVO DO DIA</b>${esc(day.target)}</div><div class="mvop-attacks">${attacks.length?attacks.map(a=>`<div class="mvop-attack ${ch[a.id]?'done':''}"><input class="mvop-check" type="checkbox" ${ch[a.id]?'checked':''} onchange="window.__MVO_CHECK('${a.id}',this.checked)"><div><div class="mvop-attack-who">${esc(a.who)}</div><div class="mvop-attack-title">${esc(a.title)}</div>${a.result?`<div class="mvop-attack-result">RESULTADO: ${esc(a.result)}</div>`:''}</div><button class="mvop-move" onclick="window.__MVO_MOVE('${a.id}')">MOVER</button></div>`).join(''):'<div class="mvop-note">Nenhum ataque definido para este dia. Crie um ataque e coloque um resultado esperado.</div>'}</div></div><aside class="mvop-panel"><div class="mvop-panel-head"><div><div class="mvop-label">FORÇA OPERACIONAL</div><strong>${rafa} Rafaella • ${dimas} Dimas</strong></div></div><div class="mvop-score"><div class="mvop-stat"><b>EXECUTADOS</b><strong>${done}</strong></div><div class="mvop-stat"><b>RESTANTES</b><strong>${Math.max(0,attacks.length-done)}</strong></div></div><div class="mvop-report"><div class="mvop-label">RELATÓRIO DO DIA</div><label>RAFAELLA // EXECUÇÃO</label><textarea placeholder="O que foi feito, resultado e o que ficou pendente..." onchange="window.__MVO_REPORT('${day.day}','rafa',this.value)">${esc(rp[day.day+'_rafa']||'')}</textarea><label>DIMAS // COMANDO</label><textarea placeholder="Decisões, negociações, travas e correções..." onchange="window.__MVO_REPORT('${day.day}','dimas',this.value)">${esc(rp[day.day+'_dimas']||'')}</textarea></div></aside></section><div class="mvop-panel"><div class="mvop-note"><strong>FLUXO:</strong> PLANEJAR → ATACAR → REGISTRAR → MEDIR → CORRIGIR. &nbsp; • &nbsp; A operação antiga não foi apagada; esta interface usa uma camada nova em ${OP_KEY}.</div></div>`;
  }

  function newAttack(){
    const op=operation();const title=prompt('Qual ataque vamos executar?');if(!title)return;const who=prompt('Quem executa? Digite DIMAS ou RAFAELLA','DIMAS')||'DIMAS';const result=prompt('Qual resultado concreto esperamos?','');const d=prompt('Dia? SEGUNDA, TERÇA, QUARTA, QUINTA, SEXTA ou SÁBADO',op.days[selected].day)||op.days[selected].day;const idx=op.days.findIndex(x=>x.day===d.trim().toUpperCase());if(idx<0){alert('Dia inválido.');return}op.days[idx].attacks.push({id:uid(),who:who.toUpperCase().includes('RAFA')?'RAFAELLA':'DIMAS',title,result:result||'',status:'OPEN'});write(OP_KEY,op);selected=idx;render();
  }

  function open(){
    try{if(typeof window.HUUD?.switchView==='function')window.HUUD.switchView('land')}catch(e){}
    setTimeout(render,0);window.scrollTo({top:0,behavior:'smooth'});
  }

  window.__MVO_RENDER=render;window.__MVO_EDIT=editOperation;window.__MVO_SAVE=saveOperation;window.__MVO_DAY=i=>{selected=Math.max(0,Math.min(5,Number(i)||0));render()};window.__MVO_CHECK=setCheck;window.__MVO_REPORT=setReport;window.__MVO_MOVE=moveAttack;window.__MVO_NEW_ATTACK=newAttack;window.__MVO_OPEN=open;
  window.__MVA_RENDER=render;window.__MVA_EDIT=editOperation;window.__MVA_SAVE=saveOperation;window.__MVA_RESET=function(){if(confirm('Restaurar a operação inicial? A camada operacional será recriada, mas a agenda antiga permanece preservada.')){localStorage.removeItem(OP_KEY);localStorage.removeItem(CHECK_KEY);localStorage.removeItem(REPORT_KEY);render()}};window.__MVA_CHECK=setCheck;window.__MVA_REPORT=setReport;window.__MVA_OPEN=open;

  function boot(){
    const original=window.__HUUD_H41_OPEN;
    if(typeof original==='function'&&!window.__MVO_NAV){window.__MVO_NAV=true;window.__HUUD_H41_OPEN=function(id){if(id==='mar-verde')return open();return original(id)}}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{boot();setTimeout(()=>{if(document.getElementById('huud-mar-verde-view')&&document.getElementById('view-land')?.classList.contains('active'))render()},250)});else{boot();setTimeout(render,250)}
})();
