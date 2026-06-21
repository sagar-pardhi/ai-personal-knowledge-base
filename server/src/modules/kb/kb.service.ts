import { prisma } from "../../lib/prisma.js";

import { CreateKbInput, UpdateKbInput } from "./kb.schema.js";

export async function createKb(userId: string, data: CreateKbInput) {
  return prisma.knowledgeBase.create({
    data: {
      ...data,
      userId,
    },
  });
}

export async function getKbs(userId: string) {
  return prisma.knowledgeBase.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getKb(id: string, userId: string) {
  const kb = await prisma.knowledgeBase.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!kb) {
    throw new Error("Knowledge base not found");
  }

  return kb;
}

export async function updateKb(
  id: string,
  userId: string,
  data: UpdateKbInput,
) {
  await getKb(id, userId);

  return prisma.knowledgeBase.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteKb(id: string, userId: string) {
  await getKb(id, userId);

  await prisma.knowledgeBase.delete({
    where: {
      id,
    },
  });

  return {
    success: true,
  };
}
