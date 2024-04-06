import { Prisma } from '@prisma/client';

export function handlePrismaError (e: any): {
    name: string,
    code: string,
    meta?: Record<string, any>,
    cause: unknown,
} | undefined {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return {
            name: e.name,
            code: e.code,
            meta: e.meta,
            cause: e.cause
        };
    }
    if (e instanceof Prisma.PrismaClientInitializationError) {
        return {
            name: e.name,
            code: e.errorCode || '500',
            meta: {
                message: e.message
            },
            cause: e.cause
        };
    }
    if (e instanceof Prisma.PrismaClientRustPanicError) {
        return {
            name: e.name,
            code: '502',
            meta: {
                message: e.message
            },
            cause: e.cause
        };
    }
    if (e instanceof Prisma.PrismaClientUnknownRequestError) {
        return {
            name: e.name,
            code: '500',
            meta: {
                message: e.message
            },
            cause: e.cause
        };
    }
    if (e instanceof Prisma.PrismaClientValidationError) {
        return {
            name: e.name,
            code: '501',
            meta: {
                message: e.message
            },
            cause: e.cause
        };
    }

    return undefined;
}
