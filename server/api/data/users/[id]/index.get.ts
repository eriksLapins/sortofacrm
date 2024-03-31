import { User } from '@prisma/client';
import { error500 } from '~/utils/errorThrows';
import { prisma } from '~db';

export default defineEventHandler(async (event): Promise<{data: Omit<User, 'password'> | undefined} | undefined> => {
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
        const user = await prisma.user.findUnique({
            where: {
                id: +id
            },
            select: {
                id: true,
                image: true,
                initials: true,
                name: true,
                lastname: true,
                position: true,
                departmentId: true,
                clientCompanyId: true,
                email: true,
                emailVerified: true,
                phoneExtension: true,
                phoneNumber: true,
                role: true,
                username: true
            }
        });

        return { data: user || undefined };
    } catch (e) {
        error500('unhandled error at user id get');
    }
});
