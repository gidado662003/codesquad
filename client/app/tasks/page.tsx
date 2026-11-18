"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearSession,
  createTask,
  deleteTask,
  getTasks,
  getToken,
  getUser,
  type Task,
  updateTask,
} from "@/lib/api";

const statuses: Task["status"][] = ["todo", "doing", "done"];

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Task | null>(null);
  const [userName, setUserName] = useState("");

  async function load() {
    try {
      setTasks(await getTasks());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load tasks");
    }
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setUserName(getUser()?.name || "");
    void load();
  }, [router]);

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const task = await createTask({
        title: String(data.get("title")),
        description: String(data.get("description")),
        status: String(data.get("status")) as Task["status"],
      });
      setTasks((current) => [task, ...current]);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create task");
    }
  }

  async function onUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const data = new FormData(event.currentTarget);
    try {
      const updated = await updateTask(editing.id, {
        title: String(data.get("title")),
        description: String(data.get("description")),
        status: String(data.get("status")) as Task["status"],
      });
      setTasks((current) => current.map((t) => (t.id === updated.id ? updated : t)));
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update task");
    }
  }

  async function onDelete(id: number) {
    try {
      await deleteTask(id);
      setTasks((current) => current.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete task");
    }
  }

  function logout() {
    clearSession();
    router.push("/login");
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-blue-700">
            Connected to http://localhost:4000
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">My tasks</h1>
          <p className="text-stone-600">Hello{userName ? `, ${userName}` : ""}.</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm hover:bg-stone-50"
        >
          Log out
        </button>
      </header>

      <form
        onSubmit={onCreate}
        className="mt-8 space-y-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
      >
        <h2 className="font-semibold">Create a task</h2>
        <input
          name="title"
          required
          placeholder="Title"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-blue-600"
        />
        <textarea
          name="description"
          placeholder="Details (optional)"
          rows={3}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-blue-600"
        />
        <select
          name="status"
          defaultValue="todo"
          className="rounded-lg border border-stone-300 px-3 py-2"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800"
        >
          Add task
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <ul className="mt-8 space-y-3">
        {tasks.length === 0 ? (
          <li className="text-stone-500">No tasks yet. Add one above.</li>
        ) : (
          tasks.map((task) => (
            <li
              key={task.id}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              {editing?.id === task.id ? (
                <form onSubmit={onUpdate} className="space-y-3">
                  <input
                    name="title"
                    defaultValue={task.title}
                    required
                    className="w-full rounded-lg border border-stone-300 px-3 py-2"
                  />
                  <textarea
                    name="description"
                    defaultValue={task.description}
                    rows={3}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2"
                  />
                  <select
                    name="status"
                    defaultValue={task.status}
                    className="rounded-lg border border-stone-300 px-3 py-2"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="rounded-lg bg-blue-700 px-3 py-1.5 text-sm text-white"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{task.title}</h3>
                      <p className="text-sm capitalize text-blue-700">{task.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing(task)}
                        className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(task.id)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {task.description ? (
                    <p className="mt-2 text-stone-600">{task.description}</p>
                  ) : null}
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
