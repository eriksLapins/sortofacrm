import type { ModuleItems } from '@prisma/client';
import type { ModuleFieldsAdjusted } from './ModuleFields';

export interface ModuleItemsAdjusted extends Omit<ModuleItems, 'id' | 'data'> {
    id?: number,
    data: {
        [key: string]: ModuleFieldsAdjusted
    }
}
