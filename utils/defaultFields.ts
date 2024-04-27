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
            valueType: 'autoincrement',
            position: 1,
            width: 'full'
        },
        {
            key: 'createdById',
            additional: {},
            module: '',
            required: true,
            title: 'Created By ID',
            type: 'number',
            valueType: 'number',
            position: 2,
            width: 'full'
        },
        {
            key: 'createdOn',
            additional: {},
            module: '',
            required: true,
            title: 'Created On',
            type: 'datepicker',
            valueType: 'datetime',
            position: 3,
            width: 'full'
        },
        {
            key: 'updatedById',
            additional: {},
            module: '',
            required: true,
            title: 'Updated By ID',
            type: 'number',
            valueType: 'number',
            position: 4,
            width: 'full'
        },
        {
            key: 'updatedOn',
            additional: {},
            module: '',
            required: true,
            title: 'Updated On',
            type: 'datepicker',
            valueType: 'datetime',
            position: 5,
            width: 'full'
        },
        {
            key: 'module',
            additional: {},
            module: '',
            required: true,
            title: 'Module',
            type: 'text',
            valueType: 'string',
            position: 6,
            width: 'full'
        }
    ];
}
