import { v4 as uuidv4 } from 'uuid';
import { redisClient, redisPubSub } from '../Config/redisClient.js';
import { producer } from "../Config/kafkaClient.js";


export function initMessageService(io) {
    // Subscribe to chat-channel
    redisPubSub.subscribe('chat-channel', (err) => {
        if (err) console.error('Redis Subscribe Error: ', err);
        else console.log('[Redis] Subscribed to chat-channel');
    });

    // Listener for messages from Redis
    redisPubSub.on('message', async (channel, message) => {
        if (channel === 'chat-channel') {
            const { msg, targetServerId } = JSON.parse(message);
            if (targetServerId === (process.env.SERVER_ID || '01')) {
                const userData = await redisClient.get(`user:${msg.receiver}`);
                if (userData) {
                    const { socketId } = JSON.parse(userData);
                    io.to(socketId).emit('NEW_MESSAGE', {
                        chatId: msg.chatId,
                        message: msg.message,
                    });
                }
            }
        }
    });
}

export async function handleNewMessage(io, senderId, { chatId, members, message, attachments }) {
    const messageForRealTime = {
        _id: uuidv4(),
        content: message,
        sender: senderId,
        attachments: attachments || {},
        createdAt: new Date().toISOString()
    };

    //Publish to Redis Pub/Sub for each member

    for (const member of members) {
        if (member.toString() !== senderId.toString()) {
            //Get the socket Id and server Id, the user is connected to from redis
            const userData = await redisClient.get(`user:${member}`);
            const targetServerId = userData ? JSON.parse(userData).serverId : process.env.SERVER_ID || "01";

            await redisPubSub.publish(
                'chat-channel',
                JSON.stringify({
                    msg: {
                        chatId,
                        receiver: member,
                        message: messageForRealTime,
                    },
                    targetServerId,
                })
            )
        }
    }

    //Prepare message for kafka
    const kafkaMessage = {
        chat: chatId,
        sender: senderId,
        content: message,
        attachments: attachments || {},
        createdAt: new Date().toISOString(),
    };

    //Create Payload
    const payloads = [
        {
            topic: 'chat-messages',
            messages: JSON.stringify(kafkaMessage),
        },
    ];

    //Send to Kafka
    producer.send(payloads, (err, data) => {
        if (err) console.error("Kafka Send Message Error: ", err);
    })
}


