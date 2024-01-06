import { EFieldType, EFieldValueType } from '@prisma/client';
import type { AdditionalsJson } from '~/types/AdditionalsJson';

export type AdditionalsTypeMapType = {
    [key in EFieldType]: {
        [key in EFieldValueType]?: {
            name: keyof AdditionalsJson,
            helper?: string,
            inputLabel: string,
        }
    }
}

const additionalsTypeMap: AdditionalsTypeMapType = {
    dropdown: {
        array: undefined
    },
    number: {
        number: undefined,
        autoincrement: {
            name: 'textPrepend',
            helper: 'The text to add to the start of the number',
            inputLabel: 'Text prepend'
        }
    },
    text: {
        string: {
            name: 'maxTextLength',
            helper: 'Maximum length of the text input',
            inputLabel: 'Max text size'
        }
    },
    textarea: {
        string: {
            name: 'maxTextLength',
            helper: 'Maximum length of the text input',
            inputLabel: 'Max text size'
        }
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
        string: {
            name: 'passwordSafetyRegex',
            helper: 'Regex expression to match for new passwords others make',
            inputLabel: 'Regex for new passwords'
        }
    },
    fileUpload: {
        file: {
            name: 'maxFileSizeMb',
            helper: 'Maximum allowed file size in MB',
            inputLabel: 'Max file size in MB'
        }
    },
    imageUpload: {
        blob: {
            name: 'maxFileSizeMb',
            helper: 'Maximum allowed image size in MB',
            inputLabel: 'Max image size in MB'
        }
    }
};

export default additionalsTypeMap;
