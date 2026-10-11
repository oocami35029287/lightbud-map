const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');const window={};
for(const f of ['layout.js','canon.js','data.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,f),'utf8'),{window});
const d=window.LIGHTBUD_DATA,ids=new Set(d.nodes.map(n=>n.id));assert.equal(ids.size,d.nodes.length);
for(const n of d.nodes){assert.ok(d.canon.entries[n.ref]);assert.ok(Number.isFinite(n.x)&&Number.isFinite(n.y));if(n.parent)assert.ok(ids.has(n.parent));}
for(const e of d.edges){assert.ok(ids.has(e.from)&&ids.has(e.to));for(const ref of e.refs)assert.ok(d.canon.entries[ref]);}
assert.equal(d.nodes.filter(n=>n.instance).length,4);assert.equal(d.nodes.filter(n=>n.placementPending).length,2);assert.equal(d.nodes.find(n=>n.id==='hollow-bud').parent,'sleep');assert.ok(!d.edges.some(e=>e.from==='mist'&&e.to==='hollow-bud'));
let id=d.story.head,prev=null;const seen=new Set();while(id){assert.ok(!seen.has(id));seen.add(id);const item=d.story.items[id];assert.equal(item.previous,prev);assert.ok(d.canon.entries[id]);prev=id;id=item.next;}assert.equal(seen.size,Object.keys(d.story.items).length);assert.equal(prev,'EVT-011');assert.equal(d.story.items['EVT-017'].next,'EVT-011');
console.log('PASS: source references, unique IDs, 4 cores, 2 pending positions, fourth-layer chamber, linked story order;',d.nodes.length,'markers,',d.edges.length,'relations.');
