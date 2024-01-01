import { ModuleItems } from '@prisma/client';
import { prisma } from '~db';

export default defineEventHandler(async (event): Promise<{data: ModuleItems} | Error> => {
    const module = getRouterParam(event, 'module');
    const body = await readBody(event);

    if (!body.id) {
        throw createError({
            status: 400,
            statusMessage: `Please provide an id for the module ${module}`
        });
    }

    const errors: Record<string, Record<string, string>> = {};

    if (Object.keys(errors).length) {
        throw createError({
            status: 400,
            data: {
                errors
            }
        });
    }

    try {
        const moduleItem = await prisma.moduleItems.update({
            where: {
                module,
                id: body.id
            },
            data: {
                ...body
            }
        });

        return { data: moduleItem };
    } catch (e) {
        console.log(e);
        throw createError({
            status: 500,
            statusText: 'Something went wrong, please try again later',
            message: 'unhandled error at tasks update'
        });
    }
});
