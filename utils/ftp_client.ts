import { Client } from 'basic-ftp';

export default async function ftpClient (localPath: string, remotePath: string) {
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
