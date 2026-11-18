// The client talks to the Express server through this URL.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type User = { id: number; name: string; email: string };
export type Task = {
  id: number;
  userId: number;
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

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || "Request failed");
  }
  return data as T;
}

export function signup(name: string, email: string, password: string) {
  return request<{ token: string; user: User }>("/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function login(email: string, password: string) {
  return request<{ token: string; user: User }>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getTasks() {
  return request<Task[]>("/tasks");
}

export function createTask(body: { title: string; description: string; status: Task["status"] }) {
  return request<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateTask(
  id: number,
  body: { title: string; description: string; status: Task["status"] },
) {
  return request<Task>(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function deleteTask(id: number) {
  return request<Task>(`/tasks/${id}`, { method: "DELETE" });
}
