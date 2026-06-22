import { useParams } from "react-router-dom";

import { UploadDocument } from "@/components/documents/upload-document";

import { DocumentList } from "@/components/documents/document-list";

import { useKb } from "@/hooks/use-kbs";

import { useDocuments } from "@/hooks/use-documents";

export default function KbDetailsPage() {
  const { id } = useParams();

  const kbId = id!;

  const { data: kb, isLoading } = useKb(kbId);

  const { data: documents } = useDocuments(kbId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold">{kb.name}</h1>

      <p className="mt-2 text-muted-foreground">{kb.description}</p>

      <div className="mt-8">
        <UploadDocument knowledgeBaseId={kbId} />
      </div>

      <div className="mt-8">
        <DocumentList documents={documents ?? []} />
      </div>
    </div>
  );
}
