const express = require('express');
const router = express.Router();
const DriveManager = require('../api/DriveManager');
const DocsManager = require('../api/DocsManager');
const FirestoreManager = require('../api/FirestoreManager');
const request = require('request');

router.get('/sync', async (req, res, next) => {
    const driveManager = new DriveManager();
    const docsManager = new DocsManager();
    const firestoreManager = new FirestoreManager();
    driveManager.getTemplates(async (err, result) => {
        let nbFiles = 0;
        for (const f of result.data.files) {
            if (f.name === '_USED') continue;
            await new Promise(resolve => {
                console.log('treating', f.name);
                driveManager.getChildren(f.id, async (err, resGetFiles) => {
                    if (err) {
                        console.error('ERR : ' + err);
                        resolve();
                    }
                    f.children = resGetFiles.data.files;
                    const linkDoc = f.children.find(c => c.mimeType === 'application/vnd.google-apps.document');
                    if (linkDoc) {
                        const link = await docsManager.getLinkFromDoc(linkDoc.id);
                        if (link) {
                            f.refLink = link.replace(' ', '');
                            await firestoreManager.saveFile(f);
                            nbFiles ++;
                            console.log('files treated : ', nbFiles)
                        }
                    }
                    resolve();
                });
            });
        }
        console.log('sending http request to sync images');
        request('https://ash-template-manager.nw.r.appspot.com/api/metas/sync', { json: true }, (err, result, body) => {
            res.send({'status': 'ok'});
        });
    });

});

module.exports = router;
