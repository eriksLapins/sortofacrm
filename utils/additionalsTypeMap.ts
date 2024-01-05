import { EFieldType, EFieldValueType } from '@prisma/client';
import type { AdditionalsJson } from '~/types/AdditionalsJson';

const additionalsTypeMap: Record<EFieldType, Partial<Record<EFieldValueType, keyof AdditionalsJson | undefined>>> = {
    dropdown: {
        array: 'arrayValueType'
    },
    number: {
        number: undefined,
        autoincrement: 'textPrepend'
    },
    text: {
        string: 'maxTextLength'
    },
    textarea: {
        string: 'maxTextLength'
    },
    datepicker: {
        date: undefined,
        datetime: undefined
    },
    switch: {
        boolean: undefined
    },
    checkbox: {
        boolean: undefined
    },
    phoneNumber: {
        number: undefined
    },
    email: {
        string: undefined
    },
    password: {
        string: 'passwordSafetyRegex'
    },
    fileUpload: {
        file: 'maxFileSizeMb'
    },
    imageUpload: {
        blob: 'maxFileSizeMb'
    }
};

export default additionalsTypeMap;
