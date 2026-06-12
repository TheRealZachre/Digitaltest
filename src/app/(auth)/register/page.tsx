"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { PLATFORM_NAME, PLATFORM_TAGLINE } from "@/lib/company";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const body = (await response.json()) as { error?: string };

    if (!response.ok) {
      setLoading(false);
      setError(body.error ?? "Registration failed.");
      return;
    }

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (signInResult?.error) {
      router.push("/login");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-brand-ink/10 bg-white p-8 shadow-sm">
      <div className="mb-8 flex justify-center">
        <BrandLogo />
      </div>
      <div className="mb-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-muted">
          {PLATFORM_NAME}
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-brand-ink">
          Create account
        </h1>
        <p className="mt-2 text-sm text-brand-muted">
          Register for {PLATFORM_TAGLINE}
        </p>
      </div>

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-brand-ink/10 px-4 py-3 text-sm font-medium text-brand-ink hover:bg-brand-ink/5"
      >
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-brand-ink/10" />
        <span className="text-xs text-brand-muted">or</span>
        <div className="h-px flex-1 bg-brand-ink/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-brand-ink">Name</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-brand-ink/10 px-3 py-2.5"
            autoComplete="name"
            required
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-brand-ink">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-brand-ink/10 px-3 py-2.5"
            autoComplete="email"
            required
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-brand-ink">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-brand-ink/10 px-3 py-2.5"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-indigo px-4 py-3 text-sm font-semibold text-white hover:bg-brand-indigo/90 disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-indigo">
          Sign in
        </Link>
      </p>
    </div>
  );
}
