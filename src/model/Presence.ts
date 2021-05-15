import { Activity } from "./Activity";
import { Availability } from "./Availability";

export type Presence =  {
    "@odata.context": string;
    id: string;
    availability: Availability;
    activity: Activity,
    outOfOfficeSettings: {
        message?: string,
        isOutOfOffice: boolean
    }
}