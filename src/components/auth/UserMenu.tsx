"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";

export function UserMenu() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium text-brand-ink">
          {session.user.name ?? session.user.email}
        </p>
        {session.user.email && session.user.name && (
          <p className="text-xs text-brand-muted">{session.user.email}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="inline-flex items-center gap-2 rounded-lg border border-brand-ink/10 px-3 py-2 text-sm font-medium text-brand-ink hover:bg-brand-ink/5"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </div>
  );
}
