import type { Modules } from '@prisma/client';
import { prisma } from '~db';

export default defineEventHandler(async (): Promise<Modules[] | Error> => {
    try {
        const modules = await prisma.modules.findMany();

        return modules;
    } catch (e) {
        console.log(e);
        throw createError({
            status: 500,
            statusText: 'Something went wrong, please try again later',
            message: 'could not get modules'
        });
    }
});
