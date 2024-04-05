import type { Files } from '@prisma/client';

export type FileReturn = {
    name: string,
    size: number,
    fileType: 'image' | 'file',
    type: string,
    url: string,
}
export type FileReturnUser = Omit<Files, 'id'>;
