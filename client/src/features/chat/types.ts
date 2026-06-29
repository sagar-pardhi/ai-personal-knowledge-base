export interface ChatSource {
  documentId: string;
  documentName: string;
  chunks?: number[];
  relevanceScore?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
}

export interface ChatRequest {
  knowledgeBaseId: string;
  question: string;
}

export interface ChatState {
  answer: string;
  sources: ChatSource[];
  loading: boolean;
  error: string | null;
}
