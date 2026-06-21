import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { createKbSchema, type CreateKbFormValues } from "@/schemas/kb.schema";

import { useCreateKb } from "@/hooks/use-kbs";

export function CreateKbDialog() {
  const [open, setOpen] = useState(false);

  const createKbMutation = useCreateKb();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateKbFormValues>({
    resolver: zodResolver(createKbSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: CreateKbFormValues) {
    try {
      await createKbMutation.mutateAsync(values);

      toast.success("Knowledge base created");

      reset();

      setOpen(false);
    } catch {
      toast.error("Failed to create knowledge base");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Knowledge Base</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Knowledge Base</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input placeholder="Programming Notes" {...register("name")} />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Store all programming notes..."
              {...register("description")}
            />

            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={createKbMutation.isPending}
          >
            {createKbMutation.isPending ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
