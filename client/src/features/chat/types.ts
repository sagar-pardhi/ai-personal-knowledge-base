export interface ChatSource {
  documentId: string;
  documentName: string;
  chunks: number[];
  relevanceScore: number;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
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
