const webPush = require('web-push');
const pushServerKeys = require('./pushServerKeys');
const pushClientSubscription = require('./pushClientSubscription');

webPush.setVapidDetails('mailto:muller.jessy.pro@gmail.com', pushServerKeys.publicKey, pushServerKeys.privateKey)

const subscription = {
    endpoint: pushClientSubscription.endpoint,
    keys:{
        auth: pushClientSubscription.keys.auth,
        p256dh: pushClientSubscription.keys.p256dh
    }
}

webPush.sendNotification(subscription, 'Notification est ce que tu as recu')
.then(res =>console.log('Push bien envoyé', res))
.catch(err => console.error)