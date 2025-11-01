"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UserName,
  UserEmail,
  UserEmailVerified,
  UserImagePhoto,
  ButtonWithPopup,
} from "@/components/UserInfoComponents";
import { PenBox, Check } from "lucide-react";
import { useState } from "react";
import type { notFoundData } from "@/interfaces";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/auth";
import {
  reload,
  sendEmailVerification,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Profile() {
  const [notFoundData, setNotFoundData] = useState<notFoundData>({
    displayName: "",
    email: "",
    photoURL: "",
    pass: "",
  });
  const user = useAtomValue(userAtom);
  return (
    <div className="w-full h-full flex">
      <main className="p-8 gap-4 flex flex-col w-full lg:w-max items-center h-full bg-neutral-900">
        <div className="flex flex-col gap-8 border-2 p-4 w-max rounded-lg border-neutral-600 hover:border-neutral-300 transition-colors duration-150 cursor-default h-max">
          <h1 className="self-center bg-neutral-800 p-2 rounded-md cursor-text">
            {user?.uid}
          </h1>
          <div className="flex gap-2">
            <UserImagePhoto
              className="w-24 h-full"
              skeletonStyle=""
              notFound={
                <div className="border-2 flex flex-col justify-between p-2 border-dotted border-white h-full">
                  <h1 className="text-sm text-center">Image not found.</h1>
                  <ButtonWithPopup
                    className="bg-neutral-900 border-0"
                    buttonContent={
                      <PenBox className="size-4 self-end text-neutral-300 hover:text-neutral-50 cursor-pointer" />
                    }
                    popoverContent={
                      <div className="flex flex-col justify-center items-center gap-4">
                        <Input
                          placeholder="Add profile picture URL..."
                          className="bg-neutral-800 border-0 text-white carpet-white"
                          onChange={(e) =>
                            setNotFoundData({
                              ...notFoundData,
                              photoURL: e.target.value,
                            })
                          }
                        />
                        <Button
                          onClick={async () => {
                            try {
                              await updateProfile(user, {
                                photoURL: notFoundData.photoURL,
                              }).catch((err) => alert(err));
                              reload(user);
                            } catch (err) {
                              console.log(err);
                            }
                          }}
                          className="bg-neutral-800 cursor-pointer text-white font-bold rounded-sm w-max hover:bg-neutral-700 transition-colors duration-150"
                        >
                          Update
                        </Button>
                      </div>
                    }
                  />
                </div>
              }
              found={
                <ButtonWithPopup
                  className="bg-neutral-900 border-0"
                  buttonContent={
                    <PenBox className="size-4 self-end text-neutral-300 hover:text-neutral-50 cursor-pointer" />
                  }
                  popoverContent={
                    <div className="flex flex-col justify-center items-center gap-4">
                      <Input
                        placeholder="Add profile picture URL..."
                        className="bg-neutral-800 border-0 text-white carpet-white"
                        onChange={(e) =>
                          setNotFoundData({
                            ...notFoundData,
                            photoURL: e.target.value,
                          })
                        }
                      />
                      <Button
                        onClick={async () => {
                          try {
                            await updateProfile(user, {
                              photoURL: notFoundData.photoURL,
                            }).catch((err) => alert(err));
                            reload(user);
                          } catch (err) {
                            console.log(err);
                          }
                        }}
                        className="bg-neutral-800 cursor-pointer text-white font-bold rounded-sm w-max hover:bg-neutral-700 transition-colors duration-150"
                      >
                        Update
                      </Button>
                    </div>
                  }
                />
              }
            />
            <div className="flex flex-col gap-5 h-max">
              <UserName
                className="w-48 h-4 "
                skeletonStyle=""
                notFound={
                  <div className="flex items-center justify-between">
                    <h1>Guest</h1>
                    <button>
                      <ButtonWithPopup
                        className="bg-neutral-900 border-0"
                        buttonContent={
                          <PenBox className="size-4 text-neutral-300 hover:text-neutral-50 cursor-pointer" />
                        }
                        popoverContent={
                          <div className="flex flex-col justify-center items-center gap-4">
                            <Input
                              placeholder="Add username..."
                              className="bg-neutral-800 border-0 text-white carpet-white"
                              onChange={(e) =>
                                setNotFoundData({
                                  ...notFoundData,
                                  displayName: e.target.value,
                                })
                              }
                            />
                            <Button
                              onClick={async () => {
                                try {
                                  if (user?.displayName === null) {
                                    await updateProfile(user, {
                                      displayName: notFoundData.displayName,
                                    });
                                    reload(user);
                                  }
                                } catch (err) {
                                  console.log(err);
                                }
                              }}
                              className="bg-neutral-800 text-white font-bold rounded-sm w-max hover:bg-neutral-700 transition-colors duration-150"
                            >
                              Update
                            </Button>
                          </div>
                        }
                      />
                    </button>
                  </div>
                }
                found={
                  <ButtonWithPopup
                    className="bg-neutral-900 border-0"
                    buttonContent={
                      <PenBox className="size-4 self-end text-neutral-300 hover:text-neutral-50 cursor-pointer" />
                    }
                    popoverContent={
                      <div className="flex flex-col justify-center items-center gap-4">
                        <Input
                          placeholder="Change username..."
                          className="bg-neutral-800 border-0 text-white carpet-white"
                          onChange={(e) =>
                            setNotFoundData({
                              ...notFoundData,
                              displayName: e.target.value,
                            })
                          }
                        />
                        <Button
                          onClick={async () => {
                            try {
                              await updateProfile(user, {
                                displayName: notFoundData.displayName,
                              }).catch((err) => alert(err));
                              reload(user);
                            } catch (err) {
                              console.log(err);
                            }
                          }}
                          className="bg-neutral-800 cursor-pointer text-white font-bold rounded-sm w-max hover:bg-neutral-700 transition-colors duration-150"
                        >
                          Update
                        </Button>
                      </div>
                    }
                  />
                }
              />
              <UserEmail
                className="w-48 h-4"
                skeletonStyle="w-48 h-4"
                notFound={
                  <div className="flex justify-between items-center">
                    <h1 className="text-neutral-400">Email not found...</h1>
                    <ButtonWithPopup
                      className="bg-neutral-900 border-0"
                      buttonContent={
                        <div>
                          <PenBox className="size-4 self-end text-neutral-300 hover:text-neutral-50 cursor-pointer" />
                        </div>
                      }
                      popoverContent={
                        <div className="flex flex-col justify-center items-center gap-4">
                          <p>
                            If your account is made using github please make
                            your profile public for you to be able to access
                            CollabSpace. To achive this go to your github
                            profile Settings -- Public profile and follow
                            instrunctions there
                          </p>
                        </div>
                      }
                    />
                  </div>
                }
              />
              <UserEmailVerified
                skeletonStyle="w-48 h-4"
                className="h-max"
                verified={
                  <h1 className="flex justify-between">
                    Email Verified <Check />
                  </h1>
                }
                unverified={
                  <Button
                    onClick={async () => {
                      try {
                        if (user?.email === null) {
                          alert("Email is not initialized");
                          return;
                        } else {
                          await sendEmailVerification(user);
                          alert("Email verification sent");
                        }
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                    className="rounded-sm text-sm hover:bg-green-600 cursor-pointer p-1 px-2 text-black font-bold bg-green-400 text-center"
                  >
                    Verify your email
                  </Button>
                }
              />
            </div>
          </div>
          <Button
            className="w-max p-2 px-4 bg-red-500 font-bold text-black rounded-sm self-center hover:bg-red-600 cursor-pointer"
            onClick={() => signOut(auth)}
          >
            Sign Out
          </Button>
        </div>
      </main>
    </div>
  );
}
