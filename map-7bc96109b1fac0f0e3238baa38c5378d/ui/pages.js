import {navigation,h,readJSON,entryURL,picture} from './intro.js';
const page=document.body.dataset.page,main=document.querySelector('#main-content');
try{
const [catalog,relations,assets]=await Promise.all(['catalog','relations','assets'].map(readJSON));
const summary=c=>c.fields['簡介']||c.fields['定義']||c.fields['特性']||c.fields['身分']||c.fields['職責']||c.fields['地理']||c.fields['地貌']||c.fields['日常']||c.fields['職務']||c.fields['形態']||c.fields['生活']||Object.entries(c.fields).find(([k])=>k!=='類別')?.[1]||'';
const display=v=>{const p=h('p');for(const part of v.split(/([A-Z]+-\d{3})/)){if(catalog[part])p.append(h('a',{href:entryURL(catalog[part])},catalog[part].name));else p.append(document.createTextNode(part));}return p;};
const artNames={garden:'菌王深庭（原圖標題：沉韻之庭）· 作者概念圖',chamber:'群息之庭 · 既有空間概念圖，非現行樓層剖面',king:'菌王地表株 · 作者概念圖'};
const lawInfo={'CHR-001':['MAG-003','傾聽生命','green'],'CHR-002':['MAG-005','讓飛行夢成形','gold'],'CHR-003':['MAG-006','照料每一天','blue'],'CHR-004':['MAG-004','追尋結構與答案','purple'],'CHR-005':[null,'蘑丘的採集日常','green'],'CHR-008':[null,'器具與生命的合作','gold']};
let portraitSequence=0;
function characterArt(c){
 const [law,label,color]=lawInfo[c.id];
 if(['CHR-001','CHR-005'].includes(c.id)){
  const f=h('figure',{class:'character-art portrait-'+c.id}),svg=document.createElementNS('http://www.w3.org/2000/svg','svg'),im=document.createElementNS('http://www.w3.org/2000/svg','image');svg.setAttribute('viewBox',c.id==='CHR-001'?'490 40 300 710':'85 140 195 245');const defs=document.createElementNS('http://www.w3.org/2000/svg','defs'),clip=document.createElementNS('http://www.w3.org/2000/svg','clipPath'),rect=document.createElementNS('http://www.w3.org/2000/svg','rect'),clipId='portrait-'+(++portraitSequence);clip.id=clipId;for(const [k,v]of Object.entries(c.id==='CHR-001'?{x:490,y:40,width:300,height:710}:{x:85,y:140,width:195,height:245}))rect.setAttribute(k,v);clip.append(rect);defs.append(clip);svg.append(defs);im.setAttribute('clip-path','url(#'+clipId+')');svg.setAttribute('role','img');svg.setAttribute('aria-label',c.name+' · 既有雙人設計板對應局部');svg.setAttribute('class','portrait-window');im.setAttribute('href',assets.lili.src);im.setAttribute('width','1887');im.setAttribute('height','838');svg.append(im);f.append(svg,h('figcaption',{},c.id==='CHR-001'?'璃璃 · 既有作者核准設計板':'小麻 · 既有設計參考，服裝以後續定稿為準'));return f;
 }
 const motif=h('div',{class:'character-motif '+color});motif.append(h('span',{class:'law-symbol','aria-hidden':'true'},c.id==='CHR-002'?'✧':c.id==='CHR-003'?'◎':c.id==='CHR-004'?'◇':'❋'),h('span',{class:'motif-label'},law?catalog[law].name:'蘑丘生活'),h('span',{class:'motif-theme'},label));return motif;
}
if(page==='index'){
 const scene=document.querySelector('#hero-scene');scene.append(h('img',{src:assets.home.src,alt:'綠意覆蓋的古代都市與軌道遺構',width:1536,height:1024,fetchpriority:'high'}));
 const texts={world:'先認識璃璃走入的世界，與生命相連的四律。',map:'尋找聚落與古代遺構，走近艾菲拉的地景。',characters:'從性格、日常與願望，認識旅途中相遇的人。',ecology:'會發光的息孢、菌林，以及彼此合作的生命。',organizations:'認識教會、政府、巡護署與獨立學院的分工。',civilization:'讀懂古代都市的層次，與仍被使用的設備。'};
 const order=['world','characters','ecology','organizations','civilization','map'];
 for(const [i,slug]of order.entries()){const [,name,en]=navigation.find(n=>n[0]===slug),a=h('a',{class:'discovery-link reveal',href:slug+'.html'});a.append(h('span',{class:'ordinal'},String(i+1).padStart(2,'0')),h('span',{class:'kicker'},en),h('h3',{},name),h('p',{},texts[slug]),h('span',{class:'card-arrow'},'↗'));document.querySelector('#discovery-grid').append(a);}
 document.querySelector('#home-atlas').replaceWith(picture(assets.atlas,'艾菲拉 · 作者世界地圖'));
 for(let i=0;i<14;i++){const dot=h('i');dot.style.setProperty('--x',((i*37)%100)+'%');dot.style.setProperty('--y',((i*23)%100)+'%');dot.style.setProperty('--delay',(-i*.7)+'s');document.querySelector('.motes').append(dot);}
 const motion=matchMedia('(prefers-reduced-motion: reduce)');let scheduled=false;const move=()=>{scheduled=false;scene.style.transform=motion.matches?'':`translateY(${Math.min(scrollY*.12,80)}px)`;};addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(move);}},{passive:true});motion.addEventListener('change',move);move();
}else if(page==='white'){
 const c=catalog['WRD-002'];document.querySelector('#white-entry').append(h('h2',{},'她原本的日常'),h('p',{},summary(c)),h('p',{},c.fields['魔素環境']));
}else if(page!=='sources'){
 const config={world:['世界','World','在荒蕪之後，生命仍在回應','從日常與風景開始，認識璃璃走入的艾菲拉。',/^(WRD|MAG|HIS)-/],characters:['角色','Characters','每個願望，都有自己的聲音','認識璃璃與她遇見的人：他們的日常、專長，以及想要守護的事物。',/^CHR-/],ecology:['生態','Ecology','微光，生長成世界','從游離息孢到古老菌網，生命各有感受，也能選擇彼此合作。',/^ECO-/],organizations:['組織','Organizations','共同生活的方式','信仰、公共安全、學術研究與日常工作，各自支撐城市的一部分。',/^(ORG|RAC|OCC)-/],civilization:['文明與遺構','Civilization','時間留下的輪廓','古代都市並未消失。新的聚落與生命，仍在它的層層輪廓間生活。',/^(TEC|HIS|GEO)-/]};
 const [name,en,title,intro,re]=config[page];main.className='page-shell';const breadcrumb=h('nav',{'aria-label':'麵包屑',class:'breadcrumb'});breadcrumb.append(h('a',{href:'index.html'},'首頁'),document.createTextNode(' / '+name));main.append(breadcrumb,h('p',{class:'kicker'},en.toUpperCase()+' / LIGHTBUD'),h('h1',{},title),h('p',{class:'lead'},intro));
 if(page==='world'){
  const guide=h('section',{class:'reading-guide','aria-label':'第一次認識艾菲拉'});guide.append(h('h2',{},'先從三件事認識這裡'));
  for(const [title,text]of [['古老城市上的新生活','大裂潮之後，古代都市留下了遺構。菌類與其他生命重新生長，人們在其間建立聚落、工作與往來。'],['魔素，連結生命與環境','魔素參與生命與設備的運作，菌網傳遞能源和訊號。它們各有作用，也需要照護與維持。'],['四律，每個人不同的專長','空相與生命共鳴，構相辨認結構，塑相協助物體變形與重組，迴相照護仍可修復的生命。能力也各有邊界。']]){const article=h('article');article.append(h('h3',{},title),h('p',{},text));guide.append(article);}main.append(guide);
  const feature=h('section',{class:'world-feature'}),copy=h('div');copy.append(h('h2',{},'艾菲拉與白域'),h('p',{},catalog['WRD-001'].fields['世界狀態']),h('p',{},'白域是璃璃原本生活的世界，那裡有她的家人與熟悉的日常。'),h('a',{class:'text-link',href:'white.html'},'走近白域 →'));feature.append(copy,picture(assets.atlas,'艾菲拉 · 作者世界地圖'));main.append(feature);
 }
 if(page==='characters'){const note=h('p',{class:'collection-note'},'璃璃與小麻使用既有作者核准設計板；小麻服裝仍有後續修訂。其他人物以律型與生活意象呈現。');main.append(note);}
 if(page==='organizations'){
  const diagram=h('section',{class:'authority-diagram'});diagram.append(h('p',{class:'kicker'},'艾瑟波恩 / 權責導覽'),h('h2',{},'守護、治理與研究'));
  const branches=h('div',{class:'branches'});for(const [id,text]of [['ORG-001','聖樹信仰、醫療照護、文獻與聖地准入。'],['ORG-005','城邦公共政務；魔法署、市政署與巡護署各司其職。'],['ORG-003','隸屬城邦政府，負責根枝、生態、通行與居民安全。'],['ORG-008','獨立自治的教育研究機構，遵守公共安全規範。']]){const a=h('a',{href:entryURL(catalog[id])},catalog[id].name);a.append(h('small',{},text));branches.append(a);}diagram.append(branches,h('p',{},'聖地准入、學術研究資格與危險工程操作許可，須分別依各自權責取得。'));main.append(diagram);
 }
 if(page==='civilization'){
  const layers=h('section',{class:'strata','aria-label':'遺構之森物理樓層'});layers.append(h('h2',{},'古都的垂直結構'));
  for(const [label,ids]of [['第五層',['GEO-001']],['第四層',['GEO-003']],['第三層',['GEO-004']],['第二層',['GEO-015']],['第一層',['GEO-006']]]){const row=h('div',{class:'stratum'});row.append(h('span',{},label));for(const id of ids)row.append(h('a',{href:entryURL(catalog[id])},catalog[id].name));layers.append(row);}
  const note=h('p',{},'中央的');note.append(h('a',{href:entryURL(catalog['GEO-005'])},'眠孢域'),'跨第一至第四層；其中的',h('a',{href:entryURL(catalog['GEO-011'])},'群息之庭'),'跨第一至第三層。這些立體區域與外側地貌名稱分開理解。');layers.append(note);main.append(layers);
 }
 if(page==='ecology'){
  const feature=h('section',{class:'ecology-feature'}),copy=h('div');copy.append(h('p',{class:'kicker'},'ECO-007 / GEO-007'),h('h2',{},'地表菌株與根部深庭'),h('p',{},catalog['ECO-007'].fields['形象與空間']));feature.append(picture(assets.king,artNames.king),copy);main.append(feature);
 }
 const toolbar=h('div',{class:'collection-toolbar'}),label=h('label',{},'搜尋圖誌'),search=h('input',{type:'search',placeholder:'名稱、永久 ID 或關鍵字…',id:'catalog-search'});label.htmlFor='catalog-search';toolbar.append(label,search);const modes=h('div',{class:'modes'}),cardsButton=h('button',{'aria-pressed':'true'},'圖鑑'),graphButton=h('button',{'aria-pressed':'false'},page==='characters'?'人物與世界關係':'關係圖');modes.append(cardsButton,graphButton);toolbar.append(modes);main.append(toolbar);
 const result=h('p',{class:'result-count','aria-live':'polite'}),grid=h('section',{class:'collection-grid','aria-label':name+'圖鑑'}),graph=h('section',{class:'relation-network','aria-label':name+'關係圖'});graph.hidden=true;main.append(result,grid,graph);
 const entries=Object.values(catalog).filter(c=>re.test(c.id));let category='all';
 if(page==='organizations'){const filters=h('div',{class:'category-filters','aria-label':'分類'});for(const[k,n]of [['all','全部'],['ORG','行政與組織'],['RAC','族群與旅居群體'],['OCC','職業與職位']]){const b=h('button',{'aria-pressed':String(k==='all')},n);b.onclick=()=>{category=k;filters.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));draw();};filters.append(b);}toolbar.after(filters);}
 const dialog=document.querySelector('#entry-dialog');let opener;
 function open(c){
  opener=document.activeElement;const content=document.querySelector('#entry-detail');content.replaceChildren();content.append(h('p',{class:'kicker'},c.id+' / '+c.fields['類別']),h('h2',{id:'entry-title'},c.name));
  if(c.id.startsWith('CHR-')){content.append(characterArt(c),h('p',{class:'character-intro'},summary(c)));}
  for(const[k,v]of Object.entries(c.fields)){if(['類別','簡介'].includes(k))continue;const detail=h('details');detail.open=['定義','特性','性格','身分','範圍','地理','職責','地貌','夢想','所屬組織','主導律','位置','位置與界線','名稱'].includes(k);detail.append(h('summary',{},k),display(v));content.append(detail);}
  const related=h('div',{class:'related-links'});related.append(h('h3',{},'繼續認識'));for(const id of relations[c.id]||[])if(catalog[id])related.append(h('a',{href:entryURL(catalog[id])},catalog[id].name+' ↗'));content.append(related);
  const asset=Object.values(assets).find(a=>(a.entryId===c.id||a.entryIds?.includes(c.id))&&a.src&&!['reference-only','character-sheet'].includes(a.usage)&&a.id!=='home');if(asset)content.append(picture(asset,artNames[asset.id]||c.name+' · 作者概念圖'));
  content.append(h('p',{class:'source-note'},'本條目依作者核准設定整理，僅呈現公開介紹範圍。'),h('a',{class:'source-link',href:'sources.html'},'內容來源與圖片說明 →'));
  const url=new URL(location.href);url.searchParams.set('entry',c.id);history.replaceState(null,'',url);dialog.showModal();
 }
 document.querySelector('.dialog-close').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===e.currentTarget){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});dialog.addEventListener('close',()=>{const url=new URL(location.href);url.searchParams.delete('entry');history.replaceState(null,'',url);opener?.focus();});
 function draw(){
  const q=search.value.trim().toLowerCase(),selected=entries.filter(c=>(category==='all'||c.id.startsWith(category+'-'))&&(c.id+' '+c.name+' '+Object.values(c.fields).join(' ')).toLowerCase().includes(q));grid.replaceChildren();graph.replaceChildren();result.textContent=selected.length+' 個條目';
  for(const c of selected){const card=h('article',{class:'collection-card reveal','data-entry-id':c.id});if(page==='characters')card.append(characterArt(c));card.append(h('p',{class:'kicker'},c.id+' / '+c.fields['類別']),h('h2',{},c.name),display(summary(c)));if(c.fields['主導律']){const id=c.fields['主導律'].match(/[A-Z]+-\d{3}/)?.[0];if(catalog[id])card.append(h('a',{class:'law-tag',href:entryURL(catalog[id])},catalog[id].name));}const b=h('button',{class:'text-link'},page==='characters'?'認識'+c.name+' →':'展開條目 →');b.onclick=()=>open(c);card.append(b);grid.append(card);
   const row=h('article',{class:'relation-row'}),node=h('button',{class:'relation-center'},c.name);node.onclick=()=>open(c);row.append(node);const links=h('div',{class:'relation-links'});for(const id of relations[c.id]||[])if(catalog[id])links.append(h('a',{href:entryURL(catalog[id])},catalog[id].name));if(!links.childElementCount)links.append(h('span',{},'此公開簡介未列其他關係'));row.append(links);graph.append(row);
  }if(!selected.length)grid.append(h('p',{},'沒有符合的條目。'));
 }
 search.oninput=draw;cardsButton.onclick=()=>{grid.hidden=false;graph.hidden=true;cardsButton.setAttribute('aria-pressed','true');graphButton.setAttribute('aria-pressed','false');};graphButton.onclick=()=>{grid.hidden=true;graph.hidden=false;cardsButton.setAttribute('aria-pressed','false');graphButton.setAttribute('aria-pressed','true');};draw();const id=new URLSearchParams(location.search).get('entry');if(catalog[id]&&entries.some(c=>c.id===id))open(catalog[id]);
}
}catch(e){main.append(h('p',{role:'alert'},'世界圖誌暫時無法載入，請重新整理。'));console.error(e);}
