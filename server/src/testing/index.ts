import { chromaClient } from "../lib/chroma.js";

async function main() {
  await chromaClient.deleteCollection({
    name: "knowledge-base",
  });

  console.log("Collection deleted");
}

main().catch(console.error);
