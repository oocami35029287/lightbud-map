const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const raw=fs.readFileSync(process.argv[2],'utf8').replace(/\r\n/g,'\n'),entries={};
for(const m of raw.matchAll(/^### ([A-Z]+-\d{3})｜([^\n]+)\n([\s\S]*?)(?=^### |^## |$(?![\s\S]))/gm)){
 if(entries[m[1]])throw Error('Duplicate '+m[1]);const fields={};for(const line of m[3].split('\n')){const f=line.match(/^- ([^：]+)：(.+)$/);if(f)fields[f[1]]=f[2];}entries[m[1]]={id:m[1],name:m[2],fields};
}
if(Object.keys(entries).length<80)throw Error('Incomplete Bible');
for(const id of raw.match(/\b[A-Z]+-\d{3}\b/g)||[])if(!entries[id])throw Error('Missing '+id);
const selected=Object.fromEntries(Object.entries(entries).filter(([id])=>/^(GEO|EVT)-/.test(id)||['ECO-007','ECO-008','ECO-006','TEC-001','TEC-002','WRD-003'].includes(id)));
const source={repository:'oocami35029287/lightbud-dream',path:'world-bible/WORLD_BIBLE.md',sha256:crypto.createHash('sha256').update(raw).digest('hex')};
fs.writeFileSync(path.join(__dirname,'canon.js'),'/* GENERATED. 世界設定請從已合併 Bible 重建。 */\nwindow.LIGHTBUD_CANON = '+JSON.stringify({source,entries:selected},null,2)+';\n');console.log('Generated',Object.keys(selected).length,'entries from',Object.keys(entries).length,'validated IDs');
