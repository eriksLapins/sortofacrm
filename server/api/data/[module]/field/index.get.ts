import { ModuleFieldsAdjusted, ResponseError } from '~/types';
import { error400, error500 } from '~/utils/errorThrows';
import { prisma } from '~db';

export default defineEventHandler(async (event): Promise<ModuleFieldsAdjusted[] | Error | undefined> => {
    const module = getRouterParam(event, 'module');
    const errors: ResponseError = {
        data: {}
    };

    if (!module) {
        errors.data = { general: 'No module name given' };
        error400(errors);
    }
    try {
        const moduleFields = await prisma.moduleFields.findMany({
            where: {
                module
            }
        });

        return moduleFields as ModuleFieldsAdjusted[];
    } catch (e) {
        console.log(e);
        error500('could not get module\'s fields');
    }
});
