const createClient = require('./client-builder');

class DocsManager {
    docs;

    constructor() {
        this.docs = createClient('docs');
    }

    getLinkFromDoc(fileId) {
        return new Promise(resolve => {
            this.docs.documents.get({
                documentId: fileId,
            }, (err, res) => {
                if (err) {
                    console.error('ERROR', err);
                    resolve(null);
                }
                let link = null;
                res.data.body.content.forEach(c => {
                    if (c.paragraph) {
                        c.paragraph.elements.forEach(e => {
                            if (e.textRun.content.includes('https://')) {
                                link = e.textRun.content;
                            }
                        })
                    }
                });
                resolve(link);
            });
        })
    }
}

module.exports = DocsManager;
