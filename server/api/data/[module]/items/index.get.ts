import { ModuleItems } from '@prisma/client';
import { prisma } from '~db';

export default defineEventHandler(async (event): Promise<ModuleItems[] | Error> => {
    const module = getRouterParam(event, 'module');
    const query = getQuery(event);

    try {
        const moduleItems = await prisma.moduleItems.findMany({
            where: {
                module,
                createdById: query.createdById ? Number(query.createdById) : undefined,
                id: query.id ? Number(query.id) : undefined
            }
        });

        return moduleItems;
    } catch (e) {
        throw createError({
            status: 500,
            statusText: 'Something went wrong, please try again later',
            message: 'unhandled error at tasks get'
        });
    }
});
