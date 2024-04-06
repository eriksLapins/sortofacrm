import { Files } from '@prisma/client';
import { prisma } from '~/server/api/db';
import { FileCreate } from '~/types';
import { error500 } from '~/utils/errorThrows';
import { ftpClient } from '~/utils/ftpClient';

async function checkExistsFile (userId: number, name: string) {
    const item = await prisma.files.findUnique({
        where: {
            name_userId: {
                name,
                userId
            }
        }
    });

    return item;
}

async function generateName (id: number, name: string): Promise<string> {
    let run = true;
    let i = 1;
    const nameArray = name.split('.');
    const fileName = nameArray.shift();
    const extension = nameArray.join('.');
    let newName = name;
    while (run) {
        const exists = await checkExistsFile(id, newName);
        if (exists) {
            newName = `${fileName} (${i}).${extension}`;
            i += 1;
            continue;
        } else {
            run = false;
        }
    }

    return newName;
}

export default defineEventHandler(async (event): Promise<{files: Files[]}> => {
    const id = getRouterParam(event, 'user_id');
    if (!id) {
        error500('No user id provided');
    }

    const query = getQuery(event);

    if (!query.type) {
        error500('No query param specifying type');
    }
    const response = await readFormData(event);

    if (typeof response === 'undefined') {
        error500('No data provided');
    }

    const files: FileCreate[] = [];
    const returnFiles: Files[] = [];
    const newResponse = new FormData();

    for (const file of response) {
        const newName = await generateName(+id!, file[0]);
        file[0] = newName;
        newResponse.append(newName, file[1]);
    }

    const noentries = newResponse.entries().next().value === undefined;

    if (!noentries) {
        try {
            const res = await ftpClient(newResponse, `/public_html/sortofacrm/users/${id}/${query.type}`);
            if (res.files) {
                for (const file of res.files) {
                    files.push({
                        name: file.name,
                        fileType: query.type as 'images' | 'files',
                        size: file.size,
                        type: file.type,
                        url: file.url,
                        userId: +id!
                    });
                }
            }
        } catch (e) {
            console.log(e);
            error500('Failed to upload image');
        }

        for (const file of files) {
            try {
                const newFile = await prisma.files.create({
                    data: {
                        ...file
                    }
                });
                returnFiles.push(newFile);
            } catch (e) {
                error500('Failed to upload files to db');
            }
        }
    } else {
        error500('No files detected');
    }

    return {
        files: returnFiles
    };
});
