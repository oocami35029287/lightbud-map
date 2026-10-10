(() => {
  'use strict';
  const data=window.LIGHTBUD_DATA,layout=window.LIGHTBUD_LAYOUT;
  const svg=document.querySelector('#map'),area=document.querySelector('#map-area'),world=document.querySelector('#world');
  const nodeLayer=document.querySelector('#nodes'),edgeLayer=document.querySelector('#edges'),bgLayer=document.querySelector('#backgrounds');
  const card=document.querySelector('#card'),body=document.querySelector('#card-body');
  const NS='http://www.w3.org/2000/svg',byId=new Map(),nodeElements=new Map(),edgeElements=[];
  const layers={life:{name:'菌路',enabled:true},road:{name:'道路',enabled:true}};
  const thresholds=[0,.85,1.5,2.6];
  let view={x:0,y:0,k:1},baseScale=1,pinned=null,hover=null,drag=null,nodeDrag=null,editing=false;
  let backgroundURL=null,backgroundImage=null,bgAspect=1.5,ready=false,suppressClick=false;
  const el=(name,attrs={})=>{const e=document.createElementNS(NS,name);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);return e;};
  for(const n of data.nodes){if(byId.has(n.id)||!Number.isFinite(n.x)||!Number.isFinite(n.y))throw new Error('節點資料錯誤：'+n.id);byId.set(n.id,n);}
  function drawBackgrounds(){
    bgLayer.replaceChildren();
    if(backgroundImage)bgLayer.append(backgroundImage);
    else for(const bg of data.backgrounds)bgLayer.append(el('image',{href:bg.src,x:bg.x,y:bg.y,width:bg.width,height:bg.height,opacity:bg.opacity??1,preserveAspectRatio:'none'}));
  }
  drawBackgrounds();
  for(const e of data.edges){
    if(!byId.has(e.from)||!byId.has(e.to)||!layers[e.type])throw new Error('連線資料錯誤');
    const p=el('path',{class:'edge',stroke:e.status==='locked'?'#726354':e.type==='life'?'#49664c':'#71492e','stroke-width':e.type==='life'?1.7:1.5,'stroke-dasharray':e.status==='locked'?'3 5':e.type==='road'?'7 5':''});
    Object.assign(p.dataset,{type:e.type,from:e.from,to:e.to,status:e.status||'open'});
    const marker=e.status==='locked'?el('g',{class:'connection-lock','aria-label':'封鎖菌路'}):null;
    if(marker){const box=el('rect',{x:-16,y:-9,width:32,height:18,rx:3,fill:'#f2dfc0',stroke:'#8d7864'}),label=el('text',{'text-anchor':'middle',y:3,fill:'#6c5744','font-size':9});label.textContent='封鎖';marker.append(box,label);}
    edgeLayer.append(p);if(marker)edgeLayer.append(marker);edgeElements.push({edge:e,element:p,marker});
  }
  for(const n of data.nodes){
    const g=el('g',{class:'node'+(n.status==='待確認'?' pending':''),tabindex:'0',role:'button','aria-label':n.name,'data-id':n.id,'data-level':n.level});
    const hit=el('rect',{class:'hit-area',x:-18,y:-18,width:36,height:36,rx:4,fill:'transparent',stroke:'none'});
    const shape=el('path',{class:'place-symbol'}),text=el('text',{class:'place-label'});
    text.textContent=n.id.endsWith('-stabilizer')?'穩定器':n.name;
    const stabilizer=n.id.endsWith('-stabilizer');
    shape.setAttribute('d',n.level===0?'':stabilizer?'M 0 -9 L 8 0 L 0 9 L -8 0 Z M -3 0 L 3 0 M 0 -3 L 0 3':n.id==='king'?'M -8 0 Q -8 -11 0 -11 Q 8 -11 8 0 Z M -2 0 L -2 8 L 2 8 L 2 0':n.id==='home'?'M -8 0 L 0 -7 L 8 0 L 6 0 L 6 8 L -6 8 L -6 0 Z':n.id==='garden'?'M 0 -8 Q 11 -3 4 6 Q 0 12 -4 6 Q -11 -3 0 -8 Z':'M 0 -6 L 6 0 L 0 6 L -6 0 Z');
    g.append(hit,shape,text);nodeLayer.append(g);nodeElements.set(n.id,{g,shape,text,hit});
    g.addEventListener('pointerenter',()=>{if(!drag&&!nodeDrag&&!editing){hover=n.id;showCard(n);renderHighlight();}});
    g.addEventListener('pointerleave',()=>{hover=null;if(pinned)showCard(byId.get(pinned));else card.hidden=true;renderHighlight();});
    g.addEventListener('click',()=>{if(editing||suppressClick)return;pin(n.id);});
    g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pin(n.id);}});
    g.addEventListener('focus',()=>{if(!editing){hover=n.id;showCard(n);renderHighlight();}});
    g.addEventListener('blur',()=>{hover=null;if(pinned)showCard(byId.get(pinned));else card.hidden=true;renderHighlight();});
    g.addEventListener('pointerdown',e=>{if(!editing||e.button!==0)return;e.preventDefault();e.stopPropagation();nodeDrag={id:n.id,pointer:e.pointerId};g.setPointerCapture(e.pointerId);});
    g.addEventListener('pointermove',e=>{if(nodeDrag?.id!==n.id)return;const r=svg.getBoundingClientRect();n.x=Math.round((e.clientX-r.left-view.x)/view.k);n.y=Math.round((e.clientY-r.top-view.y)/view.k);render();document.querySelector('#edit-status').textContent=n.name+'：'+n.x+', '+n.y+'（尚未匯出）';});
    const end=()=>{nodeDrag=null;};g.addEventListener('pointerup',end);g.addEventListener('pointercancel',end);
  }
  function line(label,value){const p=document.createElement('p'),strong=document.createElement('strong');strong.textContent=label+'　';p.append(strong,document.createTextNode(value));return p;}
  function showCard(n){
    body.replaceChildren();const tag=document.createElement('span');tag.className='tag';tag.textContent=n.kind+' / '+n.status;
    const title=document.createElement('h3');title.textContent=n.name;body.append(tag,title,line('描述',n.description),line('功能',n.function));
    if(n.note)body.append(line('註記',n.note));if(n.parent)body.append(line('所屬',byId.get(n.parent)?.name||n.parent));
    const connections=data.edges.filter(e=>e.from===n.id||e.to===n.id);
    for(const type of ['life','road']){const links=connections.filter(e=>e.type===type);if(links.length)body.append(line(layers[type].name,links.map(e=>byId.get(e.from===n.id?e.to:e.from).name+(e.status==='locked'?'【封鎖】':'')+(e.note?'（'+e.note+'）':'')+(e.unlockCondition?' 解鎖條件：'+e.unlockCondition:'')).join('；')));}
    const a=document.createElement('a');a.textContent='查看雲端設定來源 ↗';a.href=n.source;a.target='_blank';a.rel='noopener noreferrer';body.append(a);card.hidden=false;
  }
  function pin(id){pinned=pinned===id?null:id;if(pinned)showCard(byId.get(id));else card.hidden=true;renderHighlight();}
  document.querySelector('#close-card').onclick=()=>{pinned=null;hover=null;card.hidden=true;renderHighlight();};
  function renderHighlight(){
    const active=hover||pinned;
    for(const [id,{g}]of nodeElements)g.classList.toggle('active',id===active);
    for(const {edge,element,marker}of edgeElements){const opacity=active?(edge.from===active||edge.to===active?'1':'.13'):'.6';element.style.opacity=opacity;if(marker)marker.style.opacity=opacity;}
    const occupied=[];
    const ordered=data.nodes.filter(visible).sort((a,b)=>(a.id===active?-1:b.id===active?1:a.level-b.level));
    for(const n of ordered){
      const {text,hit}=nodeElements.get(n.id),t=text.getBBox(),b={x:n.x*view.k+t.x-4,y:n.y*view.k+t.y-3,w:t.width+8,h:t.height+6};
      const collision=!editing&&n.id!==active&&occupied.some(o=>b.x<o.x+o.w&&b.x+b.w>o.x&&b.y<o.y+o.h&&b.y+b.h>o.y);
      text.style.visibility=collision?'hidden':'';
      if(collision){hit.setAttribute('x',-15);hit.setAttribute('y',-15);hit.setAttribute('width',30);hit.setAttribute('height',30);}
      else{occupied.push(b);const left=Math.min(-15,t.x)-3,top=Math.min(-15,t.y)-3;hit.setAttribute('x',left);hit.setAttribute('y',top);hit.setAttribute('width',Math.max(15,t.x+t.width)-left+3);hit.setAttribute('height',Math.max(15,t.y+t.height)-top+3);}
    }
  }
  function visible(n){return editing||view.k/baseScale>=thresholds[n.level];}
  function route(e){
    const a=byId.get(e.from),b=byId.get(e.to),points=[[a.x,a.y],...(e.points||[]),[b.x,b.y]];
    return points.map((p,i)=>(i?'L ':'M ')+p.join(' ')).join(' ');
  }
  function render(){
    world.setAttribute('transform','translate('+view.x+' '+view.y+') scale('+view.k+')');
    let count=0;
    for(const n of data.nodes){
      const {g,text,hit}=nodeElements.get(n.id),show=visible(n);g.style.display=show?'':'none';g.setAttribute('aria-hidden',String(!show));if(show)count++;
      g.setAttribute('transform','translate('+n.x+' '+n.y+') scale('+1/view.k+')');
      const region=n.level===0,font=region?21:n.level===1?12:11;
      text.setAttribute('font-size',font);text.setAttribute('x',region?0:(n.labelDx??16));text.setAttribute('y',region?0:(n.labelDy??4));
      text.setAttribute('text-anchor',region?'middle':(n.labelDx??16)<0?'end':'start');
      if(show){const t=text.getBBox(),left=Math.min(-15,t.x)-3,top=Math.min(-15,t.y)-3;
        hit.setAttribute('x',left);hit.setAttribute('y',top);hit.setAttribute('width',Math.max(15,t.x+t.width)-left+3);hit.setAttribute('height',Math.max(15,t.y+t.height)-top+3);}
    }
    for(const {edge,element,marker}of edgeElements){
      const a=byId.get(edge.from),b=byId.get(edge.to),display=layers[edge.type].enabled&&visible(a)&&visible(b)?'':'none';element.style.display=display;element.setAttribute('d',route(edge));
      if(marker){marker.style.display=display;const pts=edge.points||[],m=pts.length?pts[Math.floor(pts.length/2)]:[(a.x+b.x)/2,(a.y+b.y)/2];marker.setAttribute('transform','translate('+m[0]+' '+m[1]+') scale('+1/view.k+')');}
    }
    const ratio=view.k/baseScale;document.querySelector('#zoom-level').textContent=Math.round(ratio*100)+'%';
    document.querySelector('#scope').textContent=editing?'位置編輯':ratio<.85?'世界輪廓':ratio<1.5?'艾菲拉總覽':ratio<2.6?'地區與場所':'場所細節';
    document.querySelector('#counts').textContent=count+' / '+data.nodes.length+' 個場所';
    renderHighlight();
  }
  function fit(){
    const r=area.getBoundingClientRect(),b=data.bounds;baseScale=Math.max(.06,Math.min((r.width-32)/b.width,(r.height-44)/b.height));
    view={k:baseScale,x:(r.width-b.width*baseScale)/2-b.x*baseScale,y:(r.height-b.height*baseScale)/2-b.y*baseScale};ready=true;render();
  }
  function zoom(factor,cx=area.clientWidth/2,cy=area.clientHeight/2){
    const k=Math.max(baseScale*.45,Math.min(baseScale*9,view.k*factor)),s=k/view.k;view={k,x:cx-(cx-view.x)*s,y:cy-(cy-view.y)*s};render();
  }
  svg.addEventListener('wheel',e=>{e.preventDefault();const r=svg.getBoundingClientRect();zoom(Math.exp(-e.deltaY*.0015),e.clientX-r.left,e.clientY-r.top);},{passive:false});
  svg.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('.node'))return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,ox:view.x,oy:view.y,moved:false};svg.setPointerCapture(e.pointerId);svg.classList.add('dragging');hover=null;if(!pinned)card.hidden=true;});
  svg.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved ||=Math.abs(dx)+Math.abs(dy)>3;view.x=drag.ox+dx;view.y=drag.oy+dy;render();});
  const endDrag=()=>{suppressClick=!!drag?.moved;drag=null;svg.classList.remove('dragging');setTimeout(()=>{suppressClick=false;},0);};svg.addEventListener('pointerup',endDrag);svg.addEventListener('pointercancel',endDrag);
  document.querySelector('#zoom-in').onclick=()=>zoom(1.4);document.querySelector('#zoom-out').onclick=()=>zoom(1/1.4);document.querySelector('#fit').onclick=fit;
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){pinned=null;hover=null;card.hidden=true;renderHighlight();}if(e.target.matches('input,textarea,button'))return;if(e.key==='+'||e.key==='=')zoom(1.4);if(e.key==='-')zoom(1/1.4);});
  const layersRoot=document.querySelector('#layers');
  for(const [key,l]of Object.entries(layers)){const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.checked=l.enabled;input.dataset.layer=key;input.onchange=()=>{l.enabled=input.checked;render();};label.append(input,document.createTextNode(l.name));layersRoot.append(label);}
  for(const [key,name,target]of [['labels','地名文字','#nodes'],['decorations','標題與指南針','#decorations'],['places','場所符號','#nodes'],['landmarks','孢室地標','#landmarks']]){
    const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.checked=true;input.dataset.layer=key;
    input.onchange=()=>{if(key==='labels')svg.classList.toggle('labels-hidden',!input.checked);else document.querySelector(target).style.visibility=input.checked?'':'hidden';};label.append(input,document.createTextNode(name));layersRoot.append(label);
  }
  function locate(n){view.k=baseScale*Math.max(2,thresholds[n.level]+.3);view.x=area.clientWidth/2-n.x*view.k;view.y=area.clientHeight/2-n.y*view.k;pinned=n.id;showCard(n);render();}
  document.querySelector('#search').addEventListener('input',e=>{
    const results=document.querySelector('#results'),q=e.target.value.trim().toLowerCase();results.replaceChildren();if(!q)return;
    const found=data.nodes.filter(n=>(n.name+' '+n.description+' '+n.function).toLowerCase().includes(q));
    for(const n of found){const b=document.createElement('button');b.textContent=n.name;b.onclick=()=>{document.querySelector('[data-layer="places"]').checked=true;nodeLayer.style.visibility='';locate(n);};results.append(b);}if(!found.length)results.textContent='沒有符合的場所';
  });
  function updateBackground(){
    if(!backgroundImage)return;const x=Number(document.querySelector('#bg-x').value),y=Number(document.querySelector('#bg-y').value),width=Math.max(1,Number(document.querySelector('#bg-width').value));if(![x,y,width].every(Number.isFinite))return;
    for(const [key,value]of Object.entries({x,y,width,height:width/bgAspect,opacity:document.querySelector('#bg-opacity').value}))backgroundImage.setAttribute(key,value);
  }
  document.querySelector('#background-file').onchange=e=>{
    const file=e.target.files[0];if(!file)return;const nextURL=URL.createObjectURL(file),image=new Image();
    image.onload=()=>{if(backgroundURL)URL.revokeObjectURL(backgroundURL);backgroundURL=nextURL;bgAspect=image.naturalWidth/image.naturalHeight;backgroundImage=el('image',{href:backgroundURL,preserveAspectRatio:'none'});drawBackgrounds();updateBackground();document.querySelector('#background-name').textContent=file.name+'（本次預覽）';};
    image.onerror=()=>{URL.revokeObjectURL(nextURL);document.querySelector('#background-name').textContent='圖片無法讀取。';};image.src=nextURL;
  };
  for(const id of ['bg-x','bg-y','bg-width','bg-opacity'])document.querySelector('#'+id).addEventListener('input',updateBackground);
  document.querySelector('#remove-bg').onclick=()=>{if(backgroundURL)URL.revokeObjectURL(backgroundURL);backgroundURL=null;backgroundImage=null;drawBackgrounds();document.querySelector('#background-file').value='';document.querySelector('#background-name').textContent='艾菲拉墨水底圖';};
  document.querySelector('#edit-mode').onchange=e=>{editing=e.target.checked;hover=null;pinned=null;card.hidden=true;svg.classList.toggle('editing',editing);document.querySelector('#edit-status').textContent=editing?'拖曳場所可調整位置；完成後匯出。':'位置修改僅保留於本次預覽。';render();};
  document.querySelector('#export-layout').onclick=()=>{
    const placements=Object.fromEntries(data.nodes.map(n=>[n.id,{x:n.x,y:n.y,...(n.labelDx===undefined?{}:{labelDx:n.labelDx}),...(n.labelDy===undefined?{}:{labelDy:n.labelDy})}]));
    const snapshot={version:1,placements,routes:Object.fromEntries(data.edges.map(e=>[e.from+'/'+e.to+'/'+e.type,e.points||[]])),background:backgroundImage?{...layout.background,x:+backgroundImage.getAttribute('x'),y:+backgroundImage.getAttribute('y'),width:+backgroundImage.getAttribute('width'),height:+backgroundImage.getAttribute('height'),opacity:+backgroundImage.getAttribute('opacity')}:layout.background};
    const url=URL.createObjectURL(new Blob([JSON.stringify(snapshot,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='ephyra-layout.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#edit-status').textContent='已匯出位置。底圖圖片需另外保存；匯出不會更新網站。';
  };
  document.querySelector('#layout-file').onchange=async e=>{
    const file=e.target.files[0];if(!file)return;
    try{
      const imported=JSON.parse(await file.text());if(imported.version!==1||!imported.placements)throw Error('格式不符');
      for(const [id,p]of Object.entries(imported.placements)){if(!byId.has(id)||!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)||Math.abs(p.x)>100000||Math.abs(p.y)>100000||['labelDx','labelDy'].some(k=>p[k]!==undefined&&!Number.isFinite(p[k])))throw Error('位置資料不符');}
      if(imported.routes)for(const [key,points]of Object.entries(imported.routes)){if(!data.edges.some(e=>e.from+'/'+e.to+'/'+e.type===key)||!Array.isArray(points)||points.length>100||points.some(p=>!Array.isArray(p)||p.length!==2||!p.every(Number.isFinite)))throw Error('路線資料不符');}
      for(const [id,p]of Object.entries(imported.placements)){const n=byId.get(id);n.x=p.x;n.y=p.y;if(p.labelDx!==undefined)n.labelDx=p.labelDx;if(p.labelDy!==undefined)n.labelDy=p.labelDy;}
      if(imported.routes)for(const edge of data.edges){const points=imported.routes[edge.from+'/'+edge.to+'/'+edge.type];if(points)edge.points=points;}
      if(imported.background){const b=imported.background;if(['x','y','width','height','opacity'].every(k=>Number.isFinite(b[k]))&&b.width>0&&b.height>0&&b.opacity>=0&&b.opacity<=1){Object.assign(layout.background,{x:b.x,y:b.y,width:b.width,height:b.height,opacity:b.opacity});document.querySelector('#bg-x').value=b.x;document.querySelector('#bg-y').value=b.y;document.querySelector('#bg-width').value=b.width;document.querySelector('#bg-opacity').value=b.opacity;if(backgroundImage){bgAspect=b.width/b.height;updateBackground();}else drawBackgrounds();}}
      render();document.querySelector('#edit-status').textContent='已載入位置配置（本次預覽）。';
    }catch{document.querySelector('#edit-status').textContent='配置無法讀取，請選擇匯出的有效 JSON。';}
    e.target.value='';
  };
  document.querySelector('#toggle-sidebar').onclick=()=>{document.body.classList.toggle('sidebar-open');setTimeout(fit,0);};
  new ResizeObserver(()=>{if(!ready)fit();else render();}).observe(area);fit();
  document.querySelector('#status').textContent=data.nodes.length+' 個場所 · 具體位置為示意';
})();
