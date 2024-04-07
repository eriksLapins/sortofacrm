import type { ModuleItems } from '@prisma/client';
import type { TableItems } from './TableItems';

export function unwrapModuleData (moduleItems: ModuleItems, columnList: {title: string, position: number}[]) {
    const item = moduleItems.data as Record<string, any>;
    if (item) {
        const dataColumns = Object.keys(item);
        const data: TableItems[] = dataColumns.map((column) => {
            return {
                ref_id: moduleItems.id,
                title: column,
                data: item[column],
                position: columnList.find(item => item.title === column)?.position
            };
        });

        return data;
    }
}
