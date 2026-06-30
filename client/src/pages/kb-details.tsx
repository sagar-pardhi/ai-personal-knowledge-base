import { useNavigate, useParams } from "react-router-dom";

import { UploadDocument } from "@/components/documents/upload-document";

import { DocumentList } from "@/components/documents/document-list";

import { useKb } from "@/hooks/use-kbs";

import { useDocuments } from "@/hooks/use-documents";
import { ChatPanel } from "@/features/chat/components/chat-panel";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function KbDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const kbId = id!;

  const { data: kb, isLoading } = useKb(kbId);

  const { data: documents } = useDocuments(kbId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">{kb.name}</h1>
        </div>
        <p className="mt-2 text-muted-foreground">{kb.description}</p>
      </div>

      <div className="mt-8">
        <UploadDocument knowledgeBaseId={kbId} />
      </div>

      <div className="mt-8">
        <DocumentList documents={documents ?? []} />
      </div>

      <ChatPanel knowledgeBaseId={kbId} />
    </div>
  );
}
