import { server } from "../server.js";
import prisma from "../prisma.js";

export default function Auth() {
  server.post("/account/auth", async (req, reply) => {
    const { userId, userName, userPhoto, userEmail } = req.body;
    if (!userId) {
      console.log("Fetch failed!");
      return;
    }
    try {
      const existingUser = await prisma.user.findFirst({
        where: { userId },
      });
      if (existingUser) {
        return (reply.code(400), send({ error: "User Already Exists" }));
      }
      const user = await prisma.user.create({
        data: {
          userId,
          userName,
          userPhoto,
          userEmail,
        },
      });
      console.log(`Added user to database: ${user.userName}`);
      reply.send(user);
    } catch (err) {
      console.log(err);
    }
  });
  server.get("/users/:userId", async (req, reply) => {
    const { userId } = req.params;
    if (!userId) {
      return reply.status(400).send({ error: "User ID is required" });
    }
    try {
      const user = await prisma.user.findUnique({
        where: {
          userId,
        },
        select: {
          userName: true,
          userPhoto: true,
        },
      });
      if (!user) return reply.status(404).send({ error: "User not found" });
      reply.send(user);
    } catch (err) {
      console.log(err);
      return reply.status(500).send({ error: "Server error" });
    }
  });
}
