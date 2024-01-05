import { EFieldType, EFieldValueType } from '@prisma/client';
const fieldValueTypeMap: Record<EFieldType, EFieldValueType[]> = {
    dropdown: ['array'],
    number: [
        'number',
        'autoincrement'
    ],
    text: ['string'],
    textarea: ['string'],
    datepicker: [
        'date',
        'datetime'
    ],
    switch: ['boolean'],
    checkbox: ['boolean'],
    phoneNumber: ['number'],
    email: ['string'],
    password: ['string'],
    fileUpload: ['file'],
    imageUpload: ['blob']
};

export default fieldValueTypeMap;
