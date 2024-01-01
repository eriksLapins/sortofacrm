import { ModuleItems } from '@prisma/client';
import { prisma } from '~db';

export default defineEventHandler(async (event): Promise<{data: ModuleItems[]} | Error> => {
    const body = await readBody(event);
    const module = getRouterParam(event, 'module');

    try {
        const moduleItems = await prisma.moduleItems.findMany({
            where: {
                module,
                ...body
            }
        });

        return {
            data: moduleItems
        };
    } catch (e) {
        throw createError({
            status: 500,
            statusText: 'Something went wrong, please try again later',
            message: 'unhandled error at tasks get'
        });
    }
});
