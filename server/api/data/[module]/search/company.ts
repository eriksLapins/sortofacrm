import { ModuleItems } from '@prisma/client';
import { prisma } from '@db';

export default defineEventHandler(async (event): Promise<{data: ModuleItems[]} | Error> => {
    const body = await readBody(event);
    const module = getRouterParam(event, 'module');

    const moduleItems = await prisma.moduleItems.findMany({
        where: {
            module,
            data: {
                path: '$.companyId',
                equals: body.companyId
            }
        }
    });

    return { data: moduleItems };
});
