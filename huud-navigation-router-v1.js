/* HUUD OS — NAV ROUTER V1
   Autoridade única de navegação. Compatibilidade com o núcleo legado.
*/
(function(){
  'use strict';
  if(window.__HUUD_ROUTER_V1)return;
  window.__HUUD_ROUTER_V1=true;

  const ROUTES={
    home:'flow', realidade:'realidade-v2', pendencias:'pendencias', financas:'debts',
    qgmv:'qg-mv', tecnologia:'tech', paraguai:'py'
  };
  const LEGACY={
    'realidade-v2':'realidade','pendencias':'pendencias','debts':'financas',
    'land':'qgmv','mar-verde':'qgmv','qg-mv':'qgmv','tech':'tecnologia','py':'paraguai','flow':'home'
  };

  function showView(id){
    const target=document.getElementById('view-'+id);
    if(!target)return false;
    document.querySelectorAll('.view').forEach(v=>{v.style.display='none';v.classList.remove('active')});
    target.style.display='block';target.classList.add('active');
    document.querySelectorAll('.nav-pill,.nav-btn').forEach(el=>el.classList.remove('active'));
    window.scrollTo({top:0,behavior:'smooth'});
    return true;
  }

  function openQGMV(){
    if(!showView('land'))return false;
    const v=document.getElementById('huud-mar-verde-view');
    if(v&&typeof window.__MVA_RENDER==='function'){
      try{window.__MVA_RENDER()}catch(e){console.error('[HUUD ROUTER] QG MV render',e)}
    }
    document.querySelectorAll('.nav-pill,.nav-btn').forEach(el=>{
      const t=(el.textContent||'').trim().toUpperCase();
      if(t==='QG MV'||t.includes('MAR VERDE'))el.classList.add('active');
    });
    return true;
  }

  function canonical(id){return LEGACY[String(id||'').toLowerCase()]||String(id||'').toLowerCase()}
  function navigate(id){
    const key=canonical(id);
    if(key==='home')return showView('flow');
    if(key==='qgmv')return openQGMV();
    if(key==='realidade'&&window.HUUD_R2&&typeof window.HUUD_R2.open==='function')return window.HUUD_R2.open();
    const target=ROUTES[key]||id;
    return showView(target);
  }

  function install(){
    if(!window.HUUD||typeof window.HUUD.switchView!=='function')return false;
    const legacySwitch=window.HUUD.switchView;
    window.HUUD.switchView=function(id){
      if(canonical(id)==='qgmv')return navigate('qg-mv');
      return legacySwitch.apply(this,arguments);
    };
    window.HUUD.navigate=navigate;
    window.HUUD.routes=ROUTES;
    window.__HUUD_H5_OPEN=function(id){return navigate(id)};
    return true;
  }

  function interceptHomeQGMV(){
    document.addEventListener('click',function(e){
      const card=e.target.closest&&e.target.closest('.h5-module');
      if(!card)return;
      const text=(card.textContent||'').toUpperCase();
      if(!text.includes('MAR VERDE')&&!text.includes('QG MV'))return;
      e.preventDefault();e.stopImmediatePropagation();navigate('qg-mv');
    },true);
  }

  function bindNavigationMenu(){
    document.addEventListener('click',function(e){
      const el=e.target.closest&&e.target.closest('.nav-pill,.nav-btn');
      if(!el)return;
      const raw=(el.getAttribute('data-view')||el.getAttribute('data-room')||el.getAttribute('data-route')||el.getAttribute('onclick')||el.textContent||'').trim();
      const text=raw.toUpperCase();
      let route=null;
      if(text.includes('HOME')||text.includes('HOJE')||raw.includes("'flow'")||raw.includes('"flow"'))route='home';
      else if(text.includes('REALIDADE')||raw.includes('realidade'))route='realidade';
      else if(text.includes('PEND')||text.includes('RESPONS')||raw.includes('pendencias'))route='pendencias';
      else if(text.includes('FINAN')||raw.includes('debts'))route='financas';
      else if(text.includes('MAR VERDE')||text.includes('QG MV')||raw.includes('qg-mv')||raw.includes('land'))route='qgmv';
      else if(text.includes('TECNOLOG')||text.includes('TI + IA')||text.includes('SALA DE AULA')||raw.includes('tech'))route='tecnologia';
      else if(text.includes('PARAGU')||raw.includes('py'))route='paraguai';
      if(!route)return;
      e.preventDefault();e.stopImmediatePropagation();navigate(route);
    },true);
  }

  function loadResponsibilities(){
    if(document.querySelector('script[data-huud-responsabilidades-v1]')||window.HUUD_RESPONSABILIDADES_V1)return;
    const script=document.createElement('script');
    script.src='huud-responsabilidades-v1.js';
    script.dataset.huudResponsabilidadesV1='1';
    document.body.appendChild(script);
  }

  function boot(){
    if(!install())setTimeout(boot,100);
    interceptHomeQGMV();
    bindNavigationMenu();
    loadResponsibilities();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
