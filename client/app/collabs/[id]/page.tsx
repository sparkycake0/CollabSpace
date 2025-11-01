"use client";
import React, { useState } from "react";
import Chat from "@/components/projectComps/Chat";
import Tasks from "@/components/projectComps/Tasks";
import { api } from "@/lib/server";
import { Project } from "@/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import Whiteboard from "@/components/projectComps/Whiteboard";
import Docs from "@/components/projectComps/Docs";
import NavMenu from "@/components/projectComps/NavMenu";
import ProjectHeader from "@/components/projectComps/Header";
import { LucideLoader2 } from "lucide-react";

export default function CollabPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { id } = React.use(params);
  const {
    data: project,
    error,
    isPending,
  } = api({
    endpoint: `/projects/${id}`,
    method: "GET",
    enabled: true,
  });
  if (isPending)
    return (
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <LucideLoader2 className="size-28 text-blue-500 animate-spin" />
      </div>
    );
  if (error) {
    console.log(error);
  }
  const allPages = [
    { component: <Whiteboard />, key: "whiteboard" },
    { component: <Chat projectId={id ?? "not found"} />, key: "chat" },
    { component: <Tasks id={id} />, key: "tasks" },
    { component: <Docs />, key: "docs" },
  ];
  const enabledPages = allPages.filter((page) => {
    if (!project) return false;
    const p = project as Project;
    return (
      (page.key === "whiteboard" && p.whiteboard) ||
      (page.key === "chat" && p.chat) ||
      (page.key === "tasks" && p.tasks) ||
      (page.key === "docs" && p.docs)
    );
  });
  return (
    <main className="w-full flex flex-col h-full">
      <ProjectHeader
        projectId={(project as Project).id ?? ""}
        projectOwnerId={(project as Project).ownerId}
        projectName={(project as Project).name}
        projectCreatedAt={(project as Project).createdAt ?? ""}
        projectDate={(project as Project).date ?? ""}
      />
      <div className="flex-1 hidden lg:flex flex-col">
        <div className={`flex flex-1`}>
          {(project as Project).chat ? (
            <div className="w-max max-w-2/5 hidden lg:flex">
              <Chat projectId={id ?? "not found"} className="" />
            </div>
          ) : (
            ""
          )}
          {(project as Project).whiteboard ? (
            <main className="flex-1">
              <Whiteboard />
            </main>
          ) : (
            ""
          )}
        </div>
        <div className="hidden lg:flex min-h-3/12 max-h-full w-full">
          {(project as Project).tasks ? (
            <div className="flex-1">
              <Tasks id={id} />
            </div>
          ) : (
            ""
          )}
          {(project as Project).docs ? (
            <div className="flex-1">
              <Docs />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="lg:hidden flex flex-col flex-1 relative overflow-hidden">
        {/* Content slider */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={enabledPages[activeIndex].key}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex"
            >
              {enabledPages[activeIndex].component}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation menu */}
        <NavMenu
          id={id ?? ""}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      </div>
    </main>
  );
}
