const technosDiv = document.querySelector('#technos');

function loadTechnologies(technos) {
    fetch('http://localhost:3031/technos')
        .then(response => {
            response.json()
                .then(technos => {
                    const allTechnos = technos.map(t => `<div><b>${t.name}</b> ${t.description}  <a href="${t.url}">site de ${t.name}</a> </div>`)
                            .join('');
            
                    technosDiv.innerHTML = allTechnos; 
                });
        })
        .catch(console.error);
}

loadTechnologies(technos);


//On test si le navigateur du client possede un service worker
if(navigator.serviceWorker) {
    navigator.serviceWorker
        .register('sw.js')  //Si c'est le cas on enregistre notre serviceWorker
        .then(registration => {  //Donc on possede une registration vu qu'il y as notre service worker
            // public vapid key generate with web-push
            const publicKey = 'BH6YIXhAxMSqCmKxRN7njmQrhA0HzKhMp7OLoEWZ2uHjG5iPVhTG0f3naXmNN6azvZgQOO4pDtB9Df5jxp7joAY'; //on utilise notre vapidKey

            registration.pushManager.getSubscription().then(subscription => {
                if(subscription) {
                    console.log(subscription)
                    extractKeysFromArrayBuffer(subscription);
                    return subscription;

                } else { // Si il n'ya pas de subscription on fait une nouvelle subscription
                    // ask form a subscription
                    const convertedKey = urlBase64ToUint8Array(publicKey)
                    return registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: convertedKey
                    })
                    .then(newSubscription => {
                        console.log(newSubscription)
                        extractKeysFromArrayBuffer(subscription);
                        return subscription;
                    })
                }
            })
        })
}

if(window.caches) {
    caches.open('veille-techno-1.0').then(cache => {
        // cache.add('index.html');
        cache.addAll([
            'index.html',
            'main.js',
            'vendors/bootstrap4.min.css'
        ]);
    });


}
//Verifie que l'utilisateur a accepter ou pas les notifs 

//Non-Persistant Notifications
// if(window.Notification && window.Notifiaction !== 'denied') {
//     Notification.requestPermission(perm => {
//         if(perm === 'granted') {
//             const options = {
//                 body:'Je suis le body de la notif',
//                 icon: 'images/icons/icon-72x72.png'
//             }
//             const notif = new Notification('Hello', options)
//         } else {
//             console.log('autorisation des notification à été refusé')
//         }
//     })
// }

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
   
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
   
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
   

function extractKeysFromArrayBuffer(subscription){
    // no more keys proprety directly visible on the subscription objet. So you have to use getKey()
    const keyArrayBuffer = subscription.getKey('p256dh');
    const authArrayBuffer = subscription.getKey('auth');
    const p256dh = btoa(String.fromCharCode.apply(null, new Uint8Array(keyArrayBuffer)));
    const auth = btoa(String.fromCharCode.apply(null, new Uint8Array(authArrayBuffer)));
    console.log('p256dh key', keyArrayBuffer, p256dh);
    console.log('auth key', authArrayBuffer, auth);
}