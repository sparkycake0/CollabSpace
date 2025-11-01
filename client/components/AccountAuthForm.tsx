"use client";
import { useState } from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GoogleIcon from "../assets/Google__G__logo.svg.webp";
import Github from "../assets/github-brands-solid-full.svg";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, githubProvider, googleProvider } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { saveUserToDatabase } from "@/lib/server";

export default function AccountAuthForm() {
  const [newUserData, setNewUserData] = useState({
    user: "",
    email: "",
    pass: "",
  });
  const [userData, setUserData] = useState({
    email: "",
    pass: "",
  });
  const [loginError, setLoginError] = useState(null);
  const router = useRouter();
  const handleSignUp = async (
    email: string,
    password: string,
    username: string,
    router: any,
  ) => {
    try {
      const newUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await sendEmailVerification(newUser.user);

      await updateProfile(newUser.user, {
        displayName: username,
      });

      console.log("User created:", newUser.user);
      saveUserToDatabase(
        newUser.user.uid,
        newUser.user.displayName ?? "Guest",
        newUser.user.photoURL ??
          "https://static.vecteezy.com/system/resources/previews/024/983/914/non_2x/simple-user-default-icon-free-png.png",
        newUser.user.email ?? "Email not Found",
      );
      router.push("/");
    } catch (error: any) {
      console.error("Signup error:", error);
      alert(error.message);
    }
  };
  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, userData.email, userData.pass);
      router.push("/");
    } catch (err: any) {
      setLoginError(err.code);
    }
  };
  return (
    <Tabs defaultValue="signup">
      <TabsList className="bg-neutral-900">
        <TabsTrigger className="text-white font-bold" value="signin">
          Sign In
        </TabsTrigger>
        <TabsTrigger
          className="bg-neutral-900 text-white font-bold"
          value="signup"
        >
          Sign up
        </TabsTrigger>
      </TabsList>
      <TabsContent value="signup">
        <div className="flex flex-col gap-6 bg-neutral-900 p-8 py-24 rounded-xl">
          <h1 className="w-full text-center text-3xl font-bold">
            Create your account here
          </h1>
          <div className="flex gap-4 w-full justify-center">
            <Button
              onClick={() =>
                signInWithPopup(auth, googleProvider).then((user) => {
                  saveUserToDatabase(
                    user.user.uid,
                    user.user.displayName ?? "Guest",
                    user.user.photoURL ??
                      "https://static.vecteezy.com/system/resources/previews/024/983/914/non_2x/simple-user-default-icon-free-png.png",
                    user.user.email ?? "Email not Found",
                  );
                  router.push("/");
                })
              }
              className="w-max bg-white text-stone-700 font-bold flex gap-2 items-center p-1 rounded-md"
            >
              <Image src={GoogleIcon} alt="" width={36} />
              <h1>Google</h1>
            </Button>
            <Button
              onClick={() =>
                signInWithPopup(auth, githubProvider).then((user) => {
                  saveUserToDatabase(
                    user.user.uid,
                    (user.user as any).reloadUserInfo?.screenName ?? "Guest",
                    user.user.photoURL ??
                      "https://static.vecteezy.com/system/resources/previews/024/983/914/non_2x/simple-user-default-icon-free-png.png",
                    user.user.email ?? "Email not Found",
                  );
                  router.push("/");
                })
              }
              className="w-max bg-black text-white font-bold flex gap-2 items-center p-1 rounded-md"
            >
              <Image src={Github} alt="" width={36} />
              <h1>GitHub</h1>
            </Button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp(
                newUserData.email,
                newUserData.pass,
                newUserData.user,
                router,
              );
            }}
            className="flex flex-col items-center gap-4"
          >
            <div>
              <h1 className="w-full text-start font-bold">Username</h1>
              <Input
                className="outline-none w-max"
                onChange={(e) =>
                  setNewUserData({ ...newUserData, user: e.target.value })
                }
              />
            </div>
            <div>
              <h1 className="w-full text-start font-bold">Email</h1>
              <Input
                className="outline-none w-max"
                onChange={(e) =>
                  setNewUserData({ ...newUserData, email: e.target.value })
                }
              />
            </div>
            <div>
              <h1 className="w-full text-start font-bold">Password</h1>
              <Input
                className="outline-none w-max"
                onChange={(e) =>
                  setNewUserData({ ...newUserData, pass: e.target.value })
                }
              />
            </div>
            <Button
              type="submit"
              className="bg-neutral-800 mt-10 text-lg p-4 px-8 hover:bg-neutral-700 cursor-pointer"
              variant="default"
            >
              Submit
            </Button>
          </form>
        </div>
      </TabsContent>
      <TabsContent value="signin">
        <div className="flex flex-col gap-6 bg-neutral-900 p-8 py-24 rounded-xl">
          <h1 className="w-full text-center text-3xl font-bold">
            Get back to your account
          </h1>
          <div className="flex gap-4 w-full justify-center">
            <button
              onClick={() =>
                signInWithPopup(auth, googleProvider).then((user) => {
                  saveUserToDatabase(
                    user.user.uid,
                    user.user.displayName ?? "Guest",
                    user.user.photoURL ??
                      "https://static.vecteezy.com/system/resources/previews/024/983/914/non_2x/simple-user-default-icon-free-png.png",
                    user.user.email ?? "Email not Found",
                  );
                  router.push("/");
                })
              }
              className="w-max bg-white text-stone-700 font-bold flex gap-2 items-center p-1 rounded-md"
            >
              <Image src={GoogleIcon} alt="" width={36} />
              <h1>Google</h1>
            </button>
            <button
              onClick={() =>
                signInWithPopup(auth, githubProvider).then((user) => {
                  saveUserToDatabase(
                    user.user.uid,
                    user.user.displayName ?? "Guest",
                    user.user.photoURL ??
                      "https://static.vecteezy.com/system/resources/previews/024/983/914/non_2x/simple-user-default-icon-free-png.png",
                    user.user.email ?? "Email not Found",
                  );
                  router.push("/");
                })
              }
              className="w-max bg-black text-white font-bold flex gap-2 items-center p-1 rounded-md"
            >
              <Image src={Github} alt="" width={36} />
              <h1>GitHub</h1>
            </button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignIn();
            }}
            className="flex flex-col items-center gap-4"
          >
            <div>
              <h1
                className={`w-full text-start font-bold ${loginError === "auth/invalid=email" ? "text-red-500" : ""} `}
              >
                Email
              </h1>
              <Input
                className={` ${loginError === "auth/invalid-email" ? "border-red-500" : ""} outline-none w-max`}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
            </div>
            <div>
              <h1
                className={`w-full text-start font-bold ${loginError === "auth/invalid-credential" ? "text-red-500" : ""} `}
              >
                Password
              </h1>
              <Input
                className={` ${loginError === "auth/invalid-credential" ? "border-red-500" : ""} outline-none w-max`}
                onChange={(e) =>
                  setUserData({ ...userData, pass: e.target.value })
                }
              />
            </div>
            <Button
              type="submit"
              className="bg-neutral-800 font-bold mt-10 text-lg p-4 px-8 hover:bg-neutral-700 cursor-pointer"
              variant="default"
            >
              Submit
            </Button>
          </form>
        </div>
      </TabsContent>
    </Tabs>
  );
}
