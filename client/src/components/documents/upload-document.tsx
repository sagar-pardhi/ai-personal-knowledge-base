import { toast } from "sonner";

import { useUploadDocument } from "@/hooks/use-documents";

interface Props {
  knowledgeBaseId: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function UploadDocument({ knowledgeBaseId }: Props) {
  const uploadMutation = useUploadDocument();

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File must be less than 10MB");
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
