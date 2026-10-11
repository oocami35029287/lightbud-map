
(() => {
'use strict';
const data=window.LIGHTBUD_PUBLIC?.entries||{},page=document.body.dataset.page;
const menu=document.querySelector('#menu-toggle'),nav=document.querySelector('#site-nav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open)});
nav?.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('is-open');menu?.setAttribute('aria-expanded','false')}});
const groups={world:['WRD','MAG'],characters:['CHR'],ecology:['ECO'],organizations:['ORG','OCC','RAC'],civilization:['HIS','TEC','GEO']};
const labels={WRD:'世界',MAG:'靈律與魔素',CHR:'角色',ECO:'生態',ORG:'組織',OCC:'職業',RAC:'族群',HIS:'歷史',TEC:'古代技術',GEO:'地理與遺構'};
const civIds=new Set(['GEO-002','GEO-004','GEO-006','GEO-010','GEO-012','GEO-013','GEO-015','GEO-016']);
const allowed=e=>groups[page]?.includes(e.id.slice(0,3))&&(page!=='civilization'||!e.id.startsWith('GEO-')||civIds.has(e.id));
const destination=id=>id.startsWith('WRD')||id.startsWith('MAG')?'world.html':id.startsWith('CHR')?'characters.html':id.startsWith('ECO')?'ecology.html':id.startsWith('ORG')||id.startsWith('OCC')||id.startsWith('RAC')?'organizations.html':'civilization.html';
const c=(tag,className,text)=>{const el=document.createElement(tag);if(className)el.className=className;if(text!=null)el.textContent=text;return el};
const summaryText=e=>{const f=e.fields||{};return f['定義']||f['地理']||f['地貌']||f['職責']||f['身分']||f['特徵']||Object.values(f).filter(Boolean)[1]||'探索此條目的世界背景。'};
const visible=Object.values(data).filter(allowed);
const grid=document.querySelector('#catalog-grid');if(!grid)return;
const search=document.querySelector('#catalog-search'),filter=document.querySelector('#catalog-filter'),summary=document.querySelector('#catalog-summary'),empty=document.querySelector('#catalog-empty');
for(const k of [...new Set(visible.map(e=>e.id.slice(0,3)))]){const option=c('option','',labels[k]||k);option.value=k;filter.append(option)}
const overlay=c('div','dialog-backdrop');overlay.hidden=true;overlay.setAttribute('role','presentation');
const panel=c('section','detail-panel');panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby','detail-title');overlay.append(panel);document.body.append(overlay);
let lastFocus=null;
const close=()=>{overlay.hidden=true;document.body.style.overflow='';if(lastFocus?.isConnected)lastFocus.focus();if(new URLSearchParams(location.search).has('id'))history.replaceState(null,'',location.pathname)};
const details=e=>{
 lastFocus=document.activeElement;panel.replaceChildren();
 const closeButton=c('button','detail-close','×');closeButton.type='button';closeButton.setAttribute('aria-label','關閉條目');closeButton.addEventListener('click',close);panel.append(closeButton);
 panel.append(c('p','detail-meta',e.id+' / '+(labels[e.id.slice(0,3)]||'世界圖誌')));
 const title=c('h2','',e.name);title.id='detail-title';panel.append(title);
 const dl=c('dl','detail-fields');
 for(const [key,value] of Object.entries(e.fields||{})){const row=c('div');row.append(c('dt','',key),c('dd','',value));dl.append(row)}
 panel.append(dl);
 if(e.related?.length){panel.append(c('p','detail-meta','RELATED / 相關條目'));const links=c('div','detail-links');for(const id of e.related){if(!data[id])continue;const a=c('a','',data[id].name+' ↗');a.href=destination(id)+'?id='+encodeURIComponent(id);links.append(a)}panel.append(links)}
 const source=c('a','detail-source','查看正式世界法典 ↗');source.href=window.LIGHTBUD_PUBLIC.source+'#:~:text='+encodeURIComponent(e.id);source.target='_blank';source.rel='noopener noreferrer';panel.append(source);
 overlay.hidden=false;document.body.style.overflow='hidden';closeButton.focus();
};
overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
document.addEventListener('keydown',e=>{if(!overlay.hidden&&e.key==='Escape')close()});
function render(){
 const term=(search.value||'').trim().toLocaleLowerCase(),kind=filter.value;grid.replaceChildren();
 let count=0;
 for(const e of visible){if(kind!=='all'&&!e.id.startsWith(kind))continue;
 const body=[e.id,e.name,...Object.values(e.fields||{})].join(' ').toLocaleLowerCase();if(term&&!body.includes(term))continue;
 const card=c('button','catalog-card');card.type='button';card.append(c('span','catalog-id',e.id+' / '+(labels[e.id.slice(0,3)]||'')),c('h3','',e.name),c('p','',summaryText(e)),c('span','catalog-more','閱讀條目 ↗'));
 card.addEventListener('click',()=>{history.replaceState(null,'','?id='+encodeURIComponent(e.id));details(e)});grid.append(card);count++;
 }
 summary.textContent='收錄 '+visible.length+' 筆正式公開條目 · 目前顯示 '+count+' 筆';empty.hidden=count!==0;
}
search.addEventListener('input',render);filter.addEventListener('change',render);render();
const id=new URLSearchParams(location.search).get('id');if(id&&data[id]&&allowed(data[id]))details(data[id]);
})();
