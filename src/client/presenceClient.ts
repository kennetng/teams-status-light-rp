import axios from "axios";

import { Presence } from "../model/Presence";


const client = axios.create({
    baseURL: 'https://teams-status-light-server.herokuapp.com',
    timeout: 2000,
  });


export async function getPresence(): Promise<Presence> {
  try{
    const response = await client.get("/me/presence");
    return response.data;
  }catch(error){
    console.log(error)
    throw Error(error)
  }
}