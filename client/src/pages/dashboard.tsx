import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

import { CreateKbDialog } from "@/components/kb/create-kb-dialog";
import { KbCard } from "@/components/kb/kb-card";

import { useAuth } from "@/context/auth-context";

import { useDeleteKb, useKbs } from "@/hooks/use-kbs";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import type { KnowledgeBase } from "@/types/kb";

export default function DashboardPage() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const { data: kbs, isLoading } = useKbs();

  const deleteKbMutation = useDeleteKb();

  async function handleDelete(id: string) {
    try {
      await deleteKbMutation.mutateAsync(id);

      toast.success("Knowledge base deleted");
    } catch {
      toast.error("Failed to delete knowledge base");
    }
  }

  function handleLogout() {
    logout();

    toast.success("Logged out successfully");

    navigate("/login");
  }

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8 flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">AI Knowledge Base</h1>

          <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
        </div>

        <div className="flex items-center gap-3">
          <CreateKbDialog />

          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {kbs?.length === 0 && (
        <div className="rounded-lg border p-12 text-center">
          <h2 className="font-semibold">No Knowledge Bases</h2>

          <p className="mt-2 text-muted-foreground">
            Create your first knowledge base.
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kbs?.map((kb: KnowledgeBase) => (
          <KbCard key={kb.id} kb={kb} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
