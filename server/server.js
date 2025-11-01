import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";
import { createServer } from "http";
import { Server as SocketIoServer } from "socket.io";

import ProjectRoutes from "./routes/projects.js";
import CollabRoutes from "./routes/collabs.js";
import ChatRoutes from "./routes/chat.js";
import Auth from "./routes/auth.js";
import Tasks from "./routes/tasks.js";

export const server = Fastify();
await server.register(cors, {
  origin: "https://collab-space-five.vercel.app",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
});
await server.register(fastifyFormbody);

await server.register(ProjectRoutes);
await server.register(CollabRoutes);
await server.register(Auth);
await server.register(Tasks);

server.listen({ port: 3001, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`REST API running at ${address}`);
});

// ✅ Socket.io setup
const httpServer = createServer();
export const io = new SocketIoServer(httpServer, {
  cors: { origin: "https://collab-space-five.vercel.app" },
});

ChatRoutes();

httpServer.listen(3002, "0.0.0.0", ({ address }) => {
  console.log(`Socket.IO server running on ${address}`);
});

// ✅ Graceful shutdown (optional but good practice)
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
