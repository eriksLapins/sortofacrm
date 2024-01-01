import { prisma } from '~db';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    try {
        const userData = await prisma.user.findMany({
            where: {
                ...body
            },
            select: {
                id: true,
                image: true,
                initials: true,
                name: true,
                lastname: true,
                position: true,
                departmentId: true
            }
        });

        return { data: userData };
    } catch (e) {
        throw createError({
            status: 500,
            statusText: 'Something went wrong, please try again later',
            message: 'unhandled error at users get'
        });
    }
});
