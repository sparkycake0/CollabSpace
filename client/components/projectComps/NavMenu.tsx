"use client";
import { Project } from "@/interfaces";
import { api } from "@/lib/server";
import { Bookmark, Clipboard, MessageCircle, Presentation } from "lucide-react";

interface NavMenuProps {
  id: string;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export default function NavMenu({
  id,
  activeIndex,
  setActiveIndex,
}: NavMenuProps) {
  const { data: project } = api({
    endpoint: `/projects/${id}`,
    method: "GET",
    enabled: true,
  });

  if (!project) return null;

  const tabs = [
    {
      key: "whiteboard",
      enabled: (project as Project).whiteboard,
      icon: Presentation,
    },
    {
      key: "chat",
      enabled: (project as Project).chat,
      icon: MessageCircle,
    },
    {
      key: "tasks",
      enabled: (project as Project).tasks,
      icon: Clipboard,
    },
    {
      key: "docs",
      enabled: (project as Project).docs,
      icon: Bookmark,
    },
  ].filter((tab) => tab.enabled);

  return (
    <nav className="flex flex-row absolute bottom-5 left-1/2 -translate-x-1/2 bg-neutral-900 rounded-full p-2 w-max gap-6 justify-between">
      {tabs.map((tab, idx) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.key}
            onClick={() => setActiveIndex(idx)}
            className={`cursor-pointer bg-neutral-800 px-4 rounded-full p-2 transition-all ${
              activeIndex === idx
                ? "bg-neutral-700 text-white scale-110"
                : "opacity-30 hover:opacity-100"
            }`}
          >
            <Icon className="size-5" />
          </button>
        );
      })}
    </nav>
  );
}
