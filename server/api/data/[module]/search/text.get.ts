import { ModuleItems } from '@prisma/client';
import { prisma } from '~db';

export default defineEventHandler(async (event): Promise<ModuleItems[] | Error> => {
    const module = getRouterParam(event, 'module');

    const query = getQuery(event);

    try {
        const moduleItems = await prisma.moduleItems.findMany({
            where: {
                AND: [
                    {
                        module
                    },
                    {
                        OR: [
                            {
                                title: {
                                    contains: query.searchQuery as string
                                }
                            },
                            {
                                description: {
                                    contains: query.searchQuery as string
                                }
                            }
                        ]
                    }
                ]
            }
        });

        return moduleItems;
    } catch (e) {
        console.log(e);
        throw createError({
            status: 500,
            statusMessage: 'Sorry, something went wrong',
            message: 'Unhandled error at module search by text'
        });
    }
});
