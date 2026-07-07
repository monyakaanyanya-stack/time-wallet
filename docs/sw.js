// 旧「Time Wallet」PWA（Web体験版）の後始末用Service Worker（キルスイッチ）。
// 体験版の提供は終了。旧バージョンをインストール済みの端末がオンラインで開くと、
// このSWに更新される→全キャッシュを削除→自身を解除し、以後は通常のWebページとして配信される。
// このファイル自体は、旧SWが更新チェックで取得するため残している（削除しない）。
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.registration.unregister();
    // 開いているページを再読み込みして、SW管理下から抜けた状態にする
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(client => client.navigate(client.url));
  })());
});
