import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { useDeleteDocument } from "@/hooks/use-documents";

import type { Document } from "@/types/document";

interface Props {
  documents: Document[];
}

export function DocumentList({ documents }: Props) {
  const deleteMutation = useDeleteDocument();

  async function handleDelete(id: string) {
    try {
      await deleteMutation.mutateAsync(id);

      toast.success("Document deleted");
    } catch {
      toast.error("Delete failed");
    }
  }

  return (
    <div className="space-y-3">
      {documents.map((document) => (
        <div
          key={document.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div>
            <p className="font-medium">{document.name}</p>

            <p className="text-sm text-muted-foreground">{document.fileType}</p>
          </div>

          <Button
            variant="destructive"
            onClick={() => handleDelete(document.id)}
          >
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
}
