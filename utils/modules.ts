import { EFieldType, EFieldValueType } from '@prisma/client';
import type { AdditionalsJson, ModuleFieldsAdjusted } from '~/types';

export const fieldTemplate: ModuleFieldsAdjusted = {
    key: '',
    module: '',
    required: false,
    title: '',
    // @ts-ignore
    type: undefined,
    // @ts-ignore
    valueType: undefined,
    additional: {
        maxTextLength: undefined,
        maxFileCount: undefined,
        arrayValueType: undefined,
        passwordSafetyRegex: undefined,
        textPrepend: undefined
    }
};

export type AdditionalsTypeMapType = {
    [key in EFieldType]: {
        [key in EFieldValueType]?: {
            name: keyof AdditionalsJson,
            helper?: string,
            inputLabel: string,
        }
    }
}

export const additionalsTypeMap: AdditionalsTypeMapType = {
    dropdown: {
        array: {
            name: 'arrayValueType',
            helper: 'The type of the value to add (int for ids and most likely otherwise - string)',
            inputLabel: 'Array Value type'
        }
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

export const fieldTypeItems = Object.keys(fieldValueTypeMap).map((value) => {
    return {
        key: value,
        title: value.toUpperCase()
    };
});

export function getAdditionalFieldType (fieldType: EFieldType, fieldValueType: EFieldValueType) {
    if (!fieldType || !fieldValueType) {
        return;
    }

    return additionalsTypeMap[fieldType][fieldValueType];
}

export function sanitizeTitleToKey (stringToAlter: string) {
    let tempKey = stringToAlter.toLowerCase();
    tempKey = tempKey.replaceAll(' ', '_');
    for (const key in characterReplacementMap) {
        if (!tempKey.includes(key)) {
            continue;
        }

        tempKey = tempKey.replaceAll(key, characterReplacementMap[key]);
    }

    return tempKey;
}
