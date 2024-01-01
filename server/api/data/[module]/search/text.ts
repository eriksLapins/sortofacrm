import { prisma } from '@db';

export default defineEventHandler(async (event) => {
    const module = getRouterParam(event, 'module');

    const query = getQuery(event);

    try {
        const data = await prisma.moduleItems.findMany({
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

        return { data };
    } catch (e) {
        console.log(e);
    }
});
