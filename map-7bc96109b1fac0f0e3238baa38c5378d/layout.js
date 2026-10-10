/* 可手動編輯。座標使用原圖 1536 × 1024 像素；本檔不改世界規則。 */
window.LIGHTBUD_LAYOUT = {
  version: 1,
  bounds: {x: 0, y: 0, width: 1536, height: 1024},
  mobileFocus: {x:640, y:512},
  background: {src: 'assets/ephyra-base.png', x: 0, y: 0, width: 1536, height: 1024, opacity: 1},
  placements: {
    'white-rift':{x:358,y:411,labelDx:-18,labelDy:22},
    mush: {x:425,y:258}, king:{x:550,y:239,labelDx:24,labelDy:-8},
    garden:{x:545,y:354,labelDx:28,labelDy:20}, 'garden-inner':{x:565,y:370},
    home:{x:351,y:283,labelDx:-18,labelDy:-14},
    'hollow-bud':{x:545,y:689,labelDx:17,labelDy:7},
    'ruin-floor-4':{x:689,y:451,labelDx:17,labelDy:-12},
    'ruin-floor-3':{x:755,y:561,labelDx:17,labelDy:-12},
    'ruin-floor-2':{x:684,y:671,labelDx:17,labelDy:18},
    'ruin-floor-1':{x:646,y:788,labelDx:17,labelDy:18},
    bridges:{x:430,y:315,labelDx:-17,labelDy:22},
    fields:{x:729,y:306,labelDx:18,labelDy:-12},
    'mush-stabilizer':{x:804,y:352,labelDx:18,labelDy:18},
    control:{x:825,y:364}, trade:{x:889,y:444,labelDx:18,labelDy:20},
    tree:{x:1155,y:158}, 'tree-stabilizer':{x:1182,y:214,labelDx:18,labelDy:22},
    magic:{x:1051,y:212,labelDx:-18,labelDy:-15},
    ruin:{x:575,y:543}, 'ruin-stabilizer':{x:647,y:645,labelDx:18,labelDy:20},
    relic:{x:448,y:710,labelDx:18,labelDy:22},
    marsh:{x:1190,y:870}, 'marsh-stabilizer':{x:1055,y:778,labelDx:17,labelDy:-12},
    herd:{x:1290,y:774,labelDx:18,labelDy:20}
  },
  /* 中間轉折點可手改；連線端點會跟著節點移動。菌路不是人物道路。 */
  routes: {
    'garden/mush-stabilizer/life': [[620,385],[738,384]],
    'garden/tree-stabilizer/life': [[572,430],[694,528],[904,552],[1038,453],[1131,319],[1168,245]],
    'garden/hollow-bud/life': [[528,442],[487,553],[510,642]],
    'garden/ruin-stabilizer/life': [[565,458],[600,542]],
    'garden/marsh-stabilizer/life': [[765,469],[917,603],[979,700]],
    'mush/home/road': [[389,265]],
    'mush/garden/road': [[478,288],[510,324]],
    'garden/ruin-floor-4/road': [[621,399],[659,420]],
    'ruin-floor-4/white-rift/road': [[595,430],[490,425],[409,433]],
    'ruin-floor-4/ruin-floor-3/road': [[724,484],[722,527]],
    'ruin-floor-3/ruin-floor-2/road': [[766,608],[725,632]],
    'ruin-floor-2/hollow-bud/road': [[624,656],[583,670]],
    'mush/trade/road': [[657,320],[843,406]]
  }
};
