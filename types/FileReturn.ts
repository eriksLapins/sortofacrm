import type { Files } from '@prisma/client';

export type FileReturn = {
    name: string,
    size: number,
    fileType: 'image' | 'file',
    type: string,
    url: string,
}

export type FileCreate = Omit<Files, 'id'>;

export type FileReturnUser = {
    files: Files[],
    existingFiles: Files[]
};
