export default defineEventHandler(async (event) => {
    const response: {buffer: ArrayBuffer, name: string} = await readBody(event);
    const blob = new Blob([response.buffer]);
    console.log(response.name);
    console.log(blob);

    // try {
    //     await ftpDirectClient(response.buffer, response.name, '/home/lapinser/imagestemp');
    // } catch (e) {
    //     error500('Failed to upload image');
    // }

    return {
        success: true
    };
});
