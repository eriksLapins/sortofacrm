import { Dir, mkdirSync, opendirSync, rmSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { Client } from 'basic-ftp';
import type { FileReturn } from '~/types';

export async function ftpClient (files: FormData, remotePath: string): Promise<{
    success: boolean, files?: FileReturn[]
}> {
    const client = new Client();
    // client.ftp.verbose = true;

    let dir;
    const returnFiles: FileReturn[] = [];
    try {
        await client.access({
            host: process.env.MY_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD
        });

        try {
            dir = opendirSync('./temp_files');
        } catch {
            dir = mkdirSync('./temp_files');
        }

        for (const file of files) {
            const [
                name,
                entry
            ] = file as [name: string, entry: File];

            const buffer = await (entry as File).arrayBuffer();
            const nodeBuffer = Buffer.from(buffer);
            writeFileSync(`./temp_files/${name}`, nodeBuffer);
            returnFiles.push({
                name,
                size: entry.size,
                type: entry.type,
                fileType: entry.type.includes('image') ? 'image' : 'file',
                url: process.env.NUXT_PUBLIC_IMAGE_PATH + remotePath.replace('/public_html', '') + `/${name}`
            });
        }
        await client.ensureDir(remotePath);
        const path = resolve('./temp_files');
        await client.uploadFromDir(path);

        if (dir) {
            (dir as Dir).close();
        }
    } catch (err) {
        if (dir) {
            (dir as Dir).close();
        }

        return { success: false };
    }
    rmSync('./temp_files', { recursive: true, force: true });

    client.close();

    return {
        success: true,
        files: returnFiles
    };
}

export async function ftpDeleteClient (remotePath: string) {
    const client = new Client();
    // client.ftp.verbose = true;

    try {
        await client.access({
            host: process.env.MY_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD
        });

        await client.remove(remotePath);
        await client.cd('/');
    } catch (err) {
        console.log(err);
    }
    client.close();

    return { success: true };
}
