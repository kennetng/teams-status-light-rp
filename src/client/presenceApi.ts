import axios from "axios";

import { Presence } from "../model/Presence";


const client = axios.create({
    baseURL: 'https://graph.microsoft.com/beta/',
    timeout: 1000,
  });


export async function getPresence(token: string): Promise<Presence> {
  try{
    const response = await client.get("/me/presence",{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }catch(error){
    console.log(error)
    throw Error(error)
  }
}