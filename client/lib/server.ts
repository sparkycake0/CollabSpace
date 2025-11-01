import type { ApiOptions } from "@/interfaces";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const url = "https://collabspace-0ab8.onrender.com";
export const socketUrl = "https://collabspace-0ab8.onrender.com";

export async function addUserToProject(
  projectId: string,
  userId: string,
  userName: string,
  userPhoto: string,
) {
  try {
    const res = await fetch(`${url}/projects/${projectId}/add-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, userName, userPhoto }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to add user");
    }

    const data = await res.json();
    console.log("User added:", data);
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
export async function saveUserToDatabase(
  userId: string,
  userName: string,
  userPhoto: string,
  userEmail: string,
) {
  try {
    const res = await fetch(`${url}/account/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, userName, userPhoto, userEmail }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to save user to database!");
    }
    const data = await res.json();
    console.log(`User added to database ${data}`);
  } catch (err) {
    console.log(err);
  }
}

export async function apiRequest<T>(
  endpoint: string,
  method: string = "GET",
  body?: unknown,
): Promise<T> {
  const options: RequestInit = { method };

  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
    options.headers = { "Content-Type": "application/json" };
  }

  const res = await fetch(`${url}${endpoint}`, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Api error: ${res.status} - ${text}`);
  }

  // Handle empty responses
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return null as unknown as T;
  }

  return res.json();
}

export function api<T>({
  key,
  endpoint,
  method = "GET",
  body,
  invalidateKey,
  enabled = true,
}: ApiOptions<T>) {
  const queryClient = useQueryClient();

  // GET queries
  const query = useQuery<T>({
    queryKey: [key || endpoint],
    queryFn: () => apiRequest<T>(endpoint, "GET"),
    enabled: enabled && method === "GET",
  });

  // Mutations
  const mutation = useMutation<
    T,
    Error,
    { endpoint?: string; body?: any; id?: string }
  >({
    mutationFn: async (data: any) => {
      const bodyToSend =
        method === "POST" || method === "PUT" ? data : (data?.body ?? body);
      const endpointToUse = data?.endpoint || endpoint;

      return apiRequest<T>(endpointToUse, method, bodyToSend);
    },
    onMutate: async (data) => {
      if (!invalidateKey) return;

      await queryClient.cancelQueries([invalidateKey] as any);
      const previous = queryClient.getQueryData<T[]>([invalidateKey]);

      queryClient.setQueryData<T[]>([invalidateKey], (old) => {
        if (!old) return old;

        switch (method) {
          case "PATCH":
            return old.map((item: any) =>
              item.id === data.id ? { ...item, ...data } : item,
            );
          case "DELETE":
            return old.filter((item: any) => item.id !== data.id);
          default:
            return old;
        }
      });

      return { previous };
    },
    onError: (context: any) => {
      if (invalidateKey && context?.previous) {
        queryClient.setQueryData([invalidateKey], context.previous);
      }
    },
    onSettled: () => {
      if (invalidateKey) queryClient.invalidateQueries([invalidateKey] as any);
    },
  });

  return method === "GET" ? query : mutation;
}
