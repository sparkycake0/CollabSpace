import { server } from "../server.js";
import prisma from "../prisma.js";

export default function CollabRoutes() {
  server.get("/collabs/:userId", async (req, reply) => {
    const { userId } = req.params;

    try {
      const memberships = await prisma.projectMember.findMany({
        where: { userId },
        include: { project: true },
      });
      let projects = memberships
        .map((m) => m.project)
        .filter((p) => p && p.ownerId !== userId);
      projects = Array.from(new Map(projects.map((p) => [p.id, p])).values());
      const ownerIds = Array.from(new Set(projects.map((p) => p.ownerId)));
      const owners = await prisma.user.findMany({
        where: { userId: { in: ownerIds } }, // ✅ match userId, not id
        select: { userId: true, userName: true, userPhoto: true },
      });
      projects = projects.map((p) => ({
        ...p,
        owner: owners.find((o) => o.userId === p.ownerId) || null,
      }));

      reply.code(200).send(projects);
    } catch (err) {
      console.error("Error fetching collabs:", err);
      reply.code(500).send([]);
    }
  });
}
