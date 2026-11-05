(function(){
const stage=document.getElementById('stage');
const slides=[...document.querySelectorAll('.slide')];
let cur=0;
function fit(){const s=Math.min(innerWidth/1280,innerHeight/720)*0.97;stage.style.transform='scale('+s+')';}
addEventListener('resize',fit);fit();
function show(i){
  cur=Math.max(0,Math.min(slides.length-1,i));
  slides.forEach((s,k)=>s.classList.toggle('active',k===cur));
  document.getElementById('pg').textContent=(cur+1)+' / '+slides.length;
  document.getElementById('prog').style.width=((cur+1)/slides.length*100)+'%';
  document.getElementById('notesTxt').textContent=slides[cur].dataset.notes||'';
  if(location.hash!=='#s'+(cur+1)) history.replaceState(null,'','#s'+(cur+1));
}
document.getElementById('prev').onclick=()=>show(cur-1);
document.getElementById('next').onclick=()=>show(cur+1);
addEventListener('keydown',e=>{
  if(document.getElementById('lightbox').classList.contains('on'))return;
  if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '){e.preventDefault();show(cur+1);}
  else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();show(cur-1);}
  else if(e.key==='n'||e.key==='N'){document.getElementById('notes').classList.toggle('on');}
  else if(e.key==='Home'){show(0);} else if(e.key==='End'){show(slides.length-1);}
});
const h=parseInt((location.hash||'').replace('#s',''),10);
show(isNaN(h)?0:h-1);

const $=(sel,root=document)=>root.querySelector(sel);
const $$=(sel,root=document)=>[...root.querySelectorAll(sel)];
const timers=[];
function later(fn,ms){timers.push(setTimeout(fn,ms));}

// s2
$('[data-act=goal]').onclick=function(){
  const sts=$$('[data-id=s2] .st');sts.forEach(s=>s.classList.remove('on'));
  sts.forEach((s,i)=>later(()=>s.classList.add('on'),300+i*550));
};
// s3
$('[data-act=ask]').onclick=function(){
  const bs=$$('[data-id=s3] .bubble');bs.forEach(b=>b.classList.remove('on'));
  bs.forEach(b=>later(()=>b.classList.add('on'),parseInt(b.dataset.b)*700));
};
// s4
function reset4(){$$('[data-id=s4] .dec').forEach(d=>d.classList.remove('on'));$('#call5').classList.remove('on');['n4a','n41','n42','n43','n44','n45'].forEach(id=>$('#'+id).classList.remove('on'));$$('#flow4 path').forEach(p=>p.classList.remove('on'));$('#n4as').textContent='aguardando…';}
$('[data-act=reset4]').onclick=reset4;
$('[data-act=run4]').onclick=function(){
  reset4();
  later(()=>{$('#w0').classList.add('on');$('#n4a').classList.add('on');$('#n4as').textContent='planejando…';},200);
  const msgs=['busca: quem venceu?','busca: contribuições','lendo artigos','contexto histórico'];
  const decs=$$('[data-id=s4] .dec');
  [1,2,3,4].forEach((k,i)=>later(()=>{$('#n4as').textContent=msgs[i];$('#w'+k).classList.add('on');$('#n4'+k).classList.add('on');if(i<3)decs[i].classList.add('on');},900+i*1000));
  later(()=>{$('#n4as').textContent='sintetizando…';$('#w5').classList.add('on');$('#n45').classList.add('on');decs[3].classList.add('on');},5000);
  later(()=>$('#call5').classList.add('on'),5700);
};
// s5
$$('[data-id=s4] .dec').forEach(d=>d.onclick=()=>{d.classList.add('on');if($$('[data-id=s4] .dec.on').length===4)$('#call5').classList.add('on');});
// s6
$$('[data-id=s6] .tri').forEach(t=>t.onclick=()=>t.classList.toggle('on'));
// s7 loop
const it7=[
 {tool:'web_search("2024 Nobel Physics")',res:'vencedores: Hopfield e Hinton'},
 {tool:'web_search("Hinton, Hopfield")',res:'contribuições em redes neurais'},
 {tool:'search_papers(...)',res:'rede de Hopfield · máquina de Boltzmann'},
 {tool:'wikipedia(...)',res:'contexto histórico dos autores'}
];
let s7={i:0,ph:0};
function reset7(){s7={i:0,ph:0};$('#it7').textContent='0';$$('.lnode').forEach(n=>n.classList.remove('on'));$('#ctx7').innerHTML='<div class="chip q">pergunta: resumir a pesquisa dos vencedores do Nobel de Física de 2024</div>';$('#st7').textContent='Clique em “Próxima etapa” para começar.';$('[data-act=step7]').disabled=false;}
$('[data-act=reset7]').onclick=reset7;
$('[data-act=step7]').onclick=function(){
  const it=it7[s7.i];
  $$('.lnode').forEach(n=>n.classList.remove('on'));
  const ph=s7.ph;
  $('#l'+(ph+1)).classList.add('on');
  if(ph===0){$('#it7').textContent=s7.i+1;
    if(it){$('#st7').innerHTML='O LLM avalia o contexto: falta informação. Escolhe <b class="mono hl2">'+it.tool+'</b>.';}
  } else if(ph===1){$('#st7').innerHTML='Executando <b class="mono hl2">'+it.tool+'</b>…';}
  else if(ph===2){$('#st7').textContent='O resultado entra no contexto acumulado.';const c=document.createElement('div');c.className='chip t';c.textContent='← '+it.res;$('#ctx7').appendChild(c);}
  else if(ph===3){
    if(s7.i<it7.length-1){$('#st7').innerHTML='Ainda falta informação → <b class="hl">continuar</b> para a etapa 1.';}
    else{$('#st7').innerHTML='Informação suficiente → <b class="hl">parar</b> e gerar o relatório final.';const c=document.createElement('div');c.className='chip f';c.textContent='✓ relatório final gerado';$('#ctx7').appendChild(c);this.disabled=true;}
    s7.i++;
  }
  s7.ph=(ph+1)%4;
};
// s8
const comps={
 llm:['Modelo de fundação','O “cérebro” e motor de raciocínio do sistema.','Interpreta o contexto, compreende linguagem natural e toma decisões. Em vez de só gerar texto, analisa o cenário e decide dinamicamente quais passos seguir.'],
 tools:['Ferramentas','Os “braços e mãos” que conectam o agente ao mundo real.','Funções e integrações que levam o agente além do conhecimento estático do modelo: APIs externas, cálculos, bancos de dados e arquivos do ambiente.'],
 mem:['Memória','O que garante continuidade e contexto ao longo do tempo.','Capacidade de armazenar e recuperar experiências passadas para melhorar a tomada de decisões, a percepção e o desempenho geral.'],
 orch:['Orquestração','O “maestro” que coordena o fluxo de execução e o planejamento.','Coordena vários agentes especializados num sistema unificado. Em vez de uma única IA de propósito geral, uma rede de agentes, cada um com sua tarefa, automatiza fluxos complexos.'],
 infra:['Infraestrutura de suporte','A “fundação operacional” que sustenta tudo em produção.','Computação (GPUs, nuvem), filas e mensageria, bancos de dados, segurança e observabilidade: logs, rastreamento e métricas de desempenho.']
};
$$('[data-id=s8] .comp').forEach(c=>c.onclick=()=>{$$('[data-id=s8] .comp').forEach(x=>x.classList.remove('on'));c.classList.add('on');const d=comps[c.dataset.c];$('#d8t').textContent=d[0];$('#d8o').textContent=d[1];$('#d8p').textContent=d[2];});
// s9
let s9=0;const ln9=$$('#log9 .ln');
function reset9(){s9=0;ln9.forEach(l=>l.classList.remove('on'));$('#c9').textContent='0';$('[data-act=step9]').disabled=false;}
$('[data-act=reset9]').onclick=reset9;
$('[data-act=step9]').onclick=function(){
  if(s9===0){ln9[0].classList.add('on');s9=1;}
  // reveal one Pensamento(+Ação/Observação) group per click
  const start=s9; let end=start;
  while(end<ln9.length){ln9[end].classList.add('on');end++; if(end<ln9.length && ln9[end].querySelector('.k-th'))break;}
  s9=end;
  $('#c9').textContent=$$('#log9 .ln.on .k-th').length;
  $('#log9').scrollTop=$('#log9').scrollHeight;
  if(s9>=ln9.length)this.disabled=true;
};
// s10
function reset10(){['p10','e1','e2','e3','s10s'].forEach(id=>$('#'+id).classList.remove('on'));$$('[data-id=s10] .res').forEach(r=>r.classList.remove('on'));$('#b10').style.width='0';$('#b10n').textContent='0';$('[data-act=exec10]').disabled=true;$('[data-act=plan10]').disabled=false;}
$('[data-act=reset10]').onclick=reset10;
$('[data-act=plan10]').onclick=function(){$('#p10').classList.add('on');$('#b10').style.width='50px';$('#b10n').textContent='1';this.disabled=true;$('[data-act=exec10]').disabled=false;};
$('[data-act=exec10]').onclick=function(){
  this.disabled=true;
  later(()=>$('#e1').classList.add('on'),100);
  later(()=>$('#e1 .res').classList.add('on'),800);
  later(()=>{$('#e2').classList.add('on');$('#e3').classList.add('on');},1300);
  later(()=>{$('#e2 .res').classList.add('on');$('#e3 .res').classList.add('on');},2100);
  later(()=>{$('#s10s').classList.add('on');$('#b10').style.width='100px';$('#b10n').textContent='2';},2700);
  later(()=>$('#s10s .res').classList.add('on'),3300);
};
// s12
let s12=0;
function reset12(){s12=0;['a1','a2','a3'].forEach(id=>$('#'+id).classList.remove('on'));$('#j12').style.opacity='.25';$('[data-act=step12]').disabled=false;}
$('[data-act=reset12]').onclick=reset12;
$('[data-act=step12]').onclick=function(){s12++;$('#a'+s12).classList.add('on');if(s12===3){$('#j12').style.opacity='1';this.disabled=true;}};
// s14
$$('[data-id=s14] .tab').forEach(t=>t.onclick=()=>{$$('[data-id=s14] .tab').forEach(x=>x.classList.remove('on'));t.classList.add('on');const fws=$$('[data-id=s14] .fw');fws.forEach(f=>f.classList.remove('on'));fws[+t.dataset.fw].classList.add('on');$('#fwnote').style.display=t.dataset.fw==='1'?'block':'none';});
})();

// zoom de figuras (slide 2 e outras com .zoomable)
(function(){
  const lb=document.getElementById('lightbox'), lbimg=document.getElementById('lbimg');
  function close(){lb.classList.remove('on');}
  document.querySelectorAll('.zoomable').forEach(fr=>{
    const img=fr.querySelector('img'), pick=fr.parentNode.querySelector('.figpick');
    fr.addEventListener('click',()=>{
      if(fr.classList.contains('empty')){ if(pick) pick.click(); return; }
      lbimg.src=img.src; lbimg.alt=img.alt; lb.classList.add('on');
    });
    if(pick) pick.addEventListener('change',()=>{
      const f=pick.files[0]; if(!f) return;
      img.src=URL.createObjectURL(f); fr.classList.remove('empty');
    });
  });
  lb.addEventListener('click',e=>{ if(e.target!==lbimg) close(); });
  addEventListener('keydown',e=>{ if(e.key==='Escape') close(); },true);
})();
