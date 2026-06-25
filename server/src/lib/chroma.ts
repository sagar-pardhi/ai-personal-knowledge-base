import { ChromaClient } from "chromadb";
import { DefaultEmbeddingFunction } from "@chroma-core/default-embed";
import { OpenAIEmbeddingFunction } from "@chroma-core/openai";

export const chromaClient = new ChromaClient({
  host: "localhost",
  port: 8000,
});
chromaClient.heartbeat();

export const ef = new DefaultEmbeddingFunction();
export const efOpenAI = new OpenAIEmbeddingFunction({
  modelName: "text-embedding-3-small",
});
