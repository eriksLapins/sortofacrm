import { EFieldValueType } from '@prisma/client';

export type AdditionalsJson = {
    maxTextLength?: number;
    maxFileCount?: number;
    arrayValueType?: EFieldValueType,
    arrayValuesFrom?: {
        module: string | 'users',
        keyField: string,
        titleField: string,
    }
    passwordSafetyRegex?: string,
    textPrepend?: string,
    maxFileSizeMb?: number,
    multiselect?: boolean,
    multipleFiles?: boolean,
    buttonTitle?: string;
    defaultValue?: string | boolean | number,
}
