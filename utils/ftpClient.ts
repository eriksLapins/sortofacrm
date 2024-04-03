import { writeFileSync } from 'fs';
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

export async function ftpDirectClient (file: ArrayBuffer, fileName: string, remotePath: string) {
    const client = new Client();
    // client.ftp.verbose = true;

    try {
        await client.access({
            host: process.env.MY_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD
        });

        await client.ensureDir(remotePath);
        const buffer = Buffer.from(new Uint8Array(file));
        writeFileSync(`./temp/${fileName}`, buffer);
        // await client.uploadFrom(result, remotePath);
        // await client.cd('/');
    } catch (err) {
        console.log(err);
        client.close();

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
