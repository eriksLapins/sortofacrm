import { error500 } from '~/utils/errorThrows';
import { prisma } from '~db';

export default defineEventHandler(async () => {
    try {
        const userData = await prisma.user.findMany({
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
        error500('unhandled error at users get');
    }
});
