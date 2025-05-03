import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from 'socket.io';
import connectDB from './Config/dbconnection.js';
import userRouter from "./Routes/userRoutes.js";
import authRouter from "./Routes/authRouter.js";
import messageRouter from "./Routes/messageRouter.js";
import chatRouter from "./Routes/chatRouter.js";
import { initSocketService } from "./Services/socketService.js";

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:8080'], credentials: true}))

//Database connection
connectDB();

const server = createServer(app);

//WebSocket Server
const io = new Server(server, {
    cors: { origin: ['http://localhost:5173', 'http://localhost:8080'], credentials: true }
})


//API ROUTES
app.use('/api/auth', authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);


//Initialize Socket.IO service
initSocketService(io);


server.listen(port, () => {
    console.log(`Server ${process.env.SERVER_ID || '1'} is running on port ${port}`)
});

