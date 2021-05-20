"use strict";

import { Gpio } from "onoff"; // Raspberry Pi specific 
import { getPresence } from "../client/presenceClient"
import { Activity } from "../model/Activity";
import { Presence } from "../model/Presence"

//Raspberry Pi specific
const GREEN_LED = new Gpio(4, 'out')
const RED_LED = new Gpio(5, 'out')

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
        5000
        ) 
}

// Raspberry Pi specific
function controlLedLights({ availability, activity }: Presence){
    const inACallList = [Activity.InACall, Activity.InAConferenceCall, Activity.InAConferenceCall, Activity.InAMeeting];
    const isAvailable = activity === Activity.Available 

    if(inACallList.includes(activity)){
        console.log(`turn on RED LIGHT`)
        GREEN_LED.writeSync(0) 
        RED_LED.writeSync(1)
    }else if(isAvailable){
        console.log(`turn on GREEN LIGHT`)
        RED_LED.writeSync(0)
        GREEN_LED.writeSync(1)
    }else{
        RED_LED.writeSync(1)
        GREEN_LED.writeSync(1)
    }
}

// Gracefully turn off led
process.on('SIGINT', _ => {
    GREEN_LED.unexport();
    RED_LED.unexport();
})