"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useCurrentUser } from "@/lib/user";
import { api } from "@/lib/server";
import { Task } from "@/interfaces";

export default function Tasks({ id }: { id: string }) {
  const user = useCurrentUser();
  const [task, setTask] = useState({
    name: "",
    desc: "",
    userId: user?.uid ?? "",
  });
  const { mutate: createTask, isPending } = api({
    endpoint: `/task/${id}`,
    method: "POST",
    invalidateKey: "tasks",
  }) as ReturnType<typeof api> & {
    mutate: (data: Task, options?: any) => void;
  };

  const handleSubmit = () => {
    if (!task.name || !task.desc || !task.userId) return;

    createTask(task, {
      onSuccess: (data: Task) => {
        console.log("Task created:", data);
        setTask({ name: "", desc: "", userId: user?.uid ?? "" });
      },
      onError: (err: string) => console.error("Failed to create task:", err),
    });
  };
  const { data: tasks } = api<Task[]>({
    endpoint: `/tasks/${id}`,
    method: "GET",
    enabled: true,
  });

  const { mutate: updateTaskStatus } = api<Task>({
    endpoint: "",
    method: "PATCH",
    invalidateKey: "tasks",
  }) as ReturnType<typeof api<Task>> & {
    mutate: (args: { endpoint: string; body: any }, options?: any) => void;
  };

  const toggleStatus = (task: Task) => {
    const newStatus = task.status === "PENDING" ? "DONE" : "PENDING";
    const endpoint = `/tasks/${task.id}/status`;

    updateTaskStatus(
      { endpoint, body: { status: newStatus } },
      {
        onSuccess: (updatedTask: Task) => {
          console.log("✅ Task updated:", updatedTask);
        },
        onError: (err: any) => console.error("❌ Failed to update task:", err),
      },
    );
  };

  const deleteTask = api<{ id: string }>({
    endpoint: "/tasks/:taskId",
    method: "DELETE",
    invalidateKey: "tasks",
  }) as ReturnType<typeof api> & {
    mutate: (args: { endpoint?: string; body?: any }, options?: any) => void;
  };

  const handleDelete = (taskId: string) => {
    deleteTask.mutate(
      { endpoint: `/tasks/${taskId}` },
      {
        onSuccess: () => console.log(`✅ Task ${taskId} deleted`),
        onError: (err: any) => console.error("❌ Failed to delete task", err),
      },
    );
  };
  return (
    <div className="flex-1 h-full lg:flex lg:flex-col">
      <h1 className="text-center text-3xl text-blue-500 font-bold mt-6 lg:flex lg:justify-between lg:items-center lg:mb-4">
        <Popover>
          <PopoverTrigger className="rounded-full ml-6 h-max bg-neutral-800 p-2 lg:relative lg:top-auto lg:left-auto font-bold absolute top-5 left-5">
            <Plus className="" />
          </PopoverTrigger>
          <PopoverContent className="border-0 bg-neutral-800 flex flex-col gap-4">
            <h1 className="font-bold text-blue-300">Create Task</h1>
            <input
              className="border-2 rounded-md p-2 border-transparent focus:border-blue-300 outline-0 bg-neutral-900 transition-colors duration-200"
              placeholder="Name..."
              onChange={(e) => setTask({ ...task, name: e.target.value })}
            />
            <textarea
              className="border-2 h-48 max-h-48 rounded-md p-2 border-transparent transition-colors duration-200 focus:border-blue-300 outline-0 bg-neutral-900"
              placeholder="Description..."
              onChange={(e) => setTask({ ...task, desc: e.target.value })}
            />
            <div className="w-full flex justify-center">
              <button
                onClick={() => handleSubmit()}
                className="bg-neutral-900 w-max p-2 px-4 rounded-full border-2 border-transparent transition-colors duration-200 hover:border-blue-300 text-blue-300"
              >
                {isPending ? "Creating..." : "Create"}
              </button>
            </div>
          </PopoverContent>
        </Popover>
        <p>Tasks</p>
        <div className="w-16"></div>
      </h1>

      <div className="overflow-y-auto max-h-full flex flex-col gap-4 pb-24 mt-12 p-8 lg:mt-0">
        {tasks && tasks.length > 0 ? (
          tasks.map((task, indx) => (
            <div
              key={indx}
              className={`relative ${task.status === "PENDING" ? "bg-yellow-950" : "bg-green-950"} flex items-start justify-between p-4 rounded-lg shadow-md transition-colors duration-200 
        `}
            >
              <div className="flex-1 pr-12" onClick={() => toggleStatus(task)}>
                <h2 className="text-xl font-bold text-white">{task.name}</h2>
                <p className="mt-1 text-sm text-white/90 max-h-20 overflow-y-auto break-words">
                  {task.desc || "No description"}
                </p>
              </div>

              <button
                onClick={() => toggleStatus(task)}
                className={`absolute top-2.5 right-12 px-2 py-1 rounded-full text-xs font-semibold cursor-pointer
          ${task.status === "PENDING" ? "bg-yellow-900 text-yellow-100 hover:bg-yellow-600 hover:text-yellow-950" : "bg-green-900 text-green-100 hover:bg-green-600 hover:text-green-950"}`}
              >
                {task.status}
              </button>

              <button
                onClick={() => handleDelete(task.id ?? "")}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors duration-150 cursor-pointer"
              >
                <Trash2 size={25} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-neutral-500 text-center mt-6">No tasks yet.</div>
        )}
      </div>
    </div>
  );
}
