import type { ResponseError } from '~/types';

export const error400 = (errors: ResponseError) => {
    throw createError({
        statusCode: 400,
        data: {
            errors
        }
    });
};

export const error500 = (message: string) => {
    throw createError({
        statusCode: 500,
        statusMessage: 'Something went wrong, please try again later',
        message
    });
};
