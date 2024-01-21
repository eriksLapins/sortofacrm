import { prisma } from '~db';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    if (!query.userId) {
        throw createError({
            status: 400,
            statusMessage: 'Please provide a user',
            data: {
                user: { text: 'user id is missing' }
            }
        });
    }

    try {
        const data = await prisma.userPreferences.findMany({
            where: {
                module: query.module as string,
                userId: Number(query.userId)
            }
        });

        return { data };
    } catch (e) {
        throw createError({
            status: 500,
            statusText: 'Something went wrong, please try again later',
            message: 'unhandled error at preferences get'
        });
    }
});
