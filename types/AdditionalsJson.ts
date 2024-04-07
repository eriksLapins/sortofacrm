import { EFieldValueType } from '@prisma/client';

export type AdditionalsJson = {
    maxTextLength?: number;
    maxFileCount?: number;
    arrayValueType?: EFieldValueType,
    passwordSafetyRegex?: string,
    textPrepend?: string,
    maxFileSizeMb?: number,
    multiselect?: boolean,
    multipleFiles?: boolean,
    buttonTitle?: string;
}
