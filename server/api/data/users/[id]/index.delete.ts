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
        await prisma.user.delete({
            where: {
                id: +id
            }
        });
    } catch (e) {
        throw createError({
            status: 500,
            statusText: 'Something went wrong, please try again later',
            message: 'unhandled error at users delete'
        });
    }
});
