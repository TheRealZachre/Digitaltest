import { redirect } from "next/navigation";
import { AdminUserConsole } from "@/components/admin/AdminUserConsole";
import { auth } from "@/lib/auth";
import { listUsers } from "@/lib/auth/users";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  const users = await listUsers();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-brand-indigo">
          Admin
        </p>
        <h1 className="mt-2 font-serif text-3xl text-brand-ink">User management</h1>
        <p className="mt-2 max-w-2xl text-sm text-brand-muted">
          Create username and password accounts for your team. New users can sign
          in with their username or email address.
        </p>
      </div>

      <AdminUserConsole initialUsers={users} />
    </div>
  );
}
