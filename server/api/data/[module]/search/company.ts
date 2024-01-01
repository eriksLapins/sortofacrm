import { prisma } from '@db';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const module = getRouterParam(event, 'module');

    const data = await prisma.moduleItems.findMany({
        where: {
            module,
            data: {
                path: '$.companyId',
                equals: body.companyId
            }
        }
    });

    return { data };
});
