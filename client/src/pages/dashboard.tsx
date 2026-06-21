import { useAuth } from "@/context/auth-context";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <button
          onClick={logout}
          className="rounded bg-red-500 px-4 py-2 text-white"
        >
          Logout
        </button>
      </div>

      <p className="mt-4">Welcome {user?.name}</p>
    </div>
  );
}
