import { prisma } from '~/server/api/db';

export default defineEventHandler(async () => {
    const departments = await prisma.department.findMany();

    return {
        data: departments
    };
});
