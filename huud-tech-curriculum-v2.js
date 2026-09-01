/* HUUD OS — SALA DE AULA TI + IA V2
   Curso prático: básico -> avançado. Cada aula tem objetivo, prática e aplicação nos produtos.
*/
(function(){
'use strict';
const lessons=[
['D01','Como a internet funciona','BÁSICO','Entender navegador, servidor, URL, HTTP e arquivos.','Mapeie no papel o caminho de uma página até o navegador.','Base para entender qualquer sistema.'],
['D02','Terminal sem medo','BÁSICO','Aprender cd, ls, mkdir, cp, mv, rm e pwd.','Crie uma pasta de laboratório e organize três arquivos pelo terminal.','Preparar ambiente de desenvolvimento.'],
['D03','VS Code e projeto','BÁSICO','Editor, extensões, pastas e organização.','Abra um projeto e identifique HTML, CSS e JS.','Organização do HUUD.'],
['D04','HTML: estrutura','BÁSICO','Tags, semântica, links, imagens e formulários.','Monte uma página de perfil do comandante.','Primeira interface real.'],
['D05','HTML: formulários','BÁSICO','Inputs, labels, buttons e acessibilidade.','Crie um formulário de pendência.','Base do Mapa da Realidade.'],
['D06','CSS: fundamentos','BÁSICO','Box model, cores, tipografia e espaçamento.','Reproduza um card tático do HUUD.','Sistema visual.'],
['D07','CSS: Flexbox','BÁSICO','Alinhamento, distribuição e responsividade.','Monte o cabeçalho e uma barra de navegação.','Layout profissional.'],
['D08','CSS: Grid','BÁSICO','Colunas, áreas e grids adaptáveis.','Monte a Home com módulos responsivos.','Dashboard sem gambiarra.'],
['D09','CSS: estados e animação','BÁSICO','Hover, focus, transitions e keyframes.','Crie uma microinteração de missão.','UX de alto nível.'],
['D10','JavaScript: lógica','BÁSICO','Variáveis, tipos, operadores e condições.','Crie um seletor de prioridade.','Motor de decisão.'],
['D11','JavaScript: funções','BÁSICO','Funções, parâmetros, retorno e escopo.','Transforme uma ação em função reutilizável.','Código sustentável.'],
['D12','Arrays e objetos','BÁSICO','Estruturas de dados e métodos principais.','Modele uma lista de missões em JavaScript.','Dados do HUUD.'],
['D13','DOM e eventos','BÁSICO','Selecionar elementos, alterar conteúdo e responder a cliques.','Faça uma missão mudar de estado.','Interação real.'],
['D14','LocalStorage','BÁSICO','Persistência no navegador e JSON.','Salve e recupere uma pendência.','Entender persistência antes do banco.'],
['D15','Async/Await','BÁSICO','Promises, async, await e erros.','Consuma uma API pública e trate falhas.','Base para integrações.'],
['D16','Git: versionamento','BÁSICO','Commit, diff, log e histórico.','Faça uma alteração pequena e registre um commit.','Nunca perder trabalho.'],
['D17','GitHub: repositório','BÁSICO','Repo, branch, push e pull.','Publique seu exercício no GitHub.','Fluxo usado no HUUD.'],
['D18','GitHub: colaboração','BÁSICO','Branches, PRs e revisão.','Crie uma branch experimental do HUUD.','Trabalhar profissionalmente.'],
['D19','Debugging','BÁSICO','Console, erros, inspeção e método de diagnóstico.','Encontre e corrija um bug proposital.','Parar de “chutar” código.'],
['D20','Projeto básico','BÁSICO','Juntar HTML, CSS, JS e Git.','Construir uma mini tela de missão completa.','Primeiro produto funcional.'],
['D21','HTTP e APIs','INTERMEDIÁRIO','GET, POST, headers, status e JSON.','Faça chamadas GET e POST de teste.','Comunicação entre sistemas.'],
['D22','REST na prática','INTERMEDIÁRIO','Recursos, endpoints e contratos.','Desenhe a API de missões do HUUD.','Arquitetura de dados.'],
['D23','Autenticação','INTERMEDIÁRIO','Sessão, usuário, senha, token e segurança básica.','Mapeie o fluxo de login de um usuário.','Base do app real.'],
['D24','Supabase: Postgres','INTERMEDIÁRIO','Tabelas, colunas, chaves e relacionamentos.','Modele usuários, missões e pendências.','Banco do Disciplina OS.'],
['D25','Supabase: queries','INTERMEDIÁRIO','Select, insert, update, delete e filtros.','Salvar e listar uma missão.','Persistência real.'],
['D26','Supabase: RLS','INTERMEDIÁRIO','Row Level Security e isolamento de dados.','Defina a regra: usuário só vê seus dados.','Segurança essencial.'],
['D27','Supabase Auth','INTERMEDIÁRIO','Cadastro, login, sessão e logout.','Ligue autenticação a um projeto de teste.','Conta real.'],
['D28','Supabase Storage','INTERMEDIÁRIO','Buckets, upload e URLs.','Faça upload de uma imagem de perfil.','Avatar do HUUD.'],
['D29','React: componentes','INTERMEDIÁRIO','Componentização e composição.','Converta um card do HUUD em componente mentalmente e depois em código.','Interface escalável.'],
['D30','React: estado','INTERMEDIÁRIO','State, props e fluxo de dados.','Modele o estado de uma missão.','UX reativa.'],
['D31','React: hooks','INTERMEDIÁRIO','useState, useEffect e dependências.','Carregue dados e reaja a mudanças.','Dados vivos.'],
['D32','Next.js: App Router','INTERMEDIÁRIO','Rotas, layouts e páginas.','Estruture Home, Realidade e Missões.','Arquitetura do produto.'],
['D33','Server e Client','INTERMEDIÁRIO','Quando executar no servidor ou navegador.','Separe uma tela em responsabilidades.','Performance e segurança.'],
['D34','Server Actions','INTERMEDIÁRIO','Mutação de dados no servidor.','Planeje uma ação para concluir missão.','Fluxo seguro.'],
['D35','Deploy na Vercel','INTERMEDIÁRIO','Build, deploy, domínio e variáveis.','Publique um projeto simples.','Produto online.'],
['D36','UI/UX: hierarquia','INTERMEDIÁRIO','O que deve chamar atenção e o que deve desaparecer.','Redesenhe uma tela ruim em wireframe.','Menos CRM, mais decisão.'],
['D37','Design system','INTERMEDIÁRIO','Tokens, componentes, estados e consistência.','Defina tokens do HUUD.','Escala visual.'],
['D38','Microinterações','INTERMEDIÁRIO','Feedback, loading, sucesso e erro.','Crie estados para uma missão.','Experiência premium.'],
['D39','IA generativa','INTERMEDIÁRIO','LLM, contexto, prompt e limitações.','Escreva um prompt para transformar realidade em ação.','Motor inteligente.'],
['D40','Structured output','INTERMEDIÁRIO','Fazer IA devolver dados previsíveis.','Defina um JSON para uma missão gerada.','IA conectada ao banco.'],
['D41','Embeddings','INTERMEDIÁRIO','Representação semântica e busca por significado.','Entenda como buscar experiências semelhantes.','Memória inteligente.'],
['D42','RAG','INTERMEDIÁRIO','Recuperação de contexto antes da geração.','Desenhe um RAG para o histórico do usuário.','IA com contexto real.'],
['D43','Agentes','INTERMEDIÁRIO','Modelo, ferramentas, contexto e loop.','Desenhe um agente que lê pendências e propõe próximo passo.','Motor de decisão.'],
['D44','Segurança com IA','INTERMEDIÁRIO','Prompt injection, dados sensíveis e permissões.','Liste ameaças ao agente do HUUD.','IA responsável.'],
['D45','Vercel AI SDK','AVANÇADO','Streaming, chat e geração no produto.','Monte a arquitetura de um chat HUUD.','Conversar dentro do OS.'],
['D46','Tools e function calling','AVANÇADO','IA chamando funções reais.','Desenhe tools para criar e concluir missão.','IA que executa.'],
['D47','Agentes persistentes','AVANÇADO','Estado, memória e continuidade.','Defina o estado de um agente pessoal.','Assistente de longo prazo.'],
['D48','WhatsApp + Evolution API','AVANÇADO','Webhook, eventos, mensagens e sessão.','Mapeie o fluxo WhatsApp -> agente -> Supabase.','Venom/WhatsApp.'],
['D49','Webhooks','AVANÇADO','Eventos, assinatura e idempotência.','Projete webhook de nova mensagem.','Integrações confiáveis.'],
['D50','Automação','AVANÇADO','Make, Zapier, jobs e filas.','Desenhe uma automação útil para negócio.','Operação sem trabalho manual.'],
['D51','Arquitetura','AVANÇADO','Camadas, domínio, serviços e contratos.','Desenhe a arquitetura do Disciplina OS.','Produto escalável.'],
['D52','Observabilidade','AVANÇADO','Logs, erros, métricas e tracing.','Defina o que precisa ser monitorado.','Saber quando algo quebra.'],
['D53','Produto e métricas','AVANÇADO','Ativação, retenção, conversão e valor.','Escolha 5 métricas do HUUD.','Construir produto, não só código.'],
['D54','Go Paraguay Go: sistema','AVANÇADO','Catálogo, pesquisa, preço, margem e operação.','Modele banco e fluxo comercial.','Produto comercial real.'],
['D55','Disciplina OS: sistema','AVANÇADO','Diagnóstico -> realidade -> decisão -> missão -> medição.','Modele o motor completo.','O coração do HUUD.'],
['D56','Integração total','AVANÇADO','Unir IA, Supabase, interface e automações.','Desenhe o fluxo ponta a ponta.','Arquitetura de produto.'],
['D57','Teste de produto','AVANÇADO','Testes funcionais, UX e regressão.','Crie checklist de lançamento.','Qualidade.'],
['D58','Performance','AVANÇADO','Bundle, imagens, cache e carregamento.','Liste os maiores gargalos possíveis.','Produto rápido.'],
['D59','Deploy profissional','AVANÇADO','Ambientes, variáveis, rollback e releases.','Planeje staging e produção.','Operação profissional.'],
['D60','Projeto final','AVANÇADO','Construir, publicar e apresentar um produto completo.','Escolha uma feature e leve até produção.','Disciplina OS + GO PARAGUAY GO.']
];
function render(){
 const v=document.getElementById('view-tech');if(!v||v.dataset.course2)return;v.dataset.course2='1';
 const sec=document.createElement('section');sec.className='huud-course-v2';sec.innerHTML=`<div class="course-v2-head"><div><div class="course-k">ACADEMIA HUUD // TI + IA</div><h2>DO ZERO AO <span>CONSTRUTOR</span></h2><p>60 dias. Uma aula por dia. Você aprende tecnologia construindo as duas coisas que importam: <b>Disciplina OS</b> e <b>GO PARAGUAY GO</b>.</p></div><div class="course-total">60<br><small>AULAS</small></div></div><div class="course-filter"><button data-f="TODOS">TODOS</button><button data-f="BÁSICO">BÁSICO</button><button data-f="INTERMEDIÁRIO">INTERMEDIÁRIO</button><button data-f="AVANÇADO">AVANÇADO</button></div><div class="course-list">${lessons.map((l,i)=>`<details class="course-day" data-level="${l[2]}"><summary><span class="day-num">${l[0]}</span><span class="day-title"><b>${l[1]}</b><small>${l[2]}</small></span><span class="day-arrow">+</span></summary><div class="day-body"><div><b>OBJETIVO</b><p>${l[2]&&l[2]!=='BÁSICO'?l[2]+' — ':''}${l[3]}</p></div><div><b>MISSÃO PRÁTICA</b><p>${l[4]}</p></div><div><b>APLICAÇÃO</b><p>${l[5]}</p></div><button class="lesson-action" onclick="this.textContent=this.textContent.includes('CONCLUÍDA')?'MARCAR COMO CONCLUÍDA':'✓ AULA CONCLUÍDA';this.closest('details').classList.toggle('done')">MARCAR COMO CONCLUÍDA</button></div></details>`).join('')}</div>`;
 v.appendChild(sec);
 sec.querySelectorAll('.course-filter button').forEach(btn=>btn.onclick=()=>{sec.querySelectorAll('.course-filter button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.f;sec.querySelectorAll('.course-day').forEach(d=>d.style.display=f==='TODOS'||d.dataset.level===f?'block':'none')});sec.querySelector('[data-f="TODOS"]').click();
}
function css(){if(document.getElementById('huud-course-v2-css'))return;const s=document.createElement('style');s.id='huud-course-v2-css';s.textContent=`.huud-course-v2{margin-top:18px}.course-v2-head{display:grid;grid-template-columns:1fr auto;gap:16px;align-items:center;border:1px solid #1c232d;background:linear-gradient(120deg,#080b0f,#0b0e13);border-radius:14px;padding:22px}.course-k{font:900 .58rem var(--mono);letter-spacing:2px;color:var(--neon)}.course-v2-head h2{font-size:clamp(1.7rem,4vw,3rem);line-height:.95;margin:8px 0}.course-v2-head h2 span{color:var(--neon)}.course-v2-head p{font-size:.72rem;color:var(--text-muted);line-height:1.5;max-width:720px}.course-total{font:900 4rem/.75 var(--mono);color:var(--neon);text-align:right}.course-total small{font-size:.55rem;letter-spacing:2px;color:var(--text-muted)}.course-filter{display:flex;gap:6px;overflow:auto;padding:12px 0}.course-filter button{background:#090c10;border:1px solid #1c232d;color:#7d8999;border-radius:5px;padding:7px 10px;font:800 .56rem var(--mono);cursor:pointer}.course-filter button.active{background:var(--neon);color:#000;border-color:var(--neon)}.course-list{display:grid;gap:6px}.course-day{border:1px solid #171e27;border-radius:8px;background:#080b0f;overflow:hidden}.course-day.done{border-color:#46520b}.course-day summary{list-style:none;display:grid;grid-template-columns:55px 1fr 25px;align-items:center;padding:12px 14px;cursor:pointer}.course-day summary::-webkit-details-marker{display:none}.day-num{font:900 .6rem var(--mono);color:var(--neon)}.day-title b{font-size:.75rem}.day-title small{display:block;color:#667286;font:700 .5rem var(--mono);margin-top:3px}.day-arrow{font:900 1rem var(--mono);color:#5c6878}.course-day[open] .day-arrow{transform:rotate(45deg)}.day-body{border-top:1px solid #171e27;padding:14px;display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:14px;align-items:end}.day-body b{font:900 .52rem var(--mono);color:var(--neon);letter-spacing:1px}.day-body p{font-size:.65rem;color:#8793a4;line-height:1.45;margin-top:5px}.lesson-action{border:1px solid var(--neon);background:transparent;color:var(--neon);padding:9px;border-radius:4px;font:900 .55rem var(--mono);cursor:pointer;white-space:nowrap}.course-day.done .lesson-action{background:var(--neon);color:#000}@media(max-width:800px){.course-v2-head{grid-template-columns:1fr}.course-total{text-align:left;font-size:3rem}.day-body{grid-template-columns:1fr}.course-day summary{grid-template-columns:45px 1fr 20px}}`;document.head.appendChild(s)}
function boot(){css();render();setTimeout(()=>{css();render()},500)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();