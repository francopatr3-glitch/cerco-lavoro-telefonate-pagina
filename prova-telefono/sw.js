// Telefonate sul telefono: le copie salvate sul telefono (manuale dell'app, consiglio 5; fase F3, 21-10-2026).
// Solo il minimo per disegnare la cornice e la pagina «senza rete»: Telefonate vera arriva sempre da Google.
// Tutte le pagine di francopatr3-glitch.github.io dividono lo stesso spazio: le copie hanno il prefisso di Telefonate
// e a ogni versione si cancellano solo le vecchie di Telefonate. Per una versione nuova si cambia il numero qui sotto.
const PREFISSO = 'telefonate-prova-';
const COPIE = PREFISSO + '2';
const FILE = ['./', 'manifest.webmanifest', 'icona-192.png', 'icona-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(COPIE).then(c => c.addAll(FILE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(nomi => Promise.all(nomi.filter(n => n.startsWith(PREFISSO) && n !== COPIE).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});
// la cornice si chiede prima alla rete (così le modifiche arrivano subito); senza rete si usa la copia,
// che mostra «Telefonate ha bisogno di internet»; le icone e il manifest dalla copia
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(risp => {
      const copia = risp.clone();
      if (risp.ok) caches.open(COPIE).then(c => c.put('./', copia));
      return risp;
    }).catch(() => caches.match('./')));
    return;
  }
  // solo i file della copia; tutto il resto va alla rete come se le copie non ci fossero
  const nome = new URL(r.url).pathname.split('/').pop();
  if (!FILE.includes(nome)) return;
  e.respondWith(caches.match(r).then(c => c || fetch(r)));
});
