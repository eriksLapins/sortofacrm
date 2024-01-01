import { ModuleFields } from '@prisma/client';
import { prisma } from '@db';

export default defineEventHandler(async (event): Promise<{data: ModuleFields} | Error> => {
    const body: {key: string} = await readBody(event);
    const module = getRouterParam(event, 'module');

    if (!module) {
        throw createError({
            status: 400,
            statusText: 'No module name given',
            message: 'No module name given'
        });
    };

    try {
        const field = await prisma.moduleFields.delete({
            where: {
                module_key: {
                    module,
                    key: body.key
                }
            }
        });

        return { data: field };
    } catch (e) {
        console.log(e);
        throw createError({
            status: 500,
            statusText: 'Something went wrong, please try again later',
            message: 'unhandled error at modules field delete'
        });
    }
});
