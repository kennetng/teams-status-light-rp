"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPresence = void 0;
const axios_1 = __importDefault(require("axios"));
const client = axios_1.default.create({
    baseURL: 'https://graph.microsoft.com/beta/',
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' }
});
async function getPresence(token) {
    const response = await client.get("/me/presence", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    console.log(`response`, response);
    return response.data;
}
exports.getPresence = getPresence;
