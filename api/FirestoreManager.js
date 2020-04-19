const admin = require('firebase-admin');
const serviceAccount = require('./../config/service-account-firestore');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

class FirestoreManager {

    db;

    constructor() {
        this.db = admin.firestore();
    }

    saveFile(file) {
        let docRef = this.db.collection('templates').doc(file.id);
        return docRef.set(file, {merge: true});
    }

}

module.exports = FirestoreManager;
