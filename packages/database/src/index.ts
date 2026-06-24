import { PrismaClient } from './generated/prisma';

let prismaInstance: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (prismaInstance) return prismaInstance;

  prismaInstance = new PrismaClient();
  return prismaInstance;
}

export function resetPrismaClient(): void {
  if (prismaInstance) {
    prismaInstance.$disconnect();
    prismaInstance = null;
  }
}

export { PrismaClient };
export type * from './generated/prisma';
