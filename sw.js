/* Service worker Jungle Defense: najpierw sieć (zawsze świeża wersja), a offline z pamięci */
const C='jd-cache-1';
const PRE=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==C).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||!r.url.startsWith('http')||r.headers.has('range'))return;
  e.respondWith(fetch(r).then(res=>{
    if(res&&(res.status===200||res.type==='opaque')){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp)).catch(()=>{})}
    return res;
  }).catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('index.html'):undefined))));
});
