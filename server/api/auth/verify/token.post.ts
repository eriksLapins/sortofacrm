import { ERole } from '@prisma/client';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event): Promise<{username: string, role: ERole, iat: string, exp: string, companyId: number, userId: string} | null> => {
    const { token } = await readBody(event);
    const config = useRuntimeConfig(event);

    try {
        const decoded = jwt.verify(token, config.auth.secret);
        const decodedJson = await JSON.parse(JSON.stringify(decoded));

        return decodedJson;
    } catch {
        return null;
    }
});
