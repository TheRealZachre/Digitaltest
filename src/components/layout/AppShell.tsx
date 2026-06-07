import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-brand-paper">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-auto">{children}</main>
    </div>
  );
}
