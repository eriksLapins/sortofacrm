import type { ModuleItems } from '@prisma/client';
import type { ModuleFieldsAdjusted } from '~/types';

export const defaultFieldsList: (keyof Omit<ModuleItems, 'data'>)[] = [
    'id',
    'createdById',
    'createdOn',
    'updatedById',
    'updatedOn',
    'module'
];

export function createDefaultFields (): ModuleFieldsAdjusted[] {
    return [
        {
            key: 'id',
            additional: {},
            module: '',
            required: true,
            title: 'ID',
            type: 'number',
            valueType: 'autoincrement'
        },
        {
            key: 'createdById',
            additional: {},
            module: '',
            required: true,
            title: 'Created By ID',
            type: 'number',
            valueType: 'number'
        },
        {
            key: 'createdOn',
            additional: {},
            module: '',
            required: true,
            title: 'Created On',
            type: 'datepicker',
            valueType: 'datetime'
        },
        {
            key: 'updatedById',
            additional: {},
            module: '',
            required: true,
            title: 'Updated By ID',
            type: 'number',
            valueType: 'number'
        },
        {
            key: 'updatedOn',
            additional: {},
            module: '',
            required: true,
            title: 'Updated On',
            type: 'datepicker',
            valueType: 'datetime'
        },
        {
            key: 'module',
            additional: {},
            module: '',
            required: true,
            title: 'Module',
            type: 'text',
            valueType: 'string'
        }
    ];
}
