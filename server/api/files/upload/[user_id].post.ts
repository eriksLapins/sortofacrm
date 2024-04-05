import { prisma } from '~/server/api/db';
import { FileReturnUser } from '~/types';
import { error500 } from '~/utils/errorThrows';
import { ftpClient } from '~/utils/ftpClient';

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'user_id');
    if (!id) {
        error500('No user id provided');
    }

    const query = getQuery(event);
    const files: FileReturnUser[] = [];

    if (!query.type) {
        error500('No query param specifying type');
    }
    const response = await readFormData(event);

    if (typeof response === 'undefined') {
        error500('No data provided');
    }

    try {
        const res = await ftpClient(response, `/public_html/sortofacrm/users/${id}/${query.type}`);
        if (res.files) {
            for (const file of res.files) {
                files.push({
                    name: file.name,
                    fileType: query.type as 'image' | 'file',
                    size: file.size,
                    type: file.type,
                    url: file.url,
                    userId: +id!
                });
            }
        }
    } catch (e) {
        error500('Failed to upload image');
    }

    try {
        await prisma.files.createMany({
            data: [
                ...files
            ]
        });
    } catch (e) {
        error500('Failed to upload image to db');
    }

    return {
        files
    };
});
