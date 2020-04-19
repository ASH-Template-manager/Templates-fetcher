const {google} = require('googleapis');
const key = require('../config/service-account');


function createClient(api) {
    const jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        ['https://www.googleapis.com/auth/drive'],
        null
    );

    switch (api) {
        case "drive":
            return google.drive({
                version: 'v3',
                auth: jwtClient
            });
        case "docs":
            return google.docs({
                version: 'v1',
                auth: jwtClient
            });
    }


}


module.exports = createClient;
