"use client";
import { useEffect, useState } from "react";
import { api, url } from "@/lib/server";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useCurrentUser } from "@/lib/user";
import { User } from "@/interfaces";

export default function ProjectHeader({
  projectName,
  projectCreatedAt,
  projectDate,
  projectId,
  projectOwnerId,
}: {
  projectName: string;
  projectCreatedAt: string;
  projectDate: string;
  projectId: string;
  projectOwnerId: string;
}) {
  const user = useCurrentUser();
  const currentUserId = user?.uid;
  const [userIdInput, setUserIdInput] = useState("");
  const { data: members, error: membersError } = api<User[]>({
    endpoint: `/projects/${projectId}/members`,
    method: "GET",
    key: `members-${projectId}`,
    enabled: true,
  });
  if (membersError) {
    console.log(membersError);
  }
  const { mutate: addMember } = api({
    endpoint: `/projects/${projectId}/add-user`,
    method: "POST",
    invalidateKey: `/projects/${projectId}/members`,
  }) as {
    mutate: (
      data: { userId: string; userName: string; userPhoto: string },
      fns: { onSuccess: () => void },
    ) => void;
  };

  const handleAdd = async () => {
    if (!userIdInput) return alert("Enter user UID");

    try {
      const res = await fetch(`${url}/users/${userIdInput}`);
      if (!res.ok) {
        const err = await res.json();
        return alert(err.error || "User not found");
      }
      const userData: User = await res.json();

      addMember(
        {
          userId: userIdInput,
          userName: userData.userName ?? "Guest",
          userPhoto: userData.userPhoto ?? "",
        },
        {
          onSuccess: () => {
            alert(`User ${userData.userName ?? userIdInput} added!`);
            setUserIdInput("");
          },
        },
      );
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <header className="flex bg-neutral-900 justify-between items-center p-4">
      <div className="text-blue-500 flex flex-col gap-2 font-bold text-2xl">
        <h1>{projectName}</h1>

        {currentUserId === projectOwnerId && (
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-blue-500 text-black font-bold rounded-md p-2">
                Add member
              </Button>
            </PopoverTrigger>

            <PopoverContent className="bg-neutral-900 outline-none border-none w-max">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                  placeholder="User UID"
                  className="p-2 rounded-md bg-neutral-800 text-neutral-400 font-bold outline-none"
                />
                <Button
                  onClick={handleAdd}
                  className="bg-blue-500 text-black font-bold px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add
                </Button>
              </div>
              <div>
                <h1 className="text-2xl text-neutral-400 font-bold mt-6">
                  Members:
                </h1>
                {members?.length === 0 ? (
                  <p>No members yet</p>
                ) : (
                  <div>
                    {members?.map((member, index) => (
                      <div
                        className="flex p-2 bg-neutral-800 mt-4 items-center justify-between"
                        key={index}
                      >
                        <img
                          src={member.userPhoto}
                          alt=""
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <h1 className="">{member.userName}</h1>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <div className="text-sm text-neutral-400">
        <div>Created: {new Date(projectCreatedAt).toLocaleDateString()}</div>
        <div>
          Due: {projectDate ? new Date(projectDate).toLocaleDateString() : "-"}
        </div>
      </div>
    </header>
  );
}
