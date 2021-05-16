import msal = require('@azure/msal-node');

import express from 'express';
import { initializePresenceLight } from './service/presenceLight';

const { PORT, REDIRECT_URL, CLIENT_ID, CLIENT_SECRET } = require('./config/environment');

const SERVER_PORT = PORT || 3000;
const REDIRECT_URI = REDIRECT_URL ||`http://localhost:${SERVER_PORT}/redirect`;

// Global variables
let accessToken: string | undefined;
let presenceInterval: NodeJS.Timeout | undefined;

const msalConfig = {
    auth: {
        clientId: CLIENT_ID,
        authority: "https://login.microsoftonline.com/common",
        clientSecret: CLIENT_SECRET,
    },
     system: {
         loggerOptions: {
             loggerCallback(loglevel: number, message: string, containsPii: any) {
                 console.log(message);
             },
             piiLoggingEnabled: false,
             logLevel: msal.LogLevel.Verbose,
         }
     }
 };

// Create msal application object
const pca = new msal.ConfidentialClientApplication(msalConfig);

const app = express();

app.get("/", (req, res) => {
    const authCodeUrlParameters = {
      scopes: ["user.read", "presence.read"],
      redirectUri: REDIRECT_URI,
    };
  
    // get url to sign user in and consent to scopes needed for application
    pca
      .getAuthCodeUrl(authCodeUrlParameters)
      .then((response) => {
        res.redirect(response);
      })
      .catch((error) => console.log(JSON.stringify(error)));
  });
  
  app.get("/redirect",  (req, res) => {
    const tokenRequest: any  = {
      code: req.query.code,
      scopes: ["user.read"],
      redirectUri: REDIRECT_URI,
    };
  
     pca
      .acquireTokenByCode(tokenRequest)
      .then((response) => {
        if(response){
          accessToken = response.accessToken
          res.sendStatus(200)
        }
        res.sendStatus(408)
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send(error);
      });
  });


function startApplication(){
    const checkAccessTokenInterval = setInterval(function(){
        if(accessToken){
          clearInterval(checkAccessTokenInterval)
          presenceInterval = initializePresenceLight(accessToken);
        }
    }, 5000)   

    app.listen(SERVER_PORT, () =>
      console.log(
        `Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`
      )
    );  
}

startApplication()