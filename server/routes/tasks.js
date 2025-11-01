import { server } from "../server.js";
import prisma from "../prisma.js";

export default function Tasks() {
  server.post("/task/:projectId", async (req, reply) => {
    try {
      const { projectId } = req.params;
      const { name, desc, userId } = req.body ?? {};
      console.log(req.body);
      if (!name || !desc || !userId) {
        return reply.code(400).send({ error: "Missing task fields" });
      }

      const task = await prisma.task.create({
        data: {
          name,
          desc,
          madeBy: userId,
          projectId,
        },
      });

      return reply.send(task);
    } catch (err) {
      console.log(err);
      reply.code(500).send({ error: "Failed to create task" });
    }
  });
  server.get("/tasks/:projectId", async (req, reply) => {
    try {
      const { projectId } = req.params;
      const tasks = await prisma.task.findMany({
        where: {
          projectId,
        },
      });
      return reply.send(tasks);
    } catch (err) {
      console.log(err);
    }
  });
  server.patch("/tasks/:taskId/status", async (req, reply) => {
    try {
      const { taskId } = req.params;
      const { status } = req.body;

      if (!["PENDING", "DONE"].includes(status)) {
        return reply.code(400).send({ error: "Invalid Status" });
      }

      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: { status },
      });

      return reply.send(updatedTask);
    } catch (err) {
      console.log(err);
      reply.code(500).send({ error: "Failed to update task" });
    }
  });
  server.delete("/tasks/:taskId", async (req) => {
    try {
      const { taskId } = req.params;
      await prisma.task.delete({
        where: {
          id: taskId,
        },
      });
    } catch (err) {
      console.log(err);
    }
  });
}
