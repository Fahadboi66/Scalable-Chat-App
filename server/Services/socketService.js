import { socketAuthenticator } from "../Middlewares/token.js";
import { redisClient } from "../Config/redisClient.js";
import { handleNewMessage } from "./messageService.js";
import cookieParser from "cookie-parser";

export function initSocketService(io) {
    //Socket Authentication Middleware
    io.use((socket, next) => {
        cookieParser()(
            socket.request,
            socket.request.res || {},
            async (err) => await socketAuthenticator(err, socket, next)
        );
    });


    //Connection Handling
    // 1. Check if user header is present
    // 2. Store user id to (socketID, serverID) Mapping in Redis
    io.on('connection', async (socket) => {
        console.log("A user connected: ", socket.id);

        if(socket.user && socket.user._id) {
            await redisClient.set(
                `user:${socket.user._id.toString()}`,
                JSON.stringify({socketId: socket.id, serverId: process.env.SERVER_ID || '01' })
            );
        }

        //Handle new message event
        socket.on('NEW_MESSAGE', async ({chatId, members, message, attachments }) => {
            try {
                await handleNewMessage(io, socket.user._id, { chatId, members, message, attachments });
            } catch (err) {
                console.error("Error Processing Message: ", err);
                socket.disconnect()
            }
        })

        //Handle Disconnection
        socket.on("disconnect", async () => {
            if(socket.user && socket.user._id) {
                await redisClient.del(`user:${socket.user._id.toString()}`);
                console.log(`User ${socket.user._id} disconnected from server ${process.env.SERVER_ID || '01'}`);
            }
        })


    })


}