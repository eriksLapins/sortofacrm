import { EFieldType, EFieldValueType } from '@prisma/client';
import type { AdditionalsJson, ModuleFieldsAdjusted, MultiSelect } from '~/types';

export const fieldTemplate: ModuleFieldsAdjusted = {
    key: '',
    module: '',
    required: false,
    title: '',
    // @ts-ignore
    type: undefined,
    // @ts-ignore
    valueType: undefined,
    position: 0,
    width: 'full',
    additional: {
        maxTextLength: undefined,
        maxFileCount: undefined,
        arrayValueType: undefined,
        passwordSafetyRegex: undefined,
        textPrepend: undefined,
        multiselect: undefined,
        defaultValue: undefined,
        buttonTitle: undefined,
        arrayValuesFrom: undefined,
        maxFileSizeMb: undefined,
        multipleFiles: undefined
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
            name: 'arrayValuesFrom',
            helper: 'Field in another module or from users the we want to match on',
            inputLabel: 'Array values from'
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
        boolean: {
            name: 'defaultValue',
            helper: 'Is on on new item creation?',
            inputLabel: 'On by default?'
        }
    },
    checkbox: {
        boolean: {
            name: 'defaultValue',
            helper: 'Is checked on new item creation?',
            inputLabel: 'Checked by default?'
        }
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
        file: {
            name: 'maxFileSizeMb',
            helper: 'Maximum allowed image size in MB',
            inputLabel: 'Max image size in MB'
        }
    }
};

export const fieldTypeItems: MultiSelect[] = Object.keys(fieldValueTypeMap).map((value, index) => {
    return {
        position: index,
        visible: true,
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
