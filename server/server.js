import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";
import { Server as SocketIoServer } from "socket.io";

import ProjectRoutes from "./routes/projects.js";
import CollabRoutes from "./routes/collabs.js";
import ChatRoutes from "./routes/chat.js";
import Auth from "./routes/auth.js";
import Tasks from "./routes/tasks.js";

export const server = Fastify({
  logger: true,
});

await server.register(cors, {
  origin: "https://collaborationspace.vercel.app",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
});
await server.register(fastifyFormbody);

await server.register(ProjectRoutes);
await server.register(CollabRoutes);
await server.register(Auth);
await server.register(Tasks);

server.get("/", async () => {
  return { message: "CollabSpace backend running ✅" };
});

const PORT = process.env.PORT || 3001;
server.listen({ port: PORT, host: "0.0.0.0" });

export const io = new SocketIoServer(server.server, {
  cors: { origin: "https://collaborationspace.vercel.app" },
});

ChatRoutes();

const address = server.server.address();
if (address) {
  const host = address.address === "::" ? "localhost" : address.address;
  const port = address.port;
  console.log(`Server (REST + Socket.IO) running at http://${host}:${port}`);
} else {
  console.log(
    "Server address is null, probably because server isn't fully started yet.",
  );
}

process.on("SIGINT", async () => {
  if (typeof prisma !== "undefined" && prisma.$disconnect) {
    await prisma.$disconnect();
  }
  process.exit(0);
});
