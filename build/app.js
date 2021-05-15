"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const msal = require("@azure/msal-node");
const express_1 = __importDefault(require("express"));
// import { getPresence } from './client/presenceService';
const { PORT, CLIENT_ID, CLIENT_SECRET } = require('./config/environment');
const SERVER_PORT = PORT || 3000;
const REDIRECT_URI = `http://localhost:${SERVER_PORT}/redirect`;
const msalConfig = {
    auth: {
        clientId: CLIENT_ID,
        authority: "https://login.microsoftonline.com/common",
        clientSecret: CLIENT_SECRET,
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};
// Create msal application object
const pca = new msal.ConfidentialClientApplication(msalConfig);
const app = express_1.default();
app.get("/", (req, res) => {
    const authCodeUrlParameters = {
        scopes: ["user.read", "presence.read"],
        redirectUri: REDIRECT_URI,
    };
    // get url to sign user in and consent to scopes needed for application
    pca
        .getAuthCodeUrl(authCodeUrlParameters)
        .then((response) => {
        // getPresence(response\)
        res.redirect(response);
    })
        .catch((error) => console.log(JSON.stringify(error)));
});
app.get("/redirect", (req, res) => {
    const tokenRequest = {
        code: req.query.code,
        scopes: ["user.read"],
        redirectUri: REDIRECT_URI,
    };
    pca
        .acquireTokenByCode(tokenRequest)
        .then((response) => {
        console.log("\nResponse: \n:", response);
        res.sendStatus(200);
    })
        .catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
});
function startApplication() {
    app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`));
}
