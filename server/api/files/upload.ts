import { error500 } from '~/utils/errorThrows';
import { ftpDirectClient } from '~/utils/ftpClient';

export default defineEventHandler(async (event) => {
    const response = await readFormData(event);

    if (typeof response === 'undefined') {
        error500('No data provided');
    }

    try {
        await ftpDirectClient(response, '/home/lapinser/imagestemp');
    } catch (e) {
        error500('Failed to upload image');
    }

    return {
        success: true
    };
});
