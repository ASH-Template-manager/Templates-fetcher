const createClient = require('./client-builder');
const config = require('../config/config');

class DriveManager {

    drive;

    constructor() {
        this.drive = createClient('drive');
    }

    getTemplates(callback) {
        return this.drive.files.list({
            q: `'${config.folderId}' in parents`
        }, callback)
    }

    getChildren(folderId, callback) {
        return this.drive.files.list({
            q: `'${folderId}' in parents`
        }, callback)
    }
}

module.exports = DriveManager;
