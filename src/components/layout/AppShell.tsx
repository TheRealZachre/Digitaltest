import type { ReactNode } from "react";
import { UserMenu } from "@/components/auth/UserMenu";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-brand-paper">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-auto">
        <div className="flex justify-end border-b border-brand-ink/10 bg-[#FFFEFB] px-8 py-3">
          <UserMenu />
        </div>
        {children}
      </main>
    </div>
  );
}
