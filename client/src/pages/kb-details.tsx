import { useParams } from "react-router-dom";

import { UploadDocument } from "@/components/documents/upload-document";

import { DocumentList } from "@/components/documents/document-list";

import { useKb } from "@/hooks/use-kbs";

import { useDocuments } from "@/hooks/use-documents";
import { ChatInput } from "@/features/chat/components/chat-input";
import { useChat } from "@/features/chat/hooks/use-chat";
import { ChatAnswer } from "@/features/chat/components/chat-answer";

export default function KbDetailsPage() {
  const { id } = useParams();

  const kbId = id!;

  const { data: kb, isLoading } = useKb(kbId);

  const { data: documents } = useDocuments(kbId);

  const chat = useChat(id);

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

      <div className="mt-8 gap-y-3 flex flex-col justify-between">
        <ChatAnswer
          answer={chat.answer}
          loading={chat.loading}
          error={chat.error}
        />
        <ChatInput loading={chat.loading} onSubmit={chat.askQuestion} />
      </div>
    </div>
  );
}
