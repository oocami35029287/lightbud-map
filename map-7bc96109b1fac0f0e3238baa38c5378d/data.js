/* 地圖表現與來源引用；世界事實從 canon.js 單向生成。 */
window.LIGHTBUD_DATA=(()=>{
 const canon=window.LIGHTBUD_CANON,layout=window.LIGHTBUD_LAYOUT,nodes=[],edges=[];
 const source='https://github.com/oocami35029287/lightbud-dream/blob/main/world-bible/WORLD_BIBLE.md';
 const add=(id,ref,level,parent=null,options={})=>{const c=canon.entries[ref];if(!c)throw Error('Missing canon '+ref);const f=c.fields;
 nodes.push({id,ref,name:c.name,level,parent,kind:f['類別']||'場所',status:'正典',description:[f['定義'],f['地理'],f['地貌']].filter(Boolean).join(' '),function:f['功能']||f['故事作用']||f['主要設備']||f['生活']||'查看相關場所與事件。',source:source+'#:~:text='+encodeURIComponent(ref),...options,...layout.placements[id]});};
 add('mush','GEO-001',0);add('tree','GEO-009',0);add('ruin','GEO-002',0);add('marsh','GEO-008',0);
 add('king','ECO-007',1,'mush',{name:'菌王地表株'});add('garden','GEO-007',1,'mush');
 add('wind','GEO-003',1,'ruin');add('sleep','GEO-005',1,'ruin');add('woven','GEO-004',1,'ruin');add('mist','GEO-015',1,'ruin');add('foundation','GEO-006',1,'ruin');
 add('hollow-bud','GEO-011',1,'sleep');add('mush-equipment','GEO-012',2,'mush',{note:'與群息之庭的精確包含／鄰接關係尚未確定，先分開標示。'});
 add('sacred-tree','ECO-008',1,'tree');add('root-ruins','GEO-010',1,'tree',{note:'受聖蔭教會管理的禁區；進入許可與故事階段有關。'});add('outer-forest','GEO-014',1,'marsh');
 for(const [region,parent,name]of [['mush','mush-equipment','蘑丘'],['tree','root-ruins','北方'],['ruin','ruin','遺構深層'],['marsh','marsh','沼原']]){
 const pending=['ruin','marsh'].includes(region);add(region+'-stabilizer','TEC-001',1,parent,{name:name+'穩定器',instance:region,placementPending:pending,note:pending?'位置待定：目前只標示區域示意點，可移動；不代表已確定的入口或座標。':'標記為設備示意；內部布局與修復操作尚待設計。'});
 }
 add('white-rift','WRD-003',2,'ruin',{name:'裂隙位置（事件示意）',status:'位置意向',note:'第四層原指定位置暫留；是否對應已湮滅的初始裂隙尚待確認。這不是永久開啟的入口。',destination:'white.html'});
 const link=(from,to,type,relation,note='',refs=[])=>edges.push({from,to,type,relation,note,refs,points:layout.routes[from+'/'+to+'/'+type]||[]});
 link('king','garden','structure','同一生命體','地表株與根部意識核心。',['ECO-007']);
 link('garden','hollow-bud','life','訊號交換','透過魔素網路交換訊號，線形為示意。',['GEO-011']);
 for(const r of ['mush','tree','ruin','marsh'])link('garden',r+'-stabilizer','life','菌網功能連結','分布式菌網示意，非人物道路或已測定的單一直達管線。',['ECO-006','TEC-001']);
 link('garden','sacred-tree','life','魔素交換','菌網與聖樹交換、調和魔素。',['ECO-008']);link('sacred-tree','tree-stabilizer','life','生命與設備連結','北方核心與聖樹相連。',['ECO-008']);
 link('mush','garden','road','授燈行程','有引薦者帶璃璃前往；實際入口路形待細化。',['EVT-006']);
 link('mush','hollow-bud','road','修習及返村行程','赴第四層眠孢庭修習後返村，不再下至第二層。',['EVT-007']);
 link('mush','mush-equipment','road','設備調查行程','格蕾茲作技術顧問加入後共同前往。',['EVT-008','EVT-009']);
 link('tree','root-ruins','road','禁區探索行程','故事中確有進入，平時受到許可管制。',['EVT-014','EVT-015']);
 const order=['EVT-001','EVT-002','EVT-003','EVT-004','EVT-005','EVT-006','EVT-007','EVT-008','EVT-009','EVT-010','EVT-012','EVT-014','EVT-015','EVT-016','EVT-017','EVT-011'];
 const places={'EVT-006':'garden','EVT-007':'hollow-bud','EVT-009':'mush-equipment','EVT-012':'marsh','EVT-014':'tree','EVT-015':'root-ruins','EVT-016':'root-ruins','EVT-017':'tree-stabilizer','EVT-011':'ruin-stabilizer'};
 const story={head:order[0],items:Object.fromEntries(order.map((id,i)=>[id,{eventId:id,previous:order[i-1]||null,next:order[i+1]||null,place:places[id]||(['EVT-001','EVT-002'].includes(id)?null:'mush')}]))};story.separate=['EVT-013','EVT-018','EVT-019','EVT-020'];
 for(const [a,b]of [['mush-stabilizer','marsh-stabilizer'],['marsh-stabilizer','tree-stabilizer'],['tree-stabilizer','ruin-stabilizer']])link(a,b,'story','修復順序','故事次序，不代表直達道路。',['EVT-009','EVT-012','EVT-017','EVT-011']);
 return {version:6,source,nodes,edges,story,canon,referenceNodes:[],backgrounds:[layout.background],bounds:layout.bounds};
})();
