"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveSession, signup } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      const result = await signup(
        String(form.get("name")),
        String(form.get("email")),
        String(form.get("password")),
      );
      saveSession(result.token, result.user);
      router.push("/tasks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-blue-700">
        Task client
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Sign up</h1>
      <p className="mt-2 text-stone-600">
        This form sends <code className="rounded bg-stone-200 px-1">POST /signup</code>{" "}
        to the Express server and stores the returned token.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium">
          Name
          <input
            name="name"
            type="text"
            required
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-blue-600"
          />
        </label>
        <label className="block text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-blue-600"
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={4}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-blue-600"
          />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-blue-700 px-4 py-2.5 font-medium text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-4 text-sm text-stone-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-blue-700 hover:underline">
          Log in
        </Link>
      </p>
    </main>
  );
}
