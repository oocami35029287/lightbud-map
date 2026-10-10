(() => {
  'use strict';
  const data=window.LIGHTBUD_DATA;
  const svg=document.querySelector('#map'),area=document.querySelector('#map-area'),world=document.querySelector('#world');
  const nodeLayer=document.querySelector('#nodes'),edgeLayer=document.querySelector('#edges'),bgLayer=document.querySelector('#backgrounds');
  const card=document.querySelector('#card'),body=document.querySelector('#card-body');
  const NS='http://www.w3.org/2000/svg',byId=new Map(),nodeElements=new Map(),edgeElements=[];
  const layers={life:{name:'菌路',enabled:true},road:{name:'道路',enabled:true}};
  const radii=[53,30,18,11],thresholds=[0,.85,1.5,2.6];
  let view={x:0,y:0,k:1},baseScale=1,pinned=null,hover=null,drag=null,backgroundURL=null,backgroundImage=null,bgAspect=1,ready=false;
  const el=(name,attrs={})=>{const e=document.createElementNS(NS,name);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);return e;};
  for(const n of data.nodes){
    if(byId.has(n.id)||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!Number.isInteger(n.level)||n.level<0||n.level>3)throw new Error('節點資料錯誤：'+n.id);
    byId.set(n.id,n);
  }
  for(const e of data.edges){if(!byId.has(e.from)||!byId.has(e.to)||!layers[e.type])throw new Error('連線資料錯誤');}
  function drawBackgrounds(){
    bgLayer.replaceChildren();
    for(const bg of data.backgrounds){const image=el('image',{href:bg.src,x:bg.x,y:bg.y,width:bg.width,height:bg.height,opacity:bg.opacity??.25,preserveAspectRatio:'none'});bgLayer.append(image);}
    if(backgroundImage)bgLayer.append(backgroundImage);
  }
  drawBackgrounds();
  for(const e of data.edges){
    const p=el('path',{class:'edge',stroke:'#dedede','stroke-width':e.type==='life'?1.5:1.2,'stroke-dasharray':e.type==='road'?'7 6':''});
    p.dataset.type=e.type;p.dataset.from=e.from;p.dataset.to=e.to;p.dataset.status=e.status||'open';
    if(e.status==='locked')p.setAttribute('stroke','#777');
    const marker=e.status==='locked'?el('g',{'class':'connection-lock','aria-label':'封鎖'+layers[e.type].name}):null;
    if(marker){const leader=el('line',{stroke:'#666','stroke-width':1}),box=el('rect',{x:-19,y:-10,width:38,height:20,rx:3,fill:'#111',stroke:'#777'}),label=el('text',{'text-anchor':'middle',y:4,fill:'#aaa','font-size':10});label.textContent='封鎖';marker.append(leader,box,label);}
    edgeLayer.append(p);if(marker)edgeLayer.append(marker);edgeElements.push({edge:e,element:p,marker});
  }
  for(const n of data.nodes){
    const g=el('g',{class:'node'+(n.status==='待確認'?' pending':''),tabindex:'0',role:'button','aria-label':n.name,'data-id':n.id});
    const shape=el('circle'),text=el('text'),sub=el('text');text.textContent=n.id.endsWith('-stabilizer')?'穩定器':n.name;sub.textContent=n.level===0?n.kind:'';g.append(shape,text,sub);nodeLayer.append(g);
    nodeElements.set(n.id,{g,shape,text,sub});
    g.addEventListener('pointerenter',()=>{if(!drag){hover=n.id;showCard(n);renderHighlight();}});
    g.addEventListener('pointerleave',()=>{hover=null;if(pinned)showCard(byId.get(pinned));else card.hidden=true;renderHighlight();});
    g.addEventListener('click',()=>{if(drag?.moved)return;pin(n.id);});
    g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pin(n.id);}});
    g.addEventListener('focus',()=>{hover=n.id;showCard(n);renderHighlight();});
    g.addEventListener('blur',()=>{hover=null;if(pinned)showCard(byId.get(pinned));else card.hidden=true;renderHighlight();});
  }
  function line(label,value){const p=document.createElement('p'),strong=document.createElement('strong');strong.textContent=label+'　';p.append(strong,document.createTextNode(value));return p;}
  function showCard(n){
    body.replaceChildren();const tag=document.createElement('span');tag.className='tag';tag.textContent=n.kind+' / '+n.status;
    const title=document.createElement('h3');title.textContent=n.name;body.append(tag,title,line('描述',n.description),line('功能',n.function));
    if(n.note)body.append(line('註記',n.note));
    if(n.parent)body.append(line('所屬',byId.get(n.parent)?.name||n.parent));
    const connections=data.edges.filter(e=>e.from===n.id||e.to===n.id);
    for(const type of ['life','road']){const links=connections.filter(e=>e.type===type);if(links.length)body.append(line(layers[type].name,links.map(e=>byId.get(e.from===n.id?e.to:e.from).name+(e.status==='locked'?'【封鎖】':'')+(e.note?'（'+e.note+'）':'')+(e.unlockCondition?' 解鎖條件：'+e.unlockCondition:'')).join('；')));}
    const a=document.createElement('a');a.textContent='查看雲端設定來源 ↗';a.href=n.source;a.target='_blank';a.rel='noopener noreferrer';body.append(a);card.hidden=false;
  }
  function pin(id){pinned=pinned===id?null:id;if(pinned)showCard(byId.get(id));else card.hidden=true;renderHighlight();}
  document.querySelector('#close-card').onclick=()=>{pinned=null;hover=null;card.hidden=true;renderHighlight();};
  function renderHighlight(){
    const active=hover||pinned;
    for(const [id,{g}]of nodeElements)g.classList.toggle('active',id===active);
    for(const {edge,element,marker}of edgeElements){const opacity=active?(edge.from===active||edge.to===active?'1':'.18'):'1';element.style.opacity=opacity;if(marker)marker.style.opacity=opacity;}
  }
  function visible(n){return view.k/baseScale>=thresholds[n.level];}
  function render(){
    world.setAttribute('transform',`translate(${view.x} ${view.y}) scale(${view.k})`);
    let count=0;
    for(const n of data.nodes){
      const {g,shape,text,sub}=nodeElements.get(n.id),isVisible=visible(n);g.style.display=isVisible?'':'none';g.setAttribute('aria-hidden',String(!isVisible));if(isVisible)count++;
      const screenRadius=radii[n.level]*Math.min(1.22,Math.max(.75,(view.k/baseScale)**.18));
      g.setAttribute('transform',`translate(${n.x} ${n.y}) scale(${1/view.k})`);shape.setAttribute('r',screenRadius);
      // 保持圓圈、字級與點選範圍可讀；世界座標仍隨鏡頭縮放。
      const internal=n.level<=1;text.setAttribute('y',internal?(n.level===0?-2:4):screenRadius+18);text.setAttribute('font-size',n.level===0?14:n.level===1?10:11);
      sub.setAttribute('y',17);sub.setAttribute('font-size',8);sub.setAttribute('fill','#777');
    }
    for(const {edge,element,marker}of edgeElements){
      const a=byId.get(edge.from),b=byId.get(edge.to),display=layers[edge.type].enabled&&visible(a)&&visible(b)?'':'none';element.style.display=display;
      if(marker){
        marker.style.display=display;
        let pos={x:(a.x+b.x)/2,y:(a.y+b.y)/2},anchor={...pos};
        findPosition: for(const offset of [0,42,-42,70,-70])for(const t of [.5,.3,.7,.15,.85]){
          const px=a.x+(b.x-a.x)*t,py=a.y+(b.y-a.y)*t,length=Math.hypot(b.x-a.x,b.y-a.y)||1;
          const candidate={x:px-(b.y-a.y)/length*offset/view.k,y:py+(b.x-a.x)/length*offset/view.k};
          if(data.nodes.filter(visible).every(n=>Math.hypot((n.x-candidate.x)*view.k,(n.y-candidate.y)*view.k)>radii[n.level]*1.22+27)){
            pos=candidate;anchor={x:px,y:py};break findPosition;
          }
        }
        marker.setAttribute('transform',`translate(${pos.x} ${pos.y}) scale(${1/view.k})`);
        marker.firstChild.setAttribute('x2',(anchor.x-pos.x)*view.k);marker.firstChild.setAttribute('y2',(anchor.y-pos.y)*view.k);
      }
      const dx=b.x-a.x,dy=b.y-a.y;
      element.setAttribute('d',edge.type==='life'?`M ${a.x} ${a.y} C ${a.x+dx*.25-dy*.1} ${a.y+dy*.25+dx*.1}, ${a.x+dx*.7+dy*.08} ${a.y+dy*.7-dx*.08}, ${b.x} ${b.y}`:`M ${a.x} ${a.y} L ${b.x} ${b.y}`);
    }
    const ratio=view.k/baseScale;
    document.querySelector('#zoom-level').textContent=Math.round(ratio*100)+'%';
    document.querySelector('#scope').textContent=ratio<.85?'世界輪廓':ratio<1.5?'世界與主要網絡':ratio<2.6?'地區與場所':'場所內部';
    document.querySelector('#counts').textContent=`${count} / ${data.nodes.length} 個節點`;
    if(hover&&!visible(byId.get(hover))){hover=null;if(pinned)showCard(byId.get(pinned));else card.hidden=true;renderHighlight();}
  }
  function fit(){
    const rect=area.getBoundingClientRect();baseScale=Math.max(.06,Math.min((rect.width-160)/2300,(rect.height-180)/1750));view={k:baseScale,x:rect.width/2+130*baseScale,y:rect.height/2+150*baseScale};ready=true;render();
  }
  function zoom(factor,cx=area.clientWidth/2,cy=area.clientHeight/2){
    const k=Math.max(baseScale*.45,Math.min(baseScale*7,view.k*factor)),s=k/view.k;
    view={k,x:cx-(cx-view.x)*s,y:cy-(cy-view.y)*s};render();
  }
  svg.addEventListener('wheel',e=>{e.preventDefault();const r=svg.getBoundingClientRect();zoom(Math.exp(-e.deltaY*.0015),e.clientX-r.left,e.clientY-r.top);},{passive:false});
  svg.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('.node'))return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,originX:view.x,originY:view.y,moved:false};svg.setPointerCapture(e.pointerId);svg.classList.add('dragging');hover=null;if(!pinned)card.hidden=true;});
  svg.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved ||= Math.abs(dx)+Math.abs(dy)>3;view.x=drag.originX+dx;view.y=drag.originY+dy;render();});
  const endDrag=()=>{drag=null;svg.classList.remove('dragging');};svg.addEventListener('pointerup',endDrag);svg.addEventListener('pointercancel',endDrag);
  document.querySelector('#zoom-in').onclick=()=>zoom(1.4);document.querySelector('#zoom-out').onclick=()=>zoom(1/1.4);document.querySelector('#fit').onclick=fit;
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){pinned=null;hover=null;card.hidden=true;renderHighlight();}if(e.target.matches('input'))return;if(e.key==='+'||e.key==='=')zoom(1.4);if(e.key==='-')zoom(1/1.4);});
  const layersRoot=document.querySelector('#layers');
  for(const [key,l]of Object.entries(layers)){const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.checked=l.enabled;input.dataset.layer=key;input.onchange=()=>{l.enabled=input.checked;render();};label.append(input,document.createTextNode(l.name));layersRoot.append(label);}
  function locate(n){
    view.k=baseScale*Math.max(1.9,thresholds[n.level]+.25);view.x=area.clientWidth/2-n.x*view.k;view.y=area.clientHeight/2-n.y*view.k;
    pinned=n.id;showCard(n);render();renderHighlight();
  }
  document.querySelector('#search').addEventListener('input',e=>{
    const results=document.querySelector('#results'),q=e.target.value.trim().toLowerCase();results.replaceChildren();if(!q)return;
    const found=data.nodes.filter(n=>(n.name+' '+n.description+' '+n.function).toLowerCase().includes(q));
    for(const n of found){const b=document.createElement('button');b.textContent=n.name;b.onclick=()=>locate(n);results.append(b);}if(!found.length)results.textContent='沒有符合的場所';
  });
  function updateBackground(){if(!backgroundImage)return;const x=Number(document.querySelector('#bg-x').value),y=Number(document.querySelector('#bg-y').value),width=Math.max(1,Number(document.querySelector('#bg-width').value));if(![x,y,width].every(Number.isFinite))return;for(const [key,value]of Object.entries({x,y,width,height:width/bgAspect,opacity:document.querySelector('#bg-opacity').value}))backgroundImage.setAttribute(key,value);}
  document.querySelector('#background-file').onchange=e=>{
    const file=e.target.files[0];if(!file)return;const nextURL=URL.createObjectURL(file),image=new Image();
    image.onload=()=>{if(backgroundURL)URL.revokeObjectURL(backgroundURL);backgroundURL=nextURL;bgAspect=image.naturalWidth/image.naturalHeight;backgroundImage=el('image',{href:backgroundURL,preserveAspectRatio:'none'});drawBackgrounds();updateBackground();document.querySelector('#background-name').textContent=file.name+'（本次預覽）';};
    image.onerror=()=>{URL.revokeObjectURL(nextURL);document.querySelector('#background-name').textContent='圖片無法讀取，請選擇其他檔案。';};image.src=nextURL;
  };
  for(const id of ['bg-x','bg-y','bg-width','bg-opacity'])document.querySelector('#'+id).addEventListener('input',updateBackground);
  document.querySelector('#remove-bg').onclick=()=>{if(backgroundURL)URL.revokeObjectURL(backgroundURL);backgroundURL=null;backgroundImage=null;drawBackgrounds();document.querySelector('#background-file').value='';document.querySelector('#background-name').textContent='尚未加入背景圖片';};
  new ResizeObserver(()=>{if(!ready)fit();else render();}).observe(area);fit();
  document.querySelector('#status').textContent=`${data.nodes.length} 個節點 · 座標為示意`;
})();
