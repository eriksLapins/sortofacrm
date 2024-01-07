import { Modules } from '@prisma/client';
import { prisma } from '~db';

export default defineEventHandler(async (event): Promise<{data: Modules | null} | Error> => {
    const query = getQuery(event);
    try {
        const modules = await prisma.modules.findFirst({
            where: {
                key: query.module as string
            }
        });

        return {
            data: modules
        };
    } catch (e) {
        console.log(e);
        throw createError({
            status: 500,
            statusText: 'Something went wrong, please try again later',
            message: 'could not get modules'
        });
    }
});
