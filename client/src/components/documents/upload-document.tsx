import { toast } from "sonner";

import { useUploadDocument } from "@/hooks/use-documents";

interface Props {
  knowledgeBaseId: string;
}

export function UploadDocument({ knowledgeBaseId }: Props) {
  const uploadMutation = useUploadDocument();

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    formData.append("knowledgeBaseId", knowledgeBaseId);

    try {
      await uploadMutation.mutateAsync(formData);

      toast.success("Document uploaded");
    } catch {
      toast.error("Upload failed");
    }
  }

  return (
    <div>
      <input type="file" accept=".pdf,.txt,.md" onChange={handleChange} />
    </div>
  );
}
