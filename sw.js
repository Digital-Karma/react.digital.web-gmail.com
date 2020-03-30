const cacheName = 'veille-technos-1.1';

self.addEventListener('install', evt => {
   const cachePromise = caches.open(cacheName).then(cache => {
       return cache.addAll([
            'index.html',
            'main.js',
            'style.css',
            'vendors/bootstrap4.min.css',
            'add_techno.html',
            'add_techno.js',
            'contact.html',
            'contact.js'
        ])
    })

    evt.waitUntil(cachePromise)
})

self.addEventListener('activate', evt =>{
   let cacheCleanedPromise = caches.keys().then(keys => {
        keys.forEach(key => {
            if(key !== cacheName){
               return caches.delete(key)
            }
        })
    })

    evt.waitUntil(cacheCleanedPromise)
})

self.addEventListener('fetch', evt => {

    // if(!navigator.onLine){
    //     const headers = { headers: { 'Content-Type': 'text/html;charset=utf-8'}};
    //     evt.respondWith(new Response('<h1>Pas deconnxion internet</h1><div>Application en mode dégradé</div>', headers));
    // }

    //Strategie de cache only with network fallback

    // evt.respondWith(
    //     caches.match(evt.request).then(res => {
    //         if(res) {
    //             console.log(`url fetchée depuis le cache ${evt.request.url}`, res)
    //             return res;
    //         }

    //         return fetch(evt.request).then(newResponse => {
    //             console.log(`url recupérée sur le reseau puis mise en cache ${evt.request.url}`, newResponse)
    //             caches.open(cacheName).then(cache => cache.put(evt.request, newResponse));
    //             return newResponse.clone();
    //         })
    //     })
    // )

    //Stratégie de network first with cache fallback
    evt.respondWith(
        fetch(evt.request).then(res => {
            console.log(`url fetchée depuis le reseau ${evt.request.url}`)
            caches.open(cacheName).then(cache => cache.put(evt.request, res))
            return res.clone();
        }).catch(err => {
                console.log(`url fetchée depuis le cache ${evt.request.url}`)
                return caches.match(evt.request)
            }
        )
    );
});

//Notification depuis le service Worker
// self.registration.showNotification('Notif depuis Service Worker', {
//     body:'Super Notif',
//     actions: [
//         {
//             action: 'accept',
//             title:'Accepter'
//         },
//         {
//             action: 'refuse',
//             title: 'Refusé'
//         }
//     ]
// })

// self.addEventListener('notificationclose', evt => {
//     console.log(evt)
// })

// self.addEventListener('notificationclick', evt => {
//     if(evt.action === 'accept') {
//         console.log('Accepter')
//     } else if(evt.action === 'refuse') {
//         console.log('refuser')
//     } else {
//         console.log("CLiquer sur l'un des boutton s'il vous plait")
//     }
//     evt.notification.close();
// })


//Gerer une notif depuis un server la on fait le Test avec l'outils push de devtools de google
self.addEventListener('push', evt => {
    console.log(evt)
    console.log(evt.data.text())
    const titleNotif = evt.data.text();
    evt.waitUntil(self.registration.showNotification(titleNotif, 
        {
            body:'lets go', 
            image: 'images/icons/icon-152x152.png'
        }
    ))
})