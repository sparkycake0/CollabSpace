"use client";
import { ChevronRightIcon } from "lucide-react";
import type { Message } from "@/interfaces";
import { io, type Socket } from "socket.io-client";
import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/auth";
import { socketUrl } from "@/lib/server";
import Image from "next/image";
export default function Chat({
  className,
  projectId,
}: {
  className?: string;
  projectId: string;
}) {
  const user = useAtomValue(userAtom);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const newSocket = io(socketUrl);
    setSocket(newSocket);
    newSocket.emit("joinProject", projectId);

    newSocket.on("previousMessages", (msgs) => setMessages(msgs));
    newSocket.on("receiveMessage", (msg) =>
      setMessages((prev) => [...prev, msg]),
    );

    return () => {
      newSocket.disconnect();
    };
  }, [projectId]);

  const sendMessage = () => {
    if (!socket || !input) return;
    socket.emit("sendMessage", {
      projectId,
      userId: user?.uid,
      content: input,
      userName:
        user?.displayName ??
        user?.reloadUserInfo?.screenName ??
        "user not found",
      userPhoto: user?.photoURL,
    });
    console.log(user);
    setInput("");
  };
  return (
    <div
      className={`flex-1 ${className ?? ""} h-full w-full flex flex-col gap-4 justify-between pb-24 lg:pb-4 p-4`}
    >
      <div className="bg-neutral-900 flex-1 p-4 flex flex-col gap-2">
        {messages.map((mssg: Message) => (
          <div key={mssg.id}>
            <div
              className={`${user?.uid === mssg.userId ? "justify-end" : "justify-start"} flex `}
            >
              <div
                className={`${user?.uid === mssg.userId ? "flex-row-reverse bg-neutral-700 " : "bg-neutral-800 "} flex w-max gap-4 p-2 rounded-md`}
              >
                <Image
                  unoptimized={true}
                  width={30}
                  height={30}
                  src={
                    mssg.userPhoto ??
                    "https://static.vecteezy.com/system/resources/previews/024/983/914/non_2x/simple-user-default-icon-free-png.png"
                  }
                  alt=""
                  className="rounded-full h-8 w-8"
                />
                <div>
                  <h1 className="text-neutral-200">{mssg.userName}</h1>
                  <h1 className="text-neutral-400 break-words whitespace-normal">
                    {mssg.content}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="w-full flex gap-2"
      >
        <input
          type="text"
          required
          placeholder="Type a message ..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-neutral-900 p-2 rounded-md outline-none w-full"
        />
        <button type="submit" className="bg-neutral-900 p-2 rounded-md">
          <ChevronRightIcon className="text-neutral-400" />
        </button>
      </form>
    </div>
  );
}
