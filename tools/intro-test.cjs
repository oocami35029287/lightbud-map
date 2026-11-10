const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']}),p=await b.newPage(),errors=[],checks=[];
p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
const base=process.env.TEST_SITE_URL||'http://127.0.0.1:8765/map-7bc96109b1fac0f0e3238baa38c5378d/';
const tagline='即使世界早已荒蕪，那些未曾被聽見的願望，仍會在某個角落，悄悄長出微光。';
for(const [width,height]of [[320,568],[360,640],[390,844],[1440,900]]){
 await p.setViewportSize({width,height});await p.goto(base);await p.waitForSelector('#hero-scene img');await p.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await p.locator('.hero-subtitle').innerText(),tagline);
 const box=await p.locator('.hero-subtitle').boundingBox();assert.ok(box.y>=0&&box.y+box.height<=height,'Tagline outside first viewport '+width);
 assert.ok(await p.getByRole('link',{name:'認識故事'}).isVisible());assert.ok(await p.getByRole('link',{name:'認識角色 ↗'}).isVisible());
 checks.push('Full approved tagline and story/character entrances '+width+'x'+height);
}
await p.setViewportSize({width:390,height:844});
const descriptions=[];
for(const slug of ['index','world','characters','ecology','organizations','civilization','white','sources']){
 await p.goto(base+slug+'.html');await p.waitForSelector('.site-footer');
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Overflow '+slug);
 const desc=await p.locator('meta[name="description"]').getAttribute('content');assert.ok(desc);descriptions.push(desc);
 for(const property of ['og:title','og:description','og:image','og:url'])assert.ok(await p.locator('meta[property="'+property+'"]').getAttribute('content'));
 assert.equal(await p.locator('a[href*="lightbud-dream"],a[href*="docs.google.com"]').count(),0);
}assert.equal(new Set(descriptions).size,8);checks.push('Eight introduction routes: mobile layout, unique SEO/OG, public source links');
for(const [id,name,expected]of [['CHR-001','璃璃','空相律'],['CHR-002','格蕾茲','飛上天空'],['CHR-003','弗蕾','照顧與牧放毛鼠'],['CHR-004','瑟薇','亞斯緹雅魔法學院頂尖學員與特別研究員'],['CHR-005','小麻','見習採集員'],['CHR-008','小穗','孢靈構師']]){
 await p.goto(base+'characters.html?entry='+id);await p.waitForSelector('dialog[open]');
 assert.equal(await p.locator('#entry-title').innerText(),name);assert.ok((await p.locator('#entry-detail').innerText()).includes(expected));
 assert.equal(await p.locator('#entry-detail a[href*="lightbud-dream"]').count(),0);
 if(['CHR-001','CHR-005'].includes(id)){
  const art=p.locator('#entry-detail .portrait-window');assert.ok((await art.getAttribute('aria-label')).startsWith(name));
  assert.equal(await art.getAttribute('viewBox'),id==='CHR-001'?'490 40 300 710':'85 140 195 245');
 }else assert.equal(await p.locator('#entry-detail .character-art').count(),0);
 if(id==='CHR-004'){
  assert.equal(await p.locator('#entry-detail a[href*="ORG-002"]').count(),0);
  await p.locator('#entry-detail .related-links a[href*="ORG-008"]').first().click();await p.waitForSelector('dialog[open]');
  assert.equal(await p.locator('#entry-title').innerText(),'亞斯緹雅魔法學院');
 }
 await p.keyboard.press('Escape');assert.equal(await p.locator('dialog[open]').count(),0);
}checks.push('All six character cards/deep links: name, identity, law, image assignment, academy relation and Escape');
await p.goto(base+'organizations.html');await p.waitForSelector('.authority-diagram');
assert.equal(await p.locator('.authority-diagram .branches a').count(),4);assert.ok(!(await p.locator('#main-content').innerText()).includes('魔法公會'));checks.push('Current organization responsibilities and retired guild removed');
for(const [id,name,expected]of [['GEO-005','眠孢域','第一至第四層'],['GEO-011','群息之庭','第一至第三層'],['GEO-007','菌王深庭','第五層'],['HIS-002','大裂潮','大失相災變']]){
 const route=id.startsWith('GEO')?'civilization':'world';await p.goto(base+route+'.html?entry='+id);await p.waitForSelector('dialog[open]');
 assert.equal(await p.locator('#entry-title').innerText(),name);assert.ok((await p.locator('#entry-detail').innerText()).includes(expected));
}checks.push('Current geographic names, cross-layer boundaries and historical aliases');
assert.deepEqual(errors,[]);fs.mkdirSync('.test-output',{recursive:true});fs.writeFileSync('.test-output/intro-results.json',JSON.stringify({checks,errors},null,2));console.log('PASS',checks.length,'introduction checks; no JS/resource errors');await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
