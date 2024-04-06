import { prisma } from '~/server/api/db';
import { FileQuery } from '~/types';

export default defineEventHandler(async (event) => {
    const query = getQuery<FileQuery>(event);

    const request: Record<string, any> = {};

    if (query.id) {
        request.id = +query.id;
    }
    if (query.name) {
        request.name = {
            contains: query.name
        };
    }
    if (query.fileType) {
        request.fileType = query.fileType;
    }
    if (query.userId) {
        request.userId = +query.userId;
    }

    const data = await prisma.files.findMany({
        where: {
            ...request
        }
    });

    return {
        files: data
    };
});
