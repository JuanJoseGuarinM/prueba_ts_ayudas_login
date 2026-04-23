import { getAuthenticatedUserFromCookies } from "@/lib/auth";
import LogoutButton from "@/components/ui/LogoutButton";

export default async function DashboardPage() {
  const user = await getAuthenticatedUserFromCookies();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Panel protegido
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
          Hola, {user.email}
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Esta vista solo se muestra cuando existe una sesion valida. El acceso se
          protege con tokens, cookies seguras y redireccionamiento desde middleware.
        </p>
        <div className="mt-8">
          <LogoutButton />
        </div>
      </section>
    </main>
  );
}
