import { PrismaClient } from "@prisma/client";

/**
 * This weird looking global stuff is a workaround to prevent
 * the prisma client from getting reinitialized every time
 * nextjs hot reloads.
 */

const globalForPrisma = global as unknown as {
	prisma: PrismaClient | undefined;
};

const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
