import type { Application as PrismaApplication } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type Application = PrismaApplication;

export type ApplicationInput = Omit<Application, "id" | "createdAt" | "status">;

export async function readApplications(): Promise<Application[]> {
  return prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function addApplication(
  app: ApplicationInput
): Promise<Application> {
  return prisma.application.create({ data: app });
}

export async function updateApplicationStatus(
  id: string,
  status: Application["status"]
): Promise<boolean> {
  try {
    await prisma.application.update({
      where: { id },
      data: { status },
    });
    return true;
  } catch {
    return false;
  }
}

export async function getApplicationById(id: string): Promise<Application | null> {
  return prisma.application.findUnique({ where: { id } });
}

export async function markApplicationPaid(
  id: string,
  selarReference = ""
): Promise<Application | null> {
  try {
    return await prisma.application.update({
      where: { id },
      data: {
        paymentStatus: "paid",
        paidAt: new Date(),
        selarReference: selarReference || undefined,
      },
    });
  } catch {
    return null;
  }
}

export async function findApplicationForPayment(match: {
  applicationId?: string | null;
  email?: string | null;
}): Promise<Application | null> {
  if (match.applicationId) {
    const byId = await prisma.application.findUnique({ where: { id: match.applicationId } });
    if (byId) return byId;
  }
  if (match.email) {
    return prisma.application.findFirst({
      where: { email: match.email, paymentStatus: "unpaid" },
      orderBy: { createdAt: "desc" },
    });
  }
  return null;
}
