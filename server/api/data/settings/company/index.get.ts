import { prisma } from '~/server/api/db';
import { error500 } from '~/utils/errorThrows';

export default defineEventHandler(async () => {
    try {
        const company = await prisma.clientCompany.findMany();

        return {
            data: company
        };
    } catch (e) {
        error500('Something went wrong while getting client company');
    }
});
