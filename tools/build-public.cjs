const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),site=path.join(root,'map-7bc96109b1fac0f0e3238baa38c5378d');
function parse(raw,externalIDs=new Set()){const entries={};for(const m of raw.matchAll(/^### ([A-Z]+-\d{3})｜([^\n]+)\n([\s\S]*?)(?=^### |^## |$(?![\s\S]))/gm)){if(entries[m[1]])throw Error('Duplicate '+m[1]);const fields={};for(const l of m[3].split('\n')){const f=l.match(/^- ([^：]+)：(.+)$/);if(f)fields[f[1]]=f[2];}entries[m[1]]={id:m[1],name:m[2],fields};}for(const id of raw.match(/\b[A-Z]+-\d{3}\b/g)||[])if(!entries[id]&&!externalIDs.has(id))throw Error('Missing '+id);return entries;}
const digest=raw=>crypto.createHash('sha256').update(raw).digest('hex');
function build(input,structureInput){
const raw=fs.readFileSync(input,'utf8').replace(/\r\n/g,'\n'),policy=JSON.parse(fs.readFileSync(path.join(root,'content/public-policy.json'))),out={};
if(digest(raw)!==policy.source.sha256)throw Error('Unreviewed source version; compare and review policy before generating public content.');
if(!structureInput||digest(fs.readFileSync(structureInput))!==policy.source.structureSha256)throw Error('Unreviewed structure version.');
const externalIDs=new Set(fs.readFileSync(structureInput,'utf8').match(/\b[A-Z]+-\d{3}\b/g)||[]),all=parse(raw,externalIDs);
for(const [id,keys]of Object.entries(policy.entries)){
 const c=all[id];if(!c||id.startsWith('EVT-'))throw Error('Disallowed '+id);
 const fields={};for(const key of keys){const value=policy.excerpts[id]?.[key];if(!value||!policy.excerptBasis[id]?.[key])throw Error('Missing reviewed excerpt/basis '+id+' '+key);fields[key]=value;}
 out[id]={id,name:c.name,fields,status:'A',visibility:'public',source:{...policy.source,fields:keys}};
}
const refs={};for(const c of Object.values(out)){const found=[...new Set(Object.values(c.fields).join(' ').match(/\b[A-Z]+-\d{3}\b/g)||[])];for(const id of found)if(!out[id])throw Error('Private/dangling ref '+c.id+' '+id);refs[c.id]=[...new Set([...found,...(policy.relations[c.id]||[])])];for(const id of refs[c.id])if(!out[id])throw Error('Dangling relation '+id);}
const previous=JSON.parse(fs.readFileSync(path.join(site,'modules/catalog.json')));
const groups={world:/^(WRD|MAG|HIS)-/,characters:/^CHR-/,ecology:/^ECO-/,organizations:/^(ORG|OCC|RAC)-/,civilization:/^TEC-/,places:/^GEO-/};
for(const [name,re]of Object.entries(groups))fs.writeFileSync(path.join(site,'modules',name+'.json'),JSON.stringify(Object.values(out).filter(c=>re.test(c.id)),null,2)+'\n');
fs.writeFileSync(path.join(site,'modules/catalog.json'),JSON.stringify(out,null,2)+'\n');fs.writeFileSync(path.join(site,'modules/relations.json'),JSON.stringify(refs,null,2)+'\n');
// canon.js is the frozen Atlas snapshot. Introduction updates never write it.
const changes={added:Object.keys(out).filter(id=>!previous[id]),removed:Object.keys(previous).filter(id=>!out[id]),changed:Object.keys(out).filter(id=>previous[id]&&JSON.stringify(previous[id])!==JSON.stringify(out[id]))};fs.writeFileSync(path.join(root,'content/diff-report.json'),JSON.stringify(changes,null,2)+'\n');console.log('PUBLIC BUILD',Object.keys(out).length,'entries; Atlas snapshot unchanged');return out;
}
module.exports={parse,build};if(require.main===module){if(!process.argv[2])throw Error('Supply reviewed local MD and structure JSON files.');build(process.argv[2],process.argv[3]);}
