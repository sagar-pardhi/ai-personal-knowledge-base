import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { KnowledgeBase } from "@/types/kb";

import { useNavigate } from "react-router-dom";

interface Props {
  kb: KnowledgeBase;
  onDelete: (id: string) => void;
}

export function KbCard({ kb, onDelete }: Props) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{kb.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">
          {kb.description || "No description"}
        </p>

        <div className="mt-4 flex gap-2">
          <Button onClick={() => navigate(`/kbs/${kb.id}`)}>Open</Button>
          <Button variant="destructive" onClick={() => onDelete(kb.id)}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
