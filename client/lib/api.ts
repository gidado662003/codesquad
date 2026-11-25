// // The client talks to the Express server through this URL.
// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// export type User = { id: string; name: string; email: string };
// export type Task = {
//   id: string;
//   userId: string;
//   title: string;
//   description: string;
//   status: "todo" | "doing" | "done";
//   createdAt: string;
//   updatedAt: string;
// };

// export function getToken() {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem("token");
// }

// export function saveSession(token: string, user: User) {
//   localStorage.setItem("token", token);
//   localStorage.setItem("user", JSON.stringify(user));
// }

// export function getUser(): User | null {
//   if (typeof window === "undefined") return null;
//   const raw = localStorage.getItem("user");
//   return raw ? (JSON.parse(raw) as User) : null;
// }

// export function clearSession() {
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");
// }

// async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
//   const token = getToken();
//   const res = await fetch(`${API_URL}${path}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...options.headers,
//     },
//   });
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) {
//     throw new Error((data as { error?: string }).error || "Request failed");
//   }
//   return data as T;
// }

// export function signup(name: string, email: string, password: string) {
//   return request<{ token: string; user: User }>("/auth/signup", {
//     method: "POST",
//     body: JSON.stringify({ name, email, password }),
//   });
// }

// export function login(email: string, password: string) {
//   return request<{ token: string; user: User }>("/auth/login", {
//     method: "POST",
//     body: JSON.stringify({ email, password }),
//   });
// }

// export function getTasks() {
//   return request<Task[]>("/task");
// }

// export function createTask(body: { title: string; description: string; status: Task["status"] }) {
//   return request<Task>("/task", {
//     method: "POST",
//     body: JSON.stringify(body),
//   });
// }

// export function updateTask(
//   id: string,
//   body: { title: string; description: string; status: Task["status"] },
// ) {
//   return request<Task>(`/task/${id}`, {
//     method: "PUT",
//     body: JSON.stringify(body),
//   });
// }

// export function deleteTask(id: string) {
//   return request<Task>(`/task/${id}`, { method: "DELETE" });
// }

import axios, { AxiosError, AxiosRequestConfig } from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Task = {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: "todo" | "doing" | "done";
  createdAt: string;
  updatedAt: string;
};

export function getToken() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token");
}

export function saveSession(token: string, user: User) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("user");

  return raw ? (JSON.parse(raw) as User) : null;
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

async function request<T>(
  path: string,
  options: AxiosRequestConfig = {},
): Promise<T> {
  try {
    const response = await api.request<{ success: true; response: T }>({
      url: path,
      ...options,
    });

    return response.data.response;
  } catch (err) {
    if (axios.isAxiosError<{ error?: string }>(err)) {
      throw new Error(
        err.response?.data?.error || err.message || "Request failed",
      );
    }

    throw new Error(err instanceof Error ? err.message : "Request failed");
  }
}

export function signup(name: string, email: string, password: string) {
  return request<{ token: string; user: User }>("/auth/signup", {
    method: "POST",
    data: { name, email, password },
  });
}

export function login(email: string, password: string) {
  return request<{ token: string; user: User }>("/auth/login", {
    method: "POST",
    data: { email, password },
  });
}

export function getTasks() {
  return request<Task[]>("/task");
}

export function createTask(body: {
  title: string;
  description: string;
  status: Task["status"];
}) {
  return request<Task>("/task", {
    method: "POST",
    data: body,
  });
}

export function updateTask(
  id: string,
  body: {
    title: string;
    description: string;
    status: Task["status"];
  },
) {
  return request<Task>(`/task/${id}`, {
    method: "PUT",
    data: body,
  });
}

export function deleteTask(id: string) {
  return request<Task>(`/task/${id}`, {
    method: "DELETE",
  });
}
