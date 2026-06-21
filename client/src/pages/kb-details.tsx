import { useParams } from "react-router-dom";

import { useKb } from "@/hooks/use-kbs";

export default function KbDetailsPage() {
  const { id } = useParams();

  const { data: kb, isLoading } = useKb(id!);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-bold">{kb.name}</h1>

      <p className="mt-2 text-muted-foreground">{kb.description}</p>

      <div className="mt-8 rounded-lg border p-12 text-center">
        <h2 className="font-semibold">No documents yet</h2>

        <p className="mt-2 text-muted-foreground">Upload your first document</p>
      </div>
    </div>
  );
}
