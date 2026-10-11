/* Lossless Drive PNGs split into static text chunks to avoid provider single-upload limits.
   Reconstructed at runtime without altering image data. Layout and overlays remain independent. */
(()=>{
 "use strict";
 const assets=window.LIGHTBUD_ART_ASSETS={garden:"assets/atlas-garden.png"};
 async function loadPng(prefix,parts){
   const chunks=await Promise.all(Array.from({length:parts},async(_,i)=>{
     const name="assets/atlas-parts/"+prefix+"-"+String(i).padStart(2,"0")+".txt";
     const response=await fetch(name,{cache:"force-cache"});
     if(!response.ok)throw new Error("Image part unavailable: "+name+" ("+response.status+")");
     return response.text();
   }));
   const url="data:image/png;base64,"+chunks.join("");
   await new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=()=>reject(new Error("PNG reconstruction failed: "+prefix));img.src=url;});
   return url;
 }
 window.LIGHTBUD_ASSET_LOAD=Promise.allSettled([loadPng("base",5),loadPng("hollow",6)]).then(results=>{
   assets.base=results[0].status==="fulfilled"?results[0].value:null;
   assets["hollow-bud"]=results[1].status==="fulfilled"?results[1].value:null;
   window.LIGHTBUD_ASSET_STATUS={base:!!assets.base,hollow:!!assets["hollow-bud"],garden:true};
   for(let i=0;i<results.length;i++)if(results[i].status==="rejected")console.warn("[光芽之夢] 圖層素材載入失敗",results[i].reason);
   dispatchEvent(new Event("lightbud-assets-ready"));
   return window.LIGHTBUD_ASSET_STATUS;
 });
})();
