import { Server } from "socket.io";

let io;
const connectedUsers = new Map();

const allowedOrigins = [
    "http://localhost:5173",
    "https://pulse-flow-6tvh981sk-forest-whispers-projects.vercel.app",
    "https://pulse-flow-two.vercel.app"
];

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: allowedOrigins,
        },
    });

    io.on("connection", (socket) => {
        socket.on("register", (userId) => {
            connectedUsers.set(userId, socket.id);
        });

        socket.on("disconnect", () => {
            for (const [userId, socketId] of connectedUsers.entries()) {
                if (socketId === socket.id) {
                    connectedUsers.delete(userId);
                    break;
                }
            }
        });
    });
};

export const getIO = () => io;

export const getConnectedUserSocket = (userId) => {
    return connectedUsers.get(userId);
};