import { PrismaClient } from '@prisma/client';
const config = useRuntimeConfig();

export const prisma = new PrismaClient({
  log: ['query'],
  datasourceUrl: config.DATABASE_URL
});
