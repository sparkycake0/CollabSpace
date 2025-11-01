"use client";
import type { Project } from "@/interfaces";
import { api } from "@/lib/server";
import Link from "next/link";
import { LucideLoader2 } from "lucide-react";
import { useCurrentUser } from "@/lib/user";

export default function Projects() {
  const user = useCurrentUser();
  const { data: projects, isPending } = api({
    endpoint: "/projects",
    method: "GET",
    key: "projects",
  });
  if (isPending)
    return (
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <LucideLoader2 className="size-28 text-blue-500 animate-spin" />
      </div>
    );
  const userProjects = (projects as Project[]).filter(
    (p: Project) => p.ownerId === user?.uid,
  );
  return (
    <main className="lg:mt-12 h-full w-full">
      <div
        className={`grid grid-cols-1 gap-10 p-8 w-full h-full ${userProjects.length === 0 ? "grid-cols-1" : "lg:grid-cols-3"}`}
      >
        {userProjects.length > 0 ? (
          userProjects.map((project: Project) => (
            <div
              key={project.id}
              className="p-4 bg-neutral-900 rounded-md w-full h-max flex flex-col gap-4"
            >
              <h1 className="text-blue-500 font-bold text-center text-xl">
                {project.name}
              </h1>
              <div>
                <div>
                  <h1
                    className={` ${project.priority === 0 ? "text-green-500 bg-green-950" : project.priority === 1 ? "text-yellow-500 bg-yellow-950" : "text-red-500 bg-red-950"} w-max p-2 rounded-md`}
                  >
                    {project.priority === 0
                      ? "Low Priority"
                      : project.priority === 1
                        ? "Medium Priority"
                        : "High Priority"}
                  </h1>
                </div>
              </div>
              <div className=" *:p-2 *:rounded-md">
                <div
                  className={`flex justify-between ${project.chat ? "bg-neutral-400 text-black font-bold" : "bg-neutral-800 text-neutral-400 font-bold"}`}
                >
                  <h1>Chat</h1> <h1>{project.chat ? "Enabled" : "Disabled"}</h1>
                </div>
              </div>
              <div className=" *:p-2 *:rounded-md">
                <div
                  className={`flex justify-between ${project.tasks ? "bg-neutral-400 text-black font-bold" : "bg-neutral-800 text-neutral-400 font-bold"}`}
                >
                  <h1>Task Manager</h1>{" "}
                  <h1>{project.tasks ? "Enabled" : "Disabled"}</h1>
                </div>
              </div>
              <div className=" *:p-2 *:rounded-md">
                <div
                  className={`flex justify-between ${project.whiteboard ? "bg-neutral-400 text-black font-bold" : "bg-neutral-800 text-neutral-400 font-bold"}`}
                >
                  <h1>Whiteboard</h1>{" "}
                  <h1>{project.whiteboard ? "Enabled" : "Disabled"}</h1>
                </div>
              </div>
              <div className=" *:p-2 *:rounded-md">
                <div
                  className={`flex justify-between ${project.docs ? "bg-neutral-400 text-black font-bold" : "bg-neutral-800 text-neutral-400 font-bold"}`}
                >
                  <h1>Documents</h1>{" "}
                  <h1>{project.docs ? "Enabled" : "Disabled"}</h1>
                </div>
              </div>
              <div>
                <h1 className="font-semibold text-neutral-300">Description:</h1>
                <h1 className="text-neutral-400 text-sm break-words text-wrap bg-neutral-800 p-2 rounded-md">
                  {project.desc}
                </h1>
              </div>
              <div className="text-neutral-400 w-full flex flex-col items-end text-sm">
                <h1 className="w-max">
                  Created:{" "}
                  {new Date(project.createdAt as any).toLocaleDateString()}
                </h1>
                <h1 className="w-max">
                  Due to: {new Date(project?.date ?? "").toLocaleDateString()}
                </h1>
              </div>
              <Link
                href={`/projects/${project.id}`}
                className="font-semibold bg-blue-900 flex gap-1.5 justify-center p-2 rounded-md hover:bg-blue-700 transition-colors duration-150 cursor-pointer"
              >
                Open <h1 className="font-bold">{project.name}</h1>
              </Link>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="bg-neutral-900 p-4 rounded-md font-bold flex flex-col gap-3">
              <h1 className="text-3xl text-center text-red-300">
                No projects yet
              </h1>
              <h1>You can create your first project!</h1>
              <Link
                href={"/projects/new"}
                className="text-center underline text-blue-300"
              >
                Create your project
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
