import { io } from "../server.js";
import prisma from "../prisma.js";

export default function ChatRoutes() {
  io.on("connection", (socket) => {
    socket.on("joinProject", async (projectId) => {
      if (!projectId) {
        console.log("Wrong projectId its not working: ", projectId);
        return;
      }
      socket.join(projectId ?? "fake");
      const messages = await prisma.chatMessage.findMany({
        where: {
          projectId,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      socket.emit("previousMessages", messages);
    });
    socket.on(
      "sendMessage",
      async ({ projectId, userId, content, userName, userPhoto }) => {
        const message = await prisma.chatMessage.create({
          data: { projectId, userId, content, userName, userPhoto },
        });
        io.to(projectId).emit("receiveMessage", message);
      },
    );
    socket.on("disconnect", () => {});
  });
}
