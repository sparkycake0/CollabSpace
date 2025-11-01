"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useSetAtom } from "jotai";
import { userAtom, loadingAtom } from "@/atoms/auth";
import { useRouter, usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useSetAtom(userAtom);
  const setLoading = useSetAtom(loadingAtom);
  const router = useRouter();
  const path = usePathname();
  const queryClient = new QueryClient();
  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser && path === "/account/auth") {
        router.push("/");
      }
      if (!firebaseUser && path !== "/account/auth") {
        router.push("/account/auth");
      }
    });
  }, [setUser, setLoading]);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
