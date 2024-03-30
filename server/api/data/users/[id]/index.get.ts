import { error500 } from '~/utils/errorThrows';
import { prisma } from '~db';

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    if (typeof id === 'undefined') {
        throw createError({
            status: 400,
            statusMessage: 'Please provide a user',
            data: {
                user: { text: 'user id is missing' }
            }
        });
    }
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: +id
            }
        });

        return { data: user };
    } catch (e) {
        console.log(e);
        error500('unhandled error at user id get');
    }
});
