
(()=>{"use strict";
 const BASE="index.html";
 const NAV=[["index.html","首頁"],["world.html","世界"],["map.html","地圖"],["characters.html","角色"],["ecology.html","生態"],["organizations.html","組織"],["civilization.html","文明與遺構"]];
 const pathname=location.pathname.split("/").pop()||BASE;
 const header=document.createElement("header");header.className="site-header";
 const brand=document.createElement("a");brand.href=BASE;brand.className="brand";brand.innerHTML='光芽之夢<small>LIGHTBUD DREAM</small>';
 const toggle=document.createElement("button");toggle.className="menu-toggle";toggle.textContent="選單 ☰";toggle.type="button";toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","開啟頁面導覽");
 const nav=document.createElement("nav");nav.className="site-nav";nav.setAttribute("aria-label","主要分頁");
 for(const [url,label] of NAV){const a=document.createElement("a");a.href=url;a.textContent=label;if(url===pathname||pathname==="white.html"&&url==="map.html")a.setAttribute("aria-current","page");nav.append(a)}
 toggle.onclick=()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));};
 header.append(brand,toggle,nav);document.body.prepend(header);
 const footer=document.createElement("footer");footer.className="site-footer";footer.innerHTML='<span>光芽之夢 · 艾菲拉世界圖誌</span><span>設定依正式世界法典及已確認的世界觀整理 · <a href="https://github.com/oocami35029287/lightbud-dream/blob/main/world-bible/WORLD_BIBLE.md" target="_blank" rel="noopener noreferrer">查看來源</a></span>';
 document.body.append(footer);
 if(document.body.classList.contains("page-home")){
   const scene=document.querySelector(".hero-scene");const onScroll=()=>{header.classList.toggle("scrolled",scrollY>60);if(scene&&!matchMedia("(prefers-reduced-motion: reduce)").matches)scene.style.setProperty("--parallax",Math.min(120,scrollY*.14)+"px")};
   addEventListener("scroll",onScroll,{passive:true});onScroll();
 }
 const page=document.body.dataset.page;
 if(!page||page==="home")return;
 const canon=window.LIGHTBUD_CANON;if(!canon||!canon.entries){document.querySelector("#catalog").textContent="世界資料尚未載入。";return}
 const all=Object.values(canon.entries),catalog=document.querySelector("#catalog"),search=document.querySelector("#catalog-search"),pills=document.querySelector("#category-pills"),detail=document.querySelector("#detail-panel");
 if(!catalog||!search||!pills||!detail)return;
 const config={
 world:{prefix:["WRD","MAG","HIS"],labels:{WRD:"世界",MAG:"靈律與魔素",HIS:"歷史"}},
 characters:{prefix:["CHR"],labels:{CHR:"角色"}},
 ecology:{prefix:["ECO"],labels:{ECO:"生態"}},
 organizations:{prefix:["ORG","OCC","RAC"],labels:{ORG:"組織",OCC:"職業",RAC:"族群"}},
 civilization:{prefix:["HIS","TEC","GEO"],labels:{HIS:"文明歷史",TEC:"技術與設備",GEO:"遺構地理"}}
 }[page];if(!config)return;
 const civGeo=new Set(["GEO-002","GEO-003","GEO-004","GEO-005","GEO-006","GEO-010","GEO-012","GEO-013","GEO-015","GEO-016"]);
 const data=all.filter(e=>config.prefix.includes(e.id.slice(0,3))&&(page!=="civilization"||!e.id.startsWith("GEO")||civGeo.has(e.id)));
 const cat=(entry)=>entry.id.slice(0,3);let active="all";
 const make=(tag,className,content)=>{let el=document.createElement(tag);if(className)el.className=className;if(content!==undefined)el.textContent=content;return el;};
 const lookupPage=(id)=>id.startsWith("CHR")?"characters.html":id.startsWith("ECO")?"ecology.html":id.startsWith("ORG")||id.startsWith("OCC")||id.startsWith("RAC")?"organizations.html":id.startsWith("MAG")||id.startsWith("WRD")?"world.html":id.startsWith("TEC")||id.startsWith("HIS")?"civilization.html":"map.html";
 const desc=(e)=>e.fields["定義"]||e.fields["地理"]||e.fields["類別"]||Object.values(e.fields).find(v=>typeof v==="string")||"請查看正式設定。";
 function open(id){const e=canon.entries[id];if(!e)return;detail.replaceChildren();
 const btn=make("button","close-detail","← 返回圖鑑");btn.onclick=()=>{detail.hidden=true;history.replaceState(null,"",location.pathname+location.search)};detail.append(btn,make("p","entry-id",e.id),make("h2",null,e.name));
 const dl=make("dl");for(const [k,v] of Object.entries(e.fields)){if(k==="關聯")continue;const dt=make("dt",null,k),dd=make("dd",null,v);dl.append(dt,dd)}detail.append(dl);
 const ids=(e.fields["關聯"]||"").match(/[A-Z]{3}-\d{3}/g)||[];const related=ids.filter(id=>canon.entries[id]);if(related.length){detail.append(make("h3",null,"相關條目"));const list=make("div","related");for(const target of related){const a=make("a",null,canon.entries[target].name);a.href=lookupPage(target)+"#"+target;list.append(a)}detail.append(list)}
 const src=make("a","source-link","閱讀正式世界法典 ↗");src.href="https://github.com/oocami35029287/lightbud-dream/blob/main/world-bible/WORLD_BIBLE.md";src.target="_blank";src.rel="noopener noreferrer";detail.append(src);
 detail.hidden=false;history.replaceState(null,"","#"+e.id);detail.focus();
 }
 function render(){const q=search.value.trim().toLowerCase();catalog.replaceChildren();
 let shown=data.filter(e=>(active==="all"||cat(e)===active)&&(e.name+" "+e.id+" "+Object.values(e.fields).join(" ")).toLowerCase().includes(q));
 document.querySelector("#entry-count").textContent=shown.length+" 個條目";
 if(!shown.length){catalog.append(make("p","empty-state","目前沒有符合條件的條目。"));return}
 for(const e of shown){const card=make("article","entry-card");const id=make("span","entry-id",e.id),label=make("div","meta",config.labels[cat(e)]||"條目"),title=make("h2",null,e.name),description=make("p",null,desc(e)),button=make("button",null,"查看條目 →");button.type="button";button.onclick=()=>open(e.id);card.append(id,label,title,description,button);catalog.append(card)}
 }
 for(const [key,label] of [["all","全部"],...config.prefix.map(id=>[id,config.labels[id]])]){const button=make("button","filter-pill",label);button.type="button";button.setAttribute("aria-pressed",String(key===active));button.onclick=()=>{active=key;for(const b of pills.children)b.setAttribute("aria-pressed",String(b===button));render()};pills.append(button)}
 search.addEventListener("input",render);render();detail.hidden=true;detail.tabIndex=-1;
 const id=decodeURIComponent(location.hash.slice(1));if(canon.entries[id])open(id);
 addEventListener("hashchange",()=>{const target=decodeURIComponent(location.hash.slice(1));if(canon.entries[target])open(target);else detail.hidden=true});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!detail.hidden){detail.hidden=true;search.focus()}});
})();
