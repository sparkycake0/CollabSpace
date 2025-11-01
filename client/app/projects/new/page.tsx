"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { dateAtom } from "@/atoms/generals";
import { useAtomValue } from "jotai";
import { api } from "@/lib/server";
import { userAtom } from "@/atoms/auth";
import { Project } from "@/interfaces";
export default function CreateProject() {
  const [rangeStatus, setRangeStatus] = useState([0]);
  const date = useAtomValue(dateAtom);
  const user = useAtomValue(userAtom);
  const [project, setProject] = useState({
    ownerId: user?.uid ?? "",
    name: "",
    desc: "",
    priority: rangeStatus[0],
    date: date,
    chat: false,
    docs: false,
    whiteboard: false,
    tasks: false,
  });

  useEffect(() => {
    setProject((prev) => ({ ...prev, priority: rangeStatus[0] }));
  }, [rangeStatus]);
  useEffect(() => {
    setProject((prev) => ({ ...prev, date }));
  }, [date]);
  useEffect(() => {
    if (user?.uid) {
      setProject((prev) => ({ ...prev, ownerId: user.uid }));
    }
  }, [user]);
  const { mutate: createProject, isPending } = api({
    endpoint: "/projects",
    method: "POST",
    invalidateKey: "projects",
  }) as ReturnType<typeof api> & {
    mutate: (data: Project, options?: any) => void;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProject(project, {
      onSuccess: (data: Project) => {
        console.log("Project created:", data);
        setProject({
          ownerId: user?.uid ?? "",
          name: "",
          desc: "",
          priority: rangeStatus[0],
          date: date,
          chat: false,
          docs: false,
          whiteboard: false,
          tasks: false,
        });
      },
      onError: (err: string) => {
        console.error("Failed to create project:", err);
      },
    });
  };
  return (
    <main className="h-full w-full lg:flex lg:justify-center lg:items-center bg-neutral-900">
      <form
        onSubmit={handleSubmit}
        className="w-full h-full flex flex-col items-center justify-center gap-4 rounded-lg "
      >
        <h1 className="text-center font-bold text-blue-400 text-3xl mb-6">
          Create project
        </h1>
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex flex-col gap-4">
            <h1 className="w-full font-bold text-xl">Basic Info</h1>
            <input
              type="text"
              required
              value={project.name}
              className={`w-max outline-none p-2 bg-neutral-800 rounded-md border-none`}
              placeholder={`${project.name === "" ? "Name" : "Pleae enter project name..."}`}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
            />
            <textarea
              required
              value={project.desc}
              className={`w-max border-none outline-none p-2 bg-neutral-800 rounded-md h-36 min-h-36 max-h-36`}
              placeholder="Description"
              onChange={(e) => setProject({ ...project, desc: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="w-full font-bold text-xl">Settings</h1>
            <div className="flex flex-col gap-2">
              <h1
                className={`${rangeStatus[0] === 0 ? "text-green-500" : rangeStatus[0] === 1 ? "text-yellow-500" : "text-red-500"}`}
              >
                {rangeStatus[0] === 0
                  ? "Low Priority"
                  : rangeStatus[0] === 1
                    ? "Medium Priority"
                    : "High Priority"}
              </h1>
              <Slider
                defaultValue={[0]}
                max={2}
                step={1}
                onValueChange={setRangeStatus}
                color={
                  rangeStatus[0] === 0
                    ? "#22c55e"
                    : rangeStatus[0] === 1
                      ? "#eab308"
                      : "#ef4444"
                }
                className="min-w-36 w-max"
              />
            </div>
            <DatePicker />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="w-full font-bold text-xl">Tools and Features</h1>
            <div className="flex gap-2">
              <Switch
                onCheckedChange={(bool) =>
                  setProject({ ...project, chat: bool })
                }
                className="bg-neutral-800"
              />
              <h1>Enable Chat</h1>
            </div>
            <div className="flex gap-2">
              <Switch
                onCheckedChange={(bool) =>
                  setProject({ ...project, docs: bool })
                }
                className="bg-neutral-800"
              />
              <h1>Enable Documents</h1>
            </div>
            <div className="flex gap-2">
              <Switch
                onCheckedChange={(bool) =>
                  setProject({ ...project, whiteboard: bool })
                }
                className="bg-neutral-800"
              />
              <h1>Enable Whiteboard</h1>
            </div>
            <div className="flex gap-2">
              <Switch
                onCheckedChange={(bool) =>
                  setProject({ ...project, tasks: bool })
                }
                className="bg-neutral-800"
              />
              <h1>Enable Tasks</h1>
            </div>
          </div>
        </div>
        <Button
          type="submit"
          className="bg-blue-500 w-max px-8 self-center mt-4 text-black font-bold transition-colors duration-150 hover:bg-blue-400 cursor-pointer"
        >
          {isPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </main>
  );
}
