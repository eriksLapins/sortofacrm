import type { Files } from '@prisma/client';

export type FileReturn = {
    name: string,
    size: number,
    fileType: 'images' | 'files',
    type: string,
    url: string,
}

export type FileCreate = Omit<Files, 'id'>;

export type FileReturnUser = {
    files: Files[],
    existingFiles: Files[]
};

export type FileQuery = {
        id?: number,
        name?: string,
        fileType?: 'images' | 'files',
        userId?: number,
}
