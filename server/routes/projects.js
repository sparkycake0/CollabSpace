import { server } from "../server.js";
import prisma from "../prisma.js";

export default function ProjectRoutes() {
  server.post("/projects", async (req, reply) => {
    try {
      const project = await prisma.project.create({
        data: req.body,
      });
      return reply.send(project);
    } catch (err) {
      console.error(err);
    }
  });
  server.get("/projects", async (req, reply) => {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });

    return reply.send(projects);
  });
  server.get("/projects/:id", async (req, reply) => {
    try {
      const project = await prisma?.project?.findUnique({
        where: {
          id: req.params.id,
        },
      });
      if (!project) {
        return reply.code(404).send({ message: "Project not found" });
      }
      return reply.send(project);
    } catch (err) {
      console.log(err);
      return reply.code(404).send({ error: "Someting is wrong" });
    }
  });
  server.post("/projects/:id/add-user", async (req, reply) => {
    const { id: projectId } = req.params;
    const { userId, userName, userPhoto } = req.body;

    if (!userId) return reply.code(400).send({ error: "User ID is required" });

    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });
      if (!project) return reply.code(404).send({ error: "Project not found" });

      const existing = await prisma.projectMember.findFirst({
        where: {
          AND: [{ projectId: projectId }, { userId: userId }],
        },
      });
      if (existing)
        return reply.code(400).send({ error: "User already in project" });

      const member = await prisma.projectMember.create({
        data: {
          projectId,
          userId,
          userName,
          userPhoto,
          role: "MEMBER",
        },
      });

      return reply.send(member);
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: "Something went wrong" });
    }
  });
  server.get("/projects/:projectId/members", async (req, reply) => {
    const { projectId } = req.params;
    try {
      const members = await prisma?.projectMember?.findMany({
        where: { projectId },
      });
      return reply.send(members);
    } catch (err) {
      console.error(err);
      return reply
        .code(500)
        .send({ error: "Something went wrong fetching members" });
    }
  });
}
