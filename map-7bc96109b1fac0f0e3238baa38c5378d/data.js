/* 新增場所只需擴充 nodes；id 永久唯一。位置為介面示意，非正式地理座標。 */
window.LIGHTBUD_DATA = (() => {
  const source='https://drive.google.com/file/d/1mRLSkf6bVsZCfDvr-KKiKmVjtsJmpTRp/view';
  const story='https://drive.google.com/file/d/1hHb4EGg-gMrTOLGbOTOB2hEdQbgpKzkQ/view';
  const nodes=[]; const edges=[];
  const add=(id,name,x,y,level,kind,description,func,parent=null,status='已採用',note='',url=source)=>nodes.push({id,name,x,y,level,kind,description,function:func,parent,status,note,source:url});
  add('king','菌王株（地表）',-430,-55,1,'地表菌體','長生菌王的地表株體，位於蘑丘，可沿原有道路抵達。其根部所在為沉韻之庭，菌網由根部向其他節點延伸。','協調菌網生命連結與輸送、提供族中保存的燈籠遺物。','mush','已採用','地表株體與根部的精確地形、菌王傳達意願及遺物交付方式待確認。');
  add('white','白域',-950,-30,0,'獨立世界','璃璃原本生活的世界，有家人與日常；與異世界各自獨立。','璃璃的原生生活與返回目的地。',null,'已採用','裂縫通行條件、定位點更新及精確時間差待確認。');
  add('white-home','璃璃的家',-1050,160,2,'生活場所','璃璃離開前的家庭生活場所，回家後嘗試面對未能說完的事情。','家庭日常與角色成長。','white','已採用','內部配置、房間細節待整理。',story);
  add('white-room','璃璃的房間',-1160,265,3,'內部空間','第一篇從白域生活壓力與離開房間的段落展開。','開場生活場景。','white-home','已採用','具體空間與可互動物件待整理。',story);
  const regions=[
    ['mush','蘑丘',-430,-310,'菌類共生聚落，以菌屋、菌橋、採集和家庭生活為特色。','第一篇生活據點；先臨時救援，最後完成根本修復。','損傷最重、魔素積壓，緊急封鎖期間不能直接停機。'],
    ['tree','艾瑟波恩',430,-310,'聖樹上的人類庇護城邦，涉及魔法學習、知識與資源供應。','恢復調節結構、流量控制與穩定输出頻率。','制度、完整設施與魔法少女姓名待確認。'],
    ['ruin','地表遺境',430,330,'災後舊文明遺構與遺拾技術所在，安全聚落和危險區域並存。','修復卡死設備與受阻菌路；葛雷茲的技術合作支線。','具體遺構、故障設備與工具待設計。'],
    ['marsh','深境沼原',-430,330,'水路、牧群與地脈生態交織的地區。','救援失散牧群，修復環境、菌脈與穩定器。','水路、牧群活動範圍與設備故障細節待確認。']
  ];
  for(const [id,name,x,y,desc,func,note] of regions){
    add(id,name,x,y,0,'主要地區',desc,func,null,'已採用',note);
    const sy=y<0?-1:1;
    add(id+'-stabilizer',name+'穩定器',x+150,y+sy*240,1,'人工設備','古代世界穩定器，調節當地菌網的魔素流量、壓力與頻率。輸送與分流由菌絲維持，不設獨立設備通道。',func,id,'已採用','具體位置與修復操作待確認。');
    edges.push({from:'garden',to:id+'-stabilizer',type:'life',status:'locked',unlockCondition:'當地穩定器處理完問題後恢復與菌王根部的菌路連通。',note:'由沉韻之庭的菌王根部延伸至穩定器的菌路目前封鎖；修復後恢復生命連結與輸送。此菌路不代表人物道路。'},
      {from:id,to:id+'-stabilizer',type:'life',note:'城市的菌路連到當地穩定器。'});
  }
  add('home','小麻家',-690,-340,2,'生活據點','小麻一家收留璃璃，陪伴她適應、辨認感受及學習表達需求。','停留、生活互動與情感成長。','mush');
  add('garden','沉韻之庭',-360,-660,1,'菌王根部','菌王根部所在之處；與地表菌王株相連，菌絲由此延伸至其他節點。璃璃在此接觸菌王，獲得族中保存的空芽燈籠。','菌網根部連結、菌王接觸與燈籠提供。','king','已採用','既有正式用字為沉韻之庭；精確位置、進入方式與交付流程待補充。');
  add('garden-inner','沉韻之庭深處',-250,-785,3,'內部空間','菌王根部場所的內部空間，尚未確認是否作為獨立探索區。','根部內部探索的待確認空間。','garden','待確認','內部布局與具體生態功能待設計；不代替空心之芽。');
  add('hollow-bud','空心之芽',-700,-780,2,'共鳴場所','與沉韻之庭相連的菌網節點。災害時這段連結尚未中斷，璃璃需趁仍連通時帶著燈籠趕來，完成第一次穩定共鳴。','選擇共鳴對象、辨認訊號、維持及主動停止連結，為後續各地修復做準備。','mush','已採用','連結尚存不代表永遠安全；具體地形、共鳴原理與中斷條件待確認。',story);
  edges.push({from:'king',to:'garden',type:'life',status:'open',note:'地表菌王株與沉韻之庭的根部相連。'},
    {from:'garden',to:'hollow-bud',type:'life',status:'open',note:'此時與菌王根部的菌路尚未中斷；璃璃趁仍連通趕往共鳴。'});
  add('bridges','菌橋',-730,-540,2,'交通設施','菌類共生環境中的通行設施，災害使菌橋變脆，居民進行支撐。','聚落通行、災害反應與救援。','mush','已採用','個別橋名與連接路線待整理。',story);
  add('fields','孢田',-740,-160,2,'生產場所','蘑丘日常與災害波及的場景，災後仍需持續修復。','呈現地方生產與災後重建。','mush','已採用','作物、產出與具體功能待補充。',story);
  add('control','蘑丘穩定器控制區',-160,-550,3,'設備內部','守脈機的緊急封鎖阻止四人接近控制區。','安全釋放積壓魔素與設備修復。','mush-stabilizer','已採用','守脈機是防護單位，非獨立場所；操作與戰鬥待設計。');
  add('trade','交易據點',0,-550,2,'任務入口','璃璃聯繫懂設備與其他地區的人，接入三條相識與修復任務。','地區聯絡、交易與支線入口。',null,'已採用','精確地區歸屬、名字與交通路線待確認。',story);
  add('magic','魔法設施',740,-370,2,'支線場所','魔法設施反覆故障，是魔法少女調查異常的線索。','採樣、測量及設備與生命狀況調查。','tree','待確認','功能稱呼；具體設施、所在地與操作待設計。');
  add('relic','遺構探索場所',750,350,2,'支線場所','璃璃與葛雷茲前往遺構，檢查故障設備與危险連結。','技術調查、设备測試與修復線索。','ruin','待確認','功能稱呼；具體遺構與空間待設計。');
  add('herd','牧群救援地帶',-740,350,2,'支線場所','弗蕾觀察地形、水流與安全路徑，璃璃辨認牧群訊號。','尋找失散毛鼠、救援與環境調查。','marsh','待確認','功能稱呼；具体範圍與路線待設計。');
  // 道路僅記錄已確認可往來的場所；parent 是歸屬資料，不會自動變成道路。
  edges.push({from:'mush',to:'king',type:'road',note:'使用者已確認蘑丘可沿道路抵達菌王。'},
    {from:'mush',to:'home',type:'road',note:'聚落與生活據點的往來示意。'},
    {from:'mush',to:'garden',type:'road',note:'前往菌王根部沉韻之庭的旅程示意；沿途地點與進入方式待補。'},
    {from:'garden',to:'hollow-bud',type:'road',note:'取得燈籠後趕往空心之芽的行程示意；沿途地點待補，與菌路分開記錄。'},
    {from:'mush',to:'trade',type:'road',note:'已採用的出村前往交易據點旅程；沿途地點待補。'});
  const layout=window.LIGHTBUD_LAYOUT;
  /* 每層有一關卡節點；名稱是功能標籤，關卡機制仍待設計。 */
  for(let floor=1;floor<=4;floor++)add('ruin-floor-'+floor,'第'+floor+'層關卡',0,0,2,'關卡節點',
    '地表遺境由下往上第'+floor+'層的探索關卡。'+(floor===2?'空心之芽位於本層的一個孢室。':''),
    '呈現層間探索與關卡進程；具體操作尚待設計。','ruin','已採用',
    '使用者指定每層一個節點。具體入口、機制與場景名稱待確認；第一層通路尚未定案。');
  const oldHollowRoad=edges.findIndex(e=>e.from==='garden'&&e.to==='hollow-bud'&&e.type==='road');
  if(oldHollowRoad>=0)edges.splice(oldHollowRoad,1);
  for(const [from,to]of [['garden','ruin-floor-4'],['ruin-floor-4','ruin-floor-3'],['ruin-floor-3','ruin-floor-2'],['ruin-floor-2','hollow-bud']])
    edges.push({from,to,type:'road',note:'前往第二層空心之芽須經多個關卡；圖上行程為待細化的通行示意，精確出入口與操作待設計。'});
  for(const n of nodes) Object.assign(n,layout.placements[n.id]||{});
  for(const e of edges) e.points=layout.routes[e.from+'/'+e.to+'/'+e.type]||[];
  nodes.find(n=>n.id==='mush').description='建立於地表遺境頂部的菌類共生聚落。地表由菌絲形成並完全覆蓋舊城市，僅偶見遺物。';
  nodes.find(n=>n.id==='tree').description='北方隆起台地上的聖樹城邦，台地高於蘑丘與城市遺境，巨木上有居民生活與魔法設施。';
  nodes.find(n=>n.id==='ruin').description='草木覆蓋的現代城市遺境，主要建築地表堆疊為四層；沼原接近結構處的基準地表亦留有最早城市廢墟。';
  nodes.find(n=>n.id==='marsh').description='基準地表的沼澤、水路與牧群生態；接近層疊城市處可見早期城市遺跡。';
  Object.assign(nodes.find(n=>n.id==='hollow-bud'),{level:1,parent:'ruin',
    description:'位於地表遺境第二層的一個孢室。璃璃帶著燈籠，穿越多個層間關卡後抵達；此時與菌王根部的菌路尚未中斷。',
    note:'第二層孢室與每層一個關卡節點已指定；孢室外形及具體關卡操作為待設計。'});
  Object.assign(nodes.find(n=>n.id==='tree-stabilizer'),{kind:'被覆蓋的穩定器遺跡',
    description:'聖樹底部不可進入的古代穩定器遺跡，原建於地表，現在完全被聖樹覆蓋。當地教團出於單純信仰保護此處，未曾進入，也不知道內部發生什麼。',
    note:'遺跡內部目前不可進入；未將教團設定為知情者。如何接觸或修復穩定器待設計。'});
  const treeLink=edges.find(e=>e.from==='garden'&&e.to==='tree-stabilizer'&&e.type==='life');
  treeLink.note='沉韻之庭的地下孢絲穿行於地底建築結構間，延伸至聖樹根部與其覆蓋的穩定器遺跡；這段菌路目前封鎖，不是人物通道。';
  return {version:4,source,notes:'艾菲拉橫幅墨水地圖。依採納底圖配置，具體場所和線路走向仍為介面示意，parent 不自動生成道路。',nodes,edges,backgrounds:[layout.background],bounds:layout.bounds};
})();
