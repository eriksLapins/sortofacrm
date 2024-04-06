import { ClientCompany } from '@prisma/client';
import { prisma } from '~/server/api/db';
import { ResponseError } from '~/types';
import { error400, error500 } from '~/utils/errorThrows';

export default defineEventHandler(async (event) => {
    const body: Omit<ClientCompany, 'id'> = await readBody(event);
    const errors: ResponseError = {};
    errors.data = {};
    if (!body.legalName) {
        errors.data = {
            ...errors.data,
            legalName: 'Please provide a legal name'
        };
    }

    if (!body.shortName) {
        errors.data = {
            ...errors.data,
            shortName: 'Please provide a shortname'
        };
    }

    if (!body.regNo) {
        errors.data = {
            ...errors.data,
            regNo: 'Please provide a registration number'
        };
    }

    if (!body.street) {
        errors.data = {
            ...errors.data,
            street: 'Please provide a street name'
        };
    }

    if (!body.streetNo) {
        errors.data = {
            ...errors.data,
            streetNo: 'Please provide a street number'
        };
    }

    if (!body.city) {
        errors.data = {
            ...errors.data,
            city: 'Please provide a city'
        };
    }

    if (!body.country) {
        errors.data = {
            ...errors.data,
            country: 'Please provide a country'
        };
    }

    if (!body.fullAddress) {
        errors.data = {
            ...errors.data,
            fullAddress: 'Please provide a full address'
        };
    }

    if (!body.phone) {
        errors.data = {
            ...errors.data,
            phone: 'Please provide a phone number'
        };
    }

    if (!body.phoneExtension) {
        errors.data = {
            ...errors.data,
            phoneExtension: 'Please provide a phone extension'
        };
    }

    if (!body.email) {
        errors.data = {
            ...errors.data,
            email: 'Please provide an email'
        };
    }

    if (!body.bankAccount) {
        errors.data = {
            ...errors.data,
            bankAccount: 'Please provide a bank account'
        };
    }

    if (!body.swift) {
        errors.data = {
            ...errors.data,
            swift: 'Please provide a swift'
        };
    }

    if (body.isMain === undefined) {
        errors.data = {
            ...errors.data,
            isMain: 'Please check that you have sent whether the company is a main company'
        };
    }

    if ('data' in errors && Object.keys(errors.data).length) {
        error400(errors);
    }

    try {
        await prisma.clientCompany.create({
            data: {
                ...body
            }
        });
    } catch {
        error500('Something went wrong at client company create');
    }

    return { success: true };
});
