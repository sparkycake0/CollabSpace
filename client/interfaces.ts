export interface notFoundData {
  displayName: string | null;
  email: string | null;
  pass: string | null;
  photoURL: string | null;
}
export type EmailVerificationProps = {
  verified: React.ReactNode;
  unverified: React.ReactNode;
  className: string;
  skeletonStyle: string;
};
export type Project = {
  ownerId: string;
  id?: string;
  name: string;
  desc?: string;
  priority: number;
  date?: string;
  chat: boolean;
  docs?: boolean;
  whiteboard: boolean;
  tasks: boolean;
  createdAt?: string;
  owner?: {
    userId?: string;
    userName?: string;
    userPhoto?: string;
  };
};
export type Message = {
  id: string;
  projectId: string;
  userId: string;
  content: string;
  createdAt: Date;
  userName: string;
  userPhoto: string;
};
export type User = {
  userEmail: string;
  userName: string;
  userPhoto: string;
  userId: string;
};
type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
export type ApiOptions<T> = {
  key?: string;
  endpoint: string;
  method?: Method;
  body?: unknown;
  invalidateKey?: string;
  enabled?: boolean;
};
export type ProjectMember = {
  userId: string;
  projectId: string;
  role?: "MEMBER" | "ADMIN";
  userName: string;
  userPhoto: string;
  Project: Project;
};
export type Task = {
  id?: string;
  name: string;
  desc: string;
  userId: string;
  status?: "PENDING" | "DONE";
};
