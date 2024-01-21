import { Modules } from '@prisma/client';
import { prisma } from '~db';

export default defineEventHandler(async (): Promise<{data: Modules[]} | Error> => {
    try {
        const modules = await prisma.modules.findMany();

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
