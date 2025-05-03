import { socketAuthenticator } from "../Middlewares/token.js";
import { redisClient } from "../Config/redisClient.js";
import { handleNewMessage } from "./messageService.js";
import cookieParser from "cookie-parser";

export function initSocketService(io) {
    
}