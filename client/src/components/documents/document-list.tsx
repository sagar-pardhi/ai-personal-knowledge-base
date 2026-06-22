import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { formatFileSize } from "@/lib/format-file-size";

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
      toast.error("Failed to delete document");
    }
  }

  if (documents.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <h3 className="font-medium">No documents yet</h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Upload your first document
        </p>
      </div>
    );
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

            <p className="text-sm text-muted-foreground">
              {document.fileType}
              {" • "}
              {formatFileSize(document.fileSize)}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a
                href={document.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View
              </a>
            </Button>

            <Button
              variant="destructive"
              onClick={() => handleDelete(document.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
