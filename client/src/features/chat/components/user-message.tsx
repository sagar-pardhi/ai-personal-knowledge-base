import { User } from "lucide-react";

interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="flex max-w-3xl gap-3">
        <div className="rounded-xl bg-primary px-4 py-3 text-primary-foreground">
          <p className="whitespace-pre-wrap wrap-break-word">{content}</p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <User className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
