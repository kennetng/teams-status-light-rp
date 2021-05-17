import { initializePresenceLight } from "./service/presenceLight";

let presenceInterval;

function startApplication(){
    const checkAccessTokenInterval = setInterval(function(){
          clearInterval(checkAccessTokenInterval)
          presenceInterval = initializePresenceLight();
    }, 5000)   
}

startApplication()