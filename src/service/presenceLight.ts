"use strict";

import { Gpio } from "onoff"; // Raspberry Pi specific 
import { getPresence } from "../client/presenceClient"
import { Activity } from "../model/Activity";
import { Presence } from "../model/Presence"

//Raspberry Pi specific
const GREEN_LED = new Gpio(4, 'out')
const RED_LED = new Gpio(5, 'out')
const YELLOW_LED = new Gpio(6, 'out')
const listLedLights = [RED_LED, GREEN_LED, YELLOW_LED]

export function initializePresenceLight(){
    return setInterval(
        async function(){
            try{
                const presence = await getPresence()
                controlLedLights(presence);
            }catch(error){
                console.log(error)
            }
        }, 
        2000
        ) 
}

// Raspberry Pi specific
function controlLedLights({ availability, activity }: Presence){
    const inACallList = [Activity.InACall, Activity.InAConferenceCall, Activity.InAConferenceCall, Activity.InAMeeting];
    const isAvailable = activity === Activity.Available 
    if(inACallList.includes(activity)){
        console.log(`turn on RED LIGHT`)
        turnOnOneLed(RED_LED)
    }else if(isAvailable){
        console.log(`turn on GREEN LIGHT`)
        turnOnOneLed(GREEN_LED)
    }else{
        listLedLights.forEach(led => led.writeSync(1))
    }
}

// Raspberry Pi specific
function turnOnOneLed(targetLed: Gpio){
    // Turn off all led
    listLedLights.forEach(led => {
        led.writeSync(0);
        led.unexport();
    });

    // Turn on target led
    targetLed.writeSync(1)
}