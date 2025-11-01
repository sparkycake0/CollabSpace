// lib/currentUser.ts
"use client";

import { useState, useEffect } from "react";
import { auth } from "./firebase"; // adjust import if needed
import { onAuthStateChanged, User } from "firebase/auth";

// Global variable to store current user
let _user: User | null = null;

/**
 * Hook to get current user reactively
 */
export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(_user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      _user = firebaseUser; // update global
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  return user;
}

/**
 * Synchronous getter for current user outside React
 */
export function getCurrentUser(): User | null {
  return _user;
}
