/* Public atlas relations. World facts: public-canon.js; cartography: layout.js. No story timelines. */
window.LIGHTBUD_DATA=(()=>{
 const canon=window.LIGHTBUD_CANON,layout=window.LIGHTBUD_LAYOUT,nodes=[],edges=[];
 const source='https://github.com/oocami35029287/lightbud-dream/blob/main/world-bible/WORLD_BIBLE.md';
 const add=(id,ref,level,parent=null,options={})=>{
 const c=canon.entries[ref];if(!c)throw Error('Missing public canon '+ref);
 const f=c.fields;
 nodes.push({id,ref,name:c.name,level,parent,kind:f['類別']||'場所',status:options.placementPending?'位置待定':'正典',
 description:[f['定義'],f['地理'],f['地貌']].filter(Boolean).join(' ')||f['類別']||'',
 function:f['功能']||f['主要設備']||f['交通']||f['生活']||f['定義']||'詳見正式設定',
 source:source+'#:~:text='+encodeURIComponent(ref),...options,...layout.placements[id]});
 };
 add('mush','GEO-001',0);add('tree','GEO-009',0);add('ruin','GEO-002',0);add('marsh','GEO-008',0);
 add('king','ECO-007',1,'mush',{name:'菌王地表株'});
 add('garden','GEO-007',1,'mush');
 add('wind','GEO-003',1,'ruin');add('sleep','GEO-005',1,'ruin');
 add('woven','GEO-004',1,'ruin');add('mist','GEO-015',1,'ruin');add('foundation','GEO-006',1,'ruin');
 add('hollow-bud','GEO-011',1,'sleep');add('mush-equipment','GEO-012',2,'hollow-bud',{note:'中央古代建築內的獨立設備區，不等同於沉韻之庭。'});
 add('highland','GEO-016',1,'wind',{note:'實體高地交通系統；路線曲線為畫面示意。'});
 add('sacred-tree','ECO-008',1,'tree');add('root-ruins','GEO-010',1,'tree');
 add('outer-forest','GEO-014',1,'marsh');
 for(const [region,parent,name]of [['mush','mush-equipment','蘑丘'],['tree','root-ruins','北方'],['ruin','ruin','遺構深層'],['marsh','marsh','沼原']]){
 const pending=['ruin','marsh'].includes(region);add(region+'-stabilizer','TEC-001',2,parent,{name:name+'穩定器',instance:region,placementPending:pending,note:pending?'位置尚未確定；地圖節點只代表所在區域。':'設備位置示意，精確入口尚未確認。'});
 }
 const link=(from,to,type,relation,note='',refs=[])=>edges.push({from,to,type,relation,note,refs,points:layout.routes[from+'/'+to+'/'+type]||[]});
 link('king','garden','structure','同一生命系統','地表巨菌株與根部沉韻之庭為上下兩層生命系統。',['ECO-007']);
 link('garden','hollow-bud','life','生命訊號','經由菌網交換共鳴及感知訊號，不是人物道路。',['GEO-011','ECO-006']);
 for(const region of ['mush','tree','ruin','marsh'])link('garden',region+'-stabilizer','life','菌網功能連結','分布式訊號與魔素網路示意，不代表單一直達路線。',['ECO-006','TEC-001']);
 link('garden','sacred-tree','life','魔素交流','菌網與聖樹進行魔素交換。',['ECO-008']);
 link('sacred-tree','tree-stabilizer','facility','設備協作','北方穩定器與聖樹相連。',['ECO-008','TEC-001']);
 link('mush','highland','road','實體高地交通','由蘑丘第五層的橋梁通往風棲原第四層高樓。',['GEO-016']);
 link('highland','wind','road','高地走廊','風棲原高樓聯絡段為可行走及運貨的實體橋道。',['GEO-016']);
 link('highland','tree','road','實體高地交通','通往艾瑟波恩高地；示意路形並非測繪線位。',['GEO-016']);
 return {version:7,source,nodes,edges,canon,backgrounds:[layout.background],bounds:layout.bounds};
})();
