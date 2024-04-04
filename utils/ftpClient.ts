import { Dir, mkdirSync, opendirSync, rmSync, writeFileSync } from 'fs';
import { Client } from 'basic-ftp';

export async function ftpClient (localPath: string, remotePath: string) {
    const client = new Client();
    // client.ftp.verbose = true;
    try {
        await client.access({
            host: process.env.MY_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD
        });

        await client.ensureDir(remotePath);
        await client.uploadFromDir(localPath);
        await client.cd('/');
    } catch (err) {
        console.log(err);
        client.close();

        return { success: false };
    }
    client.close();

    return { success: true };
}

export async function ftpDirectClient (files: FormData, remotePath: string) {
    const client = new Client();
    // client.ftp.verbose = true;

    let dir;
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
            ] = file;

            const buffer = await (entry as File).arrayBuffer();
            const nodeBuffer = Buffer.from(buffer);
            writeFileSync(`./temp_files/${name}`, nodeBuffer);
            await client.ensureDir(remotePath);
            await client.uploadFrom(`./temp_files/${name}`, remotePath + `/${name}`);
        }

        if (dir) {
            (dir as Dir).close();
        }
        rmSync('./temp_files', { recursive: true, force: true });
    } catch (err) {
        console.log(err);
        client.close();
        if (dir) {
            (dir as Dir).close();
        }
        rmSync('./temp_files', { recursive: true, force: true });

        return { success: false };
    }
    client.close();

    return { success: true };
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
